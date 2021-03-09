<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>采购</el-breadcrumb-item>
                <el-breadcrumb-item>运输公司</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="handle-box">
                <el-button
                    type="primary"
                    @click="addReady"
                    >+运输公司录入</el-button>
            </div>
            <div class="title">运输公司</div>
            <el-table
                :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="transporterName" label="运输方名称" align="center"></el-table-column>
                <el-table-column prop="containerName" label="货柜名称" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                     <template slot-scope="scope">
                        {{scope.row.status == 1 ? '运输完成' : '运输中'}}
                    </template>
                </el-table-column>
                <el-table-column prop="estimate" label="货柜日期" align="center" width="120"></el-table-column>
                <el-table-column prop="transporterMobile" label="电话" align="center"></el-table-column>
                <el-table-column prop="transporterAddress" label="地址" align="center"></el-table-column>
                
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
                    :page-sizes="[5,10,20]"
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
        :title="'运输公司录入'" :visible.sync="baseDialogVisible" width="551px">
            <el-form ref="form" 
                :model="form" label-width="158px"
                :rules="rules"
            >
                <el-form-item label="名称" prop="transporterName">
                    <el-input size="mini" class="form-input" v-model="form.transporterName" placeholder="请输入供应商名" maxlength="15" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="地址" prop="transporterAddress">
                    <el-input size="mini" class="form-input" v-model="form.transporterAddress" placeholder="请输入供应商地址" ></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="transporterMobile">
                    <el-input size="mini" class="form-input" v-model="form.transporterMobile" placeholder="请输入供应商电话" ></el-input>
                </el-form-item>

                <el-form-item label="其他联系方式" prop="transporterOther">
                    <el-input size="mini" class="form-input" v-model="form.transporterOther" placeholder="请输入" ></el-input>
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
import {
    addOrUpdateTransporter,
    delTransporter,
    getAllTransporter,
    getTransporterPage,
} from '@/api/index';

export default {
    name: 'TransitCompany',
    data() {
        return {
            baseDialogVisible: false,
            flag: true,
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            tableData: [],
            form: {},
            rules: {
                transporterName: [{ required: true, message: '请输入供应商名', trigger: 'change' }],
                transporterAddress: [{ required: true, message: '请输入供应商地址', trigger: 'change' }],
                transporterMobile: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
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
                transporterName: '',
                transporterAddress: '',
                transporterMobile: '',
                transporterOther: '',
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
            getTransporterPage(obj).then(res => {
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
                    addOrUpdateTransporter(params).then(res => {
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
            this.$router.push({name: 'transitcompanydetail', params: {data: data}})
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
