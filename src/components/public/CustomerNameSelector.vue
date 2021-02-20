<template>
    <div class="autocomplete-area">
        <el-autocomplete
            :style="'width: '+width"
            size="mini"
            class="form-input"
            v-model="form.name"
            :fetch-suggestions="queryName"
            :maxlength="15" 
            show-word-limit
            placeholder="请输入客户名"
            @select="handleSelect"
        ></el-autocomplete>
    </div>
</template>
<script>
import {userList} from '@/api/index';
export default {
    name: 'CustomerNameSelector',
    props: {
        width: ''
    },
    data() {
        return {
            form: {
                name: ''
            },
        }
    },
    methods: {
        // 查询客户名
        queryName(queryString, cb) {
            userList({
                level: '',
                status: '',
                page: 1,
                pageSize: 5,
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
        handleSelect(item) {
            this.$emit('selectData', item)
        }
    }
}
</script>
<style lang="scss">
    .autocomplete-area {
        display: inline-block;
    }
</style>