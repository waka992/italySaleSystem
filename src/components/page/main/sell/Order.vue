<template>
    <div class="order-box">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>销售</el-breadcrumb-item>
                <el-breadcrumb-item>销售订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="switch">
            <div class="switch-item" :class="selectedSwitch == 0 ? 'selected' : ''" @click="switchSelect(0)">全部订单</div>
            <!-- <div class="switch-item" :class="selectedSwitch == 1 ? 'selected' : ''" @click="switchSelect(1)">今日订单（12月5号）</div> -->
        </div>
        <div class="box">
            <div class="handle-box">
                <el-input v-model="customerName" class="name-search" size="mini" suffix-icon="el-icon-search" placeholder="输入客户名"></el-input>

                <div class="time">
                    <span class="label">时间</span>
                    <div class="time-comp">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <el-button icon="el-icon-search" @click="getData"></el-button>

                <el-button
                    class="new-btn"
                    type="primary"
                    @click="showDialog('new')"
                    >新订单</el-button>
            </div>
            <el-table
                :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="customerName" label="客户" align="center"></el-table-column>
                <el-table-column prop="createTime" label="日期" align="center">
                    <template  slot-scope="scope">
                        {{timeFormat(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="caseNum" label="箱数" align="center"></el-table-column>
                <el-table-column prop="price" label="金额" align="center"></el-table-column>
                <el-table-column prop="payStatus" label="支付方式" align="center" width="120">
                    <template  slot-scope="scope">
                        {{getDict(scope.row.payType, 'payWay')}}
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            @click="showDialog('edit', scope.row.id)"
                            type="text"
                        >编辑</el-button>
                        <el-button
                            @click="showDialog('review', scope.row.id)"
                            type="text"
                        >预览</el-button>
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

        <!-- 新建弹出框 -->
        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="false"
        :title="'新订单'" :visible.sync="baseDialogVisible" width="830px">
            <dialog-new-order @saveData="saveSubmit" ref="newOrderDialog"></dialog-new-order>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="baseDialogVisible = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="save">确定</el-button>
            </span>
        </el-dialog>

        <!-- 预览弹出框 -->
        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="false"
        :title="'订单预览'" :visible.sync="reviewDialogVisible" width="830px">
            <dialog-review @getPDF="getReviewPDF" ref="dialogReview"></dialog-review>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="reviewDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="askReviewPDF">生成PDF</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import dict from '@/components/common/dict.js'
import DialogNewOrder from '../customer/DialogNewOrder';
import DialogReview from './DialogReview';
import moment from 'moment';
import { 

createOrUpdateOrder,
delOrder,
orderDetail,
getOrderByCustomer,
getOrderPage,
sumOrder,
 } from '@/api/index';

export default {
    name: 'Order',
    components: {
        DialogNewOrder,
        DialogReview
    },
    data() {
        return {
            getDict: null,
            baseDialogVisible: false,
            reviewDialogVisible: false,
            status: 0,
            selectedSwitch: 0,
            customerName: '',
            time: [],

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
        this.getData();
        this.getDict = dict.getDict // 获取字典

    },
    methods: {
        switchSelect(i) {
            this.selectedSwitch = i
        },

        // 打开dialog
        showDialog(tar, id) {
            // 新建
            if (tar == 'new') {
                this.baseDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.newOrderDialog.resetData()
                })
            }
            if (tar == 'edit') {
                this.$router.push({name: 'orderinfoedit', params: {id: id}})
                // this.$refs.newOrderDialog.editData(data)
                // this.$refs.newOrderDialog.setName(customerName)
            }
            // 编辑或者预览
            if (tar == 'review') {
                orderDetail({id: id}).then(res => {
                    this.reviewDialogVisible = true
                    this.$nextTick(() => {
                        let reviewData = res
                        this.$refs.dialogReview.editData(reviewData)
                    })
                })
            }
        },

        // 查
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                customerName: this.customerName,
                startTime: this.time ? this.time[0] : '',
                endTime: this.time ? this.time[1] : '',
            }
            getOrderPage(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },
  
        save() {
            this.$refs.newOrderDialog.saveSubmit()
        },

        saveSubmit(data) {
            data.process = 0
            createOrUpdateOrder(data).then(res => {
                this.$message.success('操作成功')
                this.baseDialogVisible = false
                this.getData()
            }) 
        },

        // 询问pdf
        askReviewPDF() {
            this.$refs.dialogReview.getPDF()
        },

        // 生成pdf
        getReviewPDF() {

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
            return moment(time).format('YYYY.MM.DD')
        }
    }
};
</script>

<style lang="scss" scoped>
.order-box {
    .switch {
        margin-left: 22px;

        .switch-item{
            display: inline-block;
            cursor: pointer;
            margin-right: 40px;
            height: 36px;
            line-height: 36px;

            &.selected {
                color: $theme-color;
                border-bottom: 2px solid $theme-color;
            }
        }
        
    }
}
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

    .time {
        width: 430px;
    }

    .time-comp {
        display: inline-block;
        width: 180px;
    }

    .new-btn {
        float: right;
        width: 120px;
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
