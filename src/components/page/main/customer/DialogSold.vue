<template>
    <div class="dialog-sold">
         <div class="date-area">
            <date-selector ref="dateSelector" @change="getDateRange"></date-selector>
        </div>
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
import DateSelector from '@/components/public/DateSelector'
import { 
    customerStatistics,
    } from '@/api/index';
export default {
    name: 'DialogSold',
    components: {
        StatisticsPie,
        DateSelector
    },
    data() {
        return {
            attrType: 0, // 0特色1销售
            dateType: 0, // 0123周月季年
            date: '', // 用于确定数据时间
            id: '',
            selectedSwitch: 0,
            switchs: [{label: '特色统计'}, {label: '销售统计'}],
            selectedDateSwitch: 0,
            dateSwitchs: [{label: '周'}, {label: '月'}, {label: '季'}, {label: '年'}],
            total: {
                name: '',
                value: '',
                pics: '',
                boxes: '',
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
        setId(id) {
            this.id = id
            this.resetData()
        },
        setName(name) {
            this.total.name = name
        },
        resetData() {
            this.attrType = 0 // 0特色1销售
            this.dateType = 0 // 0123周月季年
            this.date = '' // 用于确定数据时间
            this.selectedSwitch = 0
            this.selectedDateSwitch = 0
            this.total = {
                name: '',
                value: '',
                pics: '',
                boxes: '',
            }
            this.$nextTick(() => {
                this.$refs.dateSelector.resetDate()
            })
        },
        getData() {
            let data = {
                type: this.dateType,
                STime: this.date || moment().format("YYYY-MM-DD"), // 选择时间
                id: this.id, // 客户id
            }
            customerStatistics(data).then(res => {
                let {label, sale, sum} = res
                for (let i = 0; i < sale.length; i++) {
                    const element = sale[i];
                    element.caseNum = element.CASENUM
                    element.price = element.PRICE
                    let unit = (this.dateType == 0 ? '周' 
                    : this.dateType == 1 ? '月'
                    : this.dateType == 2 ? '季' 
                    : this.dateType == 3 ? '年' : '')
                    element.label = element.days + unit
                }
                let targetArr = []
                if (this.attrType == 0) { targetArr = label } // 特色
                if (this.attrType == 1) { targetArr = sale } // 销售
                this.total.value = sum.PRICE
                this.total.pics = sum.GOODSTOTAL
                this.total.boxes = sum.CASENUM
                this.setChartData(targetArr)
            })
        },
        selectSwitch(i) {
            this.selectedSwitch = i
            // this.selectedDateSwitch = 0 // 重置二级switch
            this.topSwitchHandle(i)
        },
        selectDateSwitch(i) {
            this.selectedDateSwitch = i
            this.timeSwitchHandle(i)
        },
        // 上switch
        topSwitchHandle(tar) {
            this.attrType = tar
            this.getData()
        },
        // 下switch
        timeSwitchHandle(tar) {
            this.dateType = tar
            this.getData()
        },
        getDateRange(date) {
            if (date) {
                this.date = moment(date).format("YYYY-MM-DD")
                this.getData()
            }
        },
        setChartData(data) {
            // 数据处理
            let legendData = []
            let seriesData = cloneDeep(data)
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                legendData.push(element.label)
                seriesData[i].name = element.label
                seriesData[i].value = element.caseNum
            }
            console.log(legendData);
            console.log(seriesData);
            let legendOption = []
            if (legendData.length < 6) {
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
                        return name + " " + seriesData[index].caseNum + '箱  ' + seriesData[index].price;
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
                                return name + " " + seriesData[index].caseNum + '箱  ' + seriesData[index].price;
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

    .date-area {
        position: absolute;
        right: 0;
        width: 130px;
        top: 8px;
    }
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