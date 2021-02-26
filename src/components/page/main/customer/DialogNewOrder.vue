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

            <el-form-item label="支付方式" prop="payType">
                <el-select v-model="form.payType" size="mini" class="form-input" placeholder="请选择" >
                    <el-option v-for="(type,i) in dict.payWay" :value="type.value" :label="type.label" :key="i">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="货币" prop="monetaryUnit">
                <el-input size="mini" class="form-input" v-model="form.monetaryUnit" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="折扣" prop="discount">
                <el-input :max="1" size="mini" class="form-input" v-model="form.discount" placeholder="请输入0-1，例如八折为0.8" ></el-input>
            </el-form-item>

            <el-form-item label="税率" prop="taxRate">
                <el-input :max="1" size="mini" class="form-input" v-model="form.taxRate" placeholder="请输入小数，例如0.11" ></el-input>
            </el-form-item>
        </el-form>
        <div class="prod-table">
            <div class="label">产品</div>
            <div class="table-area">
                <!-- 表头 -->
                <div class="table-head">
                    <div class="head-item" v-for="(title, i) in tableTitles" :key="i">{{title.label}}</div>
                </div>
                <!-- 表格 -->
                <div class="table-list" v-for="(list, i) in goodsList" :key="i">
                    <div class="list-item">
                        <el-autocomplete
                            size="mini"
                            v-model="list.specification"
                            :fetch-suggestions="queryProduct"
                            placeholder="请输入产品名"
                            @select="val => {handleProductSelect(val, i)}"
                        ></el-autocomplete>
                    </div>
                    <div class="list-item">
                        <el-input v-model="list.caseNum" @change="changaItem(list.caseNum, i, 'caseNum')"></el-input>
                    </div>
                    <div class="list-item">
                        <el-input v-model="list.goodsTotal" @change="changaItem(list.goodsTotal, i, 'goodsTotal')"></el-input>
                    </div>
                    <div class="list-item">
                        <el-input v-model="list.goodsPrice" @change="changaItem(list.goodsPrice, i, 'goodsPrice')"></el-input>
                    </div>
                    <div class="list-item">
                        <!-- 0不是 1是 -->
                        <el-checkbox v-model="list.isTail"></el-checkbox>
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
getTitle } from '@/api/index';
import CustomerNameSelector from '@/components/public/CustomerNameSelector.vue'

export default {
    name: 'DialogNewOrder',
    components: {
        CustomerNameSelector
    },
    data() {
        return {
            dict: {},
            form: {},
            taxRate: 0,
            tableTitles: [
                {label: '型号', name: 'type'},
                {label: '箱数', name: 'boxes'},
                {label: '件数/箱', name: 'pics'},
                {label: '售价', name: 'price'},
                {label: '是否尾箱', name: 'isTail'},
                {label: '总计', name: 'total'},
            ],
            lockCustomer: false, // 是否从用户界面添加订单
            goodsList: [],
            // list基本式(添加用)
            listOrigin: {specification: '', goodsName: '', goodsId: '', caseNum: '', goodsPrice: '', goodsTotal: '', isTail: false},

            rules: {
                name: [{ required: true, message: '请输入', trigger: 'change' }],
                transportName: [{ required: true, message: '请输入', trigger: 'change' }],
            }
        }
    },
    created() {
        this.dict = dict
        this.getTaxRate()
    },
    methods: {
        changaItem(val, i, name) {
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
            this.form.exchangeRate = this.taxRate
            let data = cloneDeep(this.form)
            data.goodsList = cloneDeep(this.goodsList)
            data.goodsList.forEach(element => {
                element.isTail ? element.isTail = 1 : element.isTail = 0
            });
            this.$emit('saveData', data)
        },
        // 置空数据
        resetData(data, resetName = true) {
            if (data.customerId) {
                this.lockCustomer = true
            }
            else {
                this.lockCustomer = false
            }
            this.form = {
                customerId: data.customerId || '',
                customerName: data.customerName ||  '',
                customerAddress: '',
                transportName: '',
                payType: '',
                monetaryUnit: '',
                discount: '1',
                exchangeRate: '',
                taxRate: '',
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
        handleProductSelect(item, i) {
            this.$set(this.goodsList[i], 'goodsId', item.goodsId)
            this.$set(this.goodsList[i], 'goodsName', item.name)
        },
        handleSelect(item) {
            this.form.customerName = item.memberName
            this.form.customerId = item.id
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
    }
}
</script>
<style lang="scss" scoped>
.form-input {
    width: 200px;
    margin-right: 90px;
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
}
</style>