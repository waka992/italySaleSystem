<template>
    <div>
         <div class="handle-box">
                <el-input class="name-search" v-model="search.name" size="mini" suffix-icon="el-icon-search" placeholder="输入关键词"></el-input>
                <div class="status">
                    <span class="label">尺码</span>
                    <el-select size="mini" multiple v-model="search.size" placeholder="请选择">
                        <el-option
                        v-for="(item,i) in sizeOptions"
                        :key="i"
                        :label="item.arrtibute"
                        :value="item.arrtibute">
                        </el-option>
                    </el-select>
                </div>
                <div class="status">
                    <span class="label">特色</span>
                    <el-select size="mini" multiple v-model="search.label" placeholder="请选择">
                        <el-option
                        v-for="(item,i) in labelOptions"
                        :key="i"
                        :label="item.arrtibute"
                        :value="item.arrtibute">
                        </el-option>
                    </el-select>
                </div>
                <div class="status">
                    <span class="label">面料</span>
                    <el-select size="mini" multiple v-model="search.component" placeholder="请选择">
                        <el-option
                        v-for="(item,i) in componentOptions"
                        :key="i"
                        :label="item.arrtibute"
                        :value="item.arrtibute">
                        </el-option>
                    </el-select>
                </div>
                <div class="status">
                    <span class="label">状态</span>
                    <el-select size="mini" v-model="search.skuStatus" placeholder="请选择">
                        <el-option
                        v-for="item in soldStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button icon="el-icon-search" circle @click="getData"></el-button>
                <el-button type="primary" icon="el-icon-plus" circle @click="addReady">添加</el-button>
            </div>
        <el-table
            :data="tableData"
            stripe
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            @selection-change="selectionChange"
        >
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="specification" label="型号" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="label" label="特色" align="center"></el-table-column>
            <el-table-column prop="component" label="面料" align="center"></el-table-column>
            <el-table-column prop="size" label="尺码" align="center"></el-table-column>
            <el-table-column prop="color" label="颜色" align="center"></el-table-column>
            <el-table-column prop="skuStatus" label="状态" align="center" width="120">
                <template  slot-scope="scope">
                    {{
                    scope.row.skuStatus === 0 ? '即将到货' 
                    : scope.row.skuStatus === 1 ? '现货'
                    : scope.row.skuStatus === 2 ? '售罄' : '预录入'}}
                </template>
            </el-table-column>
            <el-table-column prop="caseNum" label="箱数" align="center"></el-table-column>
            <el-table-column prop="salePrice" label="售价" align="center"></el-table-column>
            
            <!-- <el-table-column label="操作" width="130" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="checkDetail(scope.row.id, 'check')"
                        type="text"
                    >查看详情</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                :current-page="page.no"
                :page-size="page.size"
                :page-sizes="[5,10,20]"
                :total="page.total"
                layout="total, prev, pager, next, sizes, jumper"
                @size-change="handleSizeChange"
                @current-change="basePageChange"
            ></el-pagination>
        </div>
        
    </div>
</template>
<script>
import { 
    getGoods,
    getAttrList,
    addGoodsToContainer} from '@/api/index';
import dict from '@/components/common/dict.js'
import {cloneDeep} from 'lodash'

export default {
        name: 'GoodList',
        props: {
            id: ''
        },
        data() {
            return {
                page: {
                no: 1,
                total: 0,
                size: 10
                },
                tableData: [],
                selectedGoods: [],
                search: {
                    name: '',
                    size: [],
                    label: [],
                    color: [],
                    component: [],
                    skuStatus: '',
                },
                amountForm: {
                    caseNum: ''
                },
                getDict: null,
                soldStatus: [],
                sizeOptions: [],
                labelOptions: [],
                componentOptions: [],
            }
        },
        mounted() {
            this.getData()
            this.getOptions()
            this.soldStatus = dict.soldStatus
        },
        methods: {
            getData() {
                let obj = {
                    pageSize:  this.page.size,
                    page:  this.page.no,
                    // component: this.search.component,
                    // sizes: this.search.size,
                    // color: this.search.color,
                    // label: this.search.label,
                    // name: this.search.name,
                    // skuStatus: this.search.skuStatus
                    isSell: '',
                }
                getGoods(obj).then(res => {
                    this.tableData = res.records
                    this.page.total = res.total
                    this.page.no = res.current
                })
            },
            getOptions() {
                // 获取属性
                getAttrList().then(res => {
                    this.sizeOptions = res[1]
                    this.labelOptions = res[5]
                    this.componentOptions = res[2]
                })
            },
            // 
            selectionChange(item) {
                let arr = cloneDeep(item)
                arr.forEach(element => {
                    element.isTail = false
                    element.tailBox = 0
                    element.tailTotal = 0
                });
                this.selectedGoods = arr
            },

            addReady() {
                if (!this.selectedGoods.length) {
                    this.$message.warning('请先选择需要添加到货柜的单品')
                    return
                }
                this.$emit('addDialogShow', this.selectedGoods)
            },

            add(items) {
                let list = []
                for (let i = 0; i < items.length; i++) {
                    const element = items[i];
                    if (element.isTail == true) {
                        // 有尾箱要多加一条
                        list.push({
                            caseNum: element.tailBox,
                            goodsTotal: element.tailTotal,
                            skuId: element.skuId,
                            skuType: element.skuType,
                            isTail: 1,
                        })
                    }
                    list.push({
                        caseNum: element.caseNum,
                        goodsTotal: element.goodsTotal,
                        skuId: element.skuId,
                        skuType: element.skuType,
                        isTail: 0,
                    })
                }

                let data = {
                    id: this.id,// 货柜id
                    skuList: list
                }
                addGoodsToContainer(data).then(res => {
                    this.selectedGoods = []
                    this.$refs.multipleTable.clearSelection();
                    this.$message.success('添加成功')
                    this.$emit('addSuccess')
                })
            },
            // 分页导航
            basePageChange(val) {
                this.$set(this.page, 'no', val);
                this.getData();
            },
            // 每页数量改变
            handleSizeChange(val) {
                this.$set(this.page, 'size', val);
                this.$set(this.page, 'no', 1);
                this.getData();
            },
        }
    }
</script>
<style scoped lang="scss">
.handle-box {
    width: 100%;
    margin-bottom: 20px;

    .label {
        width: 50px;
        font-size: 12px;
        color: #1F1F21;
        margin-right: 18px;
    }
    
    .name-search {
        display: inline-block;
        width: 178px;
        margin-right: 36px;
    }

    .status,.time {
        display: inline-block;
        width: 150px;

        .el-select {
            display: inline-block;
            width: 90px;
        }
    }

    .new-btn {
        float: right;
        margin-left: 14px;
    }
}
.pagination {
    margin-top: 40px;
}


</style>