<template>
    <div class="box">
        <el-table
            :data="tableData"
            class="table"
            height="236"
            stripe
            ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column prop="name" label="单品"></el-table-column>
            <el-table-column prop="rest" label="剩余箱数" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    {{scope.row.status == 1 ? '货存不足' : '充裕'}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <a style="color:#2183EA;" href="javascript:;" @click="unnotice(scope.row.id)">取消提醒</a>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
export default {
    name: 'HomeStockNotice',
    data() {
        return {
            tableData: [
                {name: 'A64124', rest: '1', status: '1'},
                {name: 'A64124', rest: '2', status: '2'},
                {name: 'A64124', rest: '1', status: '1'},
                {name: 'A64124', rest: '1', status: '2'},
                {name: 'A64124', rest: '1', status: '1'},
                {name: 'A64124', rest: '1', status: '1'},
            ]
        };
    },
    created() {
    },
    methods: {
        unnotice(id) {
            console.log(id);
        }
    }
};
</script>

<style lang="scss" scoped>

</style>