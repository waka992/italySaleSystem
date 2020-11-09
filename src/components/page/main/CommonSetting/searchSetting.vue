<template>
    <div class="goods-form">
        <div>
            <span class="attr-box w150">型号推荐:</span>
            <div class="attr-box">
                <el-tag
                    :key="tag.id"
                    v-for="tag in codeTags"
                    closable
                    :disable-transitions="false"
                    @close.stop="handleClose(tag, 8)"
                    @click="edit(tag, 8)">
                    {{tag.arrtibute}}
                    </el-tag>
                    <el-button class="button-new-tag" size="small" @click="showInput(8)">+</el-button>
            </div>
        </div>

        <div>
            <span class="attr-box w150">名称推荐:</span>
            <div class="attr-box">
                <el-tag
                    :key="tag.id"
                    v-for="tag in nameTags"
                    closable
                    :disable-transitions="false"
                    @close.stop="handleClose(tag, 9)"
                    @click="edit(tag, 9)">
                    {{tag.arrtibute}}
                    </el-tag>
                    <el-button class="button-new-tag" size="small" @click="showInput(9)">+</el-button>
            </div>
        </div>
        <el-dialog
            :close-on-click-modal='false'
            :title="title"
            :visible.sync="dialogVisible"
            width="700px">
                <el-input v-model="form.arrtibute"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="save">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import { 
    getAttrList,
    createAttr,
    deleteAttr,
    updateAttr
 } from '../../../../api/index';
import {uniqBy, cloneDeep} from 'lodash'

export default {
    name: 'typeForm',
    props: {
    },
    components: {
    },
    computed: {
        title() {
            let str = (this.operate === 'create' ? '新增' : '编辑')
            let attr = this.form.classType == 8 ? '型号' : 
            this.form.classType == 9 ? '名称' : ''
            console.log(str);
            return str + attr
        }
    },
    data() {
        return {
            codeTags: [],
            sizeTags: [],
            elementTags: [],
            nameTags: [],
            operate: 'create',

            form: {
                id: '',
                arrtibute: '',  
                classType: '', //0颜色 1尺寸 2面料 3公司介绍 4配比
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
                console.log(res);
                this.codeTags = res[8] || []
                this.nameTags = res[9] || []
            })
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
            if (params.id == '') {delete params.id}
            if (this.operate == 'create') {
                createAttr(params).then(res => {
                    this.getData()
                    this.dialogVisible = false
                })
            }
            else {
                updateAttr(params).then(res => {
                    this.getData()
                    this.dialogVisible = false
                })
            }
        },
        edit(tag, type) {
            this.form.id = tag.id
            this.form.arrtibute = tag.arrtibute
            this.form.classType = type
            this.dialogVisible = true
            this.operate = 'edit'
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
        openDialog() {
            this.dialogVisible = true
        },
        closeDialog() {
            this.dialogVisible = false
        },

        showInput(type) {
            this.form.arrtibute = ''
            this.form.classType = type
            this.dialogVisible = true
            this.operate = 'create'
        },

       
    }
};
</script>

<style  scoped>
.attr-box {
    display: inline-block;
}

.w150 {
    margin-top: 20px;
    width: 100px;
}

.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
