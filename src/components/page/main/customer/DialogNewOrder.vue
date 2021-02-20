<template>
    <div >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
            <el-form-item label="客户" prop="name">
                <customer-name-selector
                style="margin-right:90px;"
                :width="'200px'"
                @selectData="handleSelect"
                >
                </customer-name-selector>
            </el-form-item>

            <el-form-item label="地址" prop="customerAddress">
                <el-input size="mini" class="form-input" v-model="form.customerAddress" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="托运部" prop="transportName" >
                <el-input size="mini" class="form-input" v-model="form.transportName" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="支付方式" prop="payType">
                <el-input size="mini" class="form-input" v-model="form.payType" placeholder="请输入" ></el-input>
            </el-form-item>

            <el-form-item label="货币" prop="monetaryUnit">
                <el-input size="mini" class="form-input" v-model="form.monetaryUnit" placeholder="请输入" ></el-input>
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
                        <el-autocomplete
                            size="mini"
                            v-model="list.type"
                            :fetch-suggestions="queryProduct"
                            placeholder="请输入产品名"
                            @select="handleProductSelect(list)"
                        ></el-autocomplete>
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

import { 
userList,
checkSkuOrder } from '@/api/index';
import CustomerNameSelector from '@/components/public/CustomerNameSelector.vue'

export default {
    name: 'DialogNewOrder',
    components: {
        CustomerNameSelector
    },
    data() {
        return {
            form: {},
            tableTitles: [
                {label: '型号', name: 'type'},
                {label: '箱数', name: 'boxes'},
                {label: '件数', name: 'pics'},
                {label: '售价', name: 'price'},
                {label: '总计', name: 'total'},
            ],
            tableList: [],
            // list基本式(添加用)
            listOrigin: {type: '', boxes: '', pics: '', price: '', total: ''},
            rules: {
                name: [{ required: true, message: '请输入', trigger: 'change' }],
                transportName: [{ required: true, message: '请输入', trigger: 'change' }],
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
            console.log(this.form);
            return
            let data = cloneDeep(this.form)
            data.product = cloneDeep(this.tableList)
            this.$emit('saveData', data)
        },
        // 置空数据
        resetData(data) {
            this.form = {
                customerId: '',
                customerName: '',
                customerAddress: '',
                transportName: '',
                payType: '',
                monetaryUnit: '',
                discount: '',
                exchangeRate: '',
            }
            this.tableList = [
                {type: '', boxes: '', pics: '', price: '', total: ''}
            ]
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        editData(data) {
            this.form = data.form
            this.tableList = data.tableList
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        // 查询客户名
        queryName(queryString, cb) {
            userList({
                level: '',
                status: '',
                page: 1,
                pageSize: 10,
                userName: queryString
                }).then(res => {
                let arr = []
                    for (let i = 0; i < res.records.length; i++) {
                        const ele = res.records[i];
                        arr.push({
                            value: ele.memberName,
                            id: ele.id,
                            memberName: ele.memberName
                        })
                    }
                cb(arr)
            })
        },
        queryProduct(qs, cb) {
            checkSkuOrder({
                page: 1,
                pageSize: 5,
                specification: qs
            }).then(res => {
                console.log(res);
            })
        },
        handleProductSelect(item) {
            console.log(item);
        },
        handleSelect(item) {
            console.log(item);
            this.form.customerName = item.memberName
            this.form.id = item.id
        },
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