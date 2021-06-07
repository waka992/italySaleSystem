
const dict =  {
    accountType: [
        {value: 0, label: '现金'},
        // {value: 1, label: '转账'},
        // {value: 2, label: '微信'},
        {value: 3, label: '发票'},
        {value: 4, label: '汇款'},
        {value: 5, label: '欠款'},
    ],
    accountTypeEN: [
        {value: 0, label: 'CASH'},
        // {value: 1, label: '转账'},
        // {value: 2, label: '微信'},
        {value: 3, label: 'INVOICE'},
        {value: 4, label: 'REMITTANCE'},
        {value: 5, label: 'ARREARS'},
    ],
    payWay: [
        {value: 0, label: '发票'},
        {value: 1, label: '汇款'},
    ],
    payENWay: [
        {value: 0, label: 'INVOICE'},
        {value: 1, label: 'CASH'},
    ],
    payStatus: [
        {value: 0, label: '未支付'},
        {value: 1, label: '已支付'},
        {value: 2, label: '欠款'},
        {value: 3, label: '已结欠'},
    ],
    payENStatus: [
        {value: 0, label: 'PAID'},
        {value: 1, label: 'UNPAID'},
    ],
    
    soldStatus: [
        // {value: '', label: '预录入'},
        {value: 0, label: '即将到货'},
        {value: 1, label: '现货'},
        {value: 2, label: '售罄'},
    ],
    settingItemValue: [
        {value: 5, label: '特色/Special'},
        {value: 0, label: '颜色/Color'},
        {value: 1, label: '尺码/Size'},
        {value: 2, label: '面料/Material'},
        {value: 4, label: '配比/Ratio'},
        {value: 6, label: '破洞/Destroyed'},
        {value: 7, label: '面料(后台)/Material(back)'},
    ],
    containerStatus: [
        {value: 0, label: '未运输'},
        {value: 1, label: '已发货'},
        {value: 2, label: '已到达待确认'},
        {value: 3, label: '已确认货物'},
    ],
    transportType: [
        {value: 0, label: '海运'},
        // {value: 1, label: '陆运'},
        {value: 2, label: '空运'},
        {value: 3, label: '其他'},
    ],
    verifyStatus: [
        {value: 0, label: '未审核'},
        {value: 1, label: '不通过'},
        {value: 2, label: '审核通过'},
        {value: 3, label: '通过欠款待发货'},
        {value: 4, label: '仓库发货'},
        {value: 5, label: '退审处理中'}, // 退审
        {value: 6, label: '退审处理中'}, // 退审编辑后
    ],
    verifyCheckStatus: [
        {value: 0, label: '未审核'},
        {value: 1, label: '已审核'},
        {value: 2, label: '退审'},
    ],
    userLevel: [
        // {value: 0, label: '销售人员'},
        {value: 1, label: '销售人员'},
        {value: 2, label: '管理员'},
    ],
    customerLevel: [
        {value: 1, label: '游客'},
        {value: 2, label: '普通'},
        {value: 3, label: 'VIP'},
        {value: 9, label: '隐藏'},
    ],

    // 字典
    getDict: function(value, dictName) {
        for (let i = 0; i < dict[dictName].length; i++) {
            const element = dict[dictName][i];
            if (element.value == value) {
                return element.label
            }
        }
    },
}



export default dict;
