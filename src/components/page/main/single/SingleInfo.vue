<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>单品</el-breadcrumb-item>
                <el-breadcrumb-item>入库信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
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

                <el-button
                    class="new-btn"
                    type="primary"
                    @click="addReady"
                    >添加单品</el-button>

                <!-- <el-button
                    class="new-btn"
                    @click="checkHot"
                    plain
                >查看热销商品</el-button> -->
            </div>
            <el-table
                :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
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
                <el-table-column prop="price" label="总销售箱/件" align="center" v-if="false">

                </el-table-column>
                
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button
                            @click="checkDetail(scope.row.id, 'edit')"
                            type="text"
                        >编辑</el-button> -->
                        <el-button
                            @click="checkDetail(scope.row.id, 'check')"
                            type="text"
                        >查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="page.no"
                    :page-sizes="[5,10,20]"
                    :page-size="page.size"
                    :total="page.total"
                    layout="total, prev, pager, next, sizes, jumper"
                    @size-change="handleSizeChange"
                    @current-change="basePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import qs from 'qs'
import { 
    getGoods,
    getAttrList,} from '@/api/index';
import dict from '@/components/common/dict.js'

export default {
    name: 'SingleInfo',
    data() {
        return {
            status: 0,
            search: {
                name: '',
                size: [],
                label: [],
                color: [],
                component: [],
                skuStatus: 1,
            },
            getDict: null,
            soldStatus: [],
            sizeOptions: [],
            labelOptions: [],
            componentOptions: [],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            tableData: [],
            form: {
                name: '',
                season: '',
                transporter: '',
                containerType: '',
                fund: '',
                arriveTime: '',
                sellTime: '',
            },
            rules: {
                name: [{ required: true, message: '请输入', trigger: 'change' }],
                season: [{ required: true, message: '请选择', trigger: 'change' }],
                transporter: [{ required: true, message: '请选择', trigger: 'change' }],
            }
        };
    },
    created() {
        this.getDict = dict.getDict // 获取字典
        this.soldStatus = dict.soldStatus
        this.getData();
        this.getOptions()
    },
    methods: {
        // 置空数据
        resetData() {
            this.form = {
                name: '',
                season: '',
                transporter: '',
                containerType: '',
                fund: '',
                arriveTime: '',
                sellTime: '',
            }
        },

        // 增准备
        addReady() {
            this.$router.push({name: 'iteminfonew', params: {todo: 'new'}})
        },
        checkHot() {},

        // 查
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                component: this.search.component,
                sizes: this.search.size,
                color: this.search.color,
                label: this.search.label,
                name: this.search.name,
                isSell: '',
                skuStatus: this.search.skuStatus
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
       

        checkDetail(id, todo) {
            this.$router.push({name: 'iteminfonew', params: {id: id, todo: todo}})
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
};
</script>

<style lang="scss" scoped>

.box {
    position: relative;
    padding: 12px;
    margin: 0 23px;
    background-color: #fff;
}

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
        width: 160px;

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

.title {
    position: absolute;
    top: 22px;
    left: 28px;
    font-size: 16px;
    color: #303133;
    font-weight: 500;
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
    width: 284px;
}
</style>
