<template>
    <div class="dialog-bill">
        <div class="language">
            <common-selector
                :width="'70px'"
                :placeholder="'请选择语言'"
                :options="[{label: '中文版本', value: 'CN' }, {label: 'English', value: 'EN'}]"
                @change="languageChange"
            ></common-selector>
        </div>
        <div class="bill-form" v-if="language == 'CN'">
            <el-row>
                <el-col :span="8">
                    <span class="title">订单日期</span>
                    <span class="value">{{form.date}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">销售方</span>
                    <span class="value">{{form.seller}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">订单状态</span>
                    <span class="value">{{form.orderStatus}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <span class="title">客户名称</span>
                    <span class="value">{{form.name}}</span>
                </el-col>
            </el-row>
        </div>

        <div class="bill-form" v-if="language == 'EN'">
            <el-row>
                <el-col :span="8">
                    <span class="title">{{labels.date}}</span>
                    <span class="value" v-if="language == 'CN'">{{dateFormat(form.date, 'CN')}}</span>
                    <span class="value" v-else>{{dateFormat(form.date, 'EN')}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">{{labels.taxFee}}</span>
                    <span class="value">{{form.taxFee}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">{{labels.pieces}}</span>
                    <span class="value">{{form.pieces}}</span>
                </el-col>
            </el-row>
<!-- 二 -->
            <el-row>
                <el-col :span="8">
                    <span class="title">{{labels.salesInTotal}}</span>
                    <span class="value">{{form.salesInTotal}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">{{labels.paymentMethod}}</span>
                    <span class="value">{{form.paymentMethod}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">{{labels.price}}</span>
                    <span class="value">{{form.price}}</span>
                </el-col>
            </el-row>
<!-- 三 -->
            <el-row>
                <el-col :span="8">
                    <span class="title">{{labels.customerName}}</span>
                    <span class="value">{{form.name}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">{{labels.codeID}}</span>
                    <span class="value">{{form.codeId}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">{{labels.discount}}</span>
                    <span class="value">{{form.discount}}</span>
                </el-col>
            </el-row>
<!-- 四 -->
            <el-row>
                <el-col :span="8">
                    <span class="title">{{labels.sum}}</span>
                    <span class="value">{{form.sum}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">{{labels.totalBox}}</span>
                    <span class="value">{{form.totalBox}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="title">{{labels.totalSum}}</span>
                    <span class="value">{{form.totalSum}}</span>
                </el-col>
            </el-row>
        </div>

        <div class="prod-table" v-for="(list, i) in tableList" :key="i">
            <div class="table-area">
                
                <!-- 表头 -->
                <div class="table-head">
                    <div class="head-item" v-for="(title, j) in tableTitles" :key="j">{{title.label}}</div>
                </div>
                <!-- 表格 -->
                <div class="table-list" :class="k % 2 == 0 ? 'odd' : 'double'" v-for="(data, k) in list.data" :key="k">
                    <div class="list-item">
                        {{data.type}}
                    </div>
                    <div class="list-item">
                        {{data.boxes}}
                    </div>
                    <div class="list-item">
                        {{data.pics}}
                    </div>
                    <div class="list-item">
                        {{data.price}}
                    </div>
                    <div class="list-item">
                        {{data.pics * data.price}}$
                        <!-- <el-input v-model="list.total" @change="changeType(list.type)"></el-input> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="total-statistics">
            <div class="statistics-title">总汇：</div>
            <div class="statistics-box">
                <div class="statistics-inner">
                    <div class="item">
                        <div class="item-title">{{labels.allTotalSum}}</div>
                        <div class="item-value">{{total.value}}$</div>
                    </div>
                    <div class="item">
                        <div class="item-title">{{labels.totalBoxes}}</div>
                        <div class="item-value">{{total.boxes}}</div>
                    </div>
                    <div class="item">
                        <div class="item-title">{{labels.payWay}}</div>
                        <div class="item-value">{{total.payWay}}</div>
                    </div>
                </div>
                <div class="statistics-inner">
                    <div class="item">
                        <div class="item-title">{{labels.tax}}</div>
                        <div class="item-value">{{total.tax}}</div>
                    </div>
                    <div class="item">
                        <div class="item-title">{{labels.discount}}</div>
                        <div class="item-value">{{total.discount}}</div>
                    </div>
                    <div class="item">
                         <div class="item-title"> </div>
                        <div class="item-value"> </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {cloneDeep} from 'lodash';
import dict from '@/components/common/dict.js'
import CommonSelector from '@/components/public/CommonSelector'
import moment from 'moment';
export default {
    name: 'DialogBill',
    components: {
        CommonSelector
    },
    data() {
        return {
            language: 'CN', // 默认中文
            totalBoxes: 2300, // 同上
            totalValue: 2800, // 同上
            payStatus: 0,
            form: {
                name: '广州市歌莉娅制衣有限公司',
                seller: '广州市xx有限公司',
                date: '2020.11.29',
            },
            labels: {
                customerName: '客户名称',
                date: '账单日期',
                supplier: '销售方',
                totalSum: '总销售金额',
                payStatus: '支付状态',
                totalBoxes: '总销售箱数',
                allTotalSum: '总销售金额',
                totalBoxes: '总箱数',
                payWay: '支付方式',
                tax: '税收',
                discount: '折扣',
            },
            total: {
                value: '1',
                boxes: '1',
                payWay: '1',
                tax: '1',
                discount: '1',
            },
            tableTitles: [
                {label: '货品型号'},
                {label: '箱数'},
                {label: '件数'},
                {label: '售价'},
                {label: '金额'},
            ],
            tableList: [
                {
                    date: '2020.11.29',
                    data: [
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                    ],
                    total: 2200,
                    payStatus: 0,
                },
            ]
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
        resetData() {
            this.languageChange('CN') // 恢复中文
            this.form = {
                name: '广州市歌莉娅制衣有限公司',
                seller: '广州市xx有限公司',
                date: '2020.11.29',
            }
            this.tableList = [
                {
                    date: '2020.11.29',
                    data: [
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                        {type: 'H001', boxes: '3', pics: '70', price: '10'},
                    ],
                    total: 2200,
                    payStatus: 0,
                },
            ]
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
                    supplier: '销售方',
                    totalSum: '总销售金额',
                    payStatus: '支付状态',
                    totalBoxes: '总销售箱数',
                    allTotalSum: '总销售金额',
                    totalBoxes: '总箱数',
                    payWay: '支付方式',
                    tax: '税收',
                    discount: '折扣',
                }
            }
            if (val == 'EN') {
                this.tableTitles = [
                    {label: 'Code ID'},
                    {label: 'Box'},
                    {label: 'Piece'},
                    {label: 'Price'},
                    {label: 'Sum'},
                ]
                this.labels = {
                    customerName: 'Costumer',
                    date: 'Date',
                    supplier: 'Supplier',
                    payStatus: 'Payment Status',
                    totalPics: 'Total Piece',
                    totalBoxes: 'Total Box',
                    allTotalSum: 'Total Sum',
                    taxFee: 'Tax Fee',
                    pieces: 'Pieces',
                    salesInTotal: 'Sales In Total',
                    paymentMethod: 'Payment Method',
                    price: 'Price',
                    codeID: 'Code ID',
                    discount: 'Discount',
                    sum: 'Sum',
                    totalBox: 'Total Box',
                    totalSum: 'Total Sum',
                    payWay: 'Payment Method',
                    tax: 'Tax Revenue',
                    discount: 'Discount',
                }
            }
        },
        dateFormat(date, lang) {
            if (lang == 'CN') {
                return moment(date).format('YYYY.MM.DD')
            }
            if (lang == 'EN') {
                return moment(date).format('YYYY/MM/DD')
            }
        }
    }

}
</script>
<style lang="scss" scoped>
.dialog-bill {
    position: relative;

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
}
.total-statistics {
    width: 710px;
    margin: 35px 0;

    .statistics-title {
        vertical-align: top;
        display: inline-block;
        width: 50px;
        font-size: 16px;
        font-weight: 600;
    }

    .statistics-box {
        display: inline-block;
        width: 660px;

        .statistics-inner {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
        }
    }
    
    .item,.item-title,.item-value {
        display: inline-block;
    }

    .item {
        min-width: 160px;

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