<template>
    <div class="box">
        <el-table
            :data="tableData"
            class="table"
            height="236"
            stripe
            ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column prop="specification" label="型号"></el-table-column>
            <el-table-column prop="label" label="特色" align="center"></el-table-column>
            <el-table-column prop="caseNum" label="销售箱数" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template>
                    <span style="color:#FC5634;">售罄</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    getSellRemind,
} from '@/api/index';
export default {
    name: 'HomeSoldOutNotice',
    data() {
        return {
            tableData: [
            ]
        };
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            getSellRemind().then(res => {
                console.log(res);
                this.tableData = res
            })
        }
    }
};
</script>

<style lang="scss" scoped>

</style>