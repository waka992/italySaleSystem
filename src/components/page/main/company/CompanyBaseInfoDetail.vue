<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>公司</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name: 'baseinfo'}">基本信息</el-breadcrumb-item>
                <el-breadcrumb-item>详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            
            <div class="detail-card">
                <div class="handle-box">
                    <el-button
                        icon="el-icon-edit"
                        type="primary"
                        size="mini"
                        @click="editReady"
                        >编辑</el-button>
                </div>
                <el-row class="detail-row">
                    <el-col :span="12">
                        <span class="detail-label">公司名称：</span>
                        <span class="detail-content">{{comInfo.name}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="detail-label">营业执照注册号：</span>
                        <span class="detail-content">{{comInfo.license}}</span>
                    </el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="12">
                        <span class="detail-label">法人代表：</span>
                        <span class="detail-content">{{comInfo.corporation}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="detail-label">税务码：</span>
                        <span class="detail-content">{{comInfo.taxation}}</span>
                    </el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="12">
                        <span class="detail-label">电话：</span>
                        <span class="detail-content">{{comInfo.phone}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="detail-label">地址：</span>
                        <span class="detail-content">{{comInfo.address}}</span>
                    </el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="12">
                        <span class="detail-label">邮箱：</span>
                        <span class="detail-content">{{comInfo.email}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="detail-label">账号信息：</span>
                        <span class="detail-content">-</span>
                    </el-col>
                </el-row>
            </div>

            <div class="record-card">
                <div class="top">
                    <div class="title">支出收入记录({{tableData.length}})</div>
                    <div class="search">
                        <el-input size="mini" suffix-icon="el-icon-search" placeholder="输入关键词"></el-input>
                    </div>
                    <div class="handle-box">
                        <el-button
                            size="mini"
                            icon="el-icon-edit"
                            type="primary"
                            @click="addIncomeReady"
                            >+新增记录</el-button>
                    </div>
                </div>
                <el-table
                    :data="tableData"
                    stripe
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                >
                    <el-table-column prop="name" label="公司名称"  align="center"></el-table-column>
                    <el-table-column prop="date" label="日期" align="center"></el-table-column>
                    <el-table-column prop="income" label="收入/支出" width="120" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.income >= 0 ? 'red' : 'green'">{{scope.row.income}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="from" label="资金来源" width="120" align="center"></el-table-column>
                    <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                    <el-table-column prop="rest" label="余额"  width="120" align="center"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        :current-page="page.no"
                        :page-size="page.size"
                        :total="page.total"
                        layout="total, prev, pager, next, sizes, jumper"
                        @size-change="handleSizeChange"
                        @current-change="basePageChange"
                    ></el-pagination>
                </div>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'编辑公司信息'" :visible.sync="baseDialogVisible" width="750px">
            <el-popover
                popper-class="del-confirm"
                placement="bottom"
                width="210"
                v-model="delVisible">
                <div class="del-word">删除该公司后，数据不可恢复，是否确认删除？</div>
                <div style="text-align: right; margin: 0">
                    <el-button class="del-btn1" size="mini" type="text" @click="delVisible = false">取消</el-button>
                    <el-button class="del-btn2" size="mini" @click="delConfirm">确认删除</el-button>
                </div>
                <el-button class="del-btn2 outer" slot="reference">删除</el-button>
            </el-popover>
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
                        <el-form-item label="法人代表" prop="corporation">
                            <el-input size="mini" class="form-input" v-model="form.corporation" placeholder="请输入法人代表" ></el-input>
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
                            <el-select class="form-input" v-model="form.status" placeholder="请选择">
                                <el-option label="注销" :value="0"></el-option>
                                <el-option label="正常" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="税务代码" prop="taxation">
                            <el-input size="mini"  class="form-input" v-model="form.taxation" placeholder="请输入税务代码" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行名称" prop="bankName">
                            <el-input size="mini"  class="form-input" v-model="form.bankName" placeholder="请输入" ></el-input>
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
                        <el-form-item label="密码" prop="password">
                            <el-input size="mini"  class="form-input" v-model="form.password"  placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行卡号" prop="cardNo">
                            <el-input size="mini"  class="form-input" v-model="form.cardNo" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="流水初始金额" prop="balance" >
                            <el-input size="mini"  class="form-input" v-model="form.balance" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行所在地" prop="bankAddress">
                            <el-input size="mini"  class="form-input" v-model="form.bankAddress" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="电话" prop="phone">
                            <el-input size="mini"  class="form-input" v-model="form.phone" placeholder="请输入联系电话" ></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input size="mini"  class="form-input" v-model="form.email"  placeholder="请输入联系邮箱" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="其他备注" prop="remark">
                            <el-input size="mini"  class="form-input" v-model="form.remark"  placeholder="请输入备注内容" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="baseDialogVisible = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="save">保存</el-button>
            </span>
        </el-dialog>

        <!-- 支出收入 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'新增支出/收入记录'" :visible.sync="incomeDialogVisible" width="551px">
            <el-form ref="incomeform" 
                :model="incomeform" label-width="178px"
                :rules="incomerules"
            >
                <el-form-item label="客户名称" prop="name">
                    <el-input size="mini" class="form-input" v-model="incomeform.name" placeholder="请输入客户名" maxlength="15" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="date">
                    <el-date-picker
                        v-model="incomeform.date"
                        type="datetime"
                        placeholder="选择今日日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="收入/支出" prop="income">
                    <el-input size="mini" class="form-input" v-model="incomeform.income" placeholder="例如+1000" ></el-input>
                </el-form-item>
                <el-form-item label="资金状态" prop="status">
                    <el-input size="mini" class="form-input" v-model="incomeform.status" placeholder="请输入客户资金状态" ></el-input>
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
import {cloneDeep} from 'lodash';
import qs from 'qs'
import { 
addCompAccount,
addCompOrUpdate,
delComp,
delCompAccount,
getCompDetail,
getCompPage,
getCompPayLog,
profitSum, } from '@/api/index';

export default {
    name: 'CompanyBaseInfo',
    data() {
        return {
            delVisible: false,
            baseDialogVisible: false,
            incomeDialogVisible: false,
            id: '',
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            // 展示用
            comInfo: {},
            // 支出收入列表
            tableData: [],
            // 修改用
            form: {},
            incomeform: {},
            rules: {
                name: [{ required: true, message: '请输入公司名', trigger: 'change' }],
                person: [{ required: true, message: '请输入法人代表', trigger: 'change' }],
                license: [{ required: true, message: '请输入营业执照注册号', trigger: 'change' }],
                code: [{ required: true, message: '请输入税务代码', trigger: 'change' }],
                mobile: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
            },
            incomerules: {
                name: [{ required: true, message: '请输入客户名', trigger: 'change' }],
                date: [{ required: true, message: '请输入日期', trigger: 'change' }],
                income: [{ required: true, message: '请输入', trigger: 'change' }],
            },
        };
    },
    created() {
        this.id = this.$route.params.data.id
        this.getData();
        this.getPayLog()
    },
    methods: { 
        editReady() {
            this.baseDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },

        delConfirm() {
            let id = this.id
            delComp({id: id}).then(res => {
                if (res) {
                    this.$message.success('删除成功')
                    this.delVisible = false
                    this.baseDialogVisible = false
                    this.$router.push({name: 'baseinfo'})
                }
            })
        },

        // 查
        getData() {
            let obj = {
                id: this.id
            }
            getCompDetail(obj).then(res => {
                if (res) {
                    this.comInfo = {
                        name: res.name,
                        corporation: res.corporation,
                        license: res.license,
                        taxation: res.taxation,
                        phone: res.phone,
                        address: res.address,
                        email: res.email,
                    }
                    let bankInfo = res.banks[0]
                    this.form = {
                        name: res.name,
                        corporation: res.corporation,
                        license: res.license,
                        status: 1,
                        taxation: res.taxation,
                        address: res.address,
                        phone: res.phone,
                        balance: res.balance,
                        email: res.email,
                        remark: res.remark,
                        bankName: bankInfo.bankName,
                        bankAddress: bankInfo.address,
                        account: bankInfo.account,
                        cardNo: bankInfo.cardNo,
                        password: bankInfo.password,
                        bankCompanyId: bankInfo.companyId,
                        bankId: bankInfo.id
                    }
                }
            })
        },
        // 获取支出收入记录
        getPayLog() {
            let obj = {
                id: this.id,
                page: this.page.no,
                pageSize: this.page.size,
            }
            getCompPayLog(obj).then(res => {
                if (res) {
                    let account = res.account
                    this.tableData = account.records
                    this.page.total = account.total
                    this.page.no = account.current
                }
            })
        },
  
        // 保存编辑
        save() {
            let params = cloneDeep(this.form)
            let banks = [
                {
                    account: this.form.account,
                    address: this.form.bankAddress,
                    bankName: this.form.bankName,
                    cardNo: this.form.cardNo,
                    password: this.form.password,
                    id: this.form.bankId,
                    companyId: this.form.bankCompanyId,
                }
            ]
            delete params.account;
            delete params.bankAddress;
            delete params.bankName;
            delete params.cardNo;
            delete params.password;
            params.banks = banks
            params.id = this.id
            this.$refs.form.validate(valid => {
                if (valid) {
                    addCompOrUpdate(params).then(res => {
                        if (res) {
                            this.$message.success({message: '修改成功',});
                            this.baseDialogVisible = false
                            this.comInfo = cloneDeep(this.form) // 更新数据
                        }
                    })
                }
            })
        },

        addIncomeReady() {
            this.incomeform = {
                name: '',
                date: '',
                income: '',
                status: '',
                remark: '',
            },
            this.incomeDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.incomeform.clearValidate()
            })
        },

        saveIncome() {
            let params = cloneDeep(this.incomeform)
            this.$refs.incomeform.validate(valid => {
                console.log(valid);
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

        // 分页导航
        basePageChange(val) {
            this.$set(this.page, 'no', val);
            this.getData();
        },
        // 每页数量改变
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
    }
};
</script>

<style lang="scss" scoped>

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
    padding: 40px 0 20px 0;
    margin-bottom: 18px;
    border-radius: 2px;

    .detail-row {
        margin-bottom: 18px;
    }

    .detail-label {
        display: inline-block;
        color:  #999;
        width: 120px;
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
        font-size: 14px;
        margin-left: 12px;
        color: #303133;
        font-weight: 500;
    }

    .search {
        position: absolute;
        right: 260px;
        display: inline-block;
        width: 240px;
        height: 27px;
    }

    .top {
        height: 39px;
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

// 删除弹窗
.el-popover.del-confirm {
    width: 249px !important;
    height: 136px !important;
    background: #FFFFFF;
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.3);
}

.del-word {
    margin: 20px 9px 12px;
    font-size: 11px;
    color: #909399;
}

.del-btn1, .del-btn2 {
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
.del-btn2 {
    border: 1px solid #F5222D;
    color: #F5222D;

    &.outer {
        position: absolute;
        top: 16px;
        right: 36px;
    }
}
</style>
