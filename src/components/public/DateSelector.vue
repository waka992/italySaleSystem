<template>
    <div class="my-selector">
        <div class="date">
            <el-date-picker
            ref="dateSelector"
            :picker-options='pickerOptions'
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
import moment  from 'moment'
export default {
    name: 'DateSelector',
    props: {
    
    },
    data() {
        return {
            date: moment().format('YYYY-MM-DD'),
            pickerOptions: {
                disabledDate(time){
                    return time.getTime() > Date.now()   //如果当天可选，就不用减8.64e7
                }
            }
        };
    },
    mounted() {
    },
    methods: {
        resetDate() {
            this.date = ''
        },
        dateClick() {
            this.$refs.dateSelector.focus()
        },
        dateChange(date) {
            this.date = date
            this.$emit('change', date)
        }
    }
}
</script>
<style lang="scss" scoped>
.my-selector {
    position: relative;
    width: 90px;
    height: 32px;
}
.date {
    position: absolute;
    left: 0;
    top: 0;
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
    top: 0px;
    left: 0;
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