<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>采购</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name: 'transitcompany'}">运输公司</el-breadcrumb-item>
                <el-breadcrumb-item>运输公司详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            
            <div class="detail-card">
                <div class="title">运输公司</div>
                <div class="handle-box">
                    <el-button
                        icon="el-icon-edit"
                        type="primary"
                        size="mini"
                        @click="editReady"
                        >编辑</el-button>
                </div>
                <el-row class="detail-row">
                    <el-col :span="6">
                        <span class="detail-label">公司名称：</span>
                        <span class="detail-content">{{comInfo.transporterName}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">地址：</span>
                        <span class="detail-content">{{comInfo.transporterAddress}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">电话：</span>
                        <span class="detail-content">{{comInfo.transporterMobile}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">其他联系方式：</span>
                        <span class="detail-content">{{comInfo.transporterOther}}</span>
                    </el-col>
                </el-row>
            </div>

            <div class="record-card">
                <div class="top">
                    <div class="title">查询</div>
                    <div class="search">
                        <el-select size="mini" v-model="season" placeholder="请选择季度" clearable>
                            <el-option
                            v-for="(item,i) in seasonOptions"
                            :key="i"
                            :label="item.configValue"
                            :value="item.configValue">
                            </el-option>
                        </el-select>
                        <el-button style="margin-left: 10px;" size="mini" icon="el-icon-search" @click="getData"></el-button>
                    </div>
                    <div class="handle-box">
                        <!-- <el-button
                            size="mini"
                            icon="el-icon-edit"
                            type="primary"
                            @click="addIncomeReady"
                            >+新增记录</el-button> -->
                    </div>
                </div>
                <div class="topic">运输记录</div>
                <el-table
                    :data="tableData"
                    stripe
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                >
                    <el-table-column prop="createTime" label="货柜时间"  align="center">
                        <template slot-scope="scope">
                            {{timeFormat(scope.row.createTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="到货日期" align="center">
                        <template slot-scope="scope">
                            {{timeFormat(scope.row.finshTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsTotal" label="件数" align="center"></el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            {{getDict(scope.row.contaninerType, 'containerStatus')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cost" label="运输金额" align="center"></el-table-column>
                    <!-- <el-table-column label="操作" width="130" align="center">
                        <template slot-scope="scope">
                            <el-button
                                icon="el-icon-s-operation"
                                @click="checkDetail(scope.row.id)"
                                type="primary"
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
                <div class="operate">
                    <el-button plain @click="back">返回</el-button>
                    <el-button type="primary">生成pdf</el-button>
                </div>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'编辑运输公司信息'" :visible.sync="baseDialogVisible" width="551px">
            <el-popover
                popper-class="del-confirm"
                placement="bottom"
                width="210"
                v-model="delVisible">
                <div class="del-word">删除该供应商后，数据不可恢复，是否确认删除？</div>
                <div style="text-align: right; margin: 0">
                    <el-button class="del-btn1" size="mini" type="text" @click="delVisible = false">取消</el-button>
                    <el-button class="del-btn2" size="mini" @click="delConfirm">确认删除</el-button>
                </div>
                <el-button class="del-btn2 outer" slot="reference">删除</el-button>
            </el-popover>
            <el-form ref="form" 
                :model="form" label-width="158px"
                :rules="rules"
            >
                <el-form-item label="供应商名称" prop="transporterName">
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

        <!-- 支出收入 -->
        <el-dialog 
        :close-on-click-modal='false'
        :show-close="false"
        :title="'新增支出/收入记录'" :visible.sync="incomeDialogVisible" width="551px">
            <el-form ref="incomeform" 
                :model="incomeform" label-width="178px"
                :rules="incomerules"
            >
                <el-form-item label="客户名称" prop="name">
                    <el-input size="mini" class="form-input" v-model="incomeform.name" placeholder="请输入客户名" maxlength="15" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="date">
                    <el-date-picker
                        v-model="incomeform.date"
                        type="datetime"
                        placeholder="选择今日日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="收入/支出" prop="income">
                    <el-input size="mini" class="form-input" v-model="incomeform.income" placeholder="例如+1000" ></el-input>
                </el-form-item>
                <el-form-item label="资金状态" prop="status">
                    <el-input size="mini" class="form-input" v-model="incomeform.status" placeholder="请输入客户资金状态" ></el-input>
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
  
import dict from '@/components/common/dict.js'
import {
    addOrUpdateTransporter,
    delTransporter,
    getAllTransporter,
    getTransporterPage,
    getContainerPage,
    getTitle
} from '@/api/index';

export default {
    name: 'TransitCompanyDetail',
    data() {
        return {
            delVisible: false,
            baseDialogVisible: false,
            incomeDialogVisible: false,
            season: '',
            seasonOptions: [],
            page: {
                no: 1,
                total: 0,
                size: 5
            },
            // 展示用
            comInfo: {
            },
            tableData: [
            ],
            // 修改用
            form: {
                name: '',
                address: '',
                mobile: '',
                otherContact: '',
            },
            incomeform: {
                name: '',
                date: '',
                income: '',
                status: '',
                remark: '',
            },
            rules: {
                transporterName: [{ required: true, message: '请输入供应商名', trigger: 'change' }],
                transporterAddress: [{ required: true, message: '请输入供应商地址', trigger: 'change' }],
                transporterMobile: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
            },
            incomerules: {
                name: [{ required: true, message: '请输入客户名', trigger: 'change' }],
                date: [{ required: true, message: '请输入日期', trigger: 'change' }],
                income: [{ required: true, message: '请输入', trigger: 'change' }],
            },
        };
    },
    created() {
        this.getDict = dict.getDict
        let data = this.$route.params.data
        this.comInfo = {
            id: data.id,
            transporterName: data.transporterName,
            transporterAddress: data.transporterAddress,
            transporterMobile: data.transporterMobile,
            transporterOther: data.transporterOther,
        }
        this.getData()
        this.getSeason()

    },
    methods: {
        // 置空数据
        getDetail() {
            this.form = {
            }
        },

        
        editReady() {
            this.form = cloneDeep(this.comInfo)
            this.baseDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },

        delConfirm() {
            console.log(this.$route.params);
            this.delVisible = false
            this.baseDialogVisible = false
            this.$router.push({name: 'transitcompany'})
        },

        // 查
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                transpoterId: this.comInfo.id,
                quarter: this.season
            }
            getContainerPage(obj).then(res => {
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
                    // 校验通过
                   addOrUpdateTransporter(params).then(res => {
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
                name: '',
                date: '',
                income: '',
                status: '',
                remark: '',
            },
            this.incomeDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.incomeform.clearValidate()
            })
        },

        saveIncome() {
            let params = cloneDeep(this.incomeform)
            this.$refs.incomeform.validate(valid => {
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
            if (time) {
                return this.$moment(time).format('YYYY-MM-DD')
            }
            else {
                return ''
            }
        },
        back() {
            this.$router.push({name: 'transitcompany'})
        },
        getSeason() {
            let obj = {
                status: 'quarter'
            }
            getTitle(obj).then(res => {
                let data = (res instanceof Array) ? res : []
                this.seasonOptions = data || []
                console.log(this.seasonOptions);
            })
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
        color: #333;
        font-weight: 500;
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
