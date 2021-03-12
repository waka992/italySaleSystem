<template>
    <div >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" >
            <el-form-item label="结欠金额" prop="amount">
                <el-input size="mini" class="form-input" v-model="form.amount" placeholder="请输入" ></el-input>
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
    name: 'DialogBalance',
    components: {
    },
    data() {
        return {
            dict: {},
            form: {
                amount: 0,
                // accountType: 0,
            },
            rules: {
                amount: [{ required: true, message: '请输入', trigger: 'change' }],
            }
        }
    },
    created() {
        this.dict = dict
    },
    methods: {
        sendData() {
            this.$emit('balance', this.form)
        },
        resetData(amount) {
            this.form.amount = amount
            // this.form.accountType = 0
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