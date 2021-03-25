<template>
    <div class="box">
        <div class="date-select">
            <date-selector @change="getSellDate"></date-selector>
        </div>
        <!-- <div class="top-num">
            <div class="top-num1">
                <span>总汇款余数 ¥</span>
                <span>{{num1}}</span>
            </div>
            <div class="top-num2">
                <span>总现金余数 ¥</span>
                <span>{{num2}}</span>
            </div>
        </div> -->
        <!-- 图表 -->
        <div class="charts">
            <div class="left-chart">
                <pie-chart ref="pieChart1" :width="'200'" :height="'164'"></pie-chart>
                <div class="bottom-num">
                    <span>总收入：</span>
                    <span>{{income.total}}元</span>
                </div>
            </div>
            <div class="right-chart">
                <pie-chart ref="pieChart2" :width="'200'" :height="'164'"></pie-chart>
                <div class="bottom-num">
                    <span>总支出：</span>
                    <span>{{pay.total}}元</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PieChart from '@/components/charts/PieChart.vue'
import DateSelector from '@/components/public/DateSelector'
  
import {cloneDeep} from 'lodash'
import dict from '@/components/common/dict.js'

import {
    dailyJournal,
    } from '@/api/index';
import { format } from 'path'
export default {
    name: 'HomeFlowStatics',
    components: {
        PieChart,
        DateSelector
    },
    data() {
        return {
            saleDate: '',
            income: {
                total: ''
            },
            pay: {
                total: ''
            }
        };
    },
    mounted() {
        this.dict = dict
        this.getPieData()
    },
    methods: {
        getSellDate(date) {
            this.saleDate = date
            this.getPieData(this.saleDate)
        },
        getPieData(date) {
            let formatDate = ''
            if (!date) {
                formatDate = this.$moment().format('YYYY-MM-DD')
            }
            else {
                formatDate = this.$moment(date).format('YYYY-MM-DD')
            }
         
            let params = {
                bookDate: formatDate,
                payDate: formatDate,
            }
            dailyJournal(params).then(res => {
                let {cash, remittance, incomde, pay} = res
                let accountType = cloneDeep(this.dict.accountType)
                let data1 = []
                let data2 = []
                // 初始化data1 data2
                for (let i = 0; i < accountType.length; i++) {
                    const ele = accountType[i];
                    data1.push({
                        name: ele.label,
                        value: 0
                    })
                    data2.push({
                        name: ele.label,
                        value: 0
                    })
                }
               
                for (let i = 0; i < incomde.length; i++) {
                    const ele = incomde[i];
                    data1[ele.book_type].value = ele.cash
                }

                for (let i = 0; i < pay.length; i++) {
                    const ele = pay[i];
                    data2[ele.book_type].value = ele.cash
                }

                this.income.total = cash || 0
                this.pay.total = remittance || 0
                this.setChartData(data1, data2)
            })
        },
        setChartData(data1, data2) {
            // 初始化option
            let option1 = {
                color: ['#3BA0F6', '#5BE7C7', '#F6913B'],
                legend: {
                    top: 40,
                    data: []
                },
                series: [{data: []}]
            }
            let option2 = {
                color: ['#EA7DE8', '#E7CF5B'],
                legend: {
                    top: 40,
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
            this.$refs.pieChart1.setData(option1)
            this.$refs.pieChart2.setData(option2)
        },
    }
};
</script>

<style lang="scss" scoped>
    .date-select {
        position: absolute;
        top: 28px;
        right: 28px;
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

.charts {
    overflow-x: visible;
    height: 134px;
    margin-top: 30px;
    text-align: center;

    .bottom-num {
        padding-left: 10px;
        text-align: left;
    }
}
.left-chart, .right-chart {
    display: inline-block;
    width: 200px;
}

.right-chart {
    margin-left: 30px;
}

</style>