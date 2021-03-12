<template>
    <div class="box">
        <el-table
            :data="tableData"
            class="table"
            height="236"
            stripe
            ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column prop="estimate" label="预计到货时间">
                <template slot-scope="scope">
                    {{timeFormat(scope.row.estimate)}}
                </template>
            </el-table-column>
            <el-table-column prop="container" label="名称" align="center"></el-table-column>
            <el-table-column prop="transpoterName" label="运输商" align="center"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    getIndexArrival,
} from '@/api/index';
import moment from 'moment'
export default {
    name: 'HomeCommingNotice',
    data() {
        return {
            tableData: [
            ]
        };
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            getIndexArrival().then(res => {
                this.tableData = res
            })
        },
        timeFormat(time) {
            return moment(time).format('YYYY-MM-DD')
        },
    }
};
</script>

<style lang="scss" scoped>

</style>