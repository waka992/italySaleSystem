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
                <el-input class="name-search" size="mini" suffix-icon="el-icon-search" placeholder="输入关键词"></el-input>
                <div class="status">
                    <span class="label">尺码</span>
                    <el-select size="mini" v-model="status" placeholder="请选择">
                        <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="status">
                    <span class="label">特色</span>
                    <el-select size="mini" v-model="status" placeholder="请选择">
                        <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="status">
                    <span class="label">面料</span>
                    <el-select size="mini" v-model="status" placeholder="请选择">
                        <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>

                <el-button
                    class="new-btn"
                    type="primary"
                    @click="addReady"
                    >添加单品</el-button>

                <el-button
                    class="new-btn"
                    @click="checkHot"
                    plain
                >查看热销商品</el-button>
            </div>
            <el-table
                :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="type" label="型号" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="characteristic" label="特色" align="center"></el-table-column>
                <el-table-column prop="material" label="面料" align="center"></el-table-column>
                <el-table-column prop="size" label="尺码" align="center"></el-table-column>
                <el-table-column prop="color" label="颜色" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="120">
                    <template  slot-scope="scope">
                        {{scope.row.status == 1 ? '有货' : '售罄'}}
                    </template>
                </el-table-column>
                <el-table-column prop="boxes" label="箱数" align="center"></el-table-column>
                <el-table-column prop="price" label="售价" align="center"></el-table-column>
                
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            @click="checkDetail(scope.row.id, 'edit')"
                            type="text"
                        >编辑</el-button>
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

export default {
    name: 'ContainerInfo',
    data() {
        return {
            status: 0,
            statusOptions: [
                {label: '全部', value: 0},
                {label: '已到货', value: 1},
                {label: '即将到货', value: 2},
            ],
            seasonOptions: [
                {label: '2021春', value: 0},
                {label: '2021秋', value: 1},
            ],
            transporterOptions: [
                {label: '德邦物流', value: 0},
                {label: '顺丰物流', value: 1},
                {label: 'UPS', value: 2},
            ],
            containerTypeOptions: [
                {label: '海运', value: 0},
                {label: '陆运', value: 1},
                {label: '空运', value: 2},
            ],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            tableData: [
                {type: 'H105', name: '提臀运动裤', characteristic: '进口', material: '棉', size: 'L', color: '白色', status: 1, boxes: 1, price: 100},
            ],
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
        this.getData();
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
            this.$router.push({name: 'singleinfonew', params: {}})
        },
        checkHot() {

        },

        // 查
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
            }
            // shopContractList(obj).then(res => {
            //     this.tableData = res.records
            //     this.page.total = res.total
            //     this.page.no = res.current
            // })
        },

        checkDetail(id, todo) {
            this.$router.push({name: 'singleinfonedit', params: {id: id, todo: todo}})
        },

        // 分页导航
        basePageChange(val) {
            this.$set(this.page, 'no', val);
            this.getData();
        },
        // 每页数量改变
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
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
        width: 180px;

        .el-select {
            display: inline-block;
            width: 80px;
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
