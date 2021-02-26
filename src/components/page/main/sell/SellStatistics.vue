<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>销售</el-breadcrumb-item>
                <el-breadcrumb-item>销售统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
        </div>
    </div>
</template>

<script>
import {cloneDeep} from 'lodash';

export default {
    name: 'SellStatistics',
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
