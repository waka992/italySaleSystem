<template>
    <div class="box" :style="'width: 100%;'">
        <div class="line-chart" id="line-chart"></div>
    </div>
</template>

<script>
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

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
                        left: '20px',
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
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: true
                        },
                        axisLabel: {
                            show: false,
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
                        },
                    }],
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