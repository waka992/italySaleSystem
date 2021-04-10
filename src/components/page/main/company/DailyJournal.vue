<template>
    <div class="daily-journal-box">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>公司</el-breadcrumb-item>
                <el-breadcrumb-item>流水日记账</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="new-btn">
            <el-button
            type="primary"
            @click="addReady"
            >+新增流水</el-button>
        </div>

        <div class="flex-box">
            <div class="left-box">
                <div class="box">
                    <div class="title">今日收入流水</div>
                    <div class="operate">
                        <el-input v-model="income.companyName" suffix-icon="el-icon-search" class="name-search" placeholder="输入公司名称"></el-input>
                        <div class="timer">
                            <span class="label">筛选日期</span>
                            <el-date-picker
                                :picker-options='pickerOptions'
                                v-model="income.date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="selector">
                            <span class="label">付款方式</span>
                            <el-select v-model="income.payment" placeholder="请选择" clearable>
                                <el-option
                                v-for="item in dict.accountType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <el-button style="margin-left:16px;"  icon="el-icon-search" @click="getIncomeData"></el-button>
                    </div>
                    <el-table
                        :data="income.tableData"
                        stripe
                        height="314"
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="date" label="日期" align="center">
                            <template slot-scope="scope">
                                {{timeFormat(scope.row.createTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="customerName" label="收款方" align="center"></el-table-column>
                        <el-table-column label="支付方式" align="center">
                            <template slot-scope="scope">{{dict.getDict(scope.row.accountType, 'accountType')}}</template>
                        </el-table-column>
                        <el-table-column prop="money" label="金额" align="center"></el-table-column>
                        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                        <el-table-column prop="remark" label="操作" align="center">
                            <template slot-scope="scope">
                                <span class="edit-btn" @click="operate('edit', scope.row, 'income')">编辑</span>
                                <span class="del-btn" @click="operate('del', scope.row, 'income')">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            background
                            :current-page="income.page.no"
                            :page-size="income.page.size"
                            :page-sizes="[5,10,20]"
                            :total="income.page.total"
                            layout="total, prev, pager, next, sizes, jumper"
                            @size-change="handleIncomeSizeChange"
                            @current-change="baseIncomePageChange"
                        ></el-pagination>
                    </div>
                </div>

                <div class="box">
                    <div class="title">今日支出流水</div>
                    <div class="operate">
                        <div class="timer">
                            <span class="label">筛选日期</span>
                            <el-date-picker
                                :picker-options='pickerOptions'
                                v-model="pay.date"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="selector">
                            <span class="label">支出方式</span>
                            <el-select v-model="pay.payment" placeholder="请选择" clearable>
                                <el-option
                                v-for="item in dict.accountType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button style="margin-left:16px;" icon="el-icon-search" @click="getPayData"></el-button>
                        </div>
                    </div>
                    <el-table
                        :data="pay.tableData"
                        stripe
                        height="314"
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column label="日期" align="center">
                            <template slot-scope="scope">
                                {{timeFormat(scope.row.createTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="customerName" label="支付方" align="center"></el-table-column>
                        <el-table-column label="支付方式" align="center">
                            <template slot-scope="scope">{{dict.getDict(scope.row.accountType, 'accountType')}}</template>
                        </el-table-column>
                        <el-table-column prop="money" label="金额" align="center">
                            <template slot-scope="scope">
                                <span :class="scope.row.bookType == 1 ? 'red' : 'green'">{{scope.row.bookType == 1 ? '+' : '-'}}{{scope.row.money}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                        <el-table-column prop="remark" label="操作" align="center">
                            <template slot-scope="scope">
                                <span class="edit-btn" @click="operate('edit', scope.row, 'pay')">编辑</span>
                                <span class="del-btn" @click="operate('del', scope.row, 'pay')">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            background
                            :current-page="pay.page.no"
                            :page-size="pay.page.size"
                            :page-sizes="[5,10,20]"
                            :total="pay.page.total"
                            layout="total, prev, pager, next, sizes, jumper"
                            @size-change="handlePaySizeChange"
                            @current-change="basePayPageChange"
                        ></el-pagination>
                    </div>
                </div>
            </div>
            <div class="right-box">
                <div class="title">流水总汇</div>
                <div class="date-select">
                    <date-selector @change="getFlowDate"></date-selector>
                </div>
                <div class="top-chart">
                    <div class="top-total">总收入：{{income.total}}元</div>
                    <pie-chart ref="pieChart1" :width="'200'" :height="'164'"></pie-chart>
                </div>
                <div class="bottom-chart">
                    <div class="bottom-total">总支出：{{pay.total}}元</div>
                    <pie-chart ref="pieChart2" :width="'200'" :height="'164'"></pie-chart>
                </div>
                <!-- 统计 -->
                <!-- <div class="statics">
                    <div class="left-statics">
                        <div class="title">总现金余数</div>
                        <div class="amount">{{income.total}}</div>
                    </div>
                    <div class="right-statics">
                        <div class="title">总汇款余数</div>
                        <div class="amount">{{pay.total}}</div>
                    </div>
                </div> -->
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="operateTar == 'new' ? '新增支出/收入记录' : '编辑支出/收入记录'" :visible.sync="baseDialogVisible" width="551px">
            <el-form ref="incomeform" 
                :model="incomeform" label-width="178px"
                :rules="incomerules"
            >
                <el-form-item label="公司名称" prop="companyName">
                    <el-autocomplete
                        size="mini"
                        class="form-input"
                        v-model="incomeform.companyName"
                        :fetch-suggestions="queryCompany"
                        @select="handleSelectCompany"
                        placeholder="请输入"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="收付款名称" prop="customerName">
                    <el-autocomplete
                        size="mini"
                        class="form-input"
                        v-model="incomeform.customerName"
                        :fetch-suggestions="queryName"
                        :maxlength="15" 
                        show-word-limit
                        placeholder="请输入客户名"
                        @select="handleSelect"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="日期" prop="createTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="incomeform.createTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="收入/支出" prop="money">
                    <el-input size="mini" class="form-input" v-model="incomeform.money" placeholder="例如+1000" @input="$forceUpdate()"></el-input>
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
                <el-button class="curr-btn" plain @click="baseDialogVisible = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="saveIncome">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import PieChart from '@/components/charts/PieChart.vue'
import DateSelector from '@/components/public/DateSelector'
import {
    dailyJournal,
    getPayBook,
    addCompAccount,
    addCompOrUpdate,
    userList,
    getCompPage,
    delCompAccount} from '@/api/index';
  
import dict from '@/components/common/dict.js'
export default {
    name: 'DailyJournal',
    components: {
        DateSelector,
        PieChart,
    },
    data() {
        return {
            dict: {},
            searchAdvice: [],
            chartDate: '',
            baseDialogVisible: false,
            operateTar: 'new',
            incomeform:{},
            income: {
                companyName: '',
                date: this.$moment().format('YYYY-MM-DD'),
                payment: '',
                total: 0,
                tableData: [
                ],
                page: {
                    no: 1,
                    total: 0,
                    size: 5
                },
            },
            pay: {
                date: this.$moment().format('YYYY-MM-DD'),
                payment: '',
                total: 0,
                tableData: [],
                page: {
                    no: 1,
                    total: 0,
                    size: 5
                },
            },
            rules: {
                name: [{ required: true, message: '请输入公司名', trigger: 'change' }],
                person: [{ required: true, message: '请输入法人代表', trigger: 'change' }],
                license: [{ required: true, message: '请输入营业执照注册号', trigger: 'change' }],
                code: [{ required: true, message: '请输入税务代码', trigger: 'change' }],
                mobile: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
            },
            incomerules: {
                companyName: [{ required: true, message: '请输入', trigger: 'change' }],
                customerName: [{ required: true, message: '请输入客户名', trigger: 'change' }],
                createTime: [{ required: true, message: '请输入日期', trigger: 'change' }],
                money: [{ required: true, message: '请输入', trigger: 'change' }],
            },
            pickerOptions: {
                disabledDate(time){
                    return time.getTime() > Date.now()   //如果当天可选，就不用减8.64e7
                }
            }
        };
    },
    created() {
        this.getIncomeData();
        this.getPayData();
        this.dict = dict
    },
    mounted() {
        this.getPieData()
    },
    methods: {
        getPieData(date) {
            let formatDate = ''
            if (!date) {
                formatDate = this.$moment().format('YYYY-MM-DD')
            }
            else {
                formatDate = this.$moment(date).format('YYYY-MM-DD')
            }
         
            let params = {
                bookDate: formatDate,
                payDate: formatDate,
            }
            dailyJournal(params).then(res => {
                let {cash, remittance, incomde, pay} = res
                let accountType = cloneDeep(this.dict.accountType)
                let data1 = []
                let data2 = []
                // 初始化data1 data2
                for (let i = 0; i < accountType.length; i++) {
                    const ele = accountType[i];
                    data1.push({
                        _dictValue: ele.value,
                        name: ele.label,
                        value: 0
                    })
                    data2.push({
                        _dictValue: ele.value,
                        name: ele.label,
                        value: 0
                    })
                }
               
                for (let i = 0; i < incomde.length; i++) {
                    const ele = incomde[i];
                    for (let j = 0; j < data1.length; j++) {
                        if (data1[j]._dictValue == ele.book_type) {
                            data1[j].value = ele.cash
                        }
                    }
                }

                for (let i = 0; i < pay.length; i++) {
                    const ele = pay[i];
                    for (let j = 0; j < data1.length; j++) {
                        if (data2[j]._dictValue == ele.book_type) {
                            data2[j].value = ele.cash
                        }
                    }
                }
                this.income.total = cash || 0
                this.pay.total = remittance || 0
                this.setChartData(data1, data2)
            })
        },

        // 置空数据
        resetData() {
            this.incomeform = {
                companyId: '',
                customerName: '',
                customerId: '',
                createTime: '',
                money: '',
                remark: '',
                accountType: '', //0现金1转账2现金3微信
            }
        },

        // 增准备
        addReady() {
            this.operateTar = 'new'
            this.resetData()
            this.baseDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.incomeform.clearValidate()
            })
        },

        // 查
        getIncomeData() {
            let obj = {
                pageSize:  this.income.page.size,
                page:  this.income.page.no,
                bookType: 1,
                companyName: this.income.companyName,
                incomeDate: this.income.date,
                payType: this.income.payment,
            }
            getPayBook(obj).then(res => {
                this.income.tableData = res.records
                this.income.page.total = res.total
                this.income.page.no = res.current
            })
        },
        getPayData() {
            let obj = {
                pageSize:  this.pay.page.size,
                page:  this.pay.page.no,
                bookType: 0,
                companyName: '',
                incomeDate: this.pay.date,
                payType: this.pay.payment,
            }
             getPayBook(obj).then(res => {
                this.pay.tableData = res.records
                this.pay.page.total = res.total
                this.pay.page.no = res.current
            })
        },

  
      

        checkDetail(id) {
            this.$router.push({name: 'compbaseinfodetail', params: {id: id}})
        },

        setChartData(data1, data2) {
            // 初始化option
            let option1 = {
                color: ['#3BA0F6', '#5BE7C7', '#F6913B'],
                legend: {
                    top: 40,
                    data: []
                },
                series: [{data: []}]
            }
            let option2 = {
                color: ['#EA7DE8', '#E7CF5B'],
                legend: {
                    top: 40,
                    data: []
                },
                series: [{data: []}]
            }
            // 数据渲染
            for (let i = 0; i < data1.length; i++) {
                const element = data1[i];
                let name = `${element.name} ${element.value}`
                option1.legend.data.push(name)
                data1[i].name = name
            }
            option1.series[0].data = data1

            for (let i = 0; i < data2.length; i++) {
                const element = data2[i];
                let name = `${element.name} ${element.value}`
                option2.legend.data.push(name)
                data2[i].name = name
            }
            option2.series[0].data = data2
            this.$refs.pieChart1.setData(option1)
            this.$refs.pieChart2.setData(option2)
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
            for (let i = 0; i < this.searchAdvice.length; i++) {
                const ele = this.searchAdvice[i];
                if (params.customerName == ele.memberName) {
                    params.customerId = ele.id
                }
            }
            this.$refs.incomeform.validate(valid => {
                if (valid) {
                    if (this.operateTar == 'new') {
                        addCompAccount(params).then(res => {
                            if (res) {
                                this.$message.success({message: '新增成功',});
                                this.baseDialogVisible = false
                                this.getIncomeData()
                                this.getPayData()
                                this.getPieData(this.chartDate)
                            }
                        })
                    }
                    if (this.operateTar == 'edit') {
                        addCompOrUpdate(params).then(res => {
                            if (res) {
                                this.$message.success({message: '编辑成功',});
                                this.baseDialogVisible = false
                                this.getIncomeData()
                                this.getPayData()
                            }
                        })
                    }
                }
            })
        },
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
        handleSelectCompany(item){
            this.incomeform.companyName = item.name
            this.incomeform.companyId = item.id
        },
        // 选择日期
        getFlowDate(date) {
            this.chartDate = date
            this.getPieData(date)
        },

        // 分页导航
        baseIncomePageChange(val) {
            this.$set(this.income.page, 'no', val);
            this.getIncomeData();
        },
        // 每页数量改变
        handleIncomeSizeChange(val) {
            this.$set(this.income.page, 'size', val);
            this.$set(this.income.page, 'no', 1);
            this.getIncomeData();
        },
         // 分页导航
        basePayPageChange(val) {
            this.$set(this.pay.page, 'no', val);
            this.getPayData();
        },
        // 每页数量改变
        handlePaySizeChange(val) {
            this.$set(this.pay.page, 'size', val);
            this.$set(this.pay.page, 'no', 1);
            this.getPayData();
        },
        timeFormat(time) {
            return this.$moment(time).format('YYYY-MM-DD')
        },
        /**
         * tar 操作
         * row 行的数据
         * from 收入还是支出
         */
        operate(tar, row, from) {
            console.log(tar, row);
            if (tar == 'edit') {
                this.operateTar = 'edit'
                let {id, companyId, companyName, customerName, customerId, createTime, money, remark, accountType, bookType} = row
                this.incomeform = {
                    id: id,
                    companyName: companyName,
                    companyId: companyId,
                    customerName: customerName,
                    customerId: customerId,
                    createTime: createTime,
                    // money: money,
                    remark: remark,
                    accountType: Number(accountType), //0现金1转账2现金3微信
                }
                this.incomeform.money = bookType == 0 ? Number(-money) : Number(money)
                this.baseDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.incomeform.clearValidate()
                })
            }
            if (tar == 'del') {
                this.$confirm('确认删除该流水？').then(_ => {
                    delCompAccount({id: row.id}).then(res=> {
                        this.$message.success('删除成功')
                        if (from == 'income') {
                            this.getIncomeData()
                        }
                        if (from == 'pay') {
                            this.getPayData()
                        }
                    })
                })
                .catch(_ => {});
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.daily-journal-box {
    position: relative;
    overflow: auto;
}

.new-btn {
    position: absolute;
    top: 21px;
    right: 15px;
}

.operate  {
    font-size: 12px;
    margin-bottom: 17px;

    .name-search {
        width: 178px;
        margin-right: 36px;
        margin-left: 16px;
    }

    .timer,.selector {
        display: inline-block;
    }

    .timer {
        width: 220px;
        margin-right: 36px;

        .el-date-editor {
            width: 142px;
        }
    }

    .selector {
        .el-select {
            width: 107px;
        }
    }

    .label {
        margin-right: 8px;
    }
}

.box {
    padding: 12px;
    background-color: #fff;
    width: 100%;
    margin-bottom: 12px;

    .title {
        padding: 9px 16px;
        font-size: 16px;
        color: #303133;
    }
}

.pagination {
    padding: 20px 0 !important;
}

.table {
    width: 100%;
    font-size: 11px;

    .edit-btn {
        display: inline-block; color: #2183EA; margin-right: 10px;
        cursor: pointer;
    }

    .del-btn {
        display: inline-block; color: red;
        cursor: pointer;
    }
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

.form-input {
    width: 220px;
}

.flex-box {
    display: flex;

    .left-box {
        flex: 1;
        overflow: hidden;
        margin: 0 23px;
    }

    .right-box {
        position: relative;
        width: 290px;
        margin-right: 12px;
        margin-bottom: 15px;
        background-color: #fff;

        .title {
            margin: 23px 21px;
        }

        .date-select {
            position: absolute;
            top: 25px;
            right: 19px;
        }

        .top-total, .bottom-total {
            position: absolute;
            font-size: 12px;
            font-weight: bold;
            color: #1F1F21;
        }

        .top-total, .bottom-total {
            top: 22px;
            right: 3px;
        }
    }
}

// 图表
.charts {
    overflow-x: visible;
    height: 134px;
    margin-top: 30px;
}
.top-chart, .bottom-chart {
    position: relative;
    display: inline-block;
    width: 200px;
    height: 170px;
    margin-left: 22px;
}

.statics {
    .left-statics,.right-statics {
        display: inline-block;
        width: 50%;
        text-align: center;

        .title {
            color: #1F1F21;
            font-size: 12px;
        }
        .amount {
            font-size: 16px;
            color: #303133;
            font-weight: 500;
        }
    }

}


</style>
