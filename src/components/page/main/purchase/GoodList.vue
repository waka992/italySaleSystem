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
                :total="page.total"
                layout="total, prev, pager, next, sizes, jumper"
                @size-change="handleSizeChange"
                @current-change="basePageChange"
            ></el-pagination>
        </div>
        <el-dialog
            style="zIndex: 9999;"
            :close-on-click-modal='false'
            :show-close="false"
            append-to-body
            :title="'数量设置'" :visible.sync="baseDialogVisible" width="480px">
                <el-form class="amount-form" ref="form" label-width="90px" :inline="true" 
                label-position="left"
                v-for="(good, i) in selectedGoods" :key="i">
                    <el-col>
                        <span class="add-form-title">型号：{{good.specification}}</span>
                    </el-col>
                    <el-col>
                        <el-form-item label="总数量">
                            <el-input class="small-input" v-model="good.caseNum" placeholder="箱数">
                                <template slot="append">箱</template>
                            </el-input>
                            X
                            <el-input class="mid-input" v-model="good.goodsTotal" placeholder="每箱件数">
                                <template slot="append">件</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item v-if="good.isTail == true" label="尾箱数">
                            <el-input class="small-input" v-model="good.tailBox" placeholder="箱数">
                                <template slot="append">箱</template>
                            </el-input>
                            X
                            <el-input class="mid-input" v-model="good.tailTotal" placeholder="每箱件数">
                                <template slot="append">件</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="单品类型">
                            <el-select v-model="good.skuType" placeholder="请选择">
                                <el-option label="入货" :value="0"></el-option>
                                <el-option label="加单" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="是否有尾箱">
                            <el-checkbox v-model="good.isTail" @change="val => {isTailChange(val,i)}"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button class="curr-btn" plain @click="baseDialogVisible = false">完成</el-button>
                    <el-button class="curr-btn" plain @click="add">添加</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
import { 
    getGoods,
    getAttrList,
    addGoodsToContainer} from '@/api/index';
import dict from '@/components/common/dict.js'

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
                baseDialogVisible: true
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
                item.forEach(element => {
                    element.isTail = false
                    element.tailBox = 0
                    element.tailTotal = 0
                });
                this.selectedGoods = item
            },

            addReady() {
                if (!this.selectedGoods.length) {
                    this.$message.warning('请先选择需要添加到货柜的单品')
                    return
                }
                this.baseDialogVisible = true
            },
            isTailChange(val, i) {
                this.$set(this.selectedGoods[i], 'isTail', val)
                this.$forceUpdate()
            },
            add() {
                let list = []
                for (let i = 0; i < this.selectedGoods.length; i++) {
                    const element = this.selectedGoods[i];
                    if (element.isTail == true) {
                        // 有尾箱要多加一条
                        list.push({
                            caseNum: element.tailBox,
                            goodsTotal: element.tailTotal,
                            skuId: element.skuId,
                            skuType: element.skuType,
                            isTail: true,
                        })
                    }
                    list.push({
                        caseNum: element.caseNum,
                        goodsTotal: element.goodsTotal,
                        skuId: element.skuId,
                        skuType: element.skuType,
                        isTail: false,
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
.amount-form  {
    ::v-deep .el-input {
        width: 150px;
    }

    ::v-deep .el-input__inner {
        padding: 5px;
    }

    ::v-deep .el-input-group__append{
        padding: 5px;
        background: #fff;
        border-left: none;
    }

    .small-input {
        width: 66px !important;
    }
    .mid-input {
        width: 96px !important;
    }
}
.add-form-title {
    color: $theme-color;
    display: inline-block;
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 12px;
}
</style>