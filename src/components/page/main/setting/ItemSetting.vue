<template>
    <div class="goods-form">
        <div>
            <span class="attr-box w100">{{title}}:</span>
            <div class="attr-box">
                <el-tag
                    class="setting-tags"
                    :key="tag.id"
                    v-for="(tag,i) in tags"
                    closable
                    :disable-transitions="false"
                    @close.stop="handleClose(tag, value)"
                    @click="edit(tag, value, i)">
                    <span v-if="!tag.editVisible">{{tag.arrtibute}}</span>
                    <div class="edit-input" v-show="tag.editVisible">
                        <el-input :ref="'editInput' + i" v-model="form.arrtibute" @blur="save(i)"></el-input>
                    </div>
                </el-tag>
                <div class="add-input" v-show="dialogVisible">
                    <el-input ref="addInput" v-model="form.arrtibute" @blur="save"></el-input>
                </div>
                    <el-button class="button-new-tag" size="small" @click="showInput(value)">+</el-button>
            </div>
        </div>
        
        <!-- <el-dialog
            :close-on-click-modal='false'
            :title="title"
            :visible.sync="dialogVisible"
            width="700px">
                <el-input v-model="form.arrtibute"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="save">确 定</el-button>
                </span>
        </el-dialog> -->
    </div>
</template>

<script>
import { 
    getAttrList,
    createAttr,
    deleteAttr,
    updateAttr
 } from '@/api/index';
import {uniqBy, cloneDeep} from 'lodash'

export default {
    name: 'ItemSetting',
    props: {
        title: '',
        value: {type: Number},
    },
    components: {
    },
    
    data() {
        return {
            tags: [],
            operate: 'create',
            form: {
                id: '',
                arrtibute: '',  
                classType: '', 
            },
            dialogVisible: false,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            getAttrList().then(res => {
                this.tags = res[this.value] || []
                for (let i = 0; i < this.tags.length; i++) {
                    const element = this.tags[i];
                    element.editVisible = false
                }
            })
        },
        // 保存
        save(i) {
            let params = cloneDeep(this.form)
            if (params.arrtibute == '') {
                this.dialogVisible = false
                return
            }
            if (params.id == '') {delete params.id}
            if (this.operate == 'create') {
                createAttr(params).then(res => {
                    this.getData()
                    this.dialogVisible = false
                })
            }
            else {
                console.log(params);
                updateAttr(params).then(res => {
                    this.getData()
                    // this.dialogVisible = false
                    this.$set(this.tags[i], 'editVisible', false)
                })
            }
        },
        edit(tag, type, i) {
            this.form.id = tag.id
            this.form.arrtibute = tag.arrtibute
            this.form.classType = type
            // this.dialogVisible = true
            this.$set(this.tags[i], 'editVisible', true)
            this.$forceUpdate()
            this.operate = 'edit'
            this.$nextTick(() => {
                let attr = 'editInput' + i
                this.$refs[attr][0].focus()
            })
        },
        handleClose(tag, type) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.delAttr(tag, type)
            })
            .catch(() => {});
        },
        delAttr(tag, type) {
            this.form.id = tag.id
            this.form.arrtibute = tag.arrtibute
            this.form.classType = type

            deleteAttr(this.form).then(res => {
                this.$message.success('删除成功');
                this.getData()
            })
        },
        closeDialog() {
            this.dialogVisible = false
        },

        showInput(type) {
            this.form.arrtibute = ''
            this.form.classType = type
            this.dialogVisible = true
            this.operate = 'create'
            this.$nextTick(() => {
                this.$refs.addInput.focus()
            })
        },

       
    }
};
</script>

<style  scoped lang="scss">
.attr-box {
    display: block;
    color: #303133;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 14px;
}

.attr-box .el-tag {
    width: 180px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    margin-top: 3px;
}

.w100 {
    margin-top: 20px;
}

.setting-tags {
    width: 142px !important;
    height: 32px !important;
    line-height: 32px !important;
    vertical-align: middle;
    background-color: #ECF5FF;
    color: 12px;
    font-weight: normal;
}
.el-tag, .el-tag + .el-tag {
    margin-right: 10px;
}
.button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    vertical-align: middle;
    border-color: #979797;
}

.edit-input {
    display: inline-block;
    width: 100px !important;
    height: 28px !important;
    line-height: 28px !important;
    vertical-align: text-bottom;

    ::v-deep .el-input {
        height: 28px;
    }

    ::v-deep .el-input__inner {
        height: 28px;
        vertical-align: middle;
        background-color: #ECF5FF;
        border-color: transparent;
        color: #409EFF;;
    }
}

.add-input {
    display: inline-block;
    width: 142px !important;
    height: 32px !important;
    line-height: 32px !important;
    margin-right: 10px;

    ::v-deep .el-input__inner {
        vertical-align: middle;
        background-color: #ECF5FF;
        border-color: #d9ecff;
        color: #409EFF;;
    }
}
 
</style>
