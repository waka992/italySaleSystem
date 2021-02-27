<template>
    <div class="box" :style="'width: 100%;'">
        <div class="line-chart" id="line-chart"></div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import * as echarts from 'echarts'

export default {
    name: 'LineChart',
    props: {
        height: {
            type: String,
            default: '0px'
        },
        width: {
            type: String,
            default: '0px'
        },
    },
    data() {
        return {
           chart: null,
        };
    },
    mounted() {
        this.initCharts()
    },
    methods: {
        initCharts() {
            let chart = null
            if (!this.chart) {
                const $el = this.$el.querySelector('.line-chart')
                chart = echarts.init($el, this.theme, {
                    width: 'auto',
                    height: this.height,
                    renderer: 'canvas'
                })
                const options = {
                    grid: {
                        top: '20px',
                        left: '30px',
                        right: 0,
                        bottom: '30px',
                    },
                    xAxis: {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            fontSize: 9
                        }
                    },
                    yAxis: {
                        type : 'category',
                        data: [1,2,3,4,5,6],
                        splitNum: 1,
                        interval: 0,
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0,
                            fontSize: 9
                        },
                    },
                    series: [
                        {
                            name: ' ',
                            type: 'bar',
                            data: [23489],
                            barWidth: 27,
                            itemStyle: {
                                color: ['#2183EA']
                            },
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(220, 220, 220, 0.8)'
                            },
                        },
                        {
                            name: ' ',
                            type: 'bar',
                            data: [18203],
                            barWidth: 27,
                            itemStyle: {
                                color: ['#E62A9A']
                            },
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(220, 220, 220, 0.8)'
                            },
                        },
                    ],
                    tooltip: {
                        show: true
                    },
                }
                chart.setOption(options);
                this.chart = chart
            }
        },
        setData(data) {
            this.chart.setOption(data)
        }
    }
};
</script>

<style lang="scss" scoped>


</style>