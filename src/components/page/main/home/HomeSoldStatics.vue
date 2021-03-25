<template>
    <div class="box">
        <div class="date-select">
            <date-selector @change="getSellDate"></date-selector>
        </div>
        <div class="top-switch" v-show="false">
            <div class="tab" :class="topSelected == i ? 'active' : ''" v-for="(tab, i) in topTab" :key="tab.name" @click="topTapClick(i)">{{tab.name}}</div>
        </div>
        <div class="date-switch">
            <div class="tab" :class="dateSelected == i ? 'active' : ''" v-for="(tab, i) in dateTab" :key="tab.name" @click="dateTapClick(i)">{{tab.name}}</div>
        </div>
        <div class="charts">
            <line-chart ref="lineChart"  :height="'180px'" :width="'140px'"></line-chart>
        </div>
    </div>
</template>

<script>
import LineChart from '@/components/charts/LineChart'
import DateSelector from '@/components/public/DateSelector'
  
import { 
profitSum, } from '@/api/index';
export default {
    name: 'HomeSoldStatics',
    components: {
        LineChart,
        DateSelector
    },
    data() {
        return {
            topTar: 'sold',
            topSelected: 0,
            dateSelected: 0,
            // topTab: [{name: '特色统计'}, {name: '销售统计'}],
            topTab: [{name: '销售'}, {name: '收入'}, {name: '支出'}, {name: '利润'}],
            dateTab: [{name: '今日'}, {name: '7日'}, {name: '14日'}],
        };
    },
   
    methods: {
        getData() {
            let params = {
                saleDate: this.saleDate || this.$moment().format('YYYY-MM-DD'),
                saleType: (this.dateSelected * 7 - 1) > 0 ? (this.dateSelected * 7 - 1) : 0
            }
            profitSum(params).then(res => {
                let data = []
                switch(this.topSelected) {
                    case 0:
                        data = res.sale
                        break
                    case 1:
                        data = res.income
                        break
                    case 2:
                        data = res.pay
                        break
                    case 3:
                        data = res.profit
                        break
                }
                for (let i = 0; i < data.length; i++) {
                    const ele = data[i];
                    data[i].x = ele.days.slice(5)
                    data[i].y = ele.price
                    data[i].caseNum = ele.caseNum
                }
                this.setData(data)
            })
        },
        getSellDate(date) {
            this.saleDate = date
            this.getData()
        },
        topTapClick(i) {
            this.topSelected = i
            if (i == 0) {this.topTar = 'sold'}
            if (i == 1) {this.topTar = 'income'}
            if (i == 2) {this.topTar = 'pay'}
            if (i == 3) {this.topTar = 'profit'}
            this.getData()
        },
        dateTapClick(i) {
            this.dateSelected = i
            this.getData()
        },
        setData(data) { // tar 销售sold 收入income 支出pay 利润profit
            let xData = []
            let yData = []
            for (let i = 0; i < data.length; i++) {
                const ele = data[i];
                xData.push(ele.x)
                // yData.push({value: Math.random()*20, amount: 18}) // amount箱数
                yData.push({value: ele.y, amount: ele.caseNum}) // amount箱数
            }
            
            let options = {
                xAxis: {
                    data: xData,
                },
                series: [{
                    data: yData,
                    
                }],
            }
            if (this.topTar == 'sold') {
                options.series[0].tooltip = {
                    formatter: (params) => {
                        return '金额:' + params.data.value + '&nbsp箱数' + params.data.amount
                    }
                }
            }
            if (this.topTar == 'income') {
                options.series[0].tooltip = {
                    formatter: (params) => {
                        return '收入金额:' + params.data.value
                    }
                }
            }
            if (this.topTar == 'pay') {
                options.series[0].tooltip = {
                    formatter: (params) => {
                        return '支出金额:' + params.data.value
                    }
                }
            }
            if (this.topTar == 'profit') {
                options.series[0].tooltip = {
                    formatter: (params) => {
                        return '利润:' + params.data.value
                    }
                }
            }
            this.$refs.lineChart.setData(options)
        }
    }
};
</script>

<style lang="scss" scoped>
.box {
    position: absolute;
    top: 0;
    left: 12px;
    width: 100%;
}
.date-select {
    position: absolute;
    top: 28px;
    right: 28px;
}
.top-switch, .date-switch {
    @include xcenter
}
.top-switch {
    top: 14px;
    width: 180px;
    
    .tab {
        display: inline-block;
        width: 90px;
        height: 27px;
        line-height: 27px;
        background-color: #fff;
        color: #999;
        border: 1px solid #999;
        text-align: center;
        font-size: 11px;
        cursor: pointer;

        &:last-child {
            margin-left: -1px;
        }

        &.active {
            border: 1px solid $theme-color;
            background-color: #E2F0FF;
            color: $theme-color;
        }
    }
}
.date-switch {
    top: 52px;
    width: 120px;
    
    .tab {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 27px;
        line-height: 27px;
        background-color: #fff;
        color: #1F1F21;
        text-align: center;
        font-size: 11px;
        cursor: pointer;

        &.active {
            color: $theme-color;
        }

        &.active::after {
            content: '';
            position: absolute;
            width: 15px;
            height: 3px;
            background-color: $theme-color;
            bottom: 0;
            @include xcenter
        }
    }
}
.charts {
    width: 300px;
    top: 117px;
    @include xcenter;
}
</style>