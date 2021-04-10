<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{name: 'order'}">销售订单</el-breadcrumb-item>
                <el-breadcrumb-item>销售订单详情</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="edit-btn">
                <el-popover
                    placement="bottom"
                    v-model="delVisible">
                    <p>确认通过审核？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="delVisible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="approval">确定</el-button>
                    </div>
                    <el-button @confirm="approval" v-show="(process == 4 || process == 6)&& level == 2" slot="reference" plain icon="el-icon-circle-check">审核确认</el-button>
                    <!-- 发货后状态4到tony审核 -->
                </el-popover>

                <el-popover
                    placement="bottom"
                    v-model="sendVisible">
                    <p>确认发货？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="sendVisible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="sendApproval">确定</el-button>
                    </div>
                    <el-button @confirm="sendApproval" v-show="(process == 0 || process == 6) && level == 1" slot="reference" plain icon="el-icon-circle-check">发货</el-button>
                </el-popover>

                <el-popover
                    placement="bottom"
                    v-model="delCancelVisible">
                    <p>确认重新审核？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="delCancelVisible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="cancelApproval">确定</el-button>
                    </div>
                    <el-button style="margin-right:20px;" @confirm="cancelApproval" v-show="process == 2 && level == 2" slot="reference" plain icon="el-icon-s-release">取消审核</el-button>
                    <!-- tony审核完是2 -->
                </el-popover>

                <el-button plain icon="el-icon-edit" @click="edit" v-show="process == 0 || process == 5 || process == 6">编辑</el-button>
                <span class="verified" v-show="process == 2">
                    <i class="el-icon-s-check"></i>
                    已审核
                </span>

                <span class="verified" v-show="process == 5">
                    <i class="el-icon-s-check"></i>
                    退审处理中
                </span>

                <span class="verified" v-show="process == 0">
                    <i class="el-icon-s-check"></i>
                    待发货确认
                </span>
            </div>
        </div>
        <div class="box">
            <el-form ref="form" class="new-prodt-form" :rules="rules" :inline="true" :model="form" label-width="80px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item>
                            <span slot="label"><span style="color:red;">* </span>客户</span>
                            <customer-name-selector
                            ref="nameSelector"
                            style="margin-right:90px;"
                            :width="'150px'"
                            :disabled="todo === 'check'"
                            @selectData="handleSelect"
                            >
                            </customer-name-selector>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="地址" prop="customerAddress">
                            <el-input 
                            :disabled="todo === 'check'"
                            size="mini" v-model="form.customerAddress" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="公司" prop="company">
                            <el-autocomplete
                                class="form-input" 
                                size="mini"
                                :disabled="todo === 'check'" 
                                v-model="form.companyName"
                                :fetch-suggestions="queryCompany"
                                @selectData="handleSelectCompany"
                                placeholder="请输入"
                            ></el-autocomplete>
                        </el-form-item>
                    </el-col>
                </el-row>
<!-- 二 -->
                <el-row>
                      <el-col :span="8">
                        <el-form-item label="托运部">
                            <el-autocomplete
                                :disabled="todo === 'check'"
                                size="mini"
                                v-model="form.transportName"
                                :fetch-suggestions="queryTransport"
                                placeholder="请输入"
                            ></el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="支付方式" prop="payType">
                            <el-select :disabled="todo === 'check'" v-model="form.payType" size="mini" placeholder="请选择" >
                                <el-option v-for="(type,i) in accountType" :value="type.value" :label="type.label" :key="i">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="货币" prop="monetaryUnit">
                            <el-input :disabled="todo === 'check'" size="mini" v-model="form.monetaryUnit" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                  
                </el-row>
