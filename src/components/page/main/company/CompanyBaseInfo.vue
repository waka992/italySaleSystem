<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>公司</el-breadcrumb-item>
                <el-breadcrumb-item>基本信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="handle-box">
                <el-button
                    type="primary"
                    @click="addReady"
                    >+添加新公司</el-button>
            </div>
            <el-table
                :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="公司名称" align="center"></el-table-column>
                <el-table-column prop="corporation" label="法人代表" align="center" width="80"></el-table-column>
                <el-table-column label="状态" align="center"  width="90">
                    <template slot-scope="scope">{{scope.row.status == 0 ? '注销' : '正常'}}</template>
                </el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
                <el-table-column prop="balance" label="余额" align="center"></el-table-column>
                
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            icon="el-icon-s-operation"
                            @click="checkDetail(scope.row)"
                            type="primary"
                        >查看详情</el-button>
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
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import qs from 'qs'
import { 
addCompOrUpdate,
getCompPage,
profitSum, } from '@/api/index';
export default {
    name: 'CompanyBaseInfo',
    data() {
        return {
            baseDialogVisible: false,
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            tableData: [],
            form: {
                name: '',
                corporation: '',
                license: '',
                status: 1,
                taxation: '',
                bankName: '',
                bankAddress: '',
                address: '',
                account: '',
                phone: '',
                balance: '',
                email: '',
                remark: '',
                cardNo: '',
                password: '',
            },
            rules: {
                name: [{ required: true, message: '请输入公司名', trigger: 'change' }],
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 置空数据
        resetData() {
            this.form = {
                name: '',
                corporation: '',
                license: '',
                status: 1,
                taxation: '',
                bankName: '',
                bankAddress: '',
                address: '',
                account: '',
                phone: '',
                balance: 0,
                email: '',
                remark: '',
                cardNo: '',
                password: '',
            }
        },

        // 增准备
        addReady() {
            this.resetData()
            this.baseDialogVisible = true;
        },

        // 查
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
            }
            getCompPage(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
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
                    // id: this.form.id,
                    // companyId: this.form.companyId,
                }
            ]
            delete params.account;
            delete params.bankAddress;
            delete params.bankName;
            delete params.cardNo;
            delete params.password;
            params.banks = banks
            this.$refs.form.validate(valid => {
                if (valid) {
                    addCompOrUpdate(params).then(res => {
                        if (res) {
                            this.$message.success({message: '添加成功',});
                            this.baseDialogVisible = false
                            this.getData()
                        }
                    })
                }
            })
        },

        checkDetail(data) {
            this.$router.push({name: 'compbaseinfodetail', params: {data: data}})
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
    }
};
</script>

<style lang="scss" scoped>

.box {
    padding: 12px;
    margin: 0 23px;
    background-color: #fff;
}

.handle-box {
    margin-bottom: 20px;
    float: right;
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
</style>
