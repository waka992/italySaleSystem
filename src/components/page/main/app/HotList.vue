<template>
    <div class="goods-form">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>app</el-breadcrumb-item>
                <el-breadcrumb-item>热销管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">

            <div class="table-area">
                <div style="text-align:right;">
                    <el-button icon="el-icon-refresh-right" circle @click="getHot"></el-button>
                    <el-button type="primary" @click="create">添加商品</el-button>
                </div>
            <el-table
                :data="hotTableData"
                stripe
                class="table"
                ref="multipleTable"
                row-key="id"
                header-cell-class-name="table-header"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                >
                <el-table-column prop="name" label="商品名称" align="center">
                </el-table-column>
                <el-table-column prop="specification" label="型号" align="center">
                </el-table-column>
                <el-table-column prop="isNew" label="是否新品" align="center">
                    <template slot-scope="scope">
                        {{scope.row.isNew == 0 ? '否' : '是'}}
                    </template>
                </el-table-column>
                <el-table-column prop="showStatus" label="上架/下架" align="center">
                    <template slot-scope="scope">
                        {{scope.row.showStatus == 0 ? '下架' : '上架'}}
                    </template>
                </el-table-column>
                <el-table-column prop="imgUrl" label="封面图片" align="center">
                    <template slot-scope="scope">
                        <el-image 
                            v-show="scope.row.imgUrl"
                            style="width: 100px; height: 100px"
                            :src="scope.row.imgUrl" 
                            :preview-src-list="[scope.row.imgUrl]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            @click="delHot(scope.row)"
                            type="text"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="hotpage.no"
                    :page-size="hotpage.size"
                    :total="hotpage.total"
                    @current-change="handleHotPageChange"
                ></el-pagination>
            </div>
            <el-dialog
                :close-on-click-modal='false'
                :title="operate === 'create' ? '添加' : '编辑'"
                :visible.sync="dialogVisible"
                width="1080px">
                <div>
                    分类：
                    <div class="w200" >
                        <el-cascader clearable v-model="parentId" @change="cascaderChange" :props="cascaderProps" :options="typeList"></el-cascader>
                    </div>
                    搜索：
                    <div class="w200" >
                        <el-input v-model="searchContent"></el-input>
                    </div>
                    <el-button type="primary" @click="getGoodList">查询</el-button>
                    <el-button type="success" @click="addHot">添加</el-button>
                </div>
                <el-table
                    :data="tableData"
                    stripe
                    class="table"
                    ref="multipleTable"
                    row-key="id"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
                    <!-- <el-table-column type="index" label="序号" width="55" align="center"></el-table-column> -->
                    <el-table-column prop="name" label="商品名称" align="center">
                    </el-table-column>
                    <el-table-column prop="specification" label="型号" align="center">
                    </el-table-column>
                    <el-table-column prop="goodsDetail" label="商品描述" align="center">
                    </el-table-column>
                    <el-table-column prop="isNew" label="是否新品" align="center">
                        <template slot-scope="scope">
                            {{scope.row.isNew == 0 ? '否' : '是'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="label" label="特色" align="center">
                        <template slot-scope="scope">
                            <el-tag v-for="(tag,i) in scope.row.label" :key="i">{{tag}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showStatus" label="上架/下架" align="center">
                        <template slot-scope="scope">
                            {{scope.row.showStatus == 0 ? '下架' : '上架'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgUrl" label="封面图片" :show-overflow-tooltip="true" align="center">
                        <template slot-scope="scope">
                            <el-image 
                                v-if="area == 'eu'"
                                v-show="scope.row.imgUrl"
                                style="width: 100px; height: 100px"
                                :src="scope.row.imgUrl" 
                                :preview-src-list="[scope.row.imgUrl]">
                            </el-image>
                            <el-image 
                                v-if="area == 'cn'"
                                v-show="scope.row.cnImgUrl"
                                style="width: 100px; height: 100px"
                                :src="scope.row.cnImgUrl" 
                                :preview-src-list="[scope.row.cnImgUrl]">
                            </el-image>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="page.no"
                        :page-size="page.size"
                        :total="page.total"
                        @current-change="handlePageChange"
                    ></el-pagination>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">完成</el-button>
                </span>
    
            </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import {  getType,  getGoodsByMenu,
    addHotList, delHotList, getHotList } from '@/api/index';
import { cloneDeep} from 'lodash'
export default {
    name: 'HotList',
    props: {
    },
    components: {
    },
    computed: {
  
    },
    data() {
        return {
            parentId: '',
            searchContent: '',
            // 级联
            cascaderProps: {
                label: 'name',
                value: 'id',
                checkStrictly: true
            },
            firstGrade: '',
            secondGrade: '',
            thirdGrade: '',
            firstGradeEnum: '',
            secondGradeEnum: '',
            thirdGradeEnum: '',
            operate: 'create',
            tableData: [],
            hotTableData: [],
            typeList: [],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            hotpage: {
                no: 1,
                total: 0,
                size: 20
            },
            form: {
                name:'',
                specification: '',
                isNew: 1,
                goodsDetail: '',
                elementDetail: [],
                level: '',
                label: [],
                showStatus: 1,
                firstMenu: '',
                secondMenu: '',
                thirdMenu: '',
                imgUrl: [],
                goodsImgList: [],
            },
            dialogVisible: false,
            detailDialogVisible: false,
            delList: [],
            area: 'eu'
        };
    },
    created() {
        this.getHot()
        this.getData();
        this.area = localStorage.getItem('area') || 'eu'
    },
    methods: {
        saveDetail() {
            this.detailDialogVisible = false
            let list = cloneDeep(this.$refs.detailForm.form)
            this.form.goodsImgList.push(list)
        },
        showDetailDialog() {
            this.detailDialogVisible = true
            try {
                this.$refs.detailForm.form = cloneDeep(this.form.goodsImgList)
                this.$refs.detailForm.form
            }
            catch(err) {
                console.log(err);
            }
        },
        handleHotPageChange() {
            this.getHot()
        },
        handlePageChange(p) {
            this.page.no = p
            this.getGoodList()
        },
        getData() {
            getType().then(res => {
                res = res.filter(item => item.type !== 1)
                let str = JSON.stringify(res)
                let str2 = str.replace(/,"children":\[\]/g, '')
                this.typeList = JSON.parse(str2)
            })
        },
        getGoodList() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                content:  this.searchContent,
            }
            if (typeof this.parentId == 'object') {
                obj.parentId = this.parentId[this.parentId.length - 1]
            }
            else if (this.parentId) {
                obj.parentId = this.parentId
            }
            getGoodsByMenu(obj).then(res => {
                console.log(res);
                for (let i = 0; i < res.records.length; i++) {
                    const element = res.records[i];
                    // res.records[i].elementDetail = element.elementDetail.split(',')
                    if (res.records[i].label) {
                        res.records[i].label = element.label.split(',')
                    }
                }
                console.log(res.records);
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },
        getHot() {
            getHotList().then(res => {
                this.hotTableData = res
                // this.hotpage.total = res.total
                // this.hotpage.no = res.current
            })
        },
        // 添加热销
        addHot() {
            if (this.selectRow.length == 0) {
                return
            }
            let list = []
            for (let i = 0; i < this.selectRow.length; i++) {
                const element = this.selectRow[i];
                list.push({
                    id: element.id,
                })
            }
            addHotList(list).then(res => {
                this.$message.success({message: '添加成功',});
                this.selectRow = []
                this.dialogVisible = false
                this.getHot()
            })
        },
    
        handleSelectionChange(row){
            this.selectRow = row
        },
      
        create() {
            this.operate = 'create'
            this.initData()
            this.openDialog()
        },
        initData() {
            this.form =  {
                name:'',
                specification: '',
                isNew: 1,
                goodsDetail: '',
                elementDetail: [],
                size: '',
                label: [],
                showStatus: 1,
                firstMenu: this.parentId[0] || '',
                secondMenu: this.parentId[1] || '',
                thirdMenu: this.parentId[2] || '',
                imgUrl: [],
                goodsImgList: [],
                arrtibuteList: []
            }
        },
        delHot(row) {
            this.$confirm('确认移出热销商品列表？').then(_ => {
                    let list = [row.id]
                    delHotList(list).then(res => {
                        this.$message.success({message: '删除成功',});
                        this.getHot()
                    })
                })
                .catch(_ => {});
        },
        
        openDialog() {
            this.dialogVisible = true
            this.page.no = 1
            this.getGoodList()
        },
        closeDialog() {
            this.dialogVisible = false
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 上传图片
        handleAvatarSuccess(res, file) {
            if (res.data) {
                this.$set(this.form, 'picture', res.data)
                // this.form.picture = res.data
            }
        },
        cascaderChange(v) {
            this.getGoodList()
        },
    }
};
</script>

<style lang="scss" scoped>
.box {
    position: relative;
    padding: 12px;
    margin: 0 23px;
    background-color: #fff;
}
.table {
    width: 100%;
    font-size: 11px;
    margin-top: 10px;
}
    .el-select {
        width: 100%;
    }
    .type-select {
        display: inline-block;
        width: 300px;
        border-right: 1px solid #ddd;
        height: 100%;
        text-align: center;
    }

    .w200 {
        width: 200px;
        margin-bottom: 20px;
        margin-right: 20px;
        display: inline-block;
    }
    .upload-demo {
        text-align: center;
    }
    .upload-demo ::v-deep .el-upload.el-upload--text {
        width: 200px;
        border: none;
        height: 30px;
    }
    .pic-list {
        text-align: center;
    }
    .pic-list-item {
        display: inline-block;
        width: 100px;
        height: 100px;  
    }
    .tac .el-form-item__content{
        text-align: center;
    }
    .arrtibute-item {
        display: inline-block;
        position: relative;
        width: 150px;
        margin-right: 10px;
    }
    .badge {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 20px;
        background: rgb(255, 107, 81);
        display: inline-block;
        position: absolute;
        right: -5px;
        top: -5px;
        z-index: 999;
        cursor: pointer;
    }
</style>