<!-- 三 -->
                <el-row>
                      <el-col :span="8">
                        <el-form-item label="折扣" prop="discount">
                            <el-input :disabled="todo === 'check'" :max="1" size="mini" v-model="form.discount" placeholder="请输入折扣金额" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="税率" prop="taxRate">
                            <el-input :disabled="todo === 'check'" :max="1" size="mini" v-model="form.taxRate" placeholder="例如输入14即为14%" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="支付状态" prop="status">
                            <el-select :disabled="todo === 'check'" v-model="form.status" size="mini" class="form-input" placeholder="请选择" >
                                <el-option v-for="(type,i) in payStatus" :value="type.value" :label="type.label" :key="i">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
<!-- 四 -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="备注" prop="remark">
                            <el-input :disabled="todo === 'check'" v-model="form.remark" size="mini" class="form-input" placeholder="备注信息"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
<!-- 五 -->

                <el-row>
                    <div class="pic-upload">
                        <div class="pic-title">产品</div>
                        <div class="table-area">
                            <!-- 表头 -->
                            <div class="table-head">
                                <div class="head-item" :class="title.label == '型号' ? 'code' : ''" v-for="(title, i) in tableTitles" :key="i">{{title.label}}</div>
                            </div>
                            <!-- 表格 -->
                            <div class="table-list" v-for="(list, i) in goodsList" :key="i">
                                <div class="list-item code">
                                    <el-autocomplete
                                        size="mini"
                                        :disabled="todo === 'check'"
                                        v-model="list.specification"
                                        :fetch-suggestions="queryProduct"
                                        placeholder="请输入产品名"
                                        @select="val => {handleProductSelect(val, i)}"
                                    ></el-autocomplete>
                                </div>
                                <div class="list-item">
                                    <el-input size="mini" :disabled="todo === 'check'" v-model="list.caseNum" @change="val => changaItem(val, list, i, 'caseNum')"></el-input>
                                </div>
                                <div class="list-item">
                                    <el-input size="mini" :disabled="true" v-model="list.goodsTotal" @change="val => changaItem(val, list, i, 'goodsTotal')"></el-input>
                                </div>
                                <div class="list-item">
                                    <el-input size="mini" :disabled="todo === 'check'" v-model="list.goodsPrice" @change="val => changaItem(val, list, i, 'goodsPrice')"></el-input>
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
                                <div class="del-btn" @click="delList(i)" v-show="todo !== 'check'">
                                    <el-button type="text"  icon="el-icon-close"></el-button>
                                </div>
                            </div>
                            <div class="add-btn" @click="addList" v-show="todo !== 'check'">
                                <span class="plus">+</span>
                                <el-button type="text">添加产品</el-button>
                            </div>
                            <div class="count">
                                <span class="label">总销售金额：</span>
                                <span class="value">{{getTotal('total')}}</span>
                                <span class="label">总箱数：</span>
                                <span class="value">{{getTotal('caseNum')}}</span>
                            </div>
                        </div>
                        <div class="pagination">
                            <!-- <el-pagination
                                background
                                :current-page="page.no"
                                :page-size="page.size"
                                :page-sizes="[5,10,20]"
                                :total="page.total"
                                layout="total, prev, pager, next, sizes, jumper"
                                @size-change="handleSizeChange"
                                @current-change="basePageChange"
                            ></el-pagination> -->
                        </div>
                    </div>
                </el-row>

            </el-form>

            <div class="form-btns">
                <el-button @click="cancel">完成</el-button>
                <el-button type="primary" v-if="todo === 'edit'" @click="save">保存</el-button>
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
orderDetail,
approvalOrder, 
createOrUpdateOrder,
getCompPage} from '@/api/index';
import CustomerNameSelector from '@/components/public/CustomerNameSelector.vue'

