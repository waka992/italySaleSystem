<template>
    <div class="box" :style="'width: 80%; overflow-x:auto;'">
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
                        type : 'category',
                        data: [],
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
                        }
                    },
                    yAxis: {
                        axisTick: {
                            show: true
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: true
                        },
                        axisLabel: {
                            fontSize: 9
                        }
                    },
                    series: [{
                        name: ' ',
                        type: 'bar',
                        data: [
                        ],
                        barWidth: 12,
                        itemStyle: {
                            color: '#2183EA'
                        }
                    }],
                    tooltip: {
                        show: true
                    }
                }
                chart.setOption(options);
                this.chart = chart
            }
        },
        setData(xdata, seriesdata) {
            this.chart.setOption({
                xAxis: {
                    data: xdata,
                },
                series: [{
                    data: seriesdata
                }],
            })
        }
    }
};
</script>

<style lang="scss" scoped>


</style>