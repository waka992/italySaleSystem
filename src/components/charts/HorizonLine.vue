<template>
    <div class="horizon-line-box" :style="'width: 100%;'">
        <div class="line-item" v-for="(line,i) in  lineData" :key="i">
            <div class="line-area">
                <div class="label">{{line.label}}</div>
                <div class="horizon-line-bg">
                    <div class="line" :style="'backgroundColor:' + line.color+';transform:translateX('+line.offset+');'"></div>
                </div>
            </div>
            <div class="value-area">
                <span v-for="(val,j) in line.value" :key="j" style="margin-right: 10px;">
                    <span class="value-label">{{val.label}}：</span>
                    <span class="value-amount">{{val.value}}</span>
                </span>
            </div>
        </div>

        
    </div>
</template>

<script>
export default {
    name: 'HorizonLine',
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
            lineData: [
                {
                    label: '销售量',
                    color: '#2183EA',
                    offset: '-100%',
                    value: [
                        {label: '金额', value: 0},
                        {label: '总箱数', value: 0},
                    ]
                },
                {
                    label: '利润',
                    offset: '-100%',
                    color: '#E62A9A',
                    value: [
                        {label: '金额', value: 0},
                    ]
                },
                // color: ['#2183EA', '#E62A9A']
            ],
        };
    },
    mounted() {
    },
    methods: {
        setData(data) {
            console.log(data);
            let res = data ? data : {} //  防止null
            let salePrice = res.salePrice || 0
            this.lineData[0].value[0].value = salePrice // 金额为标准60%
            this.lineData[0].value[1].value = res.caseNum || 0
            this.lineData[1].value[0].value = res.saleProfit || 0
            let sum = salePrice / 0.6 // 图形标准基准！！！！！！！！！
            if (sum == 0) {
                this.lineData[0].offset = '-100%'
                this.lineData[1].offset = '-100%'
            }
            else {
                this.lineData[0].offset = '-36%' // 图形标准基准！！！！！！！！！
                let porperty = res.saleProfit / sum * 100 - 100
                this.lineData[1].offset = porperty + '%'
                console.log(porperty);
            }
            // this.lineData = data
        }
    }
};
</script>

<style lang="scss" scoped>
.horizon-line-box {
    .label {
        display: inline-block;
        width: 60px;
    }
    .line-item {
        margin-bottom: 30px;
    }
    .line-area {
        display: flex;
        align-items: center;
    }
    .horizon-line-bg {
        height: 27px;
        display: inline-block;
        flex: 1;
        background-color: #F3F5F7;
        border-radius: 2px;
        overflow: hidden;
    }

    .line{
        width: 100%;
        transition: .7s all;
        height: 100%;
        display: inline-block;
        border-radius: 2px;

        &:hover {
            opacity: 0.8;
        }
    }

    .value-area {
        color: #666;
        text-align: center;
        margin: 5px 0;
        font-size: 12px;
    }
}
</style>