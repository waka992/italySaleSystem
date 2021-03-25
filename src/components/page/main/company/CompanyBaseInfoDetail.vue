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
                        <el-date-picker
                            :picker-options='pickerOptions'
                            v-model="logDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                        <div class="search-btn">
                            <el-button size="mini" icon="el-icon-search" @click="getPayLog"></el-button>
                        </div>
                        <!-- <el-input size="mini" suffix-icon="el-icon-search" placeholder="输入关键词"></el-input> -->
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
                    <el-table-column prop="customerName" label="收付款方"  align="center"></el-table-column>
                    <el-table-column prop="createTime" label="日期" align="center"></el-table-column>
                    <el-table-column prop="money" label="收入/支出" width="120" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.bookType == 1 ? 'red' : 'green'">{{scope.row.bookType == 1 ? '+' : '-'}}{{scope.row.money}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="accountType" label="资金来源" width="120" align="center">
                        <template slot-scope="scope">
                            {{getDict(scope.row.accountType, 'accountType')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                    <el-table-column prop="balance" label="余额"  width="120" align="center"></el-table-column>
                    <el-table-column label="操作"  width="120" align="center">
                        <template slot-scope="scope">
                            <el-popover
                                width="120"
                                placement="bottom"
                                v-model="delRecordVisible">
                                <p>确定删除吗？</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="delRecordVisible = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="delRecordConfirm(scope.row.id)">确定</el-button>
                                </div>
                                <el-button slot="reference" type="text" @click="delRecordConfirm(scope.row.id)">删除</el-button>
                            </el-popover>
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
                        placeholder="选择今日日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="收入/支出" prop="money">
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
import {cloneDeep} from 'lodash';
import { 
addCompAccount,
addCompOrUpdate,
delComp,
delCompAccount,
getCompDetail,
getCompPayLog,
userList,} from '@/api/index';
import dict from '@/components/common/dict.js'
import RSA from '@/utils/encode'

export default {
    name: 'CompanyBaseInfo',
    data() {
        return {
            dict: {},
            delVisible: false,
            baseDialogVisible: false,
            incomeDialogVisible: false,
            delRecordVisible: false,
            searchAdvice: [],
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
                customerName: [{ required: true, message: '请输入客户名', trigger: 'change' }],
                createTime: [{ required: true, message: '请输入日期', trigger: 'change' }],
                money: [{ required: true, message: '请输入', trigger: 'change' }],
            },
            logDate: '',
            pickerOptions: {
                disabledDate(time){
                    return time.getTime() > Date.now()   //如果当天可选，就不用减8.64e7
                }
            }
        };
    },
    created() {
        this.getDict = dict.getDict // 获取字典
        this.dict = dict
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
                date: this.logDate,
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

        delRecordConfirm(id) {
            this.$confirm('确认删除当前收入记录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                callback: action => {
                if (action === 'confirm') {
                    delCompAccount({id: id}).then(res=> {
                        this.$message.success('删除成功')
                        this.getPayLog()
                    })
                }
                else {
                    console.log('按下 取消')
                }
                }
            })
        },

        addIncomeReady() {
            this.incomeform = {
                companyId: this.id,
                customerName: '',
                customerId: '',
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

            this.$refs.incomeform.validate(valid => {
                if (valid) {
                    // 校验通过
                    addCompAccount(params).then(res => {
                        if (res) {
                            this.$message.success({message: '新增成功',});
                            this.incomeDialogVisible = false
                            this.getPayLog()
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
        // 分页导航
        basePageChange(val) {
            this.$set(this.page, 'no', val);
            this.getPayLog();
        },
        // 每页数量改变
        handleSizeChange(val) {
            this.$set(this.page, 'size', val);
            this.$set(this.page, 'no', 1);
            this.getPayLog();
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
        margin-top: 8px;
        color: #303133;
        font-weight: 500;
        vertical-align: middle;
    }

    .search {
        position: absolute;
        left: 160px;
        display: inline-block;
        width: 240px;
        height: 27px;
    }

    .search-btn {
        position: absolute;
        left: 240px;
        top: 0;
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