export default {
    name: 'DialogNewOrder',
    components: {
        CustomerNameSelector
    },
    data() {
        return {
            delVisible: false,
            delCancelVisible: false,
            sendVisible: false,
            id: '',
            level: '',
            process: 1,
            todo: 'check',
            accountType: [],
            payStatus: [],
            dict: {},
            form: {},
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
                transportName: [{ required: true, message: '请输入', trigger: 'change' }],
            },
            page: {
                no: 1,
                size: 5,
                total: 0
            }
        }
    },
    created() {
        this.dict = dict
        this.accountType = [dict.accountType[0], dict.accountType[2], dict.accountType[3]] // 同步dialogneworder
        this.payStatus = [dict.payStatus[0], dict.payStatus[1]] // 同上
        this.level = Number(localStorage.getItem('level'))
        this.getTaxRate()
    },
    mounted() {
        console.log(this.$route.params);
        this.id = this.$route.params.id
        this.getData()
    },
    methods: {
        approval() {
            this.delVisible = false
            let params = {
                id: this.id,
                status: 2, //0:生成/待审批,1:不通过,2:tony通过/待发货,3:tony通过欠款/待发货,4:仓库发货
            }
            approvalOrder(params).then(res => {
                this.$message.success('审核通过完成')
                this.getData()
            })
        },
        // 发货
        sendApproval() {
            this.sendVisible = false
            let params = {
                id: this.id,
                status: 4, 
            }
            approvalOrder(params).then(res => {
                this.$message.success('发货完成')
                this.getData()
            })
        },
        cancelApproval() {
            this.delCancelVisible = false
            let params = {
                id: this.id,
                status: 5, //5反审
            }
            approvalOrder(params).then(res => {
                this.$message.success('取消审核完成')
                this.getData()
            })
        },
        getData() {
            orderDetail({id: this.id}).then(res => {
                    let {details, 
                    id,
                    customerId,
                    customerName,
                    customerAddress,
                    transportName,
                    payType,
                    monetaryUnit,
                    discount,
                    exchangeRate,
                    taxRate,
                    createTime,
                    process,
                    companyName,
                    companyId,
                    status,
                    remark} = res
                    details.forEach(element => {
                        element.isTail = (element.isTail == 1 ?  true : false)
                        element._stock = Number(element.stock) + Number(element.caseNum) // 剩余的库存和已开单的库存
                    });
                    let form = {
                        id: id,
                        customerId: customerId,
                        customerName: customerName,
                        customerAddress: customerAddress,
                        transportName: transportName,
                        payType: payType ? Number(payType) : '',
                        monetaryUnit: monetaryUnit,
                        discount: discount,
                        exchangeRate: exchangeRate,
                        companyName: companyName,
                        companyId: companyId,
                        taxRate: taxRate * 100,
                        remark: remark,
                        status: status ? Number(status) : '', // 这是payType，创建的时候，返回的时候status是别的状态
                    }
                    let goodsList = details
                    let data ={form:form, goodsList:goodsList, customerName: customerName}
                    this.process = process
                        // this.$refs.newOrderDialog.editData(data)
                        // this.$refs.newOrderDialog.setName(customerName)
                    this.editData(data)
                    this.setName(data.customerName)
                })
        },
        changaItem(val, list, i, name) {
            if (this.todo == 'check') {
                return
            }
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
                        isTail: true,
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
        save() {
            this.form.exchangeRate = this.taxRate
            let data = cloneDeep(this.form)
            data.goodsList = cloneDeep(this.goodsList)
            let flag = true
            data.goodsList.forEach(element => {
                // detail查询回来的有_stock
                    if (element.caseNum  > element._stock) {
                        this.$message.warning('销售箱数不能大于库存！请重新填写')
                        flag = false
                    }
                    element.isTail ? element.isTail = 1 : element.isTail = 0
                    delete element._stock
            });
            // data.process = 0
            if (!flag) {
                return
            }
            data.taxRate = data.taxRate / 100
            createOrUpdateOrder(data).then(res => {
                this.$message.success('操作成功')
                this.todo = 'check'
                this.getData()
            }) 
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
            this.$set(this.goodsList[i], '_stock', item.caseNum) // 这里特殊兼容detail查询用的_stock字段，dialogneworder组件不用
        },
        handleSelect(item) {
            this.form.customerName = item.memberName
            this.form.customerId = item.id
            this.form.customerAddress = item.address
        },
        handleSelectCompany(item){
            this.form.companyName = item.name
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
        },
        // 分页导航
        basePageChange(val) {
            this.$set(this.page, 'no', val);
            this.getData();
        },
        // 每页数量改变
        handleSizeChange(val) {
            this.$set(this.page, 'size', val);
            this.$set(this.page, 'no', 1);
            this.getData();
        },
        edit() {
            this.todo = 'edit'
        },
        cancel() {
            this.$router.push({name: 'order'})
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    position: relative;
    padding: 12px;
    margin: 0 23px;
    background-color: #fff;
}

.crumbs {
    position: relative;
}

.edit-btn {
    position: absolute;
    top: -10px;
    right: 0;

    ::v-deep .el-button{
        width: 109px;
        border: 1px solid $theme-color;
        color: $theme-color;
        background-color: transparent;
        margin-left: 10px;
    }
}

.handle-box {
    width: 100%;
    margin-bottom: 20px;

    .label {
        width: 50px;
        font-size: 12px;
        color: #1F1F21;
        margin-right: 18px;
    }
    
    .name-search {
        display: inline-block;
        width: 178px;
        margin-right: 36px;
    }

    .status,.time {
        display: inline-block;
        width: 180px;

        .el-select {
            display: inline-block;
            width: 80px;
        }
    }

    .new-btn {
        float: right;
        margin-left: 14px;
    }
}

.pagination {
    margin: 30px 10px;

    ::v-deep .el-input {
        width: 80px !important;
    }

    ::v-deep .el-input__inner {
        width: 80px;
    }
}

.table {
    width: 100%;
    font-size: 11px;
}

.mr10 {
    margin-right: 10px;
}
.el-dialog__header {
    padding: 30px 48px !important;
}
.dialog-footer {
    display: inline-block;
    text-align: center;
    width: 100%;
}
.curr-btn {
    width: 75px;
}

.new-prodt-form  {
    ::v-deep .el-input {
        width: 180px;
    }
    ::v-deep .el-input.is-disabled .el-input__inner {
        color: #333;
    }

    ::v-deep .el-input__inner {
        padding: 5px;
    }

    ::v-deep .el-input-group__append{
        padding: 5px;
        background: #fff;
        border-left: none;
    }

    .small-input {
        width: 66px !important;
    }
    .mid-input {
        width: 96px !important;
    }
}
// 上传图片
.pic-upload {
    border: 1px solid #EEF1F6;
    padding: 0;
    overflow: hidden;

    .upload-btn {
        display: inline-block;
        vertical-align: top;
    }

    .pic-title {
        padding: 12px;
        background-color: $theme-color;
        color: #fff;
    }

    ::v-deep .el-upload {
        width: 114px;
        height: 114px;
        margin: 14px;

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 114px;
            height: 114px;
            line-height: 114px;
            text-align: center;
        }
    }
    .pic-list-item {
        position: relative;
        display: inline-block;
        width: 114px;
        height: 114px;  
        margin: 14px;
        overflow: visible;
        vertical-align: top;
    }
    .pic-list-item-img {
        width: 114px;
        height: 114px; 
    }
    .del-icon {
        display: inline-block;
        position: absolute;
        z-index: 999;
        top: -5px;
        right: -5px;
        color: #fff;
        background-color: rgb(255, 107, 81);
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        border-radius: 50%;
        cursor: pointer;
    }
}
.table-area {
        display: inline-block;
        width: 100%;
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


            ::v-deep .el-input {
                width: 105px;
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
        margin-left: 20px;
        margin-top: 20px;

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
.form-btns {
    margin-top: 50px;
    text-align: center;

    ::v-deep .el-button{
        width: 89px;
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

    .count {
        float: right;
        margin-top: 20px;
        .label {
            color: $theme-color;
            display: inline-block;
            width: 120px;
        }
        .value {
            display: inline-block;
            width: 130px;
            font-size: 16px;
            color: #666;
            font-weight: 800;
        }
    }
    .verified {
        display: inline-block;
        margin-top: 10px;
        margin-left: 10px;
        color: red;
    }
</style>
