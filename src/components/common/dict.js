
const dict =  {
    accountType: [
        {value: 0, label: '现金'},
        // {value: 1, label: '转账'},
        // {value: 2, label: '微信'},
        {value: 3, label: '发票'},
        {value: 4, label: '汇款'},
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
        {value: '', label: '预录入'},
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
