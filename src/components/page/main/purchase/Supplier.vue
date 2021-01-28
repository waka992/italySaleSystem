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
                <el-table-column prop="name" label="供应商名称" align="center"></el-table-column>
                <el-table-column prop="use" label="作用" align="center"></el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
                <el-table-column prop="mobile" label="联系方式" align="center" width="120">
                    <template  slot-scope="scope">
                        {{scope.row.mobile + ' ' + scope.row.otherContact}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备忘录" align="center"></el-table-column>
                
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
        :title="'供应商录入'" :visible.sync="baseDialogVisible" width="551px">
            <el-form ref="form" 
                :model="form" label-width="158px"
                :rules="rules"
            >
                <el-form-item label="供应商名称" prop="name">
                    <el-input size="mini" class="form-input" v-model="form.name" placeholder="请输入供应商名" maxlength="15" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="地址" prop="address">
                    <el-input size="mini" class="form-input" v-model="form.address" placeholder="请输入供应商地址" ></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="mobile">
                    <el-input size="mini" class="form-input" v-model="form.mobile" placeholder="请输入供应商电话" ></el-input>
                </el-form-item>

                <el-form-item label="其他联系方式" prop="otherContact">
                    <el-input size="mini" class="form-input" v-model="form.otherContact" placeholder="请输入" ></el-input>
                </el-form-item>

                <el-form-item label="备忘录" prop="remark">
                    <el-input size="mini" class="form-input" v-model="form.remark" placeholder="请输入" ></el-input>
                </el-form-item>

                <el-form-item label="支付款详情" prop="payStatus">
                    <el-input size="mini" class="form-input" v-model="form.payStatus" placeholder="例如-1000" ></el-input>
                </el-form-item>

                <el-form-item label="作用" prop="use">
                    <el-input size="mini" class="form-input" v-model="form.use" placeholder="请输入" ></el-input>
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
    name: 'Supplier',
    data() {
        return {
            baseDialogVisible: false,
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            tableData: [
                {name: '广东沈外贸科技有限公司', use: '作用', address: '广州', mobile: 13577292902, remark: '已结清', id: 1},
                {name: '广东沈外贸科技有限公司', use: '作用', address: '广州', mobile: 13577292902, remark: '欠款，追账'},
                {name: '广东沈外贸科技有限公司', use: '作用', address: '广州', mobile: 13577292902, remark: '15号付款'},
                {name: '广东沈外贸科技有限公司', use: '作用', address: '广州', mobile: 13577292902, remark: '已结清'},
                {name: '广东沈外贸科技有限公司', use: '作用', address: '广州', mobile: 13577292902, remark: '已结清'},
                {name: '广东沈外贸科技有限公司', use: '作用', address: '广州', mobile: 13577292902, remark: '已结清'},
                {name: '广东沈外贸科技有限公司', use: '作用', address: '广州', mobile: 13577292902, remark: '已结清'},
                {name: '广东沈外贸科技有限公司', use: '作用', address: '广州', mobile: 13577292902, remark: '已结清'},
                {name: '广东沈外贸科技有限公司', use: '作用', address: '广州', mobile: 13577292902, remark: '已结清'},
            ],
            form: {
                name: '',
                address: '',
                mobile: '',
                otherContact: '',
                remark: '',
                payStatus: '',
                use: '',
            },
            rules: {
                name: [{ required: true, message: '请输入供应商名', trigger: 'change' }],
                address: [{ required: true, message: '请输入供应商地址', trigger: 'change' }],
                mobile: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
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
                address: '',
                mobile: '',
                otherContact: '',
                remark: '',
                payStatus: '',
                use: '',
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
            this.$router.push({name: 'supplierdetail', params: {id: id}})
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
