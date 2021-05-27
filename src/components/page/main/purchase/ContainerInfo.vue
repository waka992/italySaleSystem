<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>采购</el-breadcrumb-item>
                <el-breadcrumb-item>货柜信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="handle-box">
                <el-input v-model="name" class="name-search" size="mini" suffix-icon="el-icon-search" placeholder="输入货柜名称"></el-input>
                <div class="status">
                    <span class="label">货柜状态</span>
                    <el-select size="mini" v-model="type" placeholder="请选择" clearable>
                        <el-option
                        v-for="item in dict.containerStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>

                <div class="status">
                    <span class="label">季度</span>
                    <el-select size="mini" v-model="season" placeholder="请选择" clearable>
                        <el-option
                        v-for="item in seasonOptions"
                        :key="item.configValue"
                        :label="item.configValue"
                        :value="item.configValue">
                        </el-option>
                    </el-select>
                </div>


                <el-button icon="el-icon-search" @click="getData"></el-button>


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
                <el-table-column prop="container" label="货柜名称" align="center"></el-table-column>
                <el-table-column prop="startTime" label="出货时间" align="center">
                    <template  slot-scope="scope">
                        {{timeFormat(scope.row.startTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="contaninerType" label="状态" align="center">
                   <template slot-scope="scope">
                        {{getDict(scope.row.contaninerType, 'containerStatus')}}
                    </template>
                </el-table-column>
                <el-table-column prop="transpoterName" label="运输方" align="center"></el-table-column>
                <el-table-column prop="caseNum" label="箱数" align="center"></el-table-column>
                
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button
                            icon="el-icon-s-operation"
                            @click="checkDetail(scope.row)"
                            type="primary"
                        >查看详情</el-button> -->
                        <el-button type="text" @click="checkDetail(scope.row)">详情</el-button>
                        <el-button type="text" v-show="scope.row.contaninerType == 0" @click="sendContainer(scope.row)">发货</el-button>
                    </template>
                </el-table-column>
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
                <el-form-item label="货柜名称" prop="container">
                    <el-input size="mini" class="form-input" v-model="form.container" placeholder="请输入货柜名" maxlength="15" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="季度" prop="quarter">
                    <el-select class="form-input" size="mini" v-model="form.quarter" placeholder="请选择">
                        <el-option
                        v-for="item in seasonOptions"
                        :key="item.configValue"
                        :label="item.configValue"
                        :value="item.configValue">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="运输商" prop="transpoterName">
                    <el-select class="form-input" size="mini" v-model="form.transpoterName" placeholder="请选择">
                        <el-option
                        v-for="item in transporterOptions"
                        :key="item.id"
                        :label="item.transporterName"
                        :value="item.transporterName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="货柜类型" prop="transpoterType">
                    <el-select class="form-input" size="mini" v-model="form.transpoterType" placeholder="请选择">
                        <el-option
                        v-for="item in dict.transportType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="货柜费用" prop="cost">
                    <el-input size="mini" class="form-input" v-model="form.cost" placeholder="请输入" ></el-input>
                </el-form-item>

                <el-form-item label="出货日期" prop="startTime">
                    <el-date-picker
                        class="form-input"
                        v-model="form.startTime"
                        type="date"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                
                <el-form-item label="预计到货日期" prop="estimate">
                    <el-date-picker
                        class="form-input"
                        v-model="form.estimate"
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
  
import { 
    addGoodsToContainer,
    addOrUpdateContainer,
    confirmArrival,
    delContainer,
    getContainerPage,
    getAllTransporter,
    getTitle,
    updateContainer,
    } from '@/api/index';
import dict from '@/components/common/dict.js'

export default {
    name: 'ContainerInfo',
    data() {
        return {
            baseDialogVisible: false,
            type: 0,
            date: '',
            name: '',
            season: '',
            statusOptions: [
                {label: '全部', value: 0},
                {label: '已到货', value: 1},
                {label: '即将到货', value: 2},
            ],
            seasonOptions: [
            ],
            transporterOptions: [],
            transportType: [
            ],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            tableData: [],
            form: {},
            rules: {
                container: [{ required: true, message: '请输入', trigger: 'change' }],
                quarter: [{ required: true, message: '请选择', trigger: 'change' }],
                transpoterName: [{ required: true, message: '请选择', trigger: 'change' }],
            }
        };
    },
    created() {
        this.getDict = dict.getDict
        this.dict = dict
        this.getData();
        this.getSeason()
        this.getTransporter()
    },
    methods: {
        // 置空数据
        resetData() {
            this.form = {
                container: '',
                quarter: '',
                transpoterName: '',
                transpoterType: '',
                cost: '',
                estimate: '',
                startTime: '',
            }
        },

        // 增准备
        addReady() {
            this.resetData()
            this.baseDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },

        // 查
        getData() {
            let obj = {
                container: this.name,
                quarter: this.season,
                pageSize:  this.page.size,
                page:  this.page.no,
                contaninerType: this.type,
            }
            getContainerPage(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },
        getTransporter() {
            // 获取运输商
            getAllTransporter({}).then(res => {
                this.transporterOptions = res
            })
        },
  
        // 保存编辑
        save() {
            let params = cloneDeep(this.form)
            // 获取运输商id
            for (let i = 0; i < this.transporterOptions.length; i++) {
                const element = this.transporterOptions[i];
                if (params.transpoterName === element.transporterName) {
                    params.transpoterId = element.id
                    break
                }
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 校验通过
                    addOrUpdateContainer(params).then(res => {
                        if (res) {
                            this.$message.success({message: '添加成功',});
                            this.baseDialogVisible = false
                            this.getData()
                        }
                    })
                }
            })
        },

        checkDetail(data) {
            this.$router.push({name: 'containerinfodetail', params: {data: data}})
        },

        sendContainer(data) {
            updateContainer({id: data.id}).then(res => {
                this.$message.success('操作成功')
                this.getData()
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
            if (!time) {return ''}
            return this.$moment(time).format('YYYY-MM-DD')
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
