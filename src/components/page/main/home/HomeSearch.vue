<template>
<div class="out-box">
    <div class="box">
        <!-- <el-input class="input" placeholder="输入关键词查找" v-model="keyword"></el-input> -->
         <el-autocomplete
            class="home-search-input"
            size="mini"
            v-model="keyword"
            :fetch-suggestions="queryProduct"
            placeholder="请输入单品型号查找"
            @select="val => {handleProductSelect(val)}"
        ></el-autocomplete>
        <el-button class="btn" type="primary" @click="search">
            <img src="../../../../assets/img/icon-search.png">
        </el-button>
        <!-- <div class="btn">
            <img src="../../../../assets/img/icon-search.png">
        </div> -->
    </div>
</div>
</template>

<script>
import { 
getIndexSearch,} from '@/api/index';
export default {
    name: 'HomeCommingNotice',
    data() {
        return {
            keyword: '',
            id: '',
        };
    },
    methods: {
        search() {
            this.$router.push({name: 'iteminfonew', params: {id: this.id, todo: 'check'}})
        },
        queryProduct(qs, cb) {
            getIndexSearch({
                name: qs,
            }).then(res => {
                let arr = []
                    for (let i = 0; i < res.length; i++) {
                        const ele = res[i];
                        ele.value = ele.specification
                        arr.push(ele)
                    }
                    console.log(arr);
                cb(arr)
            })
        },
        handleProductSelect(item) {
            this.id = item.id
        },
    }
};
</script>

<style lang="scss" scoped>
.out-box {
    position: relative;
    width: 100%;
    background-color: #fff;
    height: 150px;
    margin-bottom: 12px;
}
.box {
    width: 450px;
    height: 54px;
    text-align: center;
    @include xycenter;
}
// 输入框
.home-search-input {
    width: 396px;
    height: 100%;
    vertical-align: top;
    ::v-deep .el-input {
        height: 100%;
    }
    ::v-deep .el-input__inner {
        width: 396px;
        height: 100%;
        font-size: 21px;
        border: 2px solid $theme-color;
        border-radius: 6px 0 0 6px;
    }
}
// 搜索按钮
.btn {
    position: relative;
    display: inline-block;
    width: 54px;
    height: 54px;
    line-height: 54px;
    background-color: $theme-color;
    border: 1px solid $theme-color;
    border-radius: 0 6px 6px 0;
    vertical-align: top;
    cursor: pointer;

    img {
        position: absolute;
        width: 30px;
        height:30px;
        @include xycenter;
    }
}
</style>