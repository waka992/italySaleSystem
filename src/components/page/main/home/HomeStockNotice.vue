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
            <el-table-column prop="caseNum" label="剩余箱数" align="center"></el-table-column>
            <!-- <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    {{scope.row.status == 1 ? '货存不足' : '充裕'}}
                </template>
            </el-table-column> -->
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <a style="color:#2183EA;" href="javascript:;" @click="unnotice(scope.row.id)">取消提醒</a>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    getStockRemind,
    cancalStockRemind
} from '@/api/index';
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
        this.getData()
    },
    methods: {
        unnotice(id) {
            cancalStockRemind({id: id}).then(res => {
                this.$confirm('确定要取消提醒吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('取消成功')
                        this.getData()
                    })
                    .catch(() => {});
               
            })
        },
        getData() {
            getStockRemind().then(res => {
                this.tableData = res
                console.log(res);
            })
        }
    }
};
</script>

<style lang="scss" scoped>

</style>