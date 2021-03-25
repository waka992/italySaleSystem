<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{name: 'iteminfo'}">单品</el-breadcrumb-item>
                <el-breadcrumb-item>查看单品信息</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="edit-btn">
                <el-button plain icon="el-icon-edit" @click="edit">编辑</el-button>
            </div>
        </div>
        <div class="box">
            <el-form ref="form" class="new-prodt-form" :rules="rules" :inline="true" :model="form" label-width="80px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item prop="name">
                            <span slot="label" style="color: #F25643;">商品名称</span>
                            <el-input :disabled="todo === 'check'" v-model="form.name" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item prop="size">
                            <span slot="label" style="color: #F25643;">尺码</span>
                            <el-input :disabled="todo === 'check'" v-model="form.size" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                         <el-form-item label="运输商">
                            <el-select :disabled="todo === 'check'" v-model="form.transporter" placeholder="请选择">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
<!-- 二 -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item prop="code">
                            <span slot="label" style="color: #F25643;">型号编码</span>
                            <el-input :disabled="todo === 'check'" v-model="form.code" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item prop="inprice">
                            <span slot="label" style="color: #F25643;">进价</span>
                            <el-input :disabled="todo === 'check'" v-model="form.inprice" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                         <el-form-item label="供应商">
                            <el-select :disabled="todo === 'check'" v-model="form.supplier" placeholder="请选择">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
<!-- 三 -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item prop="sellprice">
                            <span slot="label" style="color: #F25643;">售价</span>
                            <el-input :disabled="todo === 'check'" v-model="form.sellprice" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item>
                            <span slot="label" style="color: #F25643;"><span>*</span>总数量</span>
                            <el-input class="small-input" :disabled="todo === 'check'" v-model="form.boxes" placeholder="箱数">
                                <template slot="append">箱</template>
                            </el-input>
                            X
                            <el-input class="mid-input" :disabled="todo === 'check'" v-model="form.pics" placeholder="每箱件数">
                                <template slot="append">件</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                         <el-form-item label="盈利">
                            <el-input :disabled="todo === 'check'" v-model="form.profit" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
<!-- 四 -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品特色">
                            <el-input :disabled="todo === 'check'" v-model="form.characteristic" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item>
                            <span slot="label" style="color: #F25643;"><span>*</span>尾箱</span>
                            <el-input class="small-input" :disabled="todo === 'check'" v-model="form.restboxes" placeholder="箱数">
                                <template slot="append">箱</template>
                            </el-input>
                            X
                            <el-input class="mid-input" :disabled="todo === 'check'" v-model="form.restpics" placeholder="每箱件数">
                                <template slot="append">件</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                         <el-form-item label="库存提醒">
                             <el-input :disabled="todo === 'check'" v-model="form.noticenum" placeholder="少于">
                                <template slot="append">箱</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
<!-- 五 -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="面料信息">
                            <el-input :disabled="todo === 'check'" v-model="form.material" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item  label="货柜">
                            <el-input :disabled="todo === 'check'" v-model="form.container" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="配比">
                            <el-input :disabled="todo === 'check'" v-model="form.property" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
<!-- 六 -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品颜色">
                            <el-input :disabled="todo === 'check'" v-model="form.color" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>

                     <el-col :span="8">
                        <el-form-item label="季度">
                            <el-input :disabled="todo === 'check'" v-model="form.season" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                         <el-form-item label="单品类型">
                            <el-select :disabled="todo === 'check'" v-model="form.type" placeholder="请选择">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
              
                <el-row>
                    <div class="pic-upload">
                        <div class="pic-title">上传图片</div>
                        
                        <div class="pic-list-item" v-for="(pic, i) in form.goodsImgList" :key="i">
                            <span v-if="todo !== 'check'" class="del-icon" @click.stop="delPic(pic, i)">X</span>
                            <el-image 
                                class="pic-list-item-img"
                                :src="pic.cnImgUrl" 
                                :preview-src-list="[pic.cnImgUrl]">
                            </el-image>
                        </div>
                        <el-upload
                            v-if="todo !== 'check'"
                            class="upload-btn"
                            :show-file-list="false"
                            :action="'http://www.missbonbon.co:8021/file/uploadOss'"
                            :http-request="uploadListFile">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </el-row>
                <el-row>
                    <div class="pic-upload">
                        <div class="pic-title">销售记录</div>
                        <el-table
                            :data="sellTableData"
                            stripe
                            class="table"
                            ref="multipleTable"
                            header-cell-class-name="table-header"
                        >
                            <el-table-column prop="time" label="卖出时间" align="center"></el-table-column>
                            <el-table-column prop="buyer" label="买家" align="center"></el-table-column>
                            <el-table-column prop="color" label="颜色" align="center"></el-table-column>
                            <el-table-column prop="size" label="尺码" align="center"></el-table-column>
                            <el-table-column prop="amount" label="数量" align="center"></el-table-column>
                            <el-table-column prop="value" label="金额" align="center"></el-table-column>
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
                </el-row>

            </el-form>

            <div class="form-btns">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" v-if="todo === 'edit'" @click="save">保存</el-button>
                <!-- <el-button type="primary" v-if="todo === 'check'" @click="getPDF">生成PDF</el-button> -->
            </div>
        </div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import qs from 'qs'
import uploadPic from '@/utils/uploadPic.js';

