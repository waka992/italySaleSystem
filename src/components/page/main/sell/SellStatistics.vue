<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>销售</el-breadcrumb-item>
                <el-breadcrumb-item>销售统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="top-box">
            <div class="date-select">
                <date-selector @change="getSellDate"></date-selector>
            </div>
            <div>
                <div class="top-switch">
                    <div class="tab" :class="topSelected == i ? 'active' : ''" v-for="(tab, i) in topTab" :key="tab.name" @click="topTapClick(i)">{{tab.name}}</div>
                </div>
                <div class="date-switch">
                    <div class="tab" :class="dateSelected == i ? 'active' : ''" v-for="(tab, i) in dateTab" :key="tab.name" @click="dateTapClick(i)">{{tab.name}}</div>
                </div>
                <div class="attribute-select-area" v-show="topTar == 'attribute'">
                    <span>特色/Special</span>
                    <span>
                        <el-select v-model="attrForm.special" class="attr-select" placeholder="请选择" @change="getAttributeData" clearable>
                            <el-option v-for="(opt,i) in itemOptions.special" :key="i" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </span>
                    <span>颜色/Color</span>
                    <span>
                        <el-select v-model="attrForm.color" class="attr-select" placeholder="请选择" @change="getAttributeData" clearable>
                            <el-option v-for="(opt,i) in itemOptions.color" :key="i" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </span>
                    <span>尺码/Size</span>
                    <span>
                        <el-select v-model="attrForm.size" class="attr-select" placeholder="请选择" @change="getAttributeData" clearable>
                            <el-option v-for="(opt,i) in itemOptions.size" :key="i" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </span>
                    <span>面料/Material</span>
                    <span>
                        <el-select v-model="attrForm.material" class="attr-select" placeholder="请选择" @change="getAttributeData" clearable>
                            <el-option v-for="(opt,i) in itemOptions.material" :key="i" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </span>
                </div>
                <div class="charts">
                    <line-chart ref="lineChart" :height="'400px'" :width="'100%'"></line-chart>
                </div>
                <div class="data-list">
                    <span v-for="(list, i) in listData" :key="i" style="margin-right:36px;">
                        {{
                            topTar == 'single' ? list.specification :
                            topTar == 'customer' ? list.customer_name :
                            topTar == 'attribute' ? list.goodsName : ''
                        }}-{{list.CASENUM}}箱-金额：{{list.PRICE}}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
  
import DateSelector from '@/components/public/DateSelector'
import LineChart from '@/components/charts/LineChart'
import { 
arrtibuteSum,
customerSum,
goodsSum,
getAttrList} from '@/api/index';
import dict from '@/components/common/dict.js'

export default {
    name: 'SellStatistics',
    components: {
        DateSelector,
        LineChart
    },
    data() {
        return {
            listData: [],
            date: '',
            topTar: 'single',
            baseDialogVisible: false,
            status: 0,
            topSelected: 0, 
            dateSelected: 0,
            topTab: [{name: '单品'}, {name: '客户'}, {name: '属性'}],
            dateTab: [{name: '周'}, {name: '月'}, {name: '季'}, {name: '年'}],
            attrForm: {
                special: '',
                color: '',
                size: '',
                material: '',
            },
            itemOptions: {
                special: [],
                color: [],
                size: [],
                material: [],
            }
        };
    },
    created() {
        this.getSingleData();
        this.getAttributeOption()
    },
    methods: {
        getSellDate(date) {
            this.date = date
            this.topTapClick(this.topSelected)
        },
        // 置空数据
        resetChart() {
            this.listData = []
            this.setData([])
        },


        // 查
        getSingleData() {
            let obj = {
                STime: this.date || this.$moment().format("YYYY-MM-DD"), // 选择时间
                type: this.dateSelected,
            }
            goodsSum(obj).then(res => {
                let data = res
                for (let i = 0; i < data.length; i++) {
                    const ele = data[i];
                    data[i].x = ele.specification
                    data[i].y = ele.PRICE
                    data[i].caseNum = ele.CASENUM
                }
                this.listData = data
                this.setData(data)
            })
        },

        getCustomerData() {
            let obj = {
                STime: this.date || this.$moment().format("YYYY-MM-DD"), // 选择时间
                type: this.dateSelected,
            }
            customerSum(obj).then(res => {
                let data = res
                for (let i = 0; i < data.length; i++) {
                    const ele = data[i];
                    data[i].x = ele.customer_name
                    data[i].y = ele.PRICE
                    data[i].caseNum = ele.CASENUM
                }
                this.listData = data
                this.setData(data)
            })
        },

        getAttributeData() {
            if (!this.attrForm.special && !this.attrForm.color && !this.attrForm.material && !this.attrForm.size) {
                return
            }
            let obj = {
                stime: this.date || this.$moment().format("YYYY-MM-DD"), // 选择时间
                type: this.dateSelected,
                characteristic: this.attrForm.special ? [this.attrForm.special] : [], // 后端好像可以多选
                color: this.attrForm.color ? [this.attrForm.color] : [],
                component: this.attrForm.material ? [this.attrForm.material] : [],
                sizes: this.attrForm.size ? [this.attrForm.size] : []
            }
            arrtibuteSum(obj).then(res => {
                let data = res
                for (let i = 0; i < data.length; i++) {
                    const ele = data[i];
                    data[i].x = ele.goodsName
                    data[i].y = ele.PRICE
                    data[i].caseNum = ele.CASENUM
                }
                this.listData = data
                this.setData(data)
            })
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
                        axisLabel: {
                            fontSize: 14
                        }
                    },
                    yAxis: {
                        axisLabel: {
                            fontSize: 14
                        }
                    },
                    series: [{
                        data: yData,
                       
                    }],
                }
                if (this.topTar == 'single') {
                    options.series[0].tooltip = {
                        formatter: (params) => {
                            return '金额:' + params.data.value + '&nbsp箱数' + params.data.amount
                        }
                    }
                }
                // if (this.topTar == 'income') {
                //     options.series[0].tooltip = {
                //         formatter: (params) => {
                //             return '收入金额:' + params.data.value
                //         }
                //     }
                // }
                // if (this.topTar == 'pay') {
                //     options.series[0].tooltip = {
                //         formatter: (params) => {
                //             return '支出金额:' + params.data.value
                //         }
                //     }
                // }
                // if (this.topTar == 'profit') {
                //     options.series[0].tooltip = {
                //         formatter: (params) => {
                //             return '利润:' + params.data.value
                //         }
                //     }
                // }
            this.$refs.lineChart.setData(options)
        },

        topTapClick(i) {
            this.topSelected = i
            if (i == 0) {
                this.topTar = 'single'
                this.getSingleData()
            }
            if (i == 1) {
                this.topTar = 'customer'
                this.getCustomerData()
            }
            if (i == 2) {
                this.topTar = 'attribute'
                this.resetChart()
                this.getAttributeData()
            }
        },
        getAttributeOption() {
            this.itemOptions = {
                special: [],
                color: [],
                size: [],
                material: [],
            }
            getAttrList().then(res => {
            for (const key in res) {
                if (Object.hasOwnProperty.call(res, key)) {
                    const ele = res[key];
                    for (let j = 0; j < ele.length; j++) {
                        const ele2 = ele[j];
                        let target = ''
                        switch(key) {
                            case '0':
                                target = 'color'
                                break
                            case '1':
                                target = 'size'
                                break
                            case '2':
                                target = 'material'
                                break
                            case '5':
                                target = 'special'
                                break
                        }
                        if (!target) {break}
                        this.itemOptions[target].push({
                            label: ele2.arrtibute,
                            value: ele2.arrtibute
                        })
                    }
                }
                }
            })
        },
        dateTapClick(i) {
            this.dateSelected = i
            this.topTapClick(this.topSelected)
        },
    }
};
</script>

<style lang="scss" scoped>
.attribute-select-area {
    margin-top: 20px;
    text-align: center;
}
.attr-select {
    width: 120px;
    margin-right: 30px;
    margin-left: 10px;
}
.top-box {
    position: relative;
    padding: 23px 28px;
    margin: 0 23px;
    background-color: #fff;
    min-height: 80vh;
    margin-bottom: 18px;
}
.date-select {
    position: absolute;
    top: 28px;
    right: 28px;
}
.charts {
    width: 70%;
    margin: 0 auto;
    margin-top: 20px;
}

    .top-switch, .date-switch {
        // @include xcenter
        text-align: center;
    }
    .top-switch {
        top: 20px;
        
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
        margin-top: 10px;
        width: 100%;
        
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
    .data-list {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
        color: #1F1F21;
    }
</style>
