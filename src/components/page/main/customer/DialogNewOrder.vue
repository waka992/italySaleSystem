<template>
    <div >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
            <el-form-item label="客户" prop="name">
                <el-input size="mini" class="form-input" v-model="form.name" placeholder="请输入" maxlength="15" show-word-limit></el-input>
            </el-form-item>

            <el-form-item label="地址" prop="address">
                <el-input size="mini" class="form-input" v-model="form.address" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="托运部" prop="transportor" >
                <el-input size="mini" class="form-input" v-model="form.transportor" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="支付方式" prop="payWay">
                <el-input size="mini" class="form-input" v-model="form.payWay" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="货币" prop="currency">
                <el-input size="mini" class="form-input" v-model="form.currency" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="折扣" prop="discount">
                <el-input size="mini" class="form-input" v-model="form.discount" placeholder="请输入" ></el-input>
            </el-form-item>
        </el-form>
        <div class="prod-table">
            <div class="label">产品</div>
            <div class="table-area">
                <!-- 表头 -->
                <div class="table-head">
                    <div class="head-item" v-for="(title, i) in tableTitles" :key="i">{{title.label}}</div>
                </div>
                <!-- 表格 -->
                <div class="table-list" v-for="(list, i) in tableList" :key="i">
                    <div class="list-item">
                        <el-input v-model="list.type" @change="changaItem(list.type, i, 'type')"></el-input>
                    </div>
                    <div class="list-item">
                        <el-input v-model="list.boxes" @change="changaItem(list.boxes, i, 'boxes')"></el-input>
                    </div>
                    <div class="list-item">
                        <el-input v-model="list.pics" @change="changaItem(list.pics, i, 'pics')"></el-input>
                    </div>
                    <div class="list-item">
                        <el-input v-model="list.price" @change="changaItem(list.price, i, 'price')"></el-input>
                    </div>
                    <div class="list-item">
                        {{list.total}}$
                        <!-- <el-input v-model="list.total" @change="changeType(list.type)"></el-input> -->
                    </div>
                    <div class="del-btn" @click="delList(i)">
                        <el-button type="text"  icon="el-icon-close"></el-button>
                    </div>
                </div>
                <div class="add-btn" @click="addList">
                    <span class="plus">+</span>
                    <el-button type="text">添加产品</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {cloneDeep} from 'lodash';
export default {
    name: 'DialogNewOrder',
    data() {
        return {
            form: {
                name: '',
                address: '',
                transportor: '',
                payWay: '',
                currency: '',
                discount: '',
            },
            tableTitles: [
                {label: '型号', name: 'type'},
                {label: '箱数', name: 'boxes'},
                {label: '件数', name: 'pics'},
                {label: '售价', name: 'price'},
                {label: '总计', name: 'total'},
            ],
            tableList: [
                {type: '1', boxes: '1', pics: '3', price: '2', total: '6'}
            ],
            // list基本式
            listOrigin: {type: '', boxes: '', pics: '', price: '', total: ''},
            rules: {
                name: [{ required: true, message: '请输入', trigger: 'change' }],
                transportor: [{ required: true, message: '请输入', trigger: 'change' }],
            }
        }
    },
    created() {

    },
    methods: {
        changaItem(val, i, name) {
            this.$set(this.tableList[i], name, val)
        },
        addList() {
            let list = cloneDeep(this.listOrigin)
            this.tableList.push(list)
        },
        delList(i) {
            this.tableList.splice(i, 1)
        },
        // 保存提交
        saveSubmit() {
            let data = cloneDeep(this.form)
            data.product = cloneDeep(this.tableList)
            this.$emit('saveData', data)
        },
        // 置空数据
        resetData() {
            this.form = {
                name: '',
                address: '',
                transportor: '',
                payWay: '',
                currency: '',
                discount: '',
            }
            this.tableList = [
                {type: '', boxes: '', pics: '', price: '', total: ''}
            ]
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        }
    }

}
</script>
<style lang="scss" scoped>
.form-input {
    width: 200px;
    margin-right: 90px;
}
.prod-table {
    .label {
        display: inline-block;
        width: 80px;
        padding: 12px;
        text-align: right;
    }

    .table-area {
        display: inline-block;
        width: 710px;
        vertical-align: top;
    }

    .table-head {
        height: 43px;
        background: #F0F2F5;
        display: flex;
        line-height: 43px;

        .head-item {
            flex: 1;
            text-align: center;
            color: #909399;
            font-size: 12px;
        }
    }

    .table-list {
        position: relative;
        height: 43px;
        line-height: 43px;
        display: flex;

        .del-btn {
            position: absolute;
            right: 10px;
            cursor: pointer;
        }

        .list-item {
            flex: 1;
            text-align: center;

            .el-input  {
                width: 85px;
            }
        }
    }

    .add-btn {
        display: inline-block;
        font-size: 12px;
        vertical-align: middle;

        .plus {
            display: inline-block;
            width: 16px;
            height: 16px;
            font-size: 12px;
            line-height: 16px;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            background-color: #2183EA;
            margin-right: 4px;
            vertical-align: middle;
            cursor: pointer;
        }
        
    }
}
</style>