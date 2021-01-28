<template>
    <div class="pie-chart-box">
        <div class="pie-chart" id="pie-chart" :style="'height:'+height"></div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import * as echarts from 'echarts'

export default {
    name: 'StatisticsPie',
    props: {
        height: {
            type: String,
            default: '213px'
        },
        width: {
            type: String,
            default: '213px'
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
                const $el = this.$el.querySelector('.pie-chart')
                chart = echarts.init($el)
                const options = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        type: 'plain',
                        // type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 80,
                        bottom: 20,
                        data: [],
                    },
                    series: [
                        {
                            name: '姓名',
                            type: 'pie',
                            radius: '106px',
                            center: ['30%', '50%'],
                            data:[
                            ],
                            animation: false,
                            hoverAnimation: false,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                    color: ['#8DCBAE','#5BE7C7', '#374E5D', '#D78D73', '#C63D3C', '#78A98A', '#8776D7', '#E75BDB', '#EDCACF', '#FFCB51', '#62C0B6', '#B5F687']
                };
                chart.setOption(options);
                this.chart = chart
            }
        },
        setData(options) {
            this.chart.setOption(options)
        }
    }
};
</script>

<style lang="scss" scoped>
.pie-chart-box {
    width: 100%;
}

</style>