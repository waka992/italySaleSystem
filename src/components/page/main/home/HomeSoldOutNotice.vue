<template>
    <div class="box">
        <el-table
            :data="tableData"
            class="table"
            height="236"
            stripe
            ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column prop="type" label="型号"></el-table-column>
            <el-table-column prop="specification" label="特色" align="center"></el-table-column>
            <el-table-column prop="soldNum" label="总卖出件数" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1" style="color:#FC5634;">售罄</span>
                    <span v-else>有货</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
export default {
    name: 'HomeSoldOutNotice',
    data() {
        return {
            tableData: [
                {type: 'H42532', specification: '特色特色天特色天', soldNum: 1200, type: 1, status: 1},
                {type: 'Ar2352352', specification: '特色特色天特色天', soldNum: 1200, type: 0, status: 1},
                {type: 'H234235', specification: '特色特色天特色天', soldNum: 1200, type: 1, status: 0},
                {type: 'test', specification: '特色特色天特色天', soldNum: 1200, type: 1, status: 1},
                {type: 'test', specification: '特色特色天特色天', soldNum: 1200, type: 1, status: 1},
                {type: 'test', specification: '特色特色天特色天', soldNum: 1200, type: 1, status: 1},
                {type: 'test', specification: '特色特色天特色天', soldNum: 1200, type: 1, status: 1},
                {type: 'test', specification: '特色特色天特色天', soldNum: 1200, type: 1, status: 1},
                {type: 'test', specification: '特色特色天特色天', soldNum: 1200, type: 1, status: 1},
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