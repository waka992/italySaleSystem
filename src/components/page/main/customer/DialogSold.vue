<template>
    <div class="dialog-sold">
        <div class="top-switch">
            <div class="item" 
                :class="i == selectedSwitch ? 'selected' : ''" 
                v-for="(item, i) in switchs" 
                :key="i"
                @click="selectSwitch(i)">{{item.label}}
            </div>
        </div>

        <div class="second-switch">
            <div class="item" 
                :class="i == selectedDateSwitch ? 'selected' : ''" 
                v-for="(item, i) in dateSwitchs" 
                :key="i"
                @click="selectDateSwitch(i)">{{item.label}}
            </div>
        </div>
        <statistics-pie 
            :height="'325px'"
            class="charts"
            ref="pieChart"
        ></statistics-pie>
        <div class="bottom-value">
            <div class="title">总汇:</div>
            <div class="items">
                <div class="inner">
                    <div class="item">
                        <span class="item-title">客户名</span>
                        <span class="item-content">{{total.name}}</span>
                    </div>
                    <div class="item">
                        <span class="item-title">总销售金额</span>
                        <span class="item-content">{{total.value}}</span>
                    </div>
                    <div class="item">
                        <span class="item-title">总销售件数</span>
                        <span class="item-content">{{total.pics}}</span>
                    </div>
                    <div class="item">
                        <span class="item-title">总销售箱数</span>
                        <span class="item-content">{{total.boxes}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {cloneDeep} from 'lodash';
import dict from '@/components/common/dict.js'
import StatisticsPie from '@/components/charts/StatisticsPie.vue'
import moment from 'moment';
export default {
    name: 'DialogSold',
    components: {
        StatisticsPie
    },
    data() {
        return {
            selectedSwitch: 0,
            switchs: [{label: '特色统计'}, {label: '销售统计'}],
            selectedDateSwitch: 0,
            dateSwitchs: [{label: '周'}, {label: '月'}, {label: '季'}, {label: '年'}],
            total: {
                name: 16,
                value: 16000,
                pics: 1230,
                boxes: 16,
            }
        }
    },
    created() {
        this.getDict = dict.getDict
    },
    mounted() {
        this.setChartData();
    },
    methods: {
        selectSwitch(i) {
            this.selectedSwitch = i
            this.selectedDateSwitch = 0 // 重置二级switch
            this.topSwitchHandle(i)
        },
        selectDateSwitch(i) {
            this.selectedDateSwitch = i
            this.timeSwitchHandle(i)
        },
        // 上switch
        topSwitchHandle(tar) {
            if (tar == 0) {

            }
            if (tar == 1) {}
        },
        // 下switch
        timeSwitchHandle(tar) {
            // 周
            if (tar == 0) {}
            // 月
            if (tar == 1) {}
            // 季
            if (tar == 2) {}
            // 年
            if (tar == 3) {}
        },
        setChartData() {
            // 数据处理
            let data = [
                {name: '1号', value: 1, amount: '1'},
                {name: '2', value: 2, amount: '1'},
                {name: '3', value: 3, amount: '1'},
                {name: '4', value: 4, amount: '1'},
                {name: '5', value: 5, amount: '1'},
                {name: '6', value: 6, amount: '1'},
                {name: '7', value: 7, amount: '1'},
                {name: '8', value: 8, amount: '8'},
            ]
            let legendData = []
            let seriesData = cloneDeep(data)
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                legendData.push(element.name)
                seriesData[i].name = element.name
                seriesData[i].value = element.value
            }
            console.log(legendData);
            console.log(seriesData);
            let legendOption = []
            if (legendData < 6) {
                legendOption = {
                    data: legendData,
                    orient: 'vertical',
                    right: 10,
                    top: 80,
                    bottom: 20,
                    formatter: function(name) {
                        let index = 0;
                        let labels = legendData;
                        labels.forEach(function(value,i){
                            if(value == name){
                                index = i;
                            }
                        });
                        return name + " " + seriesData[index].amount + '箱  ' + seriesData[index].value + '¥';
                    }
                }
            }
            else {
                // 多个legend排位
                let max = Math.ceil(legendData.length / 6)
                for (let i = max; i > 0; i--) {
                    legendOption.push(
                        {
                            orient: 'vertical',
                            top: 80,
                            bottom: 20,
                            right: (i - 1) * 152 + 'px',
                            data: legendData.slice(6*(max - i), 6*(max - i + 1)),
                            formatter: function(name) {
                                let index = 0;
                                let labels = legendData;
                                labels.forEach(function(value,i){
                                    if(value == name){
                                        index = i;
                                    }
                                });
                                return name + " " + seriesData[index].amount + '箱  ' + seriesData[index].value + '¥';
                            }
                        }
                    )             
                }
            }
            console.log(legendOption);
            let option = {
                legend: legendOption,
                series: [
                    {
                        label: {
                            formatter: function(d) {
                                let labels = legendData;
                                let data = d.data
                                return data.name + '-' + data.value + '箱 ';
                            },
                        },
                        data: seriesData
                    }
                ]
            }
            // // 测试数据
            this.$refs.pieChart.setData(option)
        },
    }
}
</script>
<style lang="scss" scoped>
.dialog-sold {
    position: relative;
    height: 533px;
    overflow: hidden;
}

.top-switch, .second-switch {
    top: 0;
    @include xcenter;
    .item {
        display: inline-block;
        width: 107px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border: 1px solid #999;
        color: #999;
        cursor: pointer;

        &.selected {
            color: $theme-color;
            border: 1px solid $theme-color;
            background-color: #E2F0FF;
        }
    }
}

.second-switch {
    top: 48px;

    .item {
        margin: 0 18px;
        width: 20px;
        border: none;


        &.selected {
            color: $theme-color;
            background-color: #fff;
            border: none;
            border-bottom: 4px solid $theme-color;
        }
    }
}

.charts {
    margin-top: 100px;
}

.bottom-value {
    .title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        width: 48px;
    }
    .items {
        width: 700px;
        .inner {
            display: flex;
            justify-content: space-between;
        }
    }
    .item {
        flex: 1;
    }
    .title,.items,.item,.item-title,.item-value {
        display: inline-block;
    }
    

    .item-title {
        color: #787878;
        font-size: 14px;
        margin-right: 10px;
    }

    .item-content {
        font-size: 14px;
        color: #007BFE;
    }
}

</style>