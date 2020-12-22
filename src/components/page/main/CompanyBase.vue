<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    @click="addReady"
                >添加</el-button>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名"></el-table-column>
                <el-table-column label="账户余额">
                    <template slot-scope="scope">￥{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.thumb"
                            :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="editReady(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="del(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="basePage.no"
                    :page-size="basePage.size"
                    :total="pageTotal"
                    @current-change="basePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog 
        :close-on-click-modal='false'
        :title="baseDialogTitle" :visible.sync="baseDialogVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="法人代表">
                    <el-input v-model="form.legal"></el-input>
                </el-form-item>
                <el-form-item label="营业执照">
                    <el-input v-model="form.license"></el-input>
                </el-form-item>
                <el-form-item label="税务码">
                    <el-input v-model="form.taxCode"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="银行账户">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="银行密码">
                    <el-input v-model="form.pwd"></el-input>
                </el-form-item>
                <el-form-item label="支出">
                    <el-input v-model="form.pay"></el-input>
                </el-form-item>
                <el-form-item label="收入">
                    <el-input v-model="form.receive"></el-input>
                </el-form-item>
                <el-form-item label="银行信息">
                    <el-input v-model="form.info"></el-input>
                </el-form-item>
                <el-form-item label="银行地址">
                    <el-input v-model="form.bankAddress"></el-input>
                </el-form-item>
                <el-form-item label="银行电话">
                    <el-input v-model="form.bankMobile"></el-input>
                </el-form-item>
                <el-form-item label="公司logo">
                    <el-upload
                        class="upload-demo"
                        :show-file-list="false"
                        :action="'http://www.missbonbon.co:8021/file/uploadOss'"
                        :http-request="uploadSectionFile">
                            <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="baseDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import qs from 'qs'
import uploadPic from '../../../utils/uploadPic';

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                name: '',
            },
            basePage: {
                no: 1,
                total: 0,
                size: 20
            },
            
            baseDialogTitle: '',
            tableData: [],
            multipleSelection: [],
            delList: [],
            baseDialogVisible: false,
            form: {
                legal: '',
                license: '',
                taxCode: '',
                address: '',
                mobile: '',
                email: '',
                // 银行信息
                account: '',
                pwd: '',
                pay: '',
                receive: '',
                info: '',
                bankAddress: '',
                bankMobile: '',
                cnImgUrl: '',
                imgUrl: '',
                ossFilePathName: '',
            },
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 图片上传
        uploadSectionFile(param) {
            this.fileuploadHandler(param, 'imgUrl')
        },
        fileuploadHandler(param, from) {
            let fileObj = param.file;
            let vm = this
            let fn = (urlObj, name) => {
                if (from === 'imgUrl') {
                    vm.form.cnImgUrl = [urlObj.cnUrl]
                    vm.form.imgUrl = [urlObj.euUrl]
                    vm.form.ossFilePathName = name
                }
                vm.$message({
                    message: '上传成功!',
                    type: 'success'
                });
            }
            uploadPic(fileObj, fn)
        },

        // 触发搜索按钮
        search() {
            this.basePage.no = 1
            this.getData();
        },

        // 置空数据
        resetData() {
            this.form = {
                legal: '',
                license: '',
                taxCode: '',
                address: '',
                mobile: '',
                email: '',
                account: '',
                pwd: '',
                pay: '',
                receive: '',
                info: '',
                bankAddress: '',
                bankMobile: '',
                cnImgUrl: '',
                imgUrl: '',
                ossFilePathName: '',
            }
        },

        // 增准备
        addReady() {
            this.resetData()
            this.baseDialogVisible = true;
            this.baseDialogTitle = '新增'
        },

        // 增
        add() {

        },

        // 删
        del(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$message.success('删除成功');
                this.tableData.splice(index, 1);
            })
            .catch(() => {});
        },

        // 改
        editReady(index, row) {
            this.idx = index;
            this.form = row;
            this.baseDialogVisible = true;
            this.baseDialogTitle = '编辑'
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

        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
  
        // 保存编辑
        save() {
            let params = cloneDeep(this.form)
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

        // 分页导航
        basePageChange(val) {
            this.$set(this.basePage, 'no', val);
            this.getData();
        }
    }
};
</script>

<style lang="scss" scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
