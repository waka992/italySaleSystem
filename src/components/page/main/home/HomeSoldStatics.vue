<template>
    <div class="box">
        <div class="top-switch">
            <div class="tab" :class="topSelected == i ? 'active' : ''" v-for="(tab, i) in topTab" :key="tab.name" @click="topTapClick(i)">{{tab.name}}</div>
        </div>
        <div class="date-switch">
            <div class="tab" :class="dateSelected == i ? 'active' : ''" v-for="(tab, i) in dateTab" :key="tab.name" @click="dateTapClick(i)">{{tab.name}}</div>
        </div>
        <div>
            <line-chart ref="lineChart" class="charts" :height="'180px'" :width="'180px'"></line-chart>
        </div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import LineChart from '../../../charts/LineChart'
export default {
    name: 'HomeSoldStatics',
    components: {
        LineChart,
    },
    data() {
        return {
            topSelected: 0,
            dateSelected: 0,
            topTab: [{name: '特色统计'}, {name: '销售统计'}],
            dateTab: [{name: '今日'}, {name: '7日'}, {name: '14日'}],
            chartData: [
                {x: 'H101', y: 5},
                {x: 'H102', y: 20},
                {x: 'H103', y: 36},
                {x: 'H104', y: 10},
                {x: 'H105', y: 10},
                {x: 'H106', y: 20},
            ]
        };
    },
   
    methods: {
        topTapClick(i) {
            this.topSelected = i
            this.setData()
        },
        dateTapClick(i) {
            this.dateSelected = i
            this.setData()
        },
        setData() {
            let xData = []
            let yData = []
            for (let i = 0; i < this.chartData.length; i++) {
                const element = this.chartData[i];
                xData.push(element.x)
                yData.push(Math.random()*20)
            }
            this.$refs.lineChart.setData(xData, yData)
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
    width: 180px;
    top: 117px;
    @include xcenter;
}
</style>