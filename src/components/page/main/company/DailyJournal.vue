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
                        <el-input  suffix-icon="el-icon-search" class="name-search" placeholder="输入公司名称"></el-input>
                        <div class="timer">
                            <span class="label">筛选日期</span>
                            <el-date-picker
                                v-model="income.date"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="selector">
                            <span class="label">付款方式</span>
                            <el-select v-model="income.payment" placeholder="请选择">
                                <el-option
                                v-for="item in paymentOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <el-table
                        :data="income.tableData"
                        stripe
                        height="314"
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="date" label="日期" align="center"  width="130"></el-table-column>
                        <el-table-column prop="name" label="客户" align="center"></el-table-column>
                        <el-table-column label="支付方式" align="center"  width="70">
                            <template slot-scope="scope">{{getPayment(scope.row.payment)}}</template>
                        </el-table-column>
                        <el-table-column prop="amount" label="金额" align="center"  width="80"></el-table-column>
                        <el-table-column prop="remark" label="备注" align="center" width="100"></el-table-column>
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
                                v-model="pay.date"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="selector">
                            <span class="label">付款方式</span>
                            <el-select v-model="pay.payment" placeholder="请选择">
                                <el-option
                                v-for="item in paymentOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
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
                        <el-table-column prop="date" label="日期" align="center"  width="130"></el-table-column>
                        <el-table-column prop="where" label="去向" align="center"></el-table-column>
                        <el-table-column label="支付方式" align="center">
                            <template slot-scope="scope">{{getPayment(scope.row.payment)}}</template>
                        </el-table-column>
                        <el-table-column prop="amount" label="金额" align="center"  width="80"></el-table-column>
                        <el-table-column prop="remark" label="备注" align="center" width="100"></el-table-column>
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
                    <div class="top-total">总收入：{{pay.total}}元</div>
                    <pie-chart ref="pieChart1" :width="'200'" :height="'164'"></pie-chart>
                </div>
                <div class="bottom-chart">
                    <div class="bottom-total">总支出：{{pay.total}}元</div>
                    <pie-chart ref="pieChart2" :width="'200'" :height="'164'"></pie-chart>
                </div>
                <!-- 统计 -->
                <div class="statics">
                    <div class="left-statics">
                        <div class="title">总现金余数</div>
                        <div class="amount">¥{{income.total}}</div>
                    </div>
                    <div class="right-statics">
                        <div class="title">总汇款余数</div>
                        <div class="amount">¥{{pay.total}}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'添加新公司'" :visible.sync="baseDialogVisible" width="750px">
            <el-form ref="form" 
                :model="form" label-width="120px" :inline="true"
                :rules="rules"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公司名称" prop="name">
                            <el-input size="mini" class="form-input" v-model="form.name" placeholder="请输入公司名" maxlength="15" show-word-limit></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法人代表" prop="person">
                            <el-input size="mini" class="form-input" v-model="form.person" placeholder="请输入法人代表" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="营业执照号" prop="license">
                            <el-input size="mini"  class="form-input" v-model="form.license" placeholder="请输入营业执照注册号" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                            <el-input size="mini"  class="form-input" v-model="form.status" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="税务代码" prop="code">
                            <el-input size="mini"  class="form-input" v-model="form.code" placeholder="请输入税务代码" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行名称" prop="bank">
                            <el-input size="mini"  class="form-input" v-model="form.bank" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="地址" prop="address">
                            <el-input size="mini"  class="form-input" v-model="form.address" placeholder="请输入公司地址" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行账号" prop="account">
                            <el-input size="mini"  class="form-input" v-model="form.account" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="电话" prop="mobile">
                            <el-input size="mini"  class="form-input" v-model="form.mobile" placeholder="请输入联系电话" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="流水初始金额" prop="flow" placeholder="请输入" >
                            <el-input size="mini"  class="form-input" v-model="form.flow"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email" placeholder="请输入联系邮箱" >
                            <el-input size="mini"  class="form-input" v-model="form.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="其他备注" prop="remark" placeholder="请输入备注内容" >
                            <el-input size="mini"  class="form-input" v-model="form.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="baseDialogVisible = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="save">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import qs from 'qs'
import DateSelector from '../../../public/DateSelector'
import PieChart from '@/components/charts/PieChart.vue'

export default {
    name: 'CompanyBaseInfo',
    components: {
        DateSelector,
        PieChart,
    },
    data() {
        return {
            baseDialogVisible: false,
            paymentOptions: [
                {value: 0, label: '现金'},
                {value: 1, label: '汇款'},
                {value: 2, label: '发票'},
            ],
            
            income: {
                name: '',
                date: '',
                payment: '',
                total: 13000,
                tableData: [
                    {date: '2020.11.03 20:38', name: '广东沈外贸科技有限公司', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', name: '广东沈外贸科技有限公司2', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', name: '广东沈外贸科技有限公司2', payment: 2, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', name: '广东沈外贸科技有限公司2', payment: 0, id: 1, amount: 100000, remark: 'test'},
                    {date: '2020.11.03 20:38', name: '广东沈外贸科技有限公司2', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', name: '广东沈外贸科技有限公司2', payment: 1, id: 1, amount: 10000, remark: 'test'},
                ],
                page: {
                    no: 1,
                    total: 0,
                    size: 5
                },
            },
            pay: {
                date: '',
                payment: '',
                total: 12000,
                tableData: [
                    {date: '2020.11.03 20:38', where: '工资', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', where: '货款', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', where: '工资', payment: 2, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', where: '工资', payment: 0, id: 1, amount: 100000, remark: 'test'},
                    {date: '2020.11.03 20:38', where: '工资', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', where: '工资', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', where: '工资', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', where: '工资', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', where: '工资', payment: 1, id: 1, amount: 10000, remark: 'test'},
                    {date: '2020.11.03 20:38', where: '材料', payment: 1, id: 1, amount: 10000, remark: 'test'},
                ],
                page: {
                    no: 1,
                    total: 0,
                    size: 5
                },
            },
            form: {
                name: '',
                person: '',
                license: '',
                status: '',
                code: '',
                bank: '',
                address: '',
                account: '',
                mobile: '',
                flow: '',
                email: '',
                remark: '',
            },
            rules: {
                name: [{ required: true, message: '请输入公司名', trigger: 'change' }],
                person: [{ required: true, message: '请输入法人代表', trigger: 'change' }],
                license: [{ required: true, message: '请输入营业执照注册号', trigger: 'change' }],
                code: [{ required: true, message: '请输入税务代码', trigger: 'change' }],
                mobile: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
            }
        };
    },
    created() {
        this.getIncomeData();
        this.getPayData();
    },
    mounted() {
        this.setChartData();
    },
    methods: {
        getPayment(payment) {
            for (let i = 0; i < this.paymentOptions.length; i++) {
                const element = this.paymentOptions[i];
                if (element.value == payment) {
                    return element.label
                }
            }
        },
        // 置空数据
        resetData() {
            this.form = {
                name: '',
                person: '',
                license: '',
                status: '',
                code: '',
                bank: '',
                address: '',
                account: '',
                mobile: '',
                flow: '',
                email: '',
                remark: '',
            }
        },

        // 增准备
        addReady() {
            this.resetData()
            this.baseDialogVisible = true;
        },

        // 查
        getIncomeData() {
            let obj = {
                pageSize:  this.income.page.size,
                page:  this.income.page.no,
            }
            // shopContractList(obj).then(res => {
            //     this.tableData = res.records
            //     this.page.total = res.total
            //     this.page.no = res.current
            // })
        },
        getPayData() {
            let obj = {
                pageSize:  this.pay.page.size,
                page:  this.pay.page.no,
            }
            // shopContractList(obj).then(res => {
            //     this.tableData = res.records
            //     this.page.total = res.total
            //     this.page.no = res.current
            // })
        },

  
        // 保存编辑
        save() {
            let params = cloneDeep(this.form)
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 校验通过
                    // userUpdate(params).then(res => {
                    //     if (res) {
                    //         this.$message.success({message: '添加成功',});
                    //         this.dialogVisible = false
                    //         this.getData()
                    //     }
                    // })
                }
            })
        },

        checkDetail(id) {
            this.$router.push({name: 'compbaseinfodetail', params: {id: id}})
        },

        setChartData() {
            // 测试数据
            let data1 = [
                {name: '现金', value: 10000},
                {name: '汇款', value: 3000},
                {name: '发票', value: 0},
            ]
            let data2 = [
                {name: '汇款', value: 8000},
                {name: '其他', value: 4000},
            ]
            // 初始化option
            let option1 = {
                color: ['#3BA0F6', '#5BE7C7', '#F6913B'],
                legend: {
                    top: 60,
                    data: []
                },
                series: [{data: []}]
            }
            let option2 = {
                color: ['#EA7DE8', '#E7CF5B'],
                legend: {
                    top: 60,
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
            console.log(option1);
            this.$refs.pieChart1.setData(option1)
            this.$refs.pieChart2.setData(option2)
        },

        // 选择日期
        getFlowDate(date) {
            console.log(date);
        },

        // 分页导航
        baseIncomePageChange(val) {
            this.$set(this.income.page, 'no', val);
            this.getIncomeData();
        },
        // 每页数量改变
        handleIncomeSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
         // 分页导航
        basePayPageChange(val) {
            this.$set(this.pay.page, 'no', val);
            this.getPayData();
        },
        // 每页数量改变
        handlePaySizeChange(val) {
            console.log(`每页 ${val} 条`);
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
            top: 42px;
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
