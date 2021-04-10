<template>
    <div >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
            <el-form-item>
                <span slot="label"><span style="color:red;">* </span>客户</span>
                <customer-name-selector
                ref="nameSelector"
                style="margin-right:90px;"
                :width="'200px'"
                :disabled="lockCustomer"
                @selectData="handleSelect"
                >
                </customer-name-selector>
            </el-form-item>

            <el-form-item label="地址" prop="customerAddress">
                <el-input size="mini" class="form-input" v-model="form.customerAddress" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="托运部" prop="transportName">
                <el-autocomplete
                    class="form-input" 
                    size="mini"
                    v-model="form.transportName"
                    :fetch-suggestions="queryTransport"
                    placeholder="请输入"
                ></el-autocomplete>
                <!-- <el-input size="mini" class="form-input" v-model="form.transportName" placeholder="请输入" ></el-input> -->
            </el-form-item>

            <el-form-item label="公司" prop="companyName">
                <el-autocomplete
                    class="form-input" 
                    size="mini"
                    v-model="form.companyName"
                    :fetch-suggestions="queryCompany"
                    @select="handleSelectCompany"
                    placeholder="请输入"
                ></el-autocomplete>
            </el-form-item>

            <el-form-item label="支付方式" prop="payType">
                <el-select v-model="form.payType" size="mini" class="form-input" placeholder="请选择" >
                    <el-option v-for="(type,i) in accountType" :value="type.value" :label="type.label" :key="i">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="货币" prop="monetaryUnit">
                <el-input size="mini" class="form-input" v-model="form.monetaryUnit" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="折扣" prop="discount">
                <el-input :max="1" size="mini" class="form-input" v-model="form.discount" placeholder="请输入折扣金额" ></el-input>
            </el-form-item>

            <el-form-item label="税率" prop="taxRate">
                <el-input :max="1" size="mini" class="form-input" v-model="form.taxRate" placeholder="例如输入14即为14%" ></el-input>
            </el-form-item>

            <el-form-item label="支付状态" prop="status">
                <el-select v-model="form.status" size="mini" class="form-input" placeholder="请选择" >
                    <el-option v-for="(type,i) in payStatus" :value="type.value" :label="type.label" :key="i">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input  v-model="form.remark" size="mini" class="form-input" placeholder="备注"></el-input>
            </el-form-item>
        </el-form>
        <div class="prod-table">
            <div class="label">产品</div>
            <div class="table-area">
                <!-- 表头 -->
                <div class="table-head">
                    <div class="head-item" :class="title.label == '型号' ? 'code' : ''" v-for="(title, i) in tableTitles" :key="i">{{title.label}}</div>
                </div>
                <!-- 表格 -->
                <div class="table-list" v-for="(list, i) in goodsList" :key="i" >
                    <div class="list-item code">
                        <el-autocomplete
                            size="mini"
                            v-model="list.specification"
                            :fetch-suggestions="queryProduct"
                            placeholder="请输入产品名"
                            @select="val => {handleProductSelect(val, i)}"
                        ></el-autocomplete>
                    </div>
                    <div class="list-item">
                        <el-input size="mini" v-model="list.caseNum" @change="val => changaItem(val, list, i, 'caseNum')"></el-input>
                    </div>
                    <div class="list-item">
                        <el-input size="mini" v-model="list.goodsTotal" disabled @change="val => changaItem(val, list, i, 'goodsTotal')"></el-input>
                    </div>
                    <div class="list-item">
                        <el-input size="mini" v-model="list.goodsPrice" @change="val => changaItem(val, list, i, 'goodsPrice')"></el-input>
                    </div>
                    <div class="list-item">
                        <span class="my-checkbox" @click="val => changaItem(true, list, i , 'isTail')">
                            <i v-if="list.isTail" class="el-icon-check" @click.stop="val => changaItem(false, list, i , 'isTail')"></i>
                            <i v-if="!list.isTail" class="el-icon-check" style="opacity: 0;"></i>
                        </span>
                    </div>
                    <div class="list-item">
                        {{list.stock}}
                    </div>
                    <div class="list-item">
                        {{list.caseNum * list.goodsTotal * list.goodsPrice || 0}}
                    </div>
                    <div class="del-btn" @click="delList(i)">
                        <el-button type="text"  icon="el-icon-close"></el-button>
                    </div>
                </div>
                <div class="add-btn" @click="addList">
                    <span class="plus">+</span>
                    <el-button type="text">添加产品</el-button>
                </div>
            </div>
            <div class="count">
                <span class="count-label">总销售金额：</span>
                <span class="value">{{getTotal('total')}}</span>
                <span class="count-label">总箱数：</span>
                <span class="value">{{getTotal('caseNum')}}</span>
                <span class="count-label">折扣金额：</span>
                <span class="value">{{getTotal('discount')}}</span>
                <span class="count-label">税后金额：</span>
                <span class="value">{{getTotal('tax')}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import {cloneDeep} from 'lodash';
import dict from '@/components/common/dict.js'

import { 
userList,
checkSkuOrder,
getTransporterPage,
getTitle,
getCompPage } from '@/api/index';
import CustomerNameSelector from '@/components/public/CustomerNameSelector.vue'
import Big from 'big.js'

export default {
    name: 'DialogNewOrder',
    components: {
        CustomerNameSelector
    },
    data() {
        return {
            dict: {},
            form: {},
            payStatus: [],
            accountType: [],
            taxRate: 0,
            tableTitles: [
                {label: '型号', name: 'type'},
                {label: '箱数', name: 'boxes'},
                {label: '件数/箱', name: 'pics'},
                {label: '售价', name: 'price'},
                {label: '是否尾箱', name: 'isTail'},
                {label: '库存', name: 'isTail'},
                {label: '总计', name: 'total'},
            ],
            lockCustomer: false, // 是否从用户界面添加订单
            goodsList: [],
            // list基本式(添加用)
            listOrigin: {specification: '', goodsName: '', goodsId: '', caseNum: '', goodsPrice: '', goodsTotal: '', isTail: false},

            rules: {
                name: [{ required: true, message: '请输入', trigger: 'change' }],
                status: [{ required: true, message: '请选择', trigger: 'change' }],
                companyName: [{ required: true, message: '请选择', trigger: 'change' }],
            }
        }
    },
    created() {
        this.dict = dict
        this.payStatus = [dict.payStatus[0], dict.payStatus[1]]
        this.accountType = [dict.accountType[0], dict.accountType[2], dict.accountType[3]]
        this.getTaxRate()
    },
    methods: {
        changaItem(val, list, i, name) {
            // 尾箱自动添加一条
            if (name == 'isTail' && val === true && list['goodsId']) {
                if (this.goodsList[i + 1] && (this.goodsList[i + 1].goodsId === list.goodsId)) { // 防止重复添加
                    this.$set(this.goodsList[i], name, false) // 当前的设置false
                    return
                }
                if (list.tailBox !== 0) {
                    this.goodsList.splice(i+1, 0, {
                        specification: list.specification,
                        goodsId: list.goodsId,
                        goodsName: list.goodsName,
                        caseNum: list.tailBox,
                        stock: list.tailBox + '（尾箱数)',
                        goodsTotal: list.tailTotal,
                        goodsPrice: list.goodsPrice,
                        isTail: true
                    })
                }
                else {
                    this.$message.warning('当前商品尾箱数为0无法选择销售尾箱')
                }
               
                this.$set(this.goodsList[i], name, false) // 当前的设置false
                return
            }
            else if (name == 'isTail' && val === false && list['goodsId']) {
                this.delList(i)
                return
            }
            this.$set(this.goodsList[i], name, val)
        },
        addList() {
            let list = cloneDeep(this.listOrigin)
            this.goodsList.push(list)
        },
        delList(i) {
            this.goodsList.splice(i, 1)
        },
        // 保存提交
        saveSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.form.exchangeRate = this.taxRate
                    let data = cloneDeep(this.form)
                    data.goodsList = cloneDeep(this.goodsList)
                    let flag = true
                    data.goodsList.forEach(element => {
                        if (element.caseNum > element.stock) {
                            this.$message.warning('销售箱数不能大于库存！请重新填写')
                            flag = false
                        }
                        element.isTail ? element.isTail = 1 : element.isTail = 0
                        delete element.stock
                        delete element.tailBox
                    });
                    if (!flag) {
                        return
                    }
                    data.taxRate = data.taxRate / 100
                    this.$emit('saveData', data)
                }
            })
        },
        // 置空数据
        resetData(data, resetName = true) {
            if (data && data.customerId) {
                this.lockCustomer = true
            }
            else {
                this.lockCustomer = false
            }
            this.form = {
                customerId: (data ? data.customerId : ''),
                customerName: (data ? data.customerName : ''),
                customerAddress: '',
                transportName: '',
                payType: '',
                monetaryUnit: '欧元',
                discount: 0,
                exchangeRate: '',
                taxRate: 0,
                companyName: '',
                companyId: '',
                status: '',
                remark: '',
            }
            this.goodsList = [
                {specification: '', goodsName: '', goodsId: '', caseNum: '', goodsPrice: '', goodsTotal: '', isTail: false}
            ]
            this.$nextTick(() => {
                if (resetName) {
                    this.$refs.nameSelector.reset()
                }
                this.$refs.form.clearValidate()
            })
        },
        // 用于编辑时候展示
        setName(name) {
            this.$refs.nameSelector.setName(name)
        },
        editData(data) {
            this.form = data.form
            this.goodsList = data.goodsList
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        // 查询客户名
        queryName(queryString, cb) {
            userList({
                level: '',
                status: '',
                page: 1,
                pageSize: 10,
                userName: queryString
                }).then(res => {
                let arr = []
                    for (let i = 0; i < res.records.length; i++) {
                        const ele = res.records[i];
                        arr.push({
                            value: ele.memberName,
                            id: ele.id,
                            memberName: ele.memberName
                        })
                    }
                cb(arr)
            })
        },
        queryProduct(qs, cb) {
            checkSkuOrder({
                page: 1,
                pageSize: 5,
                specification: qs
            }).then(res => {
                let arr = []
                    for (let i = 0; i < res.records.length; i++) {
                        const ele = res.records[i];
                        ele.value = ele.specification
                        arr.push(ele)
                    }
                cb(arr)
            })
        },
        queryTransport(qs, cb) {
            let obj = {
                pageSize:  5,
                page:  1,
                transporterName: qs
            }
            getTransporterPage(obj).then(res => {
                let arr = []
                    for (let i = 0; i < res.records.length; i++) {
                        const ele = res.records[i];
                        ele.value = ele.transporterName
                        arr.push(ele)
                    }
                cb(arr)
            })
        },
        queryCompany(qs, cb) {
            let obj = {
                pageSize:  5,
                page:  1,
                name: qs
            }
            getCompPage(obj).then(res => {
                let arr = []
                    for (let i = 0; i < res.records.length; i++) {
                        const ele = res.records[i];
                        ele.value = ele.name
                        arr.push(ele)
                    }
                cb(arr)
            })
        },
        handleProductSelect(item, i) {
            this.$set(this.goodsList[i], 'goodsId', item.goodsId)
            this.$set(this.goodsList[i], 'goodsName', item.name)
            this.$set(this.goodsList[i], 'stock', item.caseNum)
            this.$set(this.goodsList[i], 'tailBox', item.tailBox)
            this.$set(this.goodsList[i], 'tailTotal', item.tailTotal)
            this.$set(this.goodsList[i], 'caseNum', 1)
            this.$set(this.goodsList[i], 'goodsTotal', item.goodsTotal)
            this.$set(this.goodsList[i], 'goodsPrice', item.salePrice)
        },
        handleSelect(item) {
            this.form.customerName = item.memberName
            this.form.customerId = item.id
        },
        handleSelectCompany(item){
            // this.form.companyName = item.name
            this.form.companyId = item.id
        },
        getTaxRate() {
            let obj = {
                status: 'taxRate'
            }
            getTitle(obj).then(res => {
                let data = (res instanceof Array) ? res : []
                this.taxRate = data[0].configValue
            })
        },
        // 计算总数
        getTotal(tar) {
            let caseNum = 0
            let total = 0
            let discount = this.form.discount || 0
            let taxRate = this.form.taxRate || 0
            for (let i = 0; i < this.goodsList.length; i++) {
                const ele = this.goodsList[i];
                caseNum += Number(ele.caseNum)
                total += Number(ele.caseNum * ele.goodsTotal * ele.goodsPrice)
            }
            if (tar == 'caseNum') {
                return caseNum
            }
            if (tar == 'total') {
                return total
            }
            if (tar == 'discount') {
                let res = new Big(total).minus(discount).toNumber()
                return res
            }
            if (tar == 'tax') {
                let x = new Big(total).minus(discount)
                let y = new Big(1).add(taxRate / 100)
                return x.times(y).toNumber()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.form-input {
    width: 200px;
    margin-right: 90px;

    ::v-deep .el-input{
        font-size: 14px;
    }
}
.prod-table {
    .label {
        display: inline-block;
        width: 80px;
        padding: 12px;
        text-align: right;
    }

    .table-area {
        display: inline-block;
        width: 710px;
        vertical-align: top;
    }

    .table-head {
        height: 43px;
        background: #F0F2F5;
        display: flex;
        line-height: 43px;

        .head-item {
            flex: 1;
            text-align: center;
            color: #909399;
            font-size: 12px;
        }
        .code {
            min-width: 130px;
        }
    }

    .table-list {
        position: relative;
        height: 43px;
        line-height: 43px;
        display: flex;

        .del-btn {
            position: absolute;
            right: 10px;
            cursor: pointer;
        }

        .list-item {
            flex: 1;
            text-align: center;

            .el-input  {
                width: 85px;
            }

            &.code {
                min-width: 130px;
            }
        }
    }

    .add-btn {
        display: inline-block;
        font-size: 12px;
        vertical-align: middle;

        .plus {
            display: inline-block;
            width: 16px;
            height: 16px;
            font-size: 12px;
            line-height: 16px;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            background-color: #2183EA;
            margin-right: 4px;
            vertical-align: middle;
            cursor: pointer;
        }
        
    }

    .count {
        margin-top: 20px;
        .count-label {
            color: $theme-color;
            display: inline-block;
            width: 100px;
            padding: 5px;
        }
        .value {
            display: inline-block;
            width: 90px;
            font-size: 16px;
            color: #666;
            font-weight: 800;
        }
    }

    .my-checkbox {
        display: inline-block;
        border: 1px solid #ccc;
        width: 15px;
        height: 15px;
        line-height: 15px;
        cursor: pointer;
        color: $theme-color;

        &:hover {
            border: 1px solid $theme-color;
        }
    }
}
</style>