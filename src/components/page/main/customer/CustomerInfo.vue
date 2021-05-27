<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>客户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="handle-box">
                <div class="customer-title">客户信息</div>
                <el-input v-model="userName" class="name-search" size="mini" suffix-icon="el-icon-search" placeholder="输入客户名称"></el-input>
                <!-- <el-date-picker
                    v-model="timePicker"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker> -->
                <el-button icon="el-icon-search" circle @click="getData"></el-button>
                <el-button
                    class="new-btn"
                    type="primary"
                    @click="addReady"
                    >+客户录入</el-button>
            </div>
            <el-table
                :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="memberName" label="客户名称" align="center"></el-table-column>
                <el-table-column prop="caseNum" label="销售箱数" align="center"></el-table-column>
                <el-table-column prop="arrears" label="初始金额" align="center"></el-table-column>
                <el-table-column prop="remainder" label="总欠款金额" align="center"></el-table-column>
                
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            style="margin-right:10px;"
                            type="text"
                            @click="checkDetail(scope.row)"
                        >详情</el-button>
                        <!-- <el-button
                            type="text"
                            @click="checkDetail(scope.row)"
                        >统计</el-button> -->
                        <el-dropdown @command="(command) => {operateUser(command, scope.row)}">
                            <span class="el-dropdown-link">
                                <el-button type="text">操作</el-button>
                                <i style="color:#409EFF;" class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="edit">修改</el-dropdown-item>
                                <el-dropdown-item command="del">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!-- <el-button
                            class="del-btn"
                            type="text"
                            @click="checkDetail(scope.row.id)"
                        >删除</el-button> -->
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
        <div class="bottom-box">
            <div class="inner-box">
                <div class="left-box">
                    <div class="box-title">本周最佳客户</div>
                    <el-table
                        :data="bestTableData"
                        stripe
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="customer_name" label="客户名称" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="日期" align="center">
                            <template slot-scope="scope">
                                {{dateFormat(scope.row.createTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="caseNum" label="箱件数" align="center"></el-table-column>
                        <el-table-column prop="price" label="总金额" align="center"></el-table-column>
                    </el-table>
                </div>
                <div class="right-box">
                    <div class="box-title">常用客户</div>
                    <el-table
                        :data="commonTableData"
                        stripe
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="customer_name" label="客户名称" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="日期" align="center">
                            <template slot-scope="scope">
                                {{dateFormat(scope.row.createTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="caseNum" label="箱件数" align="center"></el-table-column>
                        <el-table-column prop="price" label="总金额" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'客户录入'" :visible.sync="baseDialogVisible" width="888px">
            <el-form ref="form" 
                :model="form" label-width="120px" :inline="true"
                :rules="rules"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称" prop="memberName">
                            <el-input size="mini" class="form-input" v-model="form.memberName" placeholder="请输入公司名"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="12">
                        <el-form-item label="备忘录" prop="remarks">
                            <el-input size="mini"  class="form-input" v-model="form.remarks" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="其他联系方式" prop="contact">
                            <el-input size="mini" class="form-input" v-model="form.contact" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="地址" prop="address">
                            <el-input size="mini"  class="form-input" v-model="form.address" placeholder="请输入供应商地址" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行信息" prop="bank">
                            <el-input size="mini"  class="form-input" v-model="form.bank" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="电话" prop="mobile">
                            <el-input size="mini"  class="form-input" v-model="form.mobile" placeholder="请输入供应商电话" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="初始欠款" prop="arrears">
                            <el-input size="mini"  class="form-input" v-model="form.arrears" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="会员昵称" prop="appName">
                            <el-input class="form-input" placeholder="app登录账号" v-model="form.appName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="会员密码"  prop="password">
                            <el-input class="form-input" placeholder="app登录密码，如需修改请填写" v-model="form.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="会员状态" prop="status">
                            <!-- 0注销,1激活 -->
                            <el-select class="form-input"  v-model="form.status"  placeholder="请选择会员状态"> 
                                <el-option :value="0" label="注销"></el-option>
                                <el-option :value="1" label="激活"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="会员等级" prop="level">
                            <el-select class="form-input"  v-model="form.level"  placeholder="请选择会员等级"> 
                                <el-option :value="1" label="游客"></el-option>
                                <el-option :value="2" label="普通"></el-option>
                                <el-option :value="3" label="VIP"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="上传图片" prop="cnImgUrl">
                            <el-upload
                                class="avatar-uploader"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess">
                                <img v-if="form.cnImgUrl" :src="form.cnImgUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
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
  
import { 
    userList,
    registerCustomer,
    getBestCustomer,
    delCustomer,
    userUpdate,
    userPwdUpdate} from '@/api/index';

export default {
    name: 'ContainerInfo',
    data() {
        return {
            baseDialogVisible: false,
            timePicker: [],
            operate: 'create',
            userName: '',
            page: {
                no: 1,
                total: 0,
                size: 5
            },
            tableData: [],
            bestTableData: [],
            commonTableData: [],
            form: {},
            rules: {
                memberName: [{ required: true, message: '请输入', trigger: 'change' }],
                // address: [{ required: true, message: '请选择', trigger: 'change' }],
                // mobile: [{ required: true, message: '请选择', trigger: 'change' }],
                // appName: [{ required: true, message: '请输入', trigger: 'change' }],
                // password: [{ required: true, message: '请输入', trigger: 'change' }],
            }
        };
    },
    created() {
        this.getData();
        this.getBest()
    },
    methods: {
        // 置空数据
        resetData() {
            this.form = {
                memberName: '',
                appName: '',
                password: '',
                status: 1,
                level: 1,
                // contact: '',
                address: '',
                bank: '',
                mobile: '',
                arrears: '',
                remarks: '',
                cnImgUrl: '',
            }
        },

        // 增准备
        addReady() {
            this.resetData()
            this.operate = 'create'
            this.baseDialogVisible = true;
        },

        // 查
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                userName: this.userName
            }
            userList(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },
        getBest() {
            getBestCustomer({}).then(res => {
                this.bestTableData = res.star
                this.commonTableData = res.commonly
            })
        },

  
        // 保存编辑
        save() {
            let params = cloneDeep(this.form)
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (params.password) {
                        params.password = window.btoa(params.password)
                    }
                    if (this.operate == 'create') {
                            // 校验通过
                            registerCustomer(params).then(res => {
                                if (res) {
                                    this.$message.success({message: '添加成功',});
                                    this.baseDialogVisible = false
                                    this.getData()
                                }
                            })
                    }
                    if (this.operate == 'edit') {
                        if (params.password) {
                            let updatePwdParam = {
                                memberName: params.memberName,
                                password: params.password
                            }
                            userPwdUpdate(updatePwdParam).then(res => {

                            })
                        }
                        delete params.password
                        userUpdate(params).then(res => {
                            if (res) {
                                this.$message.success({message: '修改成功',});
                                this.baseDialogVisible = false
                                this.getData()
                            }
                        })
                    }
                }
            })
        },

        checkDetail(data) {
            this.$router.push({name: 'customerinfodetail', params: {data: data}})
        },
        // 编辑/删除
        operateUser(com, data) {
            console.log(com, data);
            if (com == 'edit') {
                this.operate = 'edit'
                let {   memberName,
                        appName,
                        password,
                        status,
                        level,
                        address,
                        bank,
                        mobile,
                        arrears,
                        remarks,
                        cnImgUrl,
                        id} = data
                this.form = {
                    memberName:memberName,
                    appName:appName,
                    password:'', // 密码默认不显示
                    status:Number(status),
                    level:level,
                    address:address,
                    bank:bank,
                    mobile:mobile,
                    arrears:arrears,
                    remarks:remarks,
                    cnImgUrl:cnImgUrl,
                    id: id,
                }
                this.baseDialogVisible = true
            }
            else if (com == 'del') {
                this.$confirm
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        delCustomer({id: data.id}).then(res => {
                            this.$message.success('删除成功');
                            this.getData()
                        })
                    })
                    .catch(() => {});
            }
        },

        // 图片上传
        handleAvatarSuccess(res, file) {
            this.form.cnImgUrl = URL.createObjectURL(file.raw);
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
        dateFormat(date, lang = 'CN') {
            if (lang == 'CN') {
                return this.$moment(date).format('YYYY.MM.DD')
            }
            if (lang == 'EN') {
                return this.$moment(date).format('YYYY/MM/DD')
            }
        },
    }
};
</script>

<style lang="scss" scoped>

.box {
    position: relative;
    padding: 12px;
    margin: 0 23px;
    background-color: #fff;
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
        min-height: 174px;

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

.handle-box {
    width: 100%;
    margin-bottom: 20px;

    .customer-title {
        display: inline-block;
        color: #303133;
        padding: 10px 16px;
        font-size: 16px;
        margin-right: 11px;
    }
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
        width: 230px;

        .el-select {
            display: inline-block;
            width: 142px;
        }
    }

    .new-btn {
        float: right;
        margin-top: 2px;
    }
    
}

.title {
    position: absolute;
    top: 22px;
    left: 28px;
    font-size: 16px;
    color: #303133;
    font-weight: 500;
}

.pagination {
    margin-top: 40px;
}

.table {
    width: 100%;
    font-size: 11px;

    .del-btn {
        color: #FC5634;
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
    width: 284px;
}

// 上传
.avatar-uploader {
    width: 71px;
    height: 71px;
}

.avatar-uploader {
    ::v-deep .el-upload {
        display: inline-block;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 71px !important;
        height: 71px !important;
    }
    ::v-deep .el-upload--text {
        width: 71px !important;
        height: 71px !important;
    }
    .el-upload:hover {
        border-color: #409EFF;
    }
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 71px;
    height: 71px;
    line-height: 71px;
    text-align: center;
}
.avatar {
    width: 71px;
    height: 71px;
    display: block;
}
</style>
