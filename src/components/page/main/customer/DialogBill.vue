<template>
    <div class="dialog-bill" id="billDialog">
        <div class="language">
            <common-selector
                :width="'70px'"
                :placeholder="'请选择语言'"
                :options="[{label: '中文版本', value: 'CN' }, {label: 'English', value: 'EN'}]"
                @change="languageChange"
            ></common-selector>
        </div>
        <div class="bill-form">
            <el-row>
                <el-col :span="12">
                    <span class="title">{{labels.customerName}}</span>
                    <span class="value">{{form.name}}</span>
                </el-col>
                <el-col :span="12">
                    <span class="title">{{labels.supplier}}</span>
                    <span class="value">{{form.seller}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <span class="title">{{labels.date}}</span>
                    <span class="value" v-if="language == 'CN'">{{dateFormat(form.date, 'CN')}}</span>
                    <span class="value" v-else>{{dateFormat(form.date, 'EN')}}</span>
                </el-col>
            </el-row>
        </div>

        <div class="prod-table" v-for="(list, i) in tableList" :key="i">
            <div class="table-area">
                <el-row>
                    <el-col :span="12">
                        <span class="title">{{labels.soldDate}}</span>
                        <span class="value" v-if="language == 'CN'">{{dateFormat(list.createTime)}}</span>
                        <span class="value" v-else>{{dateFormat(list.createTime, 'EN')}}</span>
                    </el-col>
                </el-row>
                <!-- 表头 -->
                <div class="table-head">
                    <div class="head-item" v-for="(title, j) in tableTitles" :key="j">{{title.label}}</div>
                </div>
                <!-- 表格 -->
                <div class="table-list" :class="k % 2 == 0 ? 'odd' : 'double'" v-for="(data, k) in list.details" :key="k">
                    <div class="list-item">
                        {{data.specification}}
                    </div>
                    <div class="list-item">
                        {{data.caseNum}}
                    </div>
                    <div class="list-item">
                        {{data.goodsTotal}}
                    </div>
                    <div class="list-item">
                        {{data.goodsPrice}}
                    </div>
                    <div class="list-item">
                        {{(data.caseNum * data.goodsTotal * data.goodsPrice) || 0}}
                        <!-- <el-input v-model="list.total" @change="changeType(list.type)"></el-input> -->
                    </div>
                </div>

                <div class="statistics" :class="tableList.length > 1 ? 'multi' : ''">
                    <div class="item">
                        <div class="item-title">{{labels.totalSum}}</div>
                        <div class="item-value">{{list.price}}</div>
                    </div>
                    <div class="item">
                        <div class="item-title">{{labels.payStatus}}</div>
                        <div class="item-value" v-if="language == 'CN'">{{getDict(list.status, 'payStatus')}}</div>
                        <div class="item-value" v-else>{{getDict(list.status, 'payENStatus')}}</div>
                    </div>
                    <div class="item">
                        <div class="item-title">{{labels.discount}}</div>
                        <div class="item-value">{{list.discount}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="tableList.length > 1" class="total-statistics">
            <div class="item">
                <div class="item-title">{{labels.totalPics}}</div>
                <div class="item-value">{{totalPics}}</div>
            </div>
            <div class="item">
                <div class="item-title">{{labels.totalBoxes}}</div>
                <div class="item-value">{{totalBoxes}}</div>
            </div>
            <div class="item">
                <div class="item-title">{{labels.allTotalSum}}</div>
                <div class="item-value">{{totalValue}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import {cloneDeep} from 'lodash';
import dict from '@/components/common/dict.js'
import CommonSelector from '@/components/public/CommonSelector'
  
export default {
    name: 'DialogBill',
    components: {
        CommonSelector
    },
    data() {
        return {
            language: 'CN', // 默认中文
            totalPics: 2200, // 多个日期时候才有统计值
            totalBoxes: 2300, // 同上
            totalValue: 2800, // 同上
            payStatus: 0,
            form: {
                name: '',
                seller: '',
                date: '',
            },
            labels: {},
            tableTitles: [],
            tableList: []
        }
    },
    created() {
        this.getDict = dict.getDict
    },
    methods: {
        // 保存提交
        getPDF() {
            let data = cloneDeep(this.form)
            data.product = cloneDeep(this.tableList)
            this.$emit('getPDF', data)
        },
        // 置空数据
        resetData(data) {
            let res = data.res
            this.languageChange('CN') // 恢复中文
            this.form = {
                name: data.name,
                seller: '',
                date: data.date,
            },

            this.totalPics = 0
            this.totalBoxes = 0
            this.totalValue = 0

            console.log(res);
            this.tableList = res
            for (let i = 0; i < res.length; i++) {
                const ele = res[i];
                this.totalPics += Number(ele.goodsTotal)
                this.totalBoxes += Number(ele.caseNum)
                this.totalValue += Number(ele.price)
            }
        },
        // 语言
        languageChange(val) {
            this.language = val
            if (val == 'CN') {
                this.tableTitles = [
                    {label: '货品型号'},
                    {label: '箱数'},
                    {label: '件数'},
                    {label: '售价'},
                    {label: '金额'},
                ]
                this.labels = {
                    customerName: '客户名称',
                    date: '账单日期',
                    soldDate: '销售日期',
                    supplier: '销售方',
                    totalSum: '总金额',
                    payStatus: '支付状态',
                    totalPics: '总销售件数',
                    totalBoxes: '总销售箱数',
                    allTotalSum: '总金额',
                    discount: '折扣',
                }
            }
            if (val == 'EN') {
                this.tableTitles = [
                    {label: 'Article Number'},
                    {label: 'Box'},
                    {label: 'Piece'},
                    {label: 'Price'},
                    {label: 'Sum'},
                ]
                this.labels = {
                    customerName: 'Costumer',
                    date: 'Date',
                    soldDate: 'Sold Date',
                    supplier: 'Supplier',
                    totalSum: 'Total Sum',
                    payStatus: 'Payment Status',
                    totalPics: 'Total Pieces',
                    totalBoxes: 'Total Boxes',
                    allTotalSum: 'Total Sum',
                    discount: 'Discount',
                }
            }
        },
        dateFormat(date, lang = 'CN') {
            if (lang == 'CN') {
                return this.$moment(date).format('YYYY-MM-DD')
            }
            if (lang == 'EN') {
                return this.$moment(date).format('YYYY/MM/DD')
            }
        }
    }

}
</script>
<style lang="scss" scoped>
.dialog-bill {
    position: relative;
    padding: 10px;

    .language {
        position: absolute;
        right: 0;
        top: -40px;
    }
}
.bill-form {
    .title, .value {
        display: inline-block;
        font-size: 14px;
        margin-bottom: 21px;
    }
    
    .title {
        color: #999999;
        margin-right: 7px;
    }

    .value {
       color: #333333; 
       text-decoration: underline;
       text-decoration-color: #999;
    }
}

.form-input {
    width: 213px;
    margin-right: 90px;
}

.prod-table {
    .title, .value {
        display: inline-block;
        font-size: 14px;
        margin-bottom: 21px;
        color: #999999;
    }
    
    .title {
        margin-right: 7px;
    }

    .value {
       text-decoration: underline;
       text-decoration-color: #999;
    }
    
    .label {
        display: inline-block;
        width: 80px;
        padding: 12px;
        text-align: right;
    }

    .table-area {
        display: inline-block;
        width: 710px;
        vertical-align: top;
    }

    .table-head {
        height: 43px;
        background: #F0F2F5;
        display: flex;
        line-height: 43px;

        .head-item {
            flex: 1;
            text-align: center;
            color: #909399;
            font-size: 12px;
        }
    }

    .table-list {
        position: relative;
        height: 43px;
        line-height: 43px;
        display: flex;

        .del-btn {
            position: absolute;
            right: 10px;
            cursor: pointer;
        }

        .list-item {
            flex: 1;
            text-align: center;

            .el-input  {
                width: 85px;
            }
        }

        &.double {
            background: #F8F9FA;
        }
    }

    .add-btn {
        display: inline-block;
        font-size: 12px;
        vertical-align: middle;

        .plus {
            display: inline-block;
            width: 16px;
            height: 16px;
            font-size: 12px;
            line-height: 16px;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            background-color: #2183EA;
            margin-right: 4px;
            vertical-align: middle;
            cursor: pointer;
        }
    }

    .statistics {
        margin: 35px 0;
       
        .item,.item-title,.item-value {
            display: inline-block;
        }

        .item {
            width: 200px;

            .item-title {
                margin-right: 7px;
                color: #909399;
            }

            .item-value {
                color: #007BFE;
                text-decoration: underline;
                text-decoration-color: #007BFE;
            }
        }

        &.multi {
            margin-top: 10px;
            text-align: right;

            .item {
                .item-value {
                    color: #333;
                    font-weight: 800;
                    text-decoration: none;
                }
            }
        }
    }

}
.total-statistics {
    width: 710px;
    margin: 35px 0;
    display: flex;
    justify-content: space-between;
    
    .item,.item-title,.item-value {
        display: inline-block;
    }

    .item {
        // width: 200px;

        .item-title {
            margin-right: 7px;
            color: #909399;
        }

        .item-value {
            color: #007BFE;
            text-decoration: underline;
            text-decoration-color: #007BFE;
        }
    }
}
</style>