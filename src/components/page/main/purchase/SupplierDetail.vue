<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>采购</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name: 'supplier'}">供应商</el-breadcrumb-item>
                <el-breadcrumb-item>供应商详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            
            <div class="detail-card">
                <div class="title">供应商详情</div>
                <div class="handle-box">
                    <el-button
                        icon="el-icon-edit"
                        type="primary"
                        size="mini"
                        @click="editReady"
                        >编辑</el-button>
                        <el-button
                        icon="el-icon-delete"
                        type="danger"
                        size="mini"
                        @click="deleteSupplier"
                        >删除</el-button>
                </div>
                <el-row class="detail-row">
                    <el-col :span="6">
                        <span class="detail-label">名称：</span>
                        <span class="detail-content">{{comInfo.supplierName}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">地址：</span>
                        <span class="detail-content">{{comInfo.supplierAddress}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">电话：</span>
                        <span class="detail-content">{{comInfo.supplierMobile}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">其他联系方式：</span>
                        <span class="detail-content">{{comInfo.supplierOther}}</span>
                    </el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="6">
                        <span class="detail-label">备忘：</span>
                        <span class="detail-content">{{comInfo.memorandum}}</span>
                    </el-col>
                    <!-- <el-col :span="6">
                        <span class="detail-label">支付款详情：</span>
                        <span class="detail-content">{{comInfo.payDetail}}</span>
                    </el-col> -->
                    <el-col :span="6">
                        <span class="detail-label">作用：</span>
                        <span class="detail-content">{{comInfo.effect}}</span>
                    </el-col>
                </el-row>
            </div>

            <div class="record-card">
                <div class="top">
                    <div class="title">查询</div>
                    
                    <div class="handle-box">
                        <el-button
                            size="mini"
                            icon="el-icon-edit"
                            type="primary"
                            @click="addIncomeReady"
                            >新增付款</el-button>
                    </div>
                </div>
                <div class="pay-record">
                    <div class="topic">付款记录</div>
                    <div class="search">
                            <el-date-picker
                                :picker-options='pickerOptions'
                                v-model="date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    <el-button class="search-btn" size="mini" icon="el-icon-search" @click="getData"></el-button>
                    <el-table
                        :data="tableData"
                        stripe
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="supplierName" label="供应商名称"  align="center"></el-table-column>
                        <el-table-column prop="createTime" label="日期" align="center">
                            <template slot-scope="scope">
                                {{timeFormat(scope.row.createTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="money" label="支付金额" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="支付名" align="center"></el-table-column>
                        <!-- <el-table-column prop="payType" label="支付方式" align="center"></el-table-column> -->
                        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <span style="color:red;cursor:pointer;" @click="delPay(scope.row.id)">删除</span>
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
                <div class="operation-record">
                    <div class="topic">合作记录</div>
                    <div class="search">
                        <el-select size="mini" v-model="cooperationSeason" placeholder="请选择" clearable>
                            <el-option
                            v-for="item in seasonOptions"
                            :key="item.configValue"
                            :label="item.configValue"
                            :value="item.configValue">
                            </el-option>
                        </el-select>
                        </div>
                    <el-button class="search-btn" size="mini" icon="el-icon-search" @click="getCooperationRecord"></el-button>
                    <el-table
                        :data="cooperationTableData"
                        stripe
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="quarter" label="季度"  align="center"></el-table-column>
                        <el-table-column prop="caseNum" label="总箱数" align="center">
                        </el-table-column>
                        <el-table-column prop="total" label="总件数" align="center"></el-table-column>
                        <el-table-column prop="price" label="金额" align="center"></el-table-column>
                        <!-- <el-table-column prop="payType" label="支付方式" align="center"></el-table-column> -->
                    </el-table>
                    <!-- <div class="pagination">
                        <el-pagination
                            background
                            :current-page="coopPage.no"
                            :page-size="coopPage.size"
                            :total="coopPage.total"
                        :page-sizes="[5,10,20]"
                            layout="total, prev, pager, next, sizes, jumper"
                            @size-change="handleCoopSizeChange"
                            @current-change="coopPageChange"
                        ></el-pagination>
                    </div> -->
                </div>

                <div class="operation-record">
                    <div class="topic">报损总汇</div>
                    <div class="search">
                        <el-button size="mini" @click="cleanDefect">清零</el-button>
                    </div>
                    <el-table
                        :data="defectTableData"
                        stripe
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="totals" label="件数"  align="center"></el-table-column>
                        <el-table-column prop="sum" label="报损金额"  align="center"></el-table-column>
                        
                    </el-table>
                </div>
                <!-- <div class="operate">
                    <el-button plain @click="back">返回</el-button>
                    <el-button type="primary">生成pdf</el-button>
                </div> -->
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'编辑供应商信息'" :visible.sync="baseDialogVisible" width="551px">
           
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
<!-- 
                <el-form-item label="支付款详情" prop="payDetail">
                    <el-input size="mini" class="form-input" v-model="form.payDetail" placeholder="例如-1000" ></el-input>
                </el-form-item> -->

                <el-form-item label="作用" prop="effect">
                    <el-input size="mini" class="form-input" v-model="form.effect" placeholder="请输入" ></el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="baseDialogVisible = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="save">保存</el-button>
            </span>
        </el-dialog>

        <!-- 支出收入 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'新增记录'" :visible.sync="incomeDialogVisible" width="551px">
            <el-form ref="incomeform" 
                :model="incomeform" label-width="178px"
                :rules="incomerules"
            >
                <el-form-item label="日期" prop="createTime">
                    <el-date-picker
                        v-model="incomeform.createTime"
                        type="date"
                        placeholder="选择今日日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="支付金额" prop="money">
                    <el-input size="mini" class="form-input" v-model="incomeform.money" placeholder="请输入" ></el-input>
                </el-form-item>
                <el-form-item label="支付名" prop="status">
                    <el-input size="mini" class="form-input" v-model="incomeform.companyName" placeholder="请输入" ></el-input>
                </el-form-item>
                <el-form-item label="支付方式" prop="payType">
                    <el-select v-model="incomeform.payType" size="mini" class="form-input" placeholder="请选择" >
                        <el-option v-for="(type,i) in dict.accountType" :value="type.value" :label="type.label" :key="i">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input size="mini" class="form-input" v-model="incomeform.remark" placeholder="请输入备注内容" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="incomeDialogVisible = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="saveIncome">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import dict from '@/components/common/dict.js';
  
import { 
    addSupplier,
    delSupplier,
    getSupplierPayPage,
    addSupplierPay,
    delSupplierPay,
    getSupplierGoods,
    getTitle,
    defectSum,
    defectClean, } from '@/api/index';

export default {
    name: 'SupplierDetail',
    data() {
        return {
            date: '',
            dict: {},
            seasonOptions: [],
            cooperationSeason: '',
            baseDialogVisible: false,
            incomeDialogVisible: false,
            page: {
                no: 1,
                total: 0,
                size: 10
            },
            coopPage: {
                no: 1,
                total: 0,
                size: 10
            },
            // 展示用
            comInfo: {
                id: '',
                supplierName: '',
                supplierAddress: '',
                supplierMobile: '',
                supplierOther: '',
                memorandum: '',
                payDetail: '',
                effect: '',
            },
            // 支出收入列表
            tableData: [],
            defectTableData: [],
            cooperationTableData: [],
            // 修改用
            form: {
                name: '',
                address: '',
                mobile: '',
                otherContact: '',
                remark: '',
                payStatus: '',
                use: '',
            },
            incomeform: {},
            rules: {
                supplierName: [{ required: true, message: '请输入供应商名', trigger: 'change' }],
                supplierAddress: [{ required: true, message: '请输入供应商地址', trigger: 'change' }],
                supplierMobile: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
            },
            incomerules: {
                name: [{ required: true, message: '请输入客户名', trigger: 'change' }],
                createTime: [{ required: true, message: '请选择日期', trigger: 'change' }],
                money: [{ required: true, message: '请输入', trigger: 'change' }],
            },
            pickerOptions: {
                disabledDate(time){
                    return time.getTime() > Date.now()   //如果当天可选，就不用减8.64e7
                }
            }
        };
    },
    created() {
        let data = this.$route.params.data
        this.comInfo = {
            id: data.id,
            supplierName: data.supplierName,
            supplierAddress: data.supplierAddress,
            supplierMobile: data.supplierMobile,
            supplierOther: data.supplierOther,
            memorandum: data.memorandum,
            payDetail: data.payDetail,
            effect: data.effect,
        }
    },
    mounted() {
        this.dict = dict
        this.getSeason()
        this.getData()
        this.getDefectData() // 报损总汇
        this.getCooperationRecord()
    },
    methods: {
        editReady() {
            this.form = cloneDeep(this.comInfo)
            this.baseDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },

        deleteSupplier() {
            let id = this.$route.params.data.id
            this.$confirm('确认删除当前运输公司？').then(_ => {
                    delSupplier({id: id}).then(res => {
                        this.$message.success({message: '删除成功',});
                        this.back()
                    })
                })
            .catch(_ => {});
        },
        getSeason() {
            let obj = {
                status: 'quarter'
            }
            getTitle(obj).then(res => {
                let data = (res instanceof Array) ? res : []
                this.seasonOptions = data || []
            })
        },

        // 查
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                supplierId: this.comInfo.id,
                date: this.date
            }
            getSupplierPayPage(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },

        getDefectData() {
            let obj = {
                id: this.comInfo.id
            }
            defectSum(obj).then(res => {
                this.defectTableData = [res]
            })
        },

        cleanDefect() {
            this.$confirm('确认清零报损？').then(_ => {
                let obj = {
                    id: this.comInfo.id
                }
                defectClean(obj).then(res => {
                    this.$message.success('清零报损成功')
                    this.getDefectData()
                })
            })
            .catch(_ => {});
        },

        getCooperationRecord() {
            let obj = {
                id: this.comInfo.id,
                season: this.cooperationSeason,
                pageSize:  this.coopPage.size,
                page:  this.coopPage.no,
            }
            getSupplierGoods(obj).then(res => {
                this.cooperationTableData = res
                // this.coopPage.total = res.total
                // this.coopPage.no = res.current
            })
        },

  
        // 保存编辑
        save() {
            let params = cloneDeep(this.form)
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 校验通过
                    addSupplier(params).then(res => {
                        if (res) {
                            this.$message.success({message: '修改成功',});
                            this.baseDialogVisible = false
                            this.comInfo = cloneDeep(this.form) // 更新数据
                        }
                    })
                }
            })
        },

        addIncomeReady() {
            this.incomeform = {
                createTime: '',
                money: '',
                companyName: '',
                payType: '',
                remark: '',
            },
            this.incomeDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.incomeform.clearValidate()
            })
        },

        saveIncome() {
            let params = cloneDeep(this.incomeform)
            params.supplierId = this.comInfo.id
            params.supplierName = this.comInfo.supplierName

            this.$refs.incomeform.validate(valid => {
                if (valid) {
                    // 校验通过
                    addSupplierPay(params).then(res => {
                        if (res) {
                            this.$message.success({message: '添加成功',});
                            this.incomeDialogVisible = false
                            this.getData()
                        }
                    })
                }
            })
        },

        delPay(id) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                delSupplierPay({id: id}).then(res => {
                    this.$message.success({message: '删除成功',});
                    this.getData()
                })
            })
            .catch(() => {});
        },

        timeFormat(time) {
            if (!time) {return ''}

            return this.$moment(time).add(8, 'h').format('YYYY-MM-DD')
        },
        // 返回
        back() {
            this.$router.push({name: 'supplier'})
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

        // 分页导航
        coopPageChange(val) {
            this.$set(this.coopPage, 'no', val);
            this.getCooperationRecord();
        },
        // 每页数量改变
        handleCoopSizeChange(val) {
            this.$set(this.coopPage, 'size', val);
            this.$set(this.coopPage, 'no', 1);
            this.getCooperationRecord();
        },
    }
};
</script>

<style lang="scss" scoped>

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
        width: 100px;
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
        margin-top: 3px;
        color: #333;
        font-weight: 500;
    }

    .search, .search-btn {
        display: inline-block;
        margin: 10px;
    }
    
    

    .top {
        height: 39px;
    }

    .pay-record {
        position: relative;
    }

    .operation-record {
        position: relative;
        margin-top: 60px;
    }

    .topic {
        width: 100%;
        height: 36px;
        line-height: 36px;
        padding: 0 11px;
        background: #2183EA;
        color: #FFFFFF;
        font-weight: 500;
        font-size: 12px;
    }
    
    .operate {
        margin-top: 50px;
        text-align: center;

        .el-button  {
            width: 89px;
        }
    }

    .red {
        color: #FC5634;
    }

    .green {
        color: #33C179;
    }
}

.handle-box {
    position: absolute;
    right: 12px;
    top: 12px;
}

.pagination {
    margin-top: 20px;
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
    background: #FFFFFF;
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.3);
}

.del-word {
    margin: 20px 9px 12px;
    font-size: 11px;
    color: #909399;
}

.del-btn1, .del-btn2 {
    width: 89px;
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
    border: 1px solid #F5222D;
    color: #F5222D;

    &.outer {
        position: absolute;
        top: 16px;
        right: 36px;
    }
}
</style>
