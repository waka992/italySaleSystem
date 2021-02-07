<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>销售</el-breadcrumb-item>
                <el-breadcrumb-item>销售统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="handle-box">
                <el-input class="name-search" size="mini" suffix-icon="el-icon-search" placeholder="输入运输商名称等"></el-input>
                <div class="status">
                    <span class="label">货柜状态</span>
                    <el-select size="mini" v-model="status" placeholder="请选择">
                        <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>

                <div class="time">
                    <span class="label">时间</span>
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
                    >+新建货柜</el-button>
            </div>
            <el-table
                :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="货柜名称" align="center"></el-table-column>
                <el-table-column prop="time" label="出货时间" align="center"></el-table-column>
                <el-table-column prop="transporter" label="运输商" align="center"></el-table-column>
                <el-table-column prop="pics" label="箱数" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="120">
                    <template  slot-scope="scope">
                        {{scope.row.status == 1 ? '已到货' : '即将到货'}}
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            icon="el-icon-s-operation"
                            @click="checkDetail(scope.row.id)"
                            type="primary"
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

        <!-- 编辑弹出框 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'新建货柜'" :visible.sync="baseDialogVisible" width="551px">
            <el-form ref="form" 
                :model="form" label-width="158px"
                :rules="rules"
            >
                <el-form-item label="货柜名称" prop="name">
                    <el-input size="mini" class="form-input" v-model="form.name" placeholder="请输入供应商名" maxlength="15" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="季度" prop="season">
                    <el-select class="form-input" size="mini" v-model="form.season" placeholder="请选择">
                        <el-option
                        v-for="item in seasonOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="运输商" prop="transporter">
                    <el-select class="form-input" size="mini" v-model="form.transporter" placeholder="请选择">
                        <el-option
                        v-for="item in transporterOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="货柜类型" prop="containerType">
                        
                    <el-select class="form-input" size="mini" v-model="form.containerType" placeholder="请选择">
                        <el-option
                        v-for="item in containerTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="货柜费用" prop="fund">
                    <el-input size="mini" class="form-input" v-model="form.fund" placeholder="请输入" ></el-input>
                </el-form-item>

                <el-form-item label="预计到货日期" prop="arriveTime">
                    <el-date-picker
                        class="form-input"
                        v-model="form.arriveTime"
                        type="date"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="出货日期" prop="sellTime">
                    <el-date-picker
                        class="form-input"
                        v-model="form.sellTime"
                        type="date"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="baseDialogVisible = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="save">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import qs from 'qs'

export default {
    name: 'ContainerInfo',
    data() {
        return {
            baseDialogVisible: false,
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
                {name: '广东沈外贸科技有限公司', time: '2020-11-16 14:45', transporter: '德邦物流', pics: 5, status: '1', id: 1},
                {name: '广东沈外贸科技有限公司', time: '2020-11-16 14:45', transporter: '德邦物流2', pics: 5, status: '1', id: 1},
                {name: '广东沈外贸科技有限公司', time: '2020-11-16 14:45', transporter: '德邦物流', pics: 5, status: '1', id: 1},
                {name: '广东沈外贸科技有限公司', time: '2020-11-16 14:45', transporter: '德邦物流', pics: 5, status: '1', id: 1},
                {name: '广东沈外贸科技有限公司', time: '2020-11-16 14:45', transporter: '德邦物流', pics: 5, status: '1', id: 1},
                {name: '广东沈外贸科技有限公司', time: '2020-11-16 14:45', transporter: '德邦物流', pics: 5, status: '1', id: 1},
                {name: '广东沈外贸科技有限公司', time: '2020-11-16 14:45', transporter: '德邦物流', pics: 5, status: '1', id: 1},
                {name: '广东沈外贸科技有限公司', time: '2020-11-16 14:45', transporter: '德邦物流', pics: 5, status: '1', id: 1},
                {name: '广东沈外贸科技有限公司', time: '2020-11-16 14:45', transporter: '德邦物流', pics: 5, status: '1', id: 1},
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
            this.resetData()
            this.baseDialogVisible = true;
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

  
        // 保存编辑
        save() {
            let params = cloneDeep(this.form)
            this.$refs.form.validate(valid => {
                console.log(valid);
                if (valid) {
                    // 校验通过
                    // userUpdate(params).then(res => {
                    //     if (res) {
                    //         this.$message.success({message: '添加成功',});
                    //         this.dialogVisible = false
                    //         this.getData()
                    //     }
                    // })
                }
            })
        },

        checkDetail(id) {
            this.$router.push({name: 'containerinfodetail', params: {id: id}})
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
        width: 230px;

        .el-select {
            display: inline-block;
            width: 142px;
        }
    }

    .new-btn {
        float: right;
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
