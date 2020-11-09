<template>
    <div class="goods-form">
        <div class="table-area">
        <div>
            <el-button type="primary" @click="create">新建</el-button>
            <!-- <el-button type="primary" @click="edit">编辑</el-button> -->
    
        </div>
        <div style="margin: 10px 0;">
            会员等级：
            <el-select clearable style="width: 150px;margin:0 10px;" v-model="level"  placeholder="请选择会员等级" @change="changeLevel"> 
                <el-option :value="1" label="游客"></el-option>
                <el-option :value="2" label="普通"></el-option>
                <el-option :value="3" label="VIP"></el-option>
            </el-select>
            用户搜索：
            <el-input v-model="userName" style="width: 150px;margin:0 10px;"></el-input>
            <el-button icon="el-icon-search" @click="search"></el-button>
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
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
            <!-- <el-table-column type="index" label="序号" width="55" align="center"></el-table-column> -->

            <el-table-column prop="memberName" label="会员呢称">
            </el-table-column>
            <el-table-column prop="level" label="会员等级">
                <template slot-scope="scope">
                    {{scope.row.level == 1 ? '游客' : scope.row.level == 2 ? '普通' : 'VIP'}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="会员状态">
                <template slot-scope="scope">
                    {{scope.row.status == 1  ? '激活' : '注销'}}
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注">
            </el-table-column>
            <el-table-column prop="status" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="del(scope.row)">注销</el-button>
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
            :title="operate === 'create' ? '创建会员' : '编辑会员'"
            :visible.sync="dialogVisible"
            width="700px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="会员呢称">
                                <el-input v-model="form.memberName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="会员密码" v-if="operate === 'create'">
                                <el-input v-model="form.password"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="会员状态">
                                <!-- 0注销,1激活 -->
                                <el-select :disabled="operate === 'create'" style="width: 200px;" v-model="form.status"  placeholder="请选择会员状态"> 
                                    <el-option :value="0" label="注销"></el-option>
                                    <el-option :value="1" label="激活"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="会员等级">
                                <el-select style="width: 200px;" v-model="form.level"  placeholder="请选择会员等级"> 
                                    <el-option :value="1" label="游客"></el-option>
                                    <el-option :value="2" label="普通"></el-option>
                                    <el-option :value="3" label="VIP"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注">
                                <el-input type="textarea" v-model="form.remarks"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

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
    userList,
    userUpdate,
    userRegister,
    test
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash'
// import RSA from '../../../utils/rsa'

export default {
    name: 'typeForm',
    props: {
    },
    components: {
    },
    computed: {
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
                remarks:'',
                level: 1,
                status: 1,
                password: '',
                memberName: ''
            },
            dialogVisible: false,
            selectRow: [],

            level: '',
            userName: ''
        };
    },
    created() {
        this.getData();
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
            userList(obj).then(res => {
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
                remarks:'',
                level: 1,
                status: 1,
                password: '',
                memberName: ''
            }
            this.openDialog()
        },
        edit(row) {
            // if (this.selectRow.length == 0) {
            //     this.$message.warning({message: '请选择需要编辑的内容',});
            //     return
            // }
            // else if (this.selectRow.length > 1) {
            //     this.$message.warning({message: '只能同时编辑一条',});
            //     return
            // }
            this.operate = 'edit'
            row.status = Number(row.status)
            this.form = row
            this.openDialog()
        },
        del(row) {
            this.operate = 'edit'
            row.status = Number(row.status)
            this.form = row
            this.form.status = 0
            this.save()
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
            if (params.password) {
                params.password = window.btoa(params.password)
            }
            if (this.operate == 'create') {
                userRegister(params).then(res => {
                    if (res) {
                        this.$message.success({message: '创建成功',});
                        this.dialogVisible = false
                        this.getData()
                    }
                })
            }
            if (this.operate == 'edit') {
                delete params.password
                userUpdate(params).then(res => {
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
    }
};
</script>

<style  scoped>
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
    .upload-demo /deep/ .el-upload.el-upload--text {
        width: 200px;
        border: none;
        height: 30px;
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
</style>
