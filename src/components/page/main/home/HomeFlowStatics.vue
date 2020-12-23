<template>
    <div class="box">
        <div class="showDate" @click="dateClick">
            {{date ? date : '请选择日期'}}
            <span class="unfold-pic" ></span>
        </div>
        <div class="top-num">
            <div class="top-num1">
                <span>总汇款余数 ¥</span>
                <span>{{num1}}</span>
            </div>
            <div class="top-num2">
                <span>总现金余数 ¥</span>
                <span>{{num2}}</span>
            </div>
        </div>
        <!-- 图表 -->
        <div class="charts">
            <div class="left-chart">
                <pie-chart ref="pieChart1" :width="'215'" :height="'164'"></pie-chart>
                <div class="bottom-num">
                    <span>总收入：</span>
                    <span>{{num2}}元</span>
                </div>
            </div>
            <div class="right-chart">
                <pie-chart ref="pieChart2" :width="'215'" :height="'164'"></pie-chart>
                <div class="bottom-num">
                    <span>总支出：</span>
                    <span>{{num2}}元</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import PieChart from '../../../charts/PieChart.vue'
export default {
    name: 'HomeFlowStatics',
    components: {
        PieChart,
    },
    data() {
        return {
            date: '',
            num1: 8000,
            num2: 53000
        };
    },
    mounted() {
        this.setChartData()
    },
    methods: {
        dateClick(date) {
            console.log(date);
        },
        setChartData() {
            // 测试数据
            let data1 = [
                {name: '现金', value: 10000},
                {name: '汇款', value: 3000},
                {name: '发票', value: 0},
            ]
            let data2 = [
                {name: '汇款', value: 8000},
                {name: '其他', value: 4000},
            ]
            // 初始化option
            let option1 = {
                color: ['#3BA0F6', '#5BE7C7', '#F6913B'],
                legend: {
                    top: 50,
                    data: []
                },
                series: [{data: []}]
            }
            let option2 = {
                color: ['#EA7DE8', '#E7CF5B'],
                legend: {
                    top: 60,
                    data: []
                },
                series: [{data: []}]
            }
            // 数据渲染
            for (let i = 0; i < data1.length; i++) {
                const element = data1[i];
                let name = `${element.name} ${element.value}`
                option1.legend.data.push(name)
                data1[i].name = name
            }
            option1.series[0].data = data1

            for (let i = 0; i < data2.length; i++) {
                const element = data2[i];
                let name = `${element.name} ${element.value}`
                option2.legend.data.push(name)
                data2[i].name = name
            }
            option2.series[0].data = data2
            console.log(option1);
            this.$refs.pieChart1.setData(option1)
            this.$refs.pieChart2.setData(option2)
        }
    }
};
</script>

<style lang="scss" scoped>
.showDate {
    position: absolute;
    top: 25px;
    right: 16px;
    width: 83px;
    font-size: 11px;
    color: #1F1F21;
}

.unfold-pic {
    position: absolute;
    top: 5px;
    right: 0;
    display: inline-block;
    width: 0;
    height: 0;
    border: none;
    border: 5px solid transparent;
    border-top: 5px solid #C0C4CC;
}
.top-num, .bottom-num {
    color: #1F1F21;
    font-size: 11px;
}
.top-num2, .top-num1 {
    display: inline-block;
}
.top-num2 {
    margin-left: 22px;
}

.chart {
    height: 134px;
    margin-top: 30px;
}
.left-chart, .right-chart {
    display: inline-block;
    width: 215px;
}
.left-chart {
    float: left;
}
.right-chart {
    float: right;
}
</style>