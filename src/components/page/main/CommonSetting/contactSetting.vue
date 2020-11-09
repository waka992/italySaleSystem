<template>
    <div class="goods-form">
        <div class="title">联系信息：</div>
        <div class="box-detail">
            <el-upload
                class="upload-demo"
                :action="'http://www.missbonbon.co:8021/file/uploadOss'"
                :http-request="uploadSectionFile"
                :show-file-list="false">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div class="pic-list">
                <div class="pic-list-item" v-for="(pic, i) in form.imgUrl" :key="i">
                    <el-image 
                        style="width: 100px; height: 100px"
                        :src="pic" 
                        :preview-src-list="[pic]">
                    </el-image>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { 
    getAttrList,
    updateConnection
 } from '../../../../api/index';
import uploadPic from '../../../../utils/uploadPic';

export default {
    name: 'contactSetting',
    components: {
    },
    data() {
        return {
            form: {
                imgUrl: []
            },
            area: 'cn',
        };
    },
    mounted() {
        this.area = localStorage.getItem('area') || 'eu'
        this.getData()
    },
    methods: {
        getData() {
            getAttrList().then(res => {
                let picArr = []
                if (res[3]) {
                    res[3].forEach(element => {
                        picArr.push(element.arrtibute)
                    });
                }
                this.form.imgUrl = picArr
            })
        },
        uploadSectionFile(param) {
            this.formLoading = true
            let fileObj = param.file;
            let vm = this
            let fn = (url, name) => {
                // vm.form.cnImgUrl = [url.cnUrl]
                vm.form.imgUrl = [url.euUrl]
                vm.form.ossFilePathName = name
                vm.$message({
                    message: '上传成功!',
                    type: 'success'
                });
                updateConnection({filePath: url.euUrl})
                vm.formLoading = false
            }
            uploadPic(fileObj, fn)
        },
        // uploadSectionFile(param) {
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
        //                 vm.form.imgUrl = [res.data.cn.Url];
        //                 vm.$message({
        //                     message: '上传成功!',
        //                     type: 'success'
        //                 });
        //                 updateConnection({filePath: res.data.cn.Url})
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

<style scoped>
    .title {
        display: inline-block;
        width: 90px;
        vertical-align: top;

    }
    .box-detail {
        display: inline-block;
        vertical-align: top;

    }
   .upload-demo {
       display: inline-block;
       vertical-align: top;
   }
    .upload-demo /deep/ .el-upload.el-upload--text {
        width: 80px;
        border: none;
        height: 30px;
    }
</style>
