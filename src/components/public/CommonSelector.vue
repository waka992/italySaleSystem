<template>
    <div class="my-selector">
        <div class="date">
            <el-select ref="selector" v-model="value" :placeholder="placeholder" @change="change">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="showDate" :style="'width:' + width" @click="dateClick">
            {{showValue ? showValue : placeholder}}
            <span class="unfold-pic" ></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DateSelector',
    props: {
        placeholder: String,
        options: Array,
        width: {
            type: String,
            default: '83px'
        }
    },
    data() {
        return {
           value: '',
           showValue: '',
        };
    },
    mounted() {
    },
    methods: {
        dateClick() {
            console.log(this.$refs);
            this.$refs.selector.focus()
        },
        change(val) {
            console.log(val);
            for (let i = 0; i < this.options.length; i++) {
                const element = this.options[i];
                if (element.value == val) {
                    this.showValue = element.label
                    break
                }
            }
            this.$emit('change', val)
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
    left: -20px;
    top: -10px;
    width: 113px;
    opacity: 0;
    z-index: 999;

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