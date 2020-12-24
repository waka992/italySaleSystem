<template>
    <div class="box">
        <el-table
            :data="tableData"
            class="table"
            height="236"
            stripe
            ref="multipleTable"
            header-cell-class-name="table-header">
            <el-table-column prop="time" label="出货时间"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="transporter" label="运输商" align="center"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
export default {
    name: 'HomeCommingNotice',
    data() {
        return {
            tableData: [
                {time: '2020-11-16 14:53', name: '白云区货柜01', transporter: '上海英脉物流'},
                {time: '2020-11-16 14:53', name: '白云区货柜02', transporter: '上海英脉物流'},
                {time: '2020-11-16 14:53', name: '白云区货柜03', transporter: '德邦物流'},
                {time: '2020-11-16 14:53', name: '白云区货柜04', transporter: '上海英脉物流'},
                {time: '2020-11-16 14:53', name: '白云区货柜05', transporter: '德邦物流'},
                {time: '2020-11-16 14:53', name: '白云区货柜06', transporter: '上海英脉物流'},
                {time: '2020-11-16 14:53', name: '白云区货柜07', transporter: '上海英脉物流'},
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