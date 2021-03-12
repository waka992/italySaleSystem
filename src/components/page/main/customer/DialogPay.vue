<template>
    <div >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" >
            <el-form-item label="支付金额" prop="amount">
                <el-input size="mini" disabled class="form-input" v-model="form.amount" placeholder="请输入" ></el-input>
            </el-form-item>
            <el-form-item label="支付方式" prop="payType">
                <el-select v-model="form.payType" size="mini" class="form-input" placeholder="请选择" >
                    <el-option v-for="(type,i) in dict.accountType" :value="type.value" :label="type.label" :key="i">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="资金来源" prop="accountType">
                <el-select class="form-input" size="mini" v-model="form.accountType" placeholder="请选择">
                    <el-option v-for="(type,i) in dict.accountType" 
                    :label="type.label" :value="type.value"
                    :key="i"></el-option>
                </el-select>
            </el-form-item> -->
        </el-form>
    </div>
</template>
<script>
import dict from '@/components/common/dict.js'

import { 
getTitle } from '@/api/index';

export default {
    name: 'DialogPay',
    components: {
    },
    data() {
        return {
            id: '',
            dict: {},
            form: {
                amount: 0,
                payType: '',
            },
            rules: {
                amount: [{ required: true, message: '请输入', trigger: 'change' }],
                payType: [{ required: true, message: '请选择', trigger: 'change' }],
            }
        }
    },
    created() {
        this.dict = dict
    },
    methods: {
        sendData() {
            let data = {
                orderId: this.id,
                money: this.form.amount,
                payType: this.form.payType,
                ossFilePathName: '',
                pic: '',
            }
            this.$emit('pay', data)
        },
        setId(id) {
            this.id = id
        },
        resetData(data) {
            this.id = data.id
            this.form = {
                amount: data.price,
                payType: '',
                // accountType: 0,
            }
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

</style>