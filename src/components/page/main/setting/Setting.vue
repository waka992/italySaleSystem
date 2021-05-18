<template>
    <div>
        <div class="crumbs setting-crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>属性管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="detail-box">
                <item-setting v-for="(item,i) in settingItems" 
                :key="i"
                :title="item.label"
                :value="item.value"
                ></item-setting>
            </div>
        </div>

        <div class="crumbs setting-crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item >参数管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="detail-box">
                <title-setting v-for="(item,i) in titleItems" 
                :key="i"
                :title="item.label"
                :value="item.value"></title-setting>
            </div>
        </div>

         <div class="crumbs setting-crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item >信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="detail-box">
                <info-setting></info-setting>
            </div>
        </div>

         <div class="crumbs setting-crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item >位置管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="detail-box">
                <location-setting></location-setting>
            </div>
        </div>
    </div>
</template>
<script>
import ItemSetting from './ItemSetting'
import TitleSetting from './TitleSetting'
import InfoSetting from './InfoSetting'
import LocationSetting from './LocationSetting'
import dict from '@/components/common/dict.js'

export default {
    name: 'Setting',
    components: {
        ItemSetting,
        TitleSetting,
        InfoSetting,
        LocationSetting
    },
    data() {
        return {
            settingItems: [],
            titleItems: []
        }
    },
    created() {
        this.settingItems = dict.settingItemValue
        this.titleItems = [
            {value: 'taxRate', label: '汇率/Rate'},
            {value: 'quarter', label: '季度/Season'},
            // {value: '0', label: '支出'},
            // {value: '1', label: '收入'},
        ]
    },
    methods: {

    }
}
</script>
<style scoped lang="scss">
.setting-crumbs {
    ::v-deep .el-breadcrumb__inner {
        font-size: 16px;
        color: #1F1F21;
        font-weight: 600;
    }
}
.box {
    margin: 0 23px;
    background-color: transparent;
}

.detail-box {
    position: relative;
    width: 100%;
    padding: 12px;
    background-color: #fff;
    font-size: 12px;
    padding: 22px;
    margin-bottom: 18px;
    border-radius: 2px;
}


</style>