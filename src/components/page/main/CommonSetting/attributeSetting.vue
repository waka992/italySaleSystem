<template>
    <div class="goods-form">
        <div>
            <span class="attr-box w100">特色/Special:</span>
            <div class="attr-box">
                <el-tag
                    :key="tag.id"
                    v-for="tag in specialTags"
                    closable
                    :disable-transitions="false"
                    @close.stop="handleClose(tag, 5)"
                    @click="edit(tag, 5)">
                    {{tag.arrtibute}}
                    </el-tag>
                    <el-button class="button-new-tag" size="small" @click="showInput(5)">+</el-button>
            </div>
        </div>
        <div>
            <span class="attr-box w100">颜色/Color:</span>
            <div class="attr-box">
                <el-tag
                    :key="tag.id"
                    v-for="tag in colorTags"
                    closable
                    :disable-transitions="false"
                    @close.stop="handleClose(tag, 0)"
                    @click="edit(tag, 0)">
                    {{tag.arrtibute}}
                    </el-tag>
                    <el-button class="button-new-tag" size="small" @click="showInput(0)">+</el-button>
            </div>
        </div>

        <div>
            <span class="attr-box w100">尺寸/Size:</span>
            <div class="attr-box">
                <el-tag
                    :key="tag.id"
                    v-for="tag in sizeTags"
                    closable
                    :disable-transitions="false"
                    @close.stop="handleClose(tag, 1)"
                    @click="edit(tag, 1)">
                    {{tag.arrtibute}}
                    </el-tag>
                    <el-button class="button-new-tag" size="small" @click="showInput(1)">+</el-button>
            </div>
        </div>

        <div>
            <span class="attr-box w100">面料/Material:</span>
            <div class="attr-box">
                <el-tag
                    :key="tag.id"
                    v-for="tag in elementTags"
                    closable
                    :disable-transitions="false"
                    @close.stop="handleClose(tag, 2)"
                    @click="edit(tag, 2)">
                    {{tag.arrtibute}}
                    </el-tag>
                    <el-button class="button-new-tag" size="small" @click="showInput(2)">+</el-button>
            </div>
        </div>
        <div>
            <span class="attr-box w100">配比/Ratio:</span>
            <div class="attr-box">
                <el-tag
                    :key="tag.id"
                    v-for="tag in proportionTags"
                    closable
                    :disable-transitions="false"
                    @close.stop="handleClose(tag, 4)"
                    @click="edit(tag, 4)">
                    {{tag.arrtibute}}
                    </el-tag>
                    <el-button class="button-new-tag" size="small" @click="showInput(4)">+</el-button>
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
            let attr = this.form.classType == 0 ? '颜色' : 
            this.form.classType == 1 ? '尺寸' :
            this.form.classType == 2 ? '面料' :
            this.form.classType == 4 ? '配比' :
            this.form.classType == 5 ? '特色' : ''
            console.log(str);
            return str + attr
        }
    },
    data() {
        return {
            colorTags: [],
            sizeTags: [],
            elementTags: [],
            proportionTags: [],
            specialTags: [],
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
                this.colorTags = res[0] || []
                this.sizeTags = res[1] || []
                this.elementTags = res[2] || []
                this.proportionTags = res[4] || []
                this.specialTags = res[5] || []
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
    display: block;
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
    width: 160px;
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
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
