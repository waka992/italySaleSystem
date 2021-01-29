<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{name: 'customerinfo'}">客户信息</el-breadcrumb-item>
                <el-breadcrumb-item>客户信息详情</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operate-btns">
                <el-button class="btn3 outer">结欠</el-button>
                <el-button class="btn2 outer" @click="showDialog('bill')">账单总汇</el-button>
                <el-button class="btn2 outer" @click="showDialog('sold')">销售统计</el-button>
            </div>
        </div>
        <div class="box">
            <div class="detail-card">
                <div class="title">{{comInfo.name}}</div>
                
                <div class="handle-box">
                </div>
                <el-row class="detail-row">
                    <el-col :span="6">
                        <span class="detail-label">地址：</span>
                        <span class="detail-content">{{comInfo.address}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">电话：</span>
                        <span class="detail-content">{{comInfo.mobile}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">银行信息：</span>
                        <span class="detail-content">{{comInfo.bankinfo}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="detail-label">初始欠款：</span>
                        <span class="detail-content">{{comInfo.dept}}</span>
                    </el-col>
                   
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="6">
                        <span class="detail-label">其他联系方式：</span>
                        <span class="detail-content">{{comInfo.contact}}</span>
                    </el-col>
                    <el-col :span="18">
                        <span class="detail-label">备忘：</span>
                        <span class="detail-content">{{comInfo.remark}}</span>
                    </el-col>
                </el-row>
            </div>

            <div class="record-card">
                <div class="top">
                    <div class="title">销售记录</div>
                    <div class="operate-btns">
                        <el-button type="primary" @click="showDialog('new')">+添加订单</el-button>
                    </div>
                    <!-- <div class="search">
                        <el-input size="mini" suffix-icon="el-icon-search" placeholder="输入关键词"></el-input>
                    </div> -->
                </div>
                <el-table
                    :data="tableData"
                    stripe
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="date" label="日期"  align="center"></el-table-column>
                    <el-table-column prop="boxs" label="箱数" align="center"></el-table-column>
                    <el-table-column prop="value" label="销售金额" align="center"></el-table-column>
                    <el-table-column prop="payStatus" label="支付状态" align="center">
                        <template slot-scope="scope">
                            {{scope.row.payStatus == 0 ? '待支付' : '已支付'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="verifyStatus" label="审核状态" align="center">
                        <template slot-scope="scope">
                            {{scope.row.verifyStatus == 0 ? '待审核' : '审核通过'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="editOne(scope.row.id)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <div class="pagination">
                    <el-pagination
                        background
                        :current-page="page.no"
                        :page-size="page.size"
                        :total="page.total"
                        layout="total, prev, pager, next, sizes, jumper"
                        @size-change="handleSizeChange"
                        @current-change="basePageChange"
                    ></el-pagination>
                </div> -->
                <!-- <div class="operate">
                    <el-button plain>返回</el-button>
                    <el-button type="primary">生成pdf</el-button>
                </div> -->
            </div>
        </div>
        <div class="bottom-box">
            <div class="inner-box">
                <div class="left-box">
                    <div class="box-title">欠款总汇</div>
                    <el-table
                        :data="deptTableData"
                        stripe
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="total" label="总金额" align="center"></el-table-column>
                        <el-table-column prop="dept" label="初始欠款" align="center"></el-table-column>
                        <el-table-column prop="pics" label="件数" align="center" width="80"></el-table-column>
                        <el-table-column prop="receive" label="总收款" align="center" width="80"></el-table-column>
                        <el-table-column prop="rest" label="余数" align="center" width="80"></el-table-column>
                    </el-table>
                </div>
                <div class="right-box">
                    <div class="box-title">收款总汇</div>
                    <div class="box-operate">
                        <el-button type="plain" class="btn3">收款总汇</el-button>
                    </div>
                    <el-table
                        :data="receiveTableData"
                        stripe
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="date" label="日期" align="center"></el-table-column>
                        <el-table-column prop="payWay" label="收款方式" align="center">
                            <template slot-scope="scope">
                                {{getDict(scope.row.payWay, 'payWay')}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" label="金额" align="center"></el-table-column>
                        <el-table-column prop="totalValue" label="总金额" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="false"
        :title="'新订单'" :visible.sync="newOrderDialog" width="830px">
            <dialog-new-order @saveData="saveSubmit" ref="newOrderDialog"></dialog-new-order>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="newOrderDialog = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="save">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="true"
        :title="'账单总汇'" :visible.sync="billDialog" width="830px">
            <dialog-bill @getPDF="receiveBillPDF" ref="billDialog"></dialog-bill>
            <span slot="footer" class="dialog-footer">
                <el-button class="curr-btn" plain @click="billDialog = false">取消</el-button>
                <el-button class="curr-btn" type="primary" @click="getBillPDF">生成PDF</el-button>
            </span>
        </el-dialog>
        
        <el-dialog
        class="custom-dialog"
        :close-on-click-modal='false'
        :show-close="true"
        :title="'销售统计'" :visible.sync="soldDialog" width="830px">
            <dialog-sold ref="soldDialog"></dialog-sold>
        </el-dialog>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import qs from 'qs'
import dict from '@/components/common/dict.js'
import DialogNewOrder from './DialogNewOrder';
import DialogBill from './DialogBill';
import DialogSold from './DialogSold';

export default {
    name: 'CustomerInfoDetail',
    components: {
        DialogNewOrder,
        DialogBill,
        DialogSold
    },
    data() {
        return {
            newOrderDialog: false,
            billDialog: false,
            soldDialog: false,
            page: {
                no: 1,
                total: 0,
                size: 10
            },
            // 展示用
            comInfo: {
                name: '广州市歌莉娅制衣有限公司',
                address: '德邦物流2楼',
                mobile: '13535355533',
                bankinfo: '622700029202929',
                dept: '12',
                contact: '13136383947',
                remark: '2020-11-20',
            },
            // 支出收入列表
            tableData: [
                {date: '2020-11-23 13:05', boxs: 3, value: 34952, payStatus: 1, verifyStatus: 1, id: 1},
                {date: '2020-11-23 13:05', boxs: 3, value: 34952, payStatus: 0, verifyStatus: 0, id: 1},
                {date: '2020-11-23 13:05', boxs: 3, value: 34952, payStatus: 1, verifyStatus: 1, id: 1},
                {date: '2020-11-23 13:05', boxs: 3, value: 34952, payStatus: 1, verifyStatus: 1, id: 1},
                {date: '2020-11-23 13:05', boxs: 3, value: 34952, payStatus: 1, verifyStatus: 1, id: 1},
                {date: '2020-11-23 13:05', boxs: 3, value: 34952, payStatus: 1, verifyStatus: 1, id: 1},
                {date: '2020-11-23 13:05', boxs: 3, value: 34952, payStatus: 1, verifyStatus: 1, id: 1},
            ],

            deptTableData: [
                {total: 80000, dept: 20000, pics: 12, receive: 60000, rest: 50000,}
            ],

            receiveTableData: [
                {date: '2020-11-23 13:05' , payWay: 0, value: 82000, totalValue: 82000},
                {date: '2020-11-23 13:05' , payWay: 0, value: 82000, totalValue: 82000},
                {date: '2020-11-23 13:05' , payWay: 0, value: 82000, totalValue: 82000}
            ],
            
        };
    },
    created() {
        this.getDict = dict.getDict // 获取字典
        this.getData();
    },
    methods: {
        // 置空数据
        getDetail() {
            this.form = {
                name: '广东沈外贸科技有限公司',
                address: '广州白云区家和',
                mobile: '1377292010',
                otherContact: '390525235@qq.com',
                remark: '外贸科技供应商',
                payStatus: '+8000',
                use: '文案文案',
            }
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

        // 分页导航
        basePageChange(val) {
            this.$set(this.page, 'no', val);
            this.getData();
        },
        // 每页数量改变
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },

        save() {
            this.$refs.newOrderDialog.saveSubmit()
        },

        saveSubmit(data) {
            console.log(data);
        },
        // 发起生成pdf请求
        getBillPDF() {
            this.$refs.billDialog.getPDF()
        },
        // 生成pdf
        receiveBillPDF() {

        },

        // 打开dialog
        showDialog(tar) {
            // 新建
            if (tar == 'new') {
                this.newOrderDialog = true
                this.$nextTick(() => {
                    this.$refs.newOrderDialog.resetData()
                })
            }
            // 账单总汇
            if (tar == 'bill') {
                this.billDialog = true
                this.$nextTick(() => {
                    this.$refs.billDialog.resetData()
                })
            }
            // 销售统计
            if (tar == 'sold') {
                this.soldDialog = true
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.crumbs {
    position: relative;
    width: 100%;
    height: 64px;
    box-sizing: border-box;
    padding: 25px;
    margin: 0 !important;
}

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
        width: 110px;
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

        .operate-btns {
            right: 12px;
        }
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

.custom-dialog {
    ::v-deep .el-dialog__header {
        padding: 28px 35px !important;
    }
    ::v-deep .el-dialog__title {
        color: #1F1F21 !important;
        font-weight: 500;
    }
    ::v-deep .el-dialog__body {
        padding: 0 35px !important;
    }

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
    color: #fff;
    background: #2183EA;
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.3);
}

.del-word {
    margin: 20px 9px 12px;
    font-size: 11px;
    color: #909399;
}

.del-btn1, .btn2, .btn3 {
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
.btn2 {
    @include primarybtn;
}

.btn3 {
    @include plainbtn;
}
.operate-btns {
    position: absolute;
    right: 25px;
    top: 12px;
}

.bottom-box {
    position: relative;
    margin: 12px 23px;
    background-color: #F0F2F5;
    
    .inner-box {
        background-color: #fff;
    }

    .left-box, .right-box {
        padding: 14px;
        position: relative;
        display: inline-block;
        width: 49%;
        background-color: #fff;
        min-height: 174px;

        .box-title {
            height: 46px;
            line-height: 38px;
            color: #303133;
            font-size: 16px;
            font-weight: 500;
        }
    }

    .left-box {
        float: left;
    }

    .right-box {
        float: right;
    }
}

.box-operate {
    .btn3 {
        position: absolute;
        right: 12px;
        top: 18px;
    }
}
</style>