export default {
    name: 'SingleInfoEdit',
    data() {
        return {
            todo: 'check', // check edit
            pic: [],
            goodsImgListNum: 0,
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            sellTableData: [
                {time: '2021.11.13 13:05', buyer: 'testman', color: '白色', size: 'L', amount: '2', value: '34'}
            ],
           
            form: {
                name: '',
                size: '',
                transporter: '',
                code: '',
                inprice: '',
                supplier: '',
                sellprice: '',
                boxes: '',
                pics: '',
                profit: '',
                characteristic: '',
                restboxes: '',
                restpics: '',
                noticenum: '',
                material: '',
                container: '',
                property: '',
                color: '234',
                season: '',
                type: '',
                goodsImgList: []
            },
            rules: {
                name: [{ required: true, message: '请输入', trigger: 'change' }],
                size: [{ required: true, message: '请输入', trigger: 'change' }],
                transporter: [{ required: true, message: '请选择', trigger: 'change' }],
                code: [{ required: true, message: '请输入', trigger: 'change' }],
                inprice: [{ required: true, message: '请输入', trigger: 'change' }],
                sellprice: [{ required: true, message: '请输入', trigger: 'change' }],
            }
        };
    },
    mounted() {
        this.todo = this.$route.params.todo
        this.getData();
    },
    methods: {
        // 置空数据
        resetData() {
            this.pic = []
            this.goodsImgListNum = 0
            this.form = {
                name: '',
                size: '',
                transporter: '',
                code: '',
                inprice: '',
                supplier: '',
                sellprice: '',
                boxes: '',
                pics: '',
                profit: '',
                characteristic: '',
                restboxes: '',
                restpics: '',
                noticenum: '',
                material: '',
                container: '',
                property: '',
                color: '',
                season: '',
                type: '',
                goodsImgList: []
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        
        // 增准备
        save() {
            let {boxes,pics,restboxes,restpics} = this.form
            if (this.judgeBlank([boxes,pics,restboxes,restpics])) {
                this.$message.warning('请填写总数量和尾箱')
                return
            }
            this.$refs.form.validate(valid => {
                console.log(valid);
                if (valid) {
                    // this.$router.push({name: 'iteminfo', params: {}})
                    this.todo = 'check'
                    return
                }
                this.$message.warning('请填写单品相关必填项')
            })
        },
        cancel() {
            this.$router.push({name: 'iteminfo', params: {}})
        },
        // 生成pdf
        getPDF() {

        },
        // 判断是否 === ‘’
        judgeBlank(value) {
            // 判断任意一个为空
            if (value instanceof Array) {
                for (let i = 0; i < value.length; i++) {
                    const element = value[i];
                    let judge = (element === '' || element === undefined || element === null)
                    if (judge) {return true}
                }
                return false
            }
            // 非数组时候的判断
            return (value === '' || value === undefined || value === null)
        },
        
        // 查
        getData() {
            let obj = {
            }
            goodsDetail(obj).then(res => {
                console.log();
            })
        },


        // 图片
        uploadListFile(param) {
            this.fileuploadHandler(param, 'goodsImgList')
        },
        fileuploadHandler(param, from) {
            this.formLoading = true
            let fileObj = param.file;
            let vm = this
            let fn = (urlObj, name) => {
                if (from === 'goodsImgList') {
                    vm.form.goodsImgList.push({
                        id: vm.form.secondMenu, 
                        cnImgUrl: urlObj.cnUrl, 
                        imgUrl: urlObj.euUrl, 
                        ossFilePathName: name,
                        sort: vm.goodsImgListNum // 编辑时候怎么找回？新增时候要清空
                    });
                    vm.goodsImgListNum++
                }
                vm.$message({
                    message: '上传成功!',
                    type: 'success'
                });
                vm.formLoading = false
            }
            uploadPic(fileObj, fn)
        },
        // 删除imglist内的图片
        delPic(item, i) {
            console.log(item);
            console.log(i);
            this.$confirm('删除后图片不再显示，确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                // delPic({key: item.ossFilePathName}).then(res => {
                //     console.log(res);
                //     if (res) {
                //         this.form.goodsImgList.splice(i, 1)
                //         this.$message.success('删除成功');
                //     }
                // })
            })
            .catch(() => {});
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
        // 编辑
        edit() {
            this.todo = 'edit'
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

.crumbs {
    position: relative;
}

.edit-btn {
    position: absolute;
    top: -10px;
    right: 0;

    ::v-deep .el-button{
        width: 89px;
        border: 1px solid $theme-color;
        color: $theme-color;
        background-color: transparent;
    }
}

.handle-box {
    width: 100%;
    margin-bottom: 20px;

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
        width: 180px;

        .el-select {
            display: inline-block;
            width: 80px;
        }
    }

    .new-btn {
        float: right;
        margin-left: 14px;
    }
}

.pagination {
    margin: 30px 10px;

    ::v-deep .el-input {
        width: 80px !important;
    }

    ::v-deep .el-input__inner {
        width: 80px;
    }
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
    width: 284px;
}

.new-prodt-form  {
    ::v-deep .el-input {
        width: 150px;
    }
    ::v-deep .el-input.is-disabled .el-input__inner {
        color: #333;
    }

    ::v-deep .el-input__inner {
        padding: 5px;
    }

    ::v-deep .el-input-group__append{
        padding: 5px;
        background: #fff;
        border-left: none;
    }

    .small-input {
        width: 66px !important;
    }
    .mid-input {
        width: 96px !important;
    }
}
// 上传图片
.pic-upload {
    border: 1px solid #EEF1F6;
    padding: 0;
    overflow: hidden;

    .upload-btn {
        display: inline-block;
        vertical-align: top;
    }

    .pic-title {
        padding: 12px;
        background-color: $theme-color;
        color: #fff;
    }

    ::v-deep .el-upload {
        width: 114px;
        height: 114px;
        margin: 14px;

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 114px;
            height: 114px;
            line-height: 114px;
            text-align: center;
        }
    }
    .pic-list-item {
        position: relative;
        display: inline-block;
        width: 114px;
        height: 114px;  
        margin: 14px;
        overflow: visible;
        vertical-align: top;
    }
    .pic-list-item-img {
        width: 114px;
        height: 114px; 
    }
    .del-icon {
        display: inline-block;
        position: absolute;
        z-index: 999;
        top: -5px;
        right: -5px;
        color: #fff;
        background-color: rgb(255, 107, 81);
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        border-radius: 50%;
        cursor: pointer;
    }
}
.form-btns {
    margin-top: 50px;
    text-align: center;

    ::v-deep .el-button{
        width: 89px;
    }
}
</style>
