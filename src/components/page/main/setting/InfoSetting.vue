<template>
    <div class="info-setting">
        <el-button
                class="new-btn"
                type="primary"
                @click="newInfoReady"
                >信息录入</el-button>
        <div class="info-form">
            <div class="item" v-for="(info, i) in infoItem" :key="i">
                <div class="item-title">
                    {{info.label}}
                </div>
                <div class="item-value" v-if="info.value !== 'filePath'">
                    {{infoData[info.value]}}
                </div>
                <div class="item-pic" v-if="info.value == 'filePath'">
                    <el-image 
                            style="width: 160px; height: 160px"
                            :src="infoData.filePath" 
                            :preview-src-list="[infoData.filePath]">
                    </el-image>
                </div>
            </div>
            <el-dialog 
                :close-on-click-modal='false'
                :show-close="false"
                :title="'信息录入'" :visible.sync="baseDialogVisible" width="888px">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="邮箱">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="微信">
                        <el-input v-model="form.wechat"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item label="简介">
                        <el-input type="textarea" v-model="form.remark"></el-input>
                    </el-form-item>
                    <el-form-item label="logo图片">
                            <el-upload
                                class="upload-demo"
                                :action="'http://www.missbonbon.co:8021/file/uploadOss'"
                                :http-request="uploadSectionFile"
                                :show-file-list="false">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                            <div class="pic-list">
                                <div class="pic-list-item" v-for="(pic, i) in pics.imgUrl" :key="i">
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
                    <el-button class="curr-btn" plain @click="baseDialogVisible = false">取消</el-button>
                    <el-button class="curr-btn" type="primary" @click="save">保存</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import dict from '@/components/common/dict.js'
import uploadPic from '@/utils/uploadPic'
import { 
    updateAppCompanyMsg,
    getCompanyMsg} from '@/api/index';
export default {
    name: 'InfoSetting',
    components: {
    },
    data() {
        return {
            formLoading: false,
            baseDialogVisible: false,
            infoData: {},
            form: {},
            pics: {
                imgUrl: [],
                ossFilePathName: ''
            },
            infoItem: [
                {
                    label: '邮箱：',
                    value: 'email'
                },
                {
                    label: '微信：',
                    value: 'wechat'
                },
                {
                    label: '联系方式：',
                    value: 'phone'
                },
                {
                    label: '地址：',
                    value: 'address'
                },
                {
                    label: '简介：',
                    value: 'remark'
                },
                {
                    label: 'logo图片：',
                    value: 'filePath'
                },
            ]
        }
    },
    created() {
       this.getInfo()
    },
    methods: {
        getInfo() {
            getCompanyMsg().then(res=> {
                this.infoData = res
                this.form = res
            })
        },
        newInfoReady() {
            this.baseDialogVisible = true
        },
        save() {
            updateAppCompanyMsg(this.form).then(res => {
                console.log(res);
                this.baseDialogVisible = false
            })
        },
        uploadSectionFile(param) {
            this.formLoading = true
            let fileObj = param.file;
            let vm = this
            let fn = (url, name) => {
                vm.pics.imgUrl = [url.euUrl]
                vm.$message({
                    message: '上传成功!',
                    type: 'success'
                });
                // updateConnection({filePath: url.euUrl})
                vm.form.filePath = url.euUrl
                vm.formLoading = false
            }
            uploadPic(fileObj, fn)
        },
    }
}
</script>
<style scoped lang="scss">
.info-setting {
    position: relative;

    .new-btn {
        position: absolute;
        right: 0;
        top: 0;
    }
}
.info-form {
    .item {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }
    .item-title {
        font-weight: 500;
        font-size: 14px;
        display: inline-block;
        width: 100px;
        vertical-align: top;
    }
    .item-value {
        display: inline-block;
        max-width: 600px;
    }
    .item-pic {
        display: inline-block;
        width: 180px;
        height: 180px;
    }
}
   .upload-demo {
       display: inline-block;
       vertical-align: top;
   }
    .upload-demo ::v-deep .el-upload.el-upload--text {
        width: 80px;
        border: none;
        height: 30px;
    }


</style>