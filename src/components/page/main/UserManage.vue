<template>
    <div >
         <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="handle-box">
                <el-button class="new-btn" type="primary" @click="create">新建</el-button>
            </div>
        <div style="height: 43px;">
            <!-- 用户搜索：
            <el-input v-model="userName" style="width: 150px;margin:0 10px;"></el-input>
            <el-button icon="el-icon-search" @click="search"></el-button> -->
        </div>
        <el-table
            :data="tableData"
            border
            class="table"
            ref="multipleTable"
            row-key="id"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
            >
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
            <!-- <el-table-column type="index" label="序号" width="55" align="center"></el-table-column> -->

            <el-table-column prop="userName" label="昵称" align="center">
            </el-table-column>
            <el-table-column prop="level" label="权限" align="center">
                <template slot-scope="scope">
                    {{dict.getDict(scope.row.level, 'userLevel')}}
                </template>
            </el-table-column>
            <!-- <el-table-column prop="status" label="用户状态">
                <template slot-scope="scope">
                    {{scope.row.status == 1  ? '激活' : '注销'}}
                </template>
            </el-table-column> -->
            <!-- <el-table-column prop="remarks" label="备注" align="center"> -->
            </el-table-column>
            <el-table-column prop="status" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="del(scope.row)">注销</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="page.no"
                :page-size="page.size"
                :total="page.total"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>
        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="operate === 'create' ? '创建用户' : '编辑用户'"
            :visible.sync="dialogVisible"
            width="700px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="用户呢称">
                                <el-input v-model="form.userName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户密码" v-if="operate === 'create'">
                                <el-input v-model="form.password"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="新密码" v-if="operate !== 'create'">
                                <el-input v-model="form.newPassword" placeholder="非必填，如需要修改密码请填写" @input="newPasswordChange"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <!-- <el-col :span="12">
                            <el-form-item label="用户状态">
                                <el-select :disabled="operate === 'create'" style="width: 200px;" v-model="form.status"  placeholder="请选择用户状态"> 
                                    <el-option :value="0" label="注销"></el-option>
                                    <el-option :value="1" label="激活"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="用户权限">
                                <el-select style="width: 200px;" v-model="form.level"  placeholder="请选择用户等级"> 
                                    <el-option v-for="(user, i) in dict.userLevel" :value="user.value" :label="user.label" :key="i"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注">
                                <el-input type="textarea" v-model="form.remarks"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row> -->

                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
        </div>
    </div>
</template>

<script>
import { 
    getUserList,
    addUser,
    delUser,
    updateUser,
    updatePwd
 } from '@/api/index';
import {uniqBy, cloneDeep} from 'lodash'
import dict from '@/components/common/dict.js'

export default {
    name: 'UserManage',
    props: {
    },
    data() {
        return {
            operate: 'create',
            tableData: [],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            form: {
            },
            dialogVisible: false,
            selectRow: [],

            level: '',
            userName: '',
            dict: '',
        };
    },
    created() {
        this.getData();
        this.dict = dict
    },
    methods: {
        search() {
            // let pas = RSA.RSAencrypt('caibihoutai')
            // console.log(pas);
            this.getData()
        },
        handlePageChange() {
            this.getData()
        },
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                level: this.level,
                userName: this.userName,
            }
            getUserList(obj).then(res => {
                console.log(res.records);
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },
        changeLevel(v) {
            this.level = v
            this.getData()
        },
        handleSelectionChange(row){
            this.selectRow = row
        },
        create() {
            this.operate = 'create'
            this.form =  {
                level: 1,
                password: '',
                userName: ''
            }
            this.openDialog()
        },
        edit(row) {
            this.operate = 'edit'
            this.form = row
            this.form.newPassword = ''
            this.openDialog()
        },
        del(row) {
            this.$confirm('确认注销当前用户？').then(_ => {
                delUser({id: row.id}).then(res => {
                    this.$message.success({message: '注销成功',});
                    this.getData()
                })
            })
            .catch(_ => {});
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
           
            if (this.operate == 'create') {
                if (params.password) {
                    params.password = window.btoa(params.password)
                }
                addUser(params).then(res => {
                    delete params.newPassword
                    if (res) {
                        this.$message.success({message: '创建成功',});
                        this.dialogVisible = false
                        this.getData()
                    }
                })
            }
            if (this.operate == 'edit') {
                if (params.newPassword != '') {
                    let pwdParam = {
                        userName: params.userName,
                        password: window.btoa(params.newPassword)
                    }
                    updatePwd(pwdParam).then(res => {
                        console.log(res);
                    })
                }
                delete params.newPassword
                delete params.password
                addUser(params).then(res => {
                    if (res) {
                        this.$message.success({message: '修改成功',});
                        this.dialogVisible = false
                        this.getData()
                    }
                })
            }
        },
        openDialog() {
            this.dialogVisible = true
        },
        closeDialog() {
            this.dialogVisible = false
        },
        newPasswordChange(val) {
            this.form.newPassword = val
            this.$forceUpdate()
        }
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
.handle-box {
    position: absolute;
    right: 12px;
    top: 12px;

    .new-btn {

        @include primarybtn;
    }
    
}
    .el-select {
        width: 100%;
    }
    .type-select {
        display: inline-block;
        width: 300px;
        border-right: 1px solid #ddd;
        height: 100%;
        text-align: center;
    }

    .w200 {
        width: 200px;
        margin-bottom: 20px;
        display: inline-block;
    }
    .upload-demo {
        text-align: center;
    }
   
    .pic-list {
        text-align: center;
    }
    .pic-list-item {
        display: inline-block;
        width: 100px;
        height: 100px;  
    }
    .tac .el-form-item__content{
        text-align: center;
    }
    .user-dialog .el-select {
        width: 100% !important;
    }

    .pagination {
        margin: 20px;
    }
</style>
