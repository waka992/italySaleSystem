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
                        <span class="detail-content">{{comInfo.person}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="detail-label">税务码：</span>
                        <span class="detail-content">{{comInfo.code}}</span>
                    </el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="12">
                        <span class="detail-label">电话：</span>
                        <span class="detail-content">{{comInfo.mobile}}</span>
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
                        <span class="detail-content">{{comInfo.account}}</span>
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

export default {
    name: 'CompanyBaseInfo',
    data() {
        return {
            delVisible: false,
            baseDialogVisible: false,
            incomeDialogVisible: false,
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            // 展示用
            comInfo: {
                name: '广东沈外贸科技有限公司',
                license: '李呢发', 
                person: '李呢发', 
                code: '广州', 
                mobile: 13577292902, 
                address: '234234@sina.com',
                email: '234234@sina.com',
                account: '-',
            },
            // 支出收入列表
            tableData: [
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: 3000, from: '支付宝', remark: 13577292902, rest: 67000},
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: -3000, from: '支付宝', remark: 13577292902, rest: 67000},
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: 6000, from: '支付宝', remark: 13577292902, rest: 67000},
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: 55000, from: '支付宝', remark: 13577292902, rest: 67000},
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: -3000, from: '支付宝', remark: 13577292902, rest: 67000},
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: 3000, from: '支付宝', remark: 13577292902, rest: 67000},
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: 3000, from: '支付宝', remark: 13577292902, rest: 67000},
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: 3000, from: '支付宝', remark: 13577292902, rest: 67000},
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: 3000, from: '支付宝', remark: 13577292902, rest: 67000},
                {name: '广东沈外贸科技有限公司', date: '2020.11.03 10:05', income: 3000, from: '支付宝', remark: 13577292902, rest: 67000},
            ],
            // 修改用
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
            incomeform: {
                name: '',
                date: '',
                income: '',
                status: '',
                remark: '',
            },
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
        this.getData();
    },
    methods: {
        // 置空数据
        getDetail() {
            this.form = {
                name: '公司名称',
                person: '法人代表',
                license: '3902423940273',
                status: '',
                code: '1290412094712',
                bank: '中国工商银行',
                address: '广州天河林和105',
                account: '912873192461',
                mobile: '1314251125',
                flow: '32444',
                email: 'xxx@qq.com',
                remark: '备注',
            }
        },

        
        editReady() {
            this.getDetail()
            this.baseDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },

        delConfirm() {
            console.log(this.$route.params);
            this.delVisible = false
            this.baseDialogVisible = false
            this.$router.push({name: 'baseinfo'})
        },

        // 查
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
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
        width: 100px;
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
