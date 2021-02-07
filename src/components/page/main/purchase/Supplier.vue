<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>采购</el-breadcrumb-item>
                <el-breadcrumb-item>供应商</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="handle-box">
                <el-button
                    type="primary"
                    @click="addReady"
                    >+供应商录入</el-button>
            </div>
            <div class="title">供应商</div>
            <el-table
                :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
                <el-table-column prop="effect" label="作用" align="center"></el-table-column>
                <el-table-column prop="supplierAddress" label="地址" align="center"></el-table-column>
                <el-table-column prop="supplierMobile" label="联系方式" align="center" width="120">
                    <template  slot-scope="scope">
                        {{scope.row.supplierMobile + ' ' + scope.row.supplierOther}}
                    </template>
                </el-table-column>
                <el-table-column prop="memorandum" label="备忘录" align="center"></el-table-column>
                
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            icon="el-icon-s-operation"
                            @click="checkDetail(scope.row)"
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
        :title="'供应商录入'" :visible.sync="baseDialogVisible" width="551px">
            <el-form ref="form" 
                :model="form" label-width="158px"
                :rules="rules"
            >
                <el-form-item label="供应商名称" prop="supplierName">
                    <el-input size="mini" class="form-input" v-model="form.supplierName" placeholder="请输入供应商名" maxlength="15" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="地址" prop="supplierAddress">
                    <el-input size="mini" class="form-input" v-model="form.supplierAddress" placeholder="请输入供应商地址" ></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="supplierMobile">
                    <el-input size="mini" class="form-input" v-model="form.supplierMobile" placeholder="请输入供应商电话" ></el-input>
                </el-form-item>

                <el-form-item label="其他联系方式" prop="supplierOther">
                    <el-input size="mini" class="form-input" v-model="form.supplierOther" placeholder="请输入" ></el-input>
                </el-form-item>

                <el-form-item label="备忘录" prop="memorandum">
                    <el-input size="mini" class="form-input" v-model="form.memorandum" placeholder="请输入" ></el-input>
                </el-form-item>

                <el-form-item label="支付款详情" prop="payDetail">
                    <el-input size="mini" class="form-input" v-model="form.payDetail" placeholder="请输入" ></el-input>
                </el-form-item>

                <el-form-item label="作用" prop="effect">
                    <el-input size="mini" class="form-input" v-model="form.effect" placeholder="请输入" ></el-input>
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
import { 
    addSupplier,
    delSupplier,
    getSupplier,
    getSupplierPage, } from '@/api/index';

export default {
    name: 'Supplier',
    data() {
        return {
            baseDialogVisible: false,
            flag: false,
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            tableData: [
            ],
            form: {
                supplierName: '',
                supplierAddress: '',
                supplierMobile: '',
                supplierOther: '',
                memorandum: '',
                payDetail: '',
                effect: '',
            },
            rules: {
                supplierName: [{ required: true, message: '请输入供应商名', trigger: 'change' }],
                supplierAddress: [{ required: true, message: '请输入供应商地址', trigger: 'change' }],
                supplierMobile: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
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
                supplierName: '',
                supplierAddress: '',
                supplierMobile: '',
                supplierOther: '',
                memorandum: '',
                payDetail: '',
                effect: '',
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
            getSupplierPage(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },
  
        // 保存编辑
        save() {
            let params = cloneDeep(this.form)
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (!this.flag) {return}
                    this.flag = false
                    // 校验通过
                    addSupplier(params).then(res => {
                        if (res) {
                            this.$message.success({message: '添加成功',});
                            this.baseDialogVisible = false
                            this.flag = true
                            this.getData()
                        }
                    })
                }
            })
        },

        checkDetail(data) {
            this.$router.push({name: 'supplierdetail', params: {data: data}})
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
    margin-bottom: 20px;
    float: right;
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
