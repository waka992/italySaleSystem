<template>
    <div class="goods-form">
        <div class="title">所在地</div>
        <div class="box-detail">
            <el-radio-group v-model="form.area" @change="setLocation">
                <el-radio label="eu">海外EU</el-radio>
                <el-radio label="cn">中国CN</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<script>


export default {
    name: 'locationSetting',
    components: {
    },
    data() {
        return {
            form: {
                area: 'eu'
            }
        };
    },
    mounted() {
        this.getLocation()
    },
    methods: {
        getLocation() {
            this.form.area = localStorage.getItem('area') || 'eu'
        },
        setLocation(val) {
            localStorage.setItem('area', val) 
        }
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
