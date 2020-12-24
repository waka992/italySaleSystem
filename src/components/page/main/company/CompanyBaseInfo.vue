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
                <el-table-column prop="person" label="法人代表" align="center" width="70"></el-table-column>
                <el-table-column label="状态" align="center"  width="70">
                    <template slot-scope="scope">{{scope.row.status}}</template>
                </el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
                <el-table-column prop="mobile" label="电话" align="center" width="120"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            icon="el-icon-s-operation"
                            @click="checkDetail(scope.$index, scope.row)"
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
            tableData: [
                {name: '广东沈外贸科技有限公司', person: '李呢发', status: 1, address: '广州', mobile: 13577292902, email: '234234@sina.com', id: 1},
                {name: '广东沈外贸科技有限公司', person: '李呢发', status: 1, address: '广州', mobile: 13577292902, email: '234234@sina.com'},
                {name: '广东沈外贸科技有限公司', person: '李呢发', status: 1, address: '广州', mobile: 13577292902, email: '234234@sina.com'},
                {name: '广东沈外贸科技有限公司', person: '李呢发', status: 1, address: '广州', mobile: 13577292902, email: '234234@sina.com'},
                {name: '广东沈外贸科技有限公司', person: '李呢发', status: 1, address: '广州', mobile: 13577292902, email: '234234@sina.com'},
                {name: '广东沈外贸科技有限公司', person: '李呢发', status: 1, address: '广州', mobile: 13577292902, email: '234234@sina.com'},
                {name: '广东沈外贸科技有限公司', person: '李呢发', status: 1, address: '广州', mobile: 13577292902, email: '234234@sina.com'},
                {name: '广东沈外贸科技有限公司', person: '李呢发', status: 1, address: '广州', mobile: 13577292902, email: '234234@sina.com'},
                {name: '广东沈外贸科技有限公司', person: '李呢发', status: 1, address: '广州', mobile: 13577292902, email: '234234@sina.com'},
            ],
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
        this.getData();
    },
    methods: {
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

        checkDetail(id) {
            this.$router.push({name: 'compbaseinfodetail', params: {id: id}})
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
