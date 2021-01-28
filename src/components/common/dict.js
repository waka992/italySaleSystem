
const dict =  {
    payWay: [
        {value: 0, label: '发票'},
        {value: 1, label: '汇款'},
    ],
    payStatus: [
        {value: 0, label: '欠款'},
        {value: 1, label: '已支付'},
    ],
    payENStatus: [
        {value: 0, label: 'PAID'},
        {value: 1, label: 'UNPAID'},
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
