<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>app</el-breadcrumb-item>
                <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">

            <div style="text-align:right;">
                <el-button type="primary" @click="create">新建</el-button>
            </div>
            <!-- 添加分类 -->
            <el-table
                :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                row-key="id"
                header-cell-class-name="table-header"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                >
                <el-table-column prop="name" label="分类名称" align="center">
                </el-table-column>
                <el-table-column prop="type" label="是否自定义" align="center">
                    <template slot-scope="scope">
                        {{scope.row.type == 0 ? '否' : '自定义'}}
                    </template>
                </el-table-column>
                <el-table-column prop="showStatus" label="上架/下架" align="center">
                    <template slot-scope="scope">
                        {{scope.row.showStatus == 0 ? '下架' : '上架'}}
                    </template>
                </el-table-column>
                <el-table-column prop="imgUrl" label="分类图片" align="center">
                    <template slot-scope="scope">
                        <el-image 
                            v-if="area == 'eu'"
                            v-show="scope.row.imgUrl"
                            style="width: 100px; height: 100px"
                            :src="scope.row.imgUrl" 
                            :preview-src-list="[scope.row.imgUrl]">
                        </el-image>
                        <el-image 
                            v-if="area == 'cn'"
                            v-show="scope.row.cnImgUrl"
                            style="width: 100px; height: 100px"
                            :src="scope.row.cnImgUrl" 
                            :preview-src-list="[scope.row.cnImgUrl]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center">
                </el-table-column>
                  <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            @click="edit(scope.row)"
                            type="text"
                        >编辑</el-button>
                        <el-button
                            @click="delType(scope.row)"
                            type="text"
                        >删除</el-button>
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
                :close-on-click-modal='false'
                :title="operate === 'create' ? '创建分类' : '编辑分类'"
                :visible.sync="dialogVisible"
                width="700px">
                    <el-form :model="form" class="demo-form-inline"
                        label-width="120px" 
                        v-loading="formLoading"
                        element-loading-text="图片上传中"
                    >
                        <el-form-item label="分类名称">
                            <el-input class="w500" v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="是否自定义">
                            <el-select class="w500" v-model="form.type">
                                <el-option :value="1" :label="'是'"></el-option>
                                <el-option :value="0" :label="'否'"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上级菜单" v-if="form.type == 0">
                            <el-cascader clearable class="w500" v-model="form.parentId" :props="cascaderProps" :options="filterTableData"></el-cascader>
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input class="w500" v-model="form.sort"></el-input>
                        </el-form-item>
                        <el-form-item label="上架/下架">
                            <el-select class="w500" v-model="form.showStatus">
                                <el-option :value="1" :label="'上架'"></el-option>
                                <el-option :value="0" :label="'下架'"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="排序">
                            <el-input v-model="form.sort"></el-input>
                        </el-form-item> -->

                        <el-form-item label="分类图片">
                            <el-upload
                                class="upload-demo"
                                :action="'http://www.missbonbon.co:8021/file/uploadOss'"
                                :http-request="uploadSectionFile"
                                :show-file-list="false">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                            <div class="pic-list" v-if="area == 'eu'">
                                <div class="pic-list-item" v-for="(pic, i) in form.imgUrl" :key="i">
                                    <el-image 
                                        style="width: 100px; height: 100px"
                                        :src="pic" 
                                        :preview-src-list="[pic]">
                                    </el-image>
                                </div>
                            </div>
                            <div class="pic-list" v-if="area == 'cn'">
                                <div class="pic-list-item" v-for="(pic, i) in form.cnImgUrl" :key="i">
                                    <el-image 
                                        style="width: 100px; height: 100px"
                                        :src="pic" 
                                        :preview-src-list="[pic]">
                                    </el-image>
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="save" :disabled="formLoading">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {  getType, createType, delType, editType } from '@/api/index';
import uploadPic from '@/utils/uploadPic';

import {cloneDeep} from 'lodash'
export default {
    name: 'TypeForm',
    props: {
        eventId: ''
    },
    computed: {
  
    },
    data() {
        return {
            formLoading: false,
            fileList: [],
            operate: 'create',
            tableData: [],
            filterTableData: [],
            area: 'cn',
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            // 级联
            cascaderProps: {
                label: 'name',
                value: 'id',
                checkStrictly: true
            },
            form: {
                name:'',
                imgUrl: [],
                type: 0,
                parentId: '',
                showStatus: '',
                sort: 0,
                ossFilePathName: ''
            },
            dialogVisible: false,
            delList: [],
        };
    },
    created() {
        this.getData();
        this.area = localStorage.getItem('area') || 'eu'
    },
    methods: {
        handlePageChange(num) {
            this.page.no = num
            this.getData()
        },
        getData() {
            getType().then(res => {
                let filterRes = res.filter(item => item.type != 1)
                let str = JSON.stringify(res)
                let str2 = str.replace(/,"children":\[\]/g, '')
                this.tableData = JSON.parse(str2)

                let fstr = JSON.stringify(filterRes)
                let fstr2 = fstr.replace(/,"children":\[\]/g, '')
                this.filterTableData = JSON.parse(fstr2)
            })
        },

        create() {
            this.operate = 'create'
            this.form =  {
                name:'',
                imgUrl: [],
                cnImgUrl: [],
                type: 0,
                parentId: '',
                showStatus: 1
            }
            this.openDialog()
        },
        edit(row) {
            this.operate = 'edit'
            this.form = cloneDeep(row)
            this.form.showStatus = Number(this.form.showStatus)
                this.form.imgUrl = [this.form.imgUrl]
                this.form.cnImgUrl = [this.form.cnImgUrl]
            this.openDialog()
        },
        delType(row) {
            this.$confirm('确认删除指定分类？').then(_ => {
                    let id =  row.id
                    let ossFilePathName =  row.ossFilePathName
                    
                    let obj = {id: id, ossFilePathName: ossFilePathName}
                    delType(obj).then(res => {
                        this.$message.success({message: '删除成功',});
                        this.getData()
                    })
                })
                .catch(_ => {});
        },
        // 保存
        save() {
            if (!this.form.parentId) {this.form.parentId = 0} // 默认根目录
            else if (typeof this.form.parentId == 'object') {
                this.form.parentId = this.form.parentId[this.form.parentId.length - 1]
            } 
            let param = this.saveDataHandler()
            if (this.operate == 'create') {
                createType(param).then(res => {
                    this.$message.success({message: '创建成功',});
                    this.dialogVisible = false
                    this.getData()
                })
            }
            if (this.operate == 'edit') {
                editType(param).then(res => {
                    this.$message.success({message: '修改成功',});
                    this.dialogVisible = false
                    this.getData()
                })
            }
        },
        saveDataHandler() {
            let param = cloneDeep(this.form)
            param.imgUrl = param.imgUrl.join(',')
            param.cnImgUrl = param.cnImgUrl.join(',')
            return param
        },
        getDataHandler() {
            this.form.imgUrl = this.form.imgUrl ? this.form.imgUrl.split(',') : []
            this.form.cnImgUrl = this.form.cnImgUrl ? this.form.cnImgUrl.split(',') : []
        },
        openDialog() {
            this.dialogVisible = true
        },
        closeDialog() {
            this.dialogVisible = false
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 上传图片
        handleAvatarSuccess(res, file) {
            if (res.data) {
                this.$set(this.form, 'picture', res.data)
            }
        },
        uploadSectionFile(param) {
            this.formLoading = true
            let fileObj = param.file;
            let vm = this
            let fn = (url, name) => {
                vm.form.cnImgUrl = [url.cnUrl]
                vm.form.imgUrl = [url.euUrl]
                vm.form.ossFilePathName = name
                vm.$message({
                    message: '上传成功!',
                    type: 'success'
                });
                vm.formLoading = false
            }
            uploadPic(fileObj, fn)
        }
        // uploadSectionFile(param) {
        //     this.formLoading = true
        //     let vm = this
        //     let fileObj = param.file;
        //     // 接收上传文件的后台地址
        //     let FileController = "http://www.missbonbon.co:8021/file/uploadOss";
        //     // FormData 对象
        //     let form = new FormData();
        //     // 文件对象
        //     form.append("multipartFile", fileObj);
        //     // XMLHttpRequest 对象
        //     let xhr = new XMLHttpRequest();
        //     xhr.open("post", FileController, true);
        //     xhr.setRequestHeader('xc-token', localStorage.getItem('xc-token'))
        //     xhr.onload = function () {
        //         console.log(xhr.response);
        //         try {
        //             let res = JSON.parse(xhr.response)
        //             if (res.code == 1) {
        //                 if (res.data.eu) {
        //                     vm.form.imgUrl = [res.data.eu.Url];
        //                 }
        //                 if (res.data.cn) {
        //                     vm.form.cnImgUrl = [res.data.cn.Url];
        //                 }
        //                 vm.form.ossFilePathName = res.data.eu.OssFilePathName
        //                 vm.$message({
        //                     message: '上传成功!',
        //                     type: 'success'
        //                 });
        //                 vm.formLoading = false
        //             }
        //         }
        //         catch(err) {
        //             console.log(err);
        //         }
        //     };
        //     xhr.send(form);
        // }
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
.table {
    width: 100%;
    font-size: 11px;
    margin-top: 10px;
}
    .w500 {
        width: 500px;
    }
    .upload-demo {
        text-align: center;
    }
    .upload-demo ::v-deep .el-upload.el-upload--text {
        width: 200px;
        border: none;
        height: 33px;
    }
    .pic-list {
        width: 100px;
        margin: 0 auto;
    }
    .pic-list-item {
        display: inline-block;
        width: 100px;
        height: 100px;  
    }
</style>
