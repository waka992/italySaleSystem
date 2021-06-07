<template>
    <div >
         <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>会员管理</el-breadcrumb-item>
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
            stripe
            class="table"
            ref="multipleTable"
            row-key="id"
            header-cell-class-name="table-header"
            >
           
            <el-table-column prop="appName" label="会员昵称" align="center">
            </el-table-column>
            <el-table-column prop="level" label="会员等级" align="center">
                <template slot-scope="scope">
                    {{
                        getDict(scope.row.level, 'customerLevel')
                    }}
                </template>
            </el-table-column>
            <el-table-column label="会员状态" align="center">
                <template slot-scope="scope">
                    {{scope.row.status == 1  ? '激活' : '注销'}}
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注" align="center">
            </el-table-column>
            <el-table-column prop="status" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="del(scope.row)">删除</el-button>
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
        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="operate === 'create' ? '创建会员' : '编辑会员'"
            :visible.sync="dialogVisible"
            width="700px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="会员昵称">
                                <el-input v-model="form.appName" size="mini"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="会员密码" >
                                <el-input v-model="form.password"  size="mini" :placeholder="operate === 'create' ? '密码至少6位' : '非必填，如需要修改密码请填写'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="备注" prop="remarks">
                                <el-input size="mini"  class="form-input" v-model="form.remarks" placeholder="请输入" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="会员等级" prop="level" v-if="operate === 'edit'">
                                <el-select class="form-input"  v-model="form.level"  placeholder="请选择会员等级"> 
                                    <el-option :value="1" label="游客"></el-option>
                                    <el-option :value="2" label="普通"></el-option>
                                    <el-option :value="3" label="VIP"></el-option>
                                </el-select>
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
    delCustomer,
    newAppUser,
    userPwdUpdate,
    userUpdate,
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

            level: '',
            userName: '',
            dict: '',
        };
    },
    created() {
        this.getData();
        this.dict = dict
        this.getDict = dict.getDict // 获取字典
    },
    methods: {
        basePageChange() {
            this.$set(this.page, 'no', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.$set(this.page, 'size', val);
            this.$set(this.page, 'no', 1);
            this.getData();
        },
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                userName: this.userName,
                isApp: 1, // 客户
                // level: this.level
            }
            userList(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },
     
        create() {
            this.operate = 'create'
            this.form = {
                appName: '',
                password: '',
                isEu: 1, // 0eu 1cn
                status: 1, // 1为激活
                level: 1,
            }
            this.openDialog()
        },
        edit(row) {
            this.operate = 'edit'
            this.form = row
            this.form.password = ''
            this.openDialog()
        },
        del(row) {
            this.$confirm('确认删除当前会员？').then(_ => {
                delCustomer({id: row.id}).then(res => {
                    this.$message.success({message: '删除成功',});
                    this.getData()
                })
            })
            .catch(_ => {});
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
             
            if (this.operate == 'create') {
                if (this.form.password.length < 6 || this.form.password.length > 12) {
					uni.showToast({
						title: '密码应为6-12位',
						icon: 'none',
						duration: 1500,
					})
					return
				}
				let param = {
					appName: this.form.appName,
					password: this.form.password,
					isEu: 1, // 0eu 1cn
					status: 1, // 1为激活
				}
				newAppUser(param).then(res => {
					if (res.id) {
                        this.closeDialog()
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
                    updatePwdParam.password = window.btoa(updatePwdParam.password)
                    userPwdUpdate(updatePwdParam).then(res => {

                    })
                }
                delete params.password
                userUpdate(params).then(res => {
                    if (res) {
                        this.$message.success({message: '修改成功',});
                        this.closeDialog()
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
