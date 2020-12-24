<template>
    <div class="box">
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
                    width: this.width || 'auto',
                    height: this.height,
                    renderer: 'canvas'
                })
                const options = {
                    legend: {
                        type: 'plain',
                        orient: 'vertical',
                        left: 100,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        itemWidth: 11,
                        itemHeight: 6,
                        // data: ["娄卜", "现金 50000", "于梁"],
                        data: [],
                        
                    },
                    grid: {
                        left: 'left',
                        right: 0
                    },
                    series: [
                        {
                            name: '姓名',
                            type: 'pie',
                            center: ['45px', '50%'],
                            labelLine: {show:false},
                            label: {show:false},
                            radius: '45px',
                            // data: [{name: "娄卜", value: 94141},{name: "现金 50000", value: 41785},{name: "于梁", value: 38441},],
                            data: [],
                            // emphasis: {
                            //     itemStyle: {
                            //         shadowBlur: 10,
                            //         shadowOffsetX: 0,
                            //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                            //     }
                            // }
                        }
                    ]
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
.box {
    width: 100%;
}

</style>