<template>
    <div class="box">
        <el-table
            :data="tableData"
            class="table"
            height="236"
            stripe
            ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column prop="name" label="客户名" align="center"></el-table-column>
            <el-table-column prop="num" label="销售箱数" align="center"></el-table-column>
            <el-table-column prop="price" label="金额" align="center"></el-table-column>
            <el-table-column prop="type" label="支付方式" align="center">
                <template slot-scope="scope">
                    {{scope.row.type == 1 ? '已付款' : '欠款'}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    {{scope.row.type == 1 ? '已审核' : '未审核'}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
export default {
    name: 'HomeSoldOrder',
    data() {
        return {
            tableData: [
                {name: 'test', num: 9, price: 1200, type: 1, status: 1},
                {name: 'test', num: 9, price: 1200, type: 0, status: 1},
                {name: 'test', num: 9, price: 1200, type: 1, status: 0},
                {name: 'test', num: 9, price: 1200, type: 1, status: 1},
                {name: 'test', num: 9, price: 1200, type: 1, status: 1},
                {name: 'test', num: 9, price: 1200, type: 1, status: 1},
                {name: 'test', num: 9, price: 1200, type: 1, status: 1},
                {name: 'test', num: 9, price: 1200, type: 1, status: 1},
                {name: 'test', num: 9, price: 1200, type: 1, status: 1},
            ]
        };
    },
    created() {
    },
    methods: {
        
    }
};
</script>

<style lang="scss" scoped>

</style>