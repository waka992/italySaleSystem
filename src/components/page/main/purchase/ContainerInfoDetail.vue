<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>采购</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name: 'containerinfo'}">货柜信息</el-breadcrumb-item>
                <el-breadcrumb-item>详情</el-breadcrumb-item>
            </el-breadcrumb>
            <el-popover
                popper-class="del-confirm"
                placement="bottom"
                width="210"
                v-model="delVisible">
                <div class="del-word">是否确定到货</div>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="delVisible = false">取消</el-button>
                    <el-button class="del-btn2" size="mini" @click="arriveConfirm">确定</el-button>
                </div>
                <el-button v-show="comInfo.contaninerType == 1" class="del-btn2 outer" slot="reference">确定到货</el-button>
            </el-popover>
        </div>
        <div class="box" id="containerInfoDetail">
            
            <div class="detail-card">
                <div class="title">{{comInfo.container}}</div>
                <div class="handle-box">
                    <!-- <el-button
                        icon="el-icon-edit"
                        type="primary"
                        size="mini"
                        @click="editReady"
                        >编辑</el-button> -->
                </div>
                <el-row class="detail-row">
                    <el-col :span="6">
                        <span class="detail-label">运输商：</span>
                        <span class="detail-content">{{comInfo.transpoterName}}</span>
                    </el-col>
                    <el-col :span="5">
                        <span class="detail-label">货柜类型：</span>
                        <span class="detail-content">{{getDict(comInfo.transpoterType, 'transportType')}}</span>
                    </el-col>
                    <el-col :span="5">
                        <span class="detail-label">货柜费用：</span>
                        <span class="detail-content">{{comInfo.cost}}</span>
                    </el-col>
                    <el-col :span="4">
                        <span class="detail-label">总件数：</span>
                        <span class="detail-content">{{comInfo.goodsTotal}}</span>
                    </el-col>
                    <el-col :span="4">
                        <span class="detail-label">总箱数：</span>
                        <span class="detail-content">{{comInfo.caseNum}}</span>
                    </el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="6">
                        <span class="detail-label">出货日期：</span>
                        <span class="detail-content">{{timeFormat(comInfo.startTime)}}</span>
                    </el-col>
                    <el-col :span="5">
                        <span class="detail-label">到货日期：</span>
                        <span class="detail-content">{{timeFormat(comInfo.estimate)}}</span>
                    </el-col>
                    <el-col :span="5">
                        <span class="detail-label">货物总金额：</span>
                        <span class="detail-content">{{comInfo.goodsCost}}</span>
                    </el-col>
                    <el-col :span="4">
                        <span class="detail-label">平均运费：</span>
                        <span class="detail-content">{{comInfo.averageCost}}</span>
                    </el-col>
                </el-row>
            </div>

            <div class="record-card">
                <div class="top">
                    <div class="title">货柜单品</div>
                    <!-- <el-button class="add-goods" slot="reference" @click="addGoods">添加单品</el-button> -->
                    <!-- <div class="search">
                        <el-input size="mini" suffix-icon="el-icon-search" placeholder="输入关键词"></el-input>
                    </div> -->
                    
                </div>
                <el-table
                    :data="tableData"
                    stripe
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                >
                    <el-table-column prop="name" label="商品名称"  align="center"></el-table-column>
                    <el-table-column prop="specification" label="型号" align="center"></el-table-column>
                    <el-table-column prop="label" label="特色" align="center"></el-table-column>
                    <!-- <el-table-column prop="value" label="装数" align="center"></el-table-column> -->
                    <el-table-column prop="caseNum" label="箱数" align="center">
                        <template slot-scope="scope">
                            {{scope.row.caseNum + (scope.row.isTail == '1' ? '（尾箱）' : '')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsTotal" label="件数" align="center"></el-table-column>
                    <el-table-column label="金额" align="center">
                        <template slot-scope="scope">
                            {{scope.row.caseNum * scope.row.costPrice * scope.row.goodsTotal}}
                        </template>
                    </el-table-column>
                    <el-table-column label="是否尾箱" align="center">
                        <template slot-scope="scope">
                            {{scope.row.isTail == 0 ? '否' : scope.row.isTail == 1 ? '是' : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button
                                @click="delTransRecord(scope.row.id)"
                                type="text"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <div class="pagination">
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
                </div> -->
            </div>
           
            <el-dialog
                class="custom-dialog"
                :close-on-click-modal='false'
                :show-close="false"
                :title="'单品列表'" :visible.sync="baseDialogVisible" width="980px">
                    <good-list ref="goodList" :id="id" @addSuccess="addContainerSuccess" @addDialogShow="addDialogShow"></good-list>
                    <span slot="footer" class="dialog-footer">
                        <el-button class="curr-btn" plain @click="baseDialogVisible = false">完成</el-button>
                    </span>
            </el-dialog>

            <el-dialog
            :close-on-click-modal='false'
            :show-close="false"
            append-to-body
            :title="'数量设置'" :visible.sync="addDialogVisible" width="480px">
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
                    <el-button class="curr-btn" plain @click="addDialogVisible = false">完成</el-button>
                    <el-button class="curr-btn" plain @click="addToContainer">添加</el-button>
                </span>
        </el-dialog>
        </div>
        <div class="operate">
            <el-button plain @click="back">返回</el-button>
            <el-button type="primary" @click="downPdf">生成pdf</el-button>
        </div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
  
import GoodList from './GoodList'
import { 
    addOrUpdateContainer,
    confirmArrival,
    delContainer,
    getContainerPage,
    delTransportRecord,
    containerDetail,
    } from '@/api/index';
import dict from '@/components/common/dict.js'
import pdfservice from '@/utils/getpdf.js'

export default {
    name: 'ContainerInfoDetail',
    components: {
        GoodList
    },
    data() {
        return {
            delVisible: false,
            baseDialogVisible: false,
            addDialogVisible: false,
            selectedGoods: [],
            id: '',
            page: {
                no: 1,
                total: 0,
                size: 10
            },
            // 展示用
            comInfo: {},
            // 支出收入列表
            tableData: [],
            
        };
    },
    created() {
        this.getDict = dict.getDict
        let data = this.$route.params.data
        this.id = data.id
        this.getData()
    },
    methods: {
        arriveConfirm() {
            let obj = {
                id: this.id
            }
            confirmArrival(obj).then(res => {
                this.$message.success('操作成功')
                this.delVisible = false
                this.getData()
                // this.$router.push({name: 'containerinfo'})
            })
        },

        // 查
        getData() {
            let obj = {
                id: this.id
            }
            containerDetail(obj).then(res => {
                let {
                    container,
                    transpoterName,
                    transpoterType,
                    cost,
                    goodsTotal,
                    goodsCost,
                    caseNum,
                    startTime,
                    estimate,
                    averageCost,
                    details,
                    contaninerType,
                } = res
                this.comInfo = {
                    container: container,
                    transpoterName: transpoterName,
                    transpoterType: transpoterType,
                    cost: cost,
                    goodsTotal: goodsTotal,
                    goodsCost: goodsCost,
                    caseNum: caseNum,
                    startTime: startTime,
                    estimate: estimate,
                    averageCost: averageCost,
                    contaninerType: contaninerType,
                }
                this.tableData = details
            })
        },
        back() {
            this.$router.push({name: 'containerinfo', params: {}})
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
        timeFormat(time) {
            if (!time) {return ''}

            return this.$moment(time).format('YYYY-MM-DD')
        },
        addGoods() {
            this.baseDialogVisible = true
        },
        // 编辑具体单品数量的dialog
        addDialogShow(data) {
            this.addDialogVisible = true
            this.selectedGoods = data
        },
        isTailChange(val, i) {
            this.$set(this.selectedGoods[i], 'isTail', val)
            this.$forceUpdate()
        },
        addToContainer() {
            let data = cloneDeep(this.selectedGoods)
            this.$refs.goodList.add(data)
        },
        addContainerSuccess() {
            this.getData()
            this.addDialogVisible = false
        },
        downPdf() {
            pdfservice('#containerInfoDetail', '货柜详情')
        },
        delTransRecord(id) {
            this.$confirm('确认删除当前单品？').then(_ => {
                delTransportRecord({id: id}).then(res => {
                    this.$message.success({message: '删除成功',});
                    this.getData()
                })
            })
            .catch(_ => {});
        }
    }
};
</script>

<style lang="scss" scoped>
.crumbs {
    position: relative;
    width: 100%;
    height: 64px;
    box-sizing: border-box;
    padding: 25px;
    margin: 0 !important;
}

.box {
    margin: 0 23px;
    background-color: transparent;
}

.detail-card {
    position: relative;
    width: 100%;
    padding: 12px;
    background-color: #fff;
    font-size: 12px;
    padding: 72px 0 20px 0;
    margin-bottom: 18px;
    border-radius: 2px;


    .title {
        position: absolute;
        font-size: 20px;
        color: #333;
        top: 24px;
        left: 23px;
        font-weight: 500;
    }

    .detail-row {
        margin-bottom: 18px;
    }

    .detail-label {
        display: inline-block;
        color:  #999;
        width: 90px;
        text-align: right;
    }

    .detail-content {
        display: inline-block;
    }
}

.record-card  {
    position: relative;
    padding: 12px;
    background-color: #fff;
    border-radius: 2px;
    
    .title {
        display: inline-block;
        font-size: 20px;
        margin-left: 12px;
        color: #333;
        font-weight: 500;
    }

    .add-goods {
        position: absolute;
        right: 12px;
        top: 10px;

        @include primarybtn;
    }

    .search {
        position: absolute;
        left: 90px;
        display: inline-block;
        width: 240px;
        height: 27px;
    }

    .top {
        height: 39px;
    }

    

    .red {
        color: #FC5634;
    }

    .green {
        color: #33C179;
    }
}
.operate {
        background-color: #fff;
        padding: 50px 0;
        margin: 0 23px;
        text-align: center;

        .el-button  {
            width: 89px;
        }
}
.handle-box {
    position: absolute;
    right: 12px;
    top: 12px;
}

.pagination {
    margin-top: 40px;
}

.table {
    width: 100%;
    font-size: 11px;
}

.mr10 {
    margin-right: 10px;
}
.el-dialog__header {
    padding: 30px 48px !important;
}
.dialog-footer {
    display: inline-block;
    text-align: center;
    width: 100%;
}
.curr-btn {
    width: 75px;
}
.form-input {
    width: 220px;
}

// 删除弹窗
.el-popover.del-confirm {
    width: 249px !important;
    height: 136px !important;
    color: #fff;
    background: #2183EA;
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.3);
}

.del-word {
    margin: 20px 9px 12px;
    font-size: 11px;
    color: #909399;
}

.del-btn1, .del-btn2 {
    width: 70px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 3px;
    font-size: 11px;
}
.del-btn1 {
    border: 1px solid #C4C9D3;
    color: #1F1F21;
}
.del-btn2 {
    border: 1px solid #2183EA;
    background: #2183EA;
    color: #fff;

    &.outer {
        width: 100px;
        position: absolute;
        top: 16px;
        right: 23px;
    }
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
