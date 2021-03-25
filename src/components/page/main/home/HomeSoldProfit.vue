<template>
    <div class="box">
        <div class="date-select">
            <date-selector @change="getSellDate"></date-selector>
        </div>
        <div class="horizon-charts">
            <horizon-line :showTarget="['amount']" ref="horizonLine" :height="'180px'" :width="'300px'"></horizon-line>
        </div>
    </div>
</template>

<script>
import HorizonLine from '@/components/charts/HorizonLine'
import DateSelector from '@/components/public/DateSelector'
  
import { 
profitSum, } from '@/api/index';
export default {
    name: 'HomeSoldProfit',
    components: {
        HorizonLine,
        DateSelector
    },
    data() {
        return {
            saleDate: ''
        };
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            let params = {
                saleDate: this.saleDate || this.$moment().format('YYYY-MM-DD'),
                saleType: 0
            }
            profitSum(params).then(res => {
                this.$refs.horizonLine.setData(res.saleToday)
            })
        },
        getSellDate(date) {
            this.saleDate = date
            this.getData()
        },
    }
};
</script>

<style lang="scss" scoped>
    .horizon-charts {
        position: absolute;
        width: 400px;
        top: 150px;

        @include xcenter;
    }
    .date-select {
        position: absolute;
        top: 28px;
        right: 28px;
    }
</style>