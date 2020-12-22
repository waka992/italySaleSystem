<template>
    <div class="container">
        <home-search></home-search>
        <div class="box-container"  v-for="comps in componentInfo" :key="comps.title">
            <div class="title">{{comps.title}}</div>
            <!-- {{comps.comp}} -->
            <components :is="comps.comp"></components>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog 
        :close-on-click-modal='false'
        :title="baseDialogTitle" :visible.sync="baseDialogVisible" width="30%">
            
        </el-dialog>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import qs from 'qs'
import HomeSearch from './HomeSearch'
import HomeCommingNotice from './HomeCommingNotice'
import HomeFlowStatics from './HomeFlowStatics'
import HomeSoldOrder from './HomeSoldOrder'
import HomeSoldOutNotice from './HomeSoldOutNotice'
import HomeSoldProfit from './HomeSoldProfit'
import HomeSoldStatics from './HomeSoldStatics'
import HomeStockNotice from './HomeStockNotice'

export default {
    name: 'basetable',
    components: {
        HomeSearch,
        HomeCommingNotice,
        HomeFlowStatics,
        HomeSoldOrder,
        HomeSoldOutNotice,
        HomeSoldProfit,
        HomeSoldStatics,
        HomeStockNotice,
    },
    data() {
        return {
            baseDialogTitle: '',
            baseDialogVisible: false,
            componentInfo: [
                {comp: HomeSoldOrder, title: '今日销售订单'},
                {comp: HomeSoldStatics, title: '销售统计'},
                {comp: HomeSoldProfit, title: '销售利润'},
                {comp: HomeFlowStatics, title: '流水总汇'},
                {comp: HomeSoldOutNotice, title: '售罄提醒'},
                {comp: HomeCommingNotice, title: '即将到货货柜'},
                {comp: HomeStockNotice, title: '库存提示'},
            ]
        };
    },
    created() {

    },
    methods: {
        
    }
};
</script>

<style lang="scss" scoped>
    .container {
        background-color: #F0F2F5;
        padding: 12px;
    }

    .card {
        border-radius: 2px;
        background-color: #fff;
    }
    .title {
        color: #303133;
        font-size: 18px;
    }
    .box-container {
        display: inline-block;
        width: 46%;
        padding: 12px;
        background-color: #fff;
        margin-right: 12px;
        margin-bottom: 12px;
    }
</style>
