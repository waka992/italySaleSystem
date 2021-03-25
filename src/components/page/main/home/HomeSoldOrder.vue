<template>
    <div class="box">
        <el-table
            :data="tableData"
            class="table"
            height="236"
            stripe
            ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column prop="customerName" label="客户名" align="center"></el-table-column>
            <el-table-column prop="caseNum" label="销售箱数" align="center"></el-table-column>
            <el-table-column prop="price" label="金额" align="center"></el-table-column>
            <el-table-column prop="type" label="支付方式" align="center">
              <template  slot-scope="scope">
                        {{getDict(scope.row.payType, 'accountType')}}
                    </template>
            </el-table-column>
            <el-table-column label="订单状态" align="center">
                <template slot-scope="scope">{{getDict(scope.row.process, 'verifyStatus')}}</template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  
import dict from '@/components/common/dict.js'

import { 
getOrderPage,
 } from '@/api/index';
export default {
    name: 'HomeSoldOrder',
    data() {
        return {
            tableData: []
        };
    },
    created() {
        this.getDict = dict.getDict
        this.getData()
    },
    methods: {
        getData() {
            let obj = {
                pageSize: 999,
                page:  1,
                customerName: '',
                startTime: this.$moment().format('YYYY-MM-DD'),
                endTime: this.$moment().format('YYYY-MM-DD'),
                process: '',
            }
            getOrderPage(obj).then(res => {
                this.tableData = res.records
            })
        },
    }
};
</script>

<style lang="scss" scoped>

</style>