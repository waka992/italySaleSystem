<template>
    <div class="box">
        <div class="date">
            <el-date-picker
            ref="dateSelector"
            v-model="date"
            type="date"
            value-format="yyyy-MM-dd"
            @change="dateChange"
            placeholder="选择日期">
            </el-date-picker>
        </div>
        <div class="showDate" @click="dateClick">
            {{date ? date : '请选日期'}}
            <span class="unfold-pic" ></span>
        </div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
export default {
    name: 'HomeSoldProfit',
    data() {
        return {
            date: ''
        };
    },
    created() {
    },
    methods: {
        dateClick() {
            this.$refs.dateSelector.focus()
        },
        dateChange(date) {
            console.log(date);
        }
    }
};
</script>

<style lang="scss" scoped>

.date {
    position: absolute;
    right: 16px;
    top: 25px;
    width: 113px;
    opacity: 0;

    ::v-deep .el-date-editor {
        position: absolute;
        top: -8px;
        left: 0;
        width: 130px;
        z-index: 999;
        background-color: transparent;
    }
}
.showDate {
    position: absolute;
    top: 25px;
    right: 16px;
    width: 83px;
    font-size: 11px;
    color: #1F1F21;
}

.unfold-pic {
    position: absolute;
    top: 5px;
    right: 0;
    display: inline-block;
    width: 0;
    height: 0;
    border: none;
    border: 5px solid transparent;
    border-top: 5px solid #C0C4CC;
}
</style>