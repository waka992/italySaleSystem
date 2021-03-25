<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{name: 'customerinfo'}">客户信息</el-breadcrumb-item>
                <el-breadcrumb-item>客户信息详情</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operate-btns">
                <el-button class="btn3 outer" @click="showDialog('receive')">收款</el-button>
                <el-button class="btn3 outer" @click="showDialog('balance')">结欠</el-button>
                <el-button class="btn2 outer" @click="showDialog('bill')">账单总汇</el-button>
                <el-button class="btn2 outer" @click="showDialog('sold')">销售统计</el-button>
            </div>
        </div>
        <div class="box">
            <div class="detail-card">
                <div class="title">{{comInfo.memberName}}</div>
                
                <div class="handle-box">
                </div>
                <el-row class="detail-row">
                    <el-col :span="6">
                        <span class="detail-label">地址：</span>
                        <span class="detail-content">{{comInfo.address}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">电话：</span>
                        <span class="detail-content">{{comInfo.mobile}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">银行信息：</span>
                        <span class="detail-content">{{comInfo.bank}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">初始欠款：</span>
                        <span class="detail-content">{{comInfo.arrears}}</span>
                    </el-col>
                   
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="6">
                        <span class="detail-label">会员昵称：</span>
                        <span class="detail-content">{{comInfo.appName}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">等级：</span>
                        <span class="detail-content">{{comInfo.level == 1 ? '游客' : comInfo.level == 2 ? '普通' : comInfo.level == 3 ? 'VIP' : ''}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">状态：</span>
                        <span class="detail-content">{{comInfo.status == 1 ? '激活' : '注销'}}</span>
                    </el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="18">
                        <span class="detail-label">备忘：</span>
                        <span class="detail-content">{{comInfo.remarks}}</span>
                    </el-col>
                </el-row>
            </div>

            <div class="record-card">
                <div class="top">
                    <div class="title">销售记录</div>
                    <el-select style="margin:0 20px;" size="mini" v-model="status" placeholder="请选择" clearable>
                        <el-option
                        v-for="item in dict.payStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button icon="el-icon-search" size="mini" @click="getData"></el-button>
                    <div class="operate-btns">
                        <el-button type="primary" @click="showDialog('new')">+添加订单</el-button>
                    </div>
                    <!-- <div class="search">
                        <el-input size="mini" suffix-icon="el-icon-search" placeholder="输入关键词"></el-input>
                    </div> -->
                </div>
                <el-table
                    :data="tableData"
                    stripe
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="soldRecordChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="日期"  align="center">
                        <template slot-scope="scope">
                            {{dateFormat(scope.row.createTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="caseNum" label="箱数" align="center"></el-table-column>
                    <el-table-column prop="price" label="销售金额" align="center"></el-table-column>
                    <el-table-column label="支付状态" align="center">
                        <template slot-scope="scope">
                            {{getDict(scope.row.status, 'payStatus')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="审核状态" align="center">
                        <template slot-scope="scope">
                            {{ getDict(scope.row.process, 'verifyStatus') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button v-show="scope.row.process == 0 || scope.row.process == 1" type="text" @click="showDialog('edit', scope.row.id)">编辑</el-button>
                            <el-button  v-show="scope.row.process != 0 && scope.row.process != 1 && scope.row.process && scope.row.status == 0" type="text" @click="showDialog('pay', scope.row)">支付</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        :current-page="page.no"
                        :page-size="page.size"
                        :page-sizes="[5,10,20]"
                        :total="page.total"
                        layout="total, prev, pager, next, sizes, jumper"
                        @size-change="handleSizeChange"
                        @current-change="basePageChange"
                    ></el-pagination>
                </div>
                <!-- <div class="operate">
                    <el-button plain>返回</el-button>
                    <el-button type="primary">生成pdf</el-button>
                </div> -->
            </div>
        </div>
        <div class="bottom-box">
            <div class="inner-box">
                <div class="left-box">
                    <div class="box-title">欠款总汇</div>
                    <el-table
                        :data="deptTableData"
                        stripe
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="price" label="销售金额" align="center"></el-table-column>
                        <el-table-column prop="startArrears" label="初始欠款" align="center"></el-table-column>
                        <el-table-column prop="goodsTotal" label="件数" align="center" width="80"></el-table-column>
                        <el-table-column prop="collection" label="总收款" align="center" width="80"></el-table-column>
                        <el-table-column prop="arrears" label="余数" align="center" width="80">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="right-box">
                    <div class="box-title">收款总汇</div>
                    <div class="box-operate">
                        <!-- <el-button type="plain" class="btn3" @click="showDialog('pay')">收款总汇</el-button> -->
                    </div>
                    <el-table
                        :data="receiveTableData"
                        stripe
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <!-- <el-table-column prop="date" label="日期" align="center">
                            <template slot-scope="scope">
                                {{dateFormat(scope.row.createTime)}}
                            </template>
                        </el-table-column> -->
                        <el-table-column prop="payWay" label="收款方式" align="center">
                        </el-table-column>
                        <el-table-column prop="value" label="金额" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="false"
        :title="'新订单'" :visible.sync="newOrderDialog" width="830px">
            <dialog-new-order @saveData="saveSubmit" ref="newOrderDialogRef"></dialog-new-order>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="newOrderDialog = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="save">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="true"
        :title="'结欠'" :visible.sync="balanceDialog" width="400px">
            <dialog-balance @balance="askBalance" ref="balanceDialogRef"></dialog-balance>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="balanceDialog = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="getBalance">结欠</el-button>
            </span>
        </el-dialog>

        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="true"
        
        :title="'账单总汇'" :visible.sync="billDialog" width="830px">
            <dialog-bill @getPDF="receiveBillPDF" ref="billDialog"></dialog-bill>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="billDialog = false">取消</el-button>
                <el-button type="primary" @click="getBillPDF">生成PDF</el-button>
            </span>
        </el-dialog>
        
        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="true"
        :title="'销售统计'" :visible.sync="soldDialog" width="830px">
            <dialog-sold ref="soldDialog"></dialog-sold>
        </el-dialog>

        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="true"
        :title="'支付订单'" :visible.sync="payDialog" width="400px">
            <dialog-pay ref="payDialog" @pay="askPay"></dialog-pay>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="payDialog = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="getPay">支付</el-button>
            </span>
        </el-dialog>

        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'新增收款'" :visible.sync="incomeDialogVisible" width="551px">
            <el-form ref="incomeform" 
                :model="incomeform" label-width="178px"
                :rules="incomerules"
            >
                <el-form-item label="客户名" prop="customerName">
                    <el-autocomplete
                        size="mini"
                        class="form-input"
                        v-model="incomeform.customerName"
                        :fetch-suggestions="queryName"
                        :maxlength="15" 
                        show-word-limit
                        placeholder="请选择客户名"
                        @select="handleSelect"
                    ></el-autocomplete>
                </el-form-item>

                <el-form-item label="收款公司" prop="companyName">
                    <el-autocomplete
                        size="mini"
                        class="form-input"
                        v-model="incomeform.companyName"
                        :fetch-suggestions="queryCompanyName"
                        placeholder="请选择公司"
                        @select="handleCompanySelect"
                    ></el-autocomplete>
                </el-form-item>

                <el-form-item label="日期" prop="createTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="incomeform.createTime"
                        type="datetime"
                        placeholder="选择今日日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="收款金额" prop="money">
                    <el-input size="mini" class="form-input" v-model="incomeform.money" placeholder="例如+1000" ></el-input>
                </el-form-item>
                <el-form-item label="资金状态" prop="accountType">
                    <el-select class="form-input" size="mini" v-model="incomeform.accountType" placeholder="请选择">
                        <el-option v-for="(type,i) in dict.accountType" 
                        :label="type.label" :value="type.value"
                        :key="i"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input size="mini" class="form-input" v-model="incomeform.remark" placeholder="请输入备注内容" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="incomeDialogVisible = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="saveIncome">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  
import dict from '@/components/common/dict.js'
import DialogNewOrder from './DialogNewOrder';
import DialogBill from './DialogBill';
import DialogSold from './DialogSold';
import DialogBalance from './DialogBalance';
import DialogPay from './DialogPay';
import {cloneDeep} from 'lodash'
import pdfservice from '@/utils/getpdf.js'
import { 
    getOrderByCustomer,
    createOrUpdateOrder,
    orderDetail,
    settleOrder,
    sumOrder,
    payOrder,
    addCompAccount,
    userList,
    getCompPage
    } from '@/api/index';
export default {
    name: 'CustomerInfoDetail',
    components: {
        DialogNewOrder,
        DialogBill,
        DialogSold,
        DialogBalance,
        DialogPay
    },
    data() {
        return {
            id: '',
            status: '',
            dict: {},
            newOrderDialog: false,
            billDialog: false,
            balanceDialog: false,
            incomeDialogVisible: false,
            soldDialog: false,
            payDialog: false,
            page: {
                no: 1,
                total: 0,
                size: 10
            },
            // 展示用
            comInfo: {},
            // 支出收入列表
            tableData: [],
            deptTableData: [],
            receiveTableData: [],
            selectedRecord: [],
            incomeform: {},
            incomerules: {
                customerName: [{ required: true, message: '请输入客户名', trigger: 'change' }],
                companyName: [{ required: true, message: '请选择公司', trigger: 'change' }],
                createTime: [{ required: true, message: '请输入日期', trigger: 'change' }],
                money: [{ required: true, message: '请输入', trigger: 'change' }],
            },
            searchAdvice: [],
            searchCompanyAdvice: [],
        };
    },
    created() {
        this.getDict = dict.getDict // 获取字典
        this.dict = dict
        let data = this.$route.params.data
        this.id = data.id
        this.comInfo = {
            id: data.id,
            memberName: data.memberName,
            address: data.address,
            mobile: data.mobile,
            bank: data.bank,
            arrears: data.arrears,
            appName: data.appName,
            remarks: data.remarks,
            level: data.level,
            status: data.status,
        }
        this.getData()
    },
    methods: {
        getData() {
            if (!this.id){return}
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                customerId: this.id,
                status: this.status
            }
            getOrderByCustomer(obj).then(res => {
                if(res.list) {
                    let list = res.list
                    this.tableData = list.records
                    this.page.total = list.total
                    this.page.no = list.current
                }
                if (res.arrears) {
                    let arrears = res.arrears
                    this.deptTableData = [
                        arrears
                    ]
                }
                if (res.pay) {
                    let payArr = []
                    let pay = res.pay
                    for (let i = 0; i < this.dict.accountType.length; i++) {
                        const ele = this.dict.accountType[i];
                        for (const key in pay) {
                            const objele = pay[key];
                            if (key == ele.value) {
                                payArr.push({
                                    date: '',
                                    payWay: ele.label,
                                    value: objele
                                })
                            }
                        }
                    }
                   
                    this.receiveTableData = payArr
                }
            })
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

        save() {
            this.$refs.newOrderDialogRef.saveSubmit()
        },

        saveSubmit(data) {
            data.process = 0
            createOrUpdateOrder(data).then(res => {
                this.$message.success('操作成功')
                this.newOrderDialog = false
                this.getData()
            }) 
        },
        soldRecordChange(item) {
            this.selectedRecord = item
        },
        // 请求结欠
        getBalance() {
            this.$refs.balanceDialogRef.sendData()
        },
        askBalance(data) {
            let ids = []
            for (let i = 0; i < this.selectedRecord.length; i++) {
                const ele = this.selectedRecord[i];
                ids.push(ele.id)
            }
            let params = {
                customerId: this.id,
                ids: ids,
                price: data.amount,
                accountType: data.accountType
            }
            settleOrder(params).then(res => {
                this.balanceDialog = false
                this.$message.success('结欠成功')
                this.selectedRecord = []
                this.getData()
            })
        },
        // 请求支付
        getPay() {
            this.$refs.payDialog.sendData()
        },
        askPay(data) {
            payOrder(data).then(res => {
                this.payDialog = false
                this.$message.success('支付成功')
                this.getData()
            })
        },

        // 发起生成pdf请求
        getBillPDF() {
            this.$refs.billDialog.getPDF()
        },
        // 生成pdf
        receiveBillPDF() {
            pdfservice('#billDialog', '账单总汇')
        },
        dateFormat(date, lang = 'CN') {
            if (lang == 'CN') {
                return this.$moment(date).format('YYYY.MM.DD')
            }
            if (lang == 'EN') {
                return this.$moment(date).format('YYYY/MM/DD')
            }
        },

        // 打开dialog
        showDialog(tar, id) {
            // 结欠
            if (tar == 'balance') {
           
                if (!this.selectedRecord.length) {
                    this.$message.warning('请选择需要结欠的销售记录')
                    return
                }
                for (let i = 0; i < this.selectedRecord.length; i++) {
                    const ele = this.selectedRecord[i];
                    if (ele.process == 0 || ele.process == 1) {
                        this.$message.warning('需要通过审核才能进行结欠')
                        return
                    }
                }
                this.balanceDialog = true
                this.$nextTick(() => {
                    this.$refs.balanceDialogRef.resetData(this.comInfo.arrears)
                })
            }
            // 账单总汇
            if (tar == 'bill') {
                if (!this.selectedRecord.length) {
                    this.$message.warning('请选择需要汇总的销售记录')
                    return
                }
                let ids = []
                for (let i = 0; i < this.selectedRecord.length; i++) {
                    const ele = this.selectedRecord[i];
                    ids.push(ele.id)
                }
                sumOrder(ids).then(res => {
                    let data = {
                        name: this.comInfo.memberName,
                        date: this.$moment().format('YYYY-MM-DD'),
                        res: res.order
                    }
                    this.billDialog = true
                    this.$nextTick(() => {
                        this.$refs.billDialog.resetData(data)
                    })
                })
            }
            // 支付订单
            if (tar == 'pay') {
                this.payDialog = true
                this.$nextTick(() => {
                    this.$refs.payDialog.resetData(id)
                })
            }
            // 销售统计
            if (tar == 'sold') {
                this.soldDialog = true
                this.$nextTick(() => {
                    this.$refs.soldDialog.setId(this.id)
                    this.$refs.soldDialog.setName(this.comInfo.memberName)
                    this.$refs.soldDialog.getData()
                })
            }
            // 新建销售记录
            if (tar == 'new') {
                this.newOrderDialog = true
                this.$nextTick(() => {
                    this.$refs.newOrderDialogRef.resetData({customerName: this.comInfo.memberName, customerId: this.id}, false)
                    this.$refs.newOrderDialogRef.setName(this.comInfo.memberName)
                })
            }
            // 编辑销售记录
            if (tar == 'edit') {
                orderDetail({id: id}).then(res => {
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
                    status} = res
                    details.forEach(element => {
                        element.isTail = (element.isTail == 1 ?  true : false)
                    });
                    this.newOrderDialog = true
                    let form = {
                        id: id,
                        customerId: customerId,
                        customerName: customerName,
                        customerAddress: customerAddress,
                        transportName: transportName,
                        payType: Number(payType),
                        monetaryUnit: monetaryUnit,
                        discount: discount,
                        exchangeRate: exchangeRate,
                        taxRate: taxRate * 100,
                        status: Number(status),
                    }
                    let goodsList = details
                    this.$nextTick(() => {
                        // 请求id相关数据然后打开dialog
                        let data ={form:form, goodsList:goodsList}
                        this.$refs.newOrderDialogRef.editData(data)
                        this.$refs.newOrderDialogRef.setName(customerName)
                    })
                })
            }
            if (tar == 'receive') {
                this.addIncomeReady()
            }
        },
        addIncomeReady() {
            this.incomeform = {
                companyId: '',
                companyName: '',
                customerName: this.comInfo.memberName,
                customerId: this.comInfo.id,
                createTime: '',
                money: '',
                remark: '',
                accountType: '', //0现金1转账2现金3微信
            },
            this.incomeDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.incomeform.clearValidate()
            })
        },
        saveIncome() {
            let params = cloneDeep(this.incomeform)
            if (params.money < 0) {
                params.bookType = 0 // 支出
            }
            else {
                params.bookType = 1 // 收入
            }
            params.money = Math.abs(params.money)
            // 防止用户不点选客户
            for (let i = 0; i < this.searchAdvice.length; i++) {
                const ele = this.searchAdvice[i];
                if (params.customerName == ele.memberName) {
                    params.customerId = ele.id
                }
            }
            for (let i = 0; i < this.searchCompanyAdvice.length; i++) {
                const ele = this.searchCompanyAdvice[i];
                if (params.companyName == ele.name) {
                    params.companyId = ele.id
                }
            }

            this.$refs.incomeform.validate(valid => {
                if (valid) {
                    // 校验通过
                    addCompAccount(params).then(res => {
                        if (res) {
                            this.$message.success({message: '新增成功',});
                            this.incomeDialogVisible = false
                            // this.getPayLog()
                        }
                    })
                }
            })
        },
        // 查询客户名
        queryName(queryString, cb) {
            userList({
                level: '',
                status: '',
                page: 1,
                pageSize: 5,
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
                this.searchAdvice = arr
                cb(arr)
            })
        },
     
        handleSelect(item) {
            this.incomeform.customerId = item.id
        },
        // 查询公司
        queryCompanyName(qs, cb) {
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
                    this.searchCompanyAdvice = arr
                cb(arr)
            })
        },
     
        handleCompanySelect(item) {
            this.incomeform.companyName = item.name
            this.incomeform.companyId = item.id
        },
    }
};
</script>

<style lang="scss" scoped>
.crumbs {
    position: relative;
    width: 100%;
    height: 64px;
    box-sizing: border-box;
    padding: 25px;
    margin: 0 !important;
}

.box {
    margin: 0 23px;
    background-color: transparent;
}

.detail-card {
    position: relative;
    width: 100%;
    padding: 12px;
    background-color: #fff;
    font-size: 12px;
    padding: 72px 0 20px 0;
    margin-bottom: 18px;
    border-radius: 2px;


    .title {
        position: absolute;
        font-size: 20px;
        color: #333;
        top: 24px;
        left: 23px;
        font-weight: 500;
    }

    .detail-row {
        margin-bottom: 18px;
    }

    .detail-label {
        display: inline-block;
        color:  #999;
        width: 110px;
        text-align: right;
    }

    .detail-content {
        display: inline-block;
    }
}

.record-card  {
    position: relative;
    padding: 12px;
    background-color: #fff;
    border-radius: 2px;
    
    .title {
        display: inline-block;
        font-size: 20px;
        margin-left: 12px;
        color: #333;
        font-weight: 500;
    }

    .search {
        position: absolute;
        left: 90px;
        display: inline-block;
        width: 240px;
        height: 27px;
    }

    .top {
        height: 39px;

        .operate-btns {
            right: 12px;
        }
    }

    .operate {
        margin-top: 50px;
        text-align: center;

        .el-button  {
            width: 89px;
        }
    }

    .red {
        color: #FC5634;
    }

    .green {
        color: #33C179;
    }
}

.handle-box {
    position: absolute;
    right: 12px;
    top: 12px;
}

.pagination {
    margin-top: 40px;
}

.table {
    width: 100%;
    font-size: 11px;
}

.mr10 {
    margin-right: 10px;
}

.custom-dialog {
    ::v-deep .el-dialog__header {
        padding: 28px 35px !important;
    }
    ::v-deep .el-dialog__title {
        color: #1F1F21 !important;
        font-weight: 500;
    }
    ::v-deep .el-dialog__body {
        padding: 0 35px !important;
    }

}
.dialog-footer {
    display: inline-block;
    text-align: center;
    width: 100%;
}
.curr-btn {
    width: 75px;
}
.form-input {
    width: 220px;
}

// 删除弹窗
.el-popover.del-confirm {
    width: 249px !important;
    height: 136px !important;
    color: #fff;
    background: #2183EA;
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.3);
}

.del-word {
    margin: 20px 9px 12px;
    font-size: 11px;
    color: #909399;
}

.del-btn1, .btn2, .btn3 {
    width: 89px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 3px;
    font-size: 11px;
}
.del-btn1 {
    border: 1px solid #C4C9D3;
    color: #1F1F21;
}
.btn2 {
    @include primarybtn;
}

.btn3 {
    @include plainbtn;
}
.operate-btns {
    position: absolute;
    right: 25px;
    top: 12px;
}

.bottom-box {
    position: relative;
    margin: 12px 23px;
    background-color: #F0F2F5;
    
    .inner-box {
        background-color: #fff;
    }

    .left-box, .right-box {
        padding: 14px;
        position: relative;
        display: inline-block;
        width: 49%;
        background-color: #fff;
        min-height: 274px;

        .box-title {
            height: 46px;
            line-height: 38px;
            color: #303133;
            font-size: 16px;
            font-weight: 500;
        }
    }

    .left-box {
        float: left;
    }

    .right-box {
        float: right;
    }
}

.box-operate {
    .btn3 {
        position: absolute;
        right: 12px;
        top: 18px;
    }
}
</style>
