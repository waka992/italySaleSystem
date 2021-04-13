import service from '../utils/request';
let axiosPost = service.post
let axiosGet = service.get
import qs from 'qs'
import RSA from '../utils/encode'

sessionStorage.clear() // 先清理锁

/**
 * 
 * @param {*} name 
 * @param {*} query 
 * @param {*} limit 请求限制，默认开，需要同时请求多次的接口设置为false即可
 * @param {*} encode 是否加密，默认不加，部分接口需要就加
 */
function post(name, query, limit = true, encode = false) {
    if (sessionStorage.getItem(name) === 'true' && limit) {
        // 防止请求出错完全不能请求
        setTimeout(() => {
            console.log('session清理');
            sessionStorage.clear()
        }, 3000)
        let donothingPromise = new Promise((res, rej) => {
            rej()
        })
        return donothingPromise
    }
    sessionStorage.setItem(name, true)
    // 加密
    if (encode === true) {
        console.log(query);
        query = RSA.EncryptData(JSON.stringify(query))
    }
    return axiosPost(name, query)
}

// request中配置了全是post请求
export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

function get(path, query, limit = false, encode = false) {
    // 加密
    if (encode === true) {
        console.log(query);
        query = RSA.EncryptData(JSON.stringify(query))
    }
    // get一般不用上锁
    // if (sessionStorage.getItem(path) === 'true') {
    //     // return new Promise
    // }
    let param = ''
    try {
        param = qs.stringify(query)
    }
    catch(err) {
        param = ''
    }
    finally {
        // sessionStorage.setItem(path, true)
        return axiosGet(path +'?'+ param)
    }
}
// 登陆
export const login = query => {
    return post('user/login', query, true, true)
}

// 会员
export const userList = query => {
    return post('user/ht/userList', query, true, true)
}

// 会员修改 
export const userUpdate = query => {
    return post('user/ht/update', query)
}

// 会员注册
export const userRegister = query => {
    return post('user/ht/register', query)
}

export const test = query => {
    return post('user/test', query)
}
/**
 *  公司 - 
 */
export const addCompAccount = query => {
    return post('cm/addAccount', query)
}
export const addCompOrUpdate = query => {
    return post('cm/addOrUpdate', query)
}
export const delComp = query => {
    return get('cm/del', query)
}
export const delCompAccount = query => {
    return get('cm/delAccount', query)
}
export const getCompDetail = query => {
    return get('cm/detail', query)
}
export const getCompPage = query => {
    return get('cm/list', query)
}
export const getCompPayLog = query => {
    return get('cm/payLog', query)
}
export const getPayBook = query => {
    return post('cm/payBook', query, false)
}


/**
 * 采购 - 供应商模块
 */
export const addSupplier = query => {
    return post('su/addOrUpdate', query)
}
export const delSupplier = query => {
    return get('su/del', query)
}
export const getSupplier = query => {
    return get('su/getAll', query)
}
export const getSupplierPage = query => {
    return get('su/getSupplierPage', query)
}
export const getSupplierPayPage = query => {
    return get('su/getSupplierPayPage', query)
}
export const addSupplierPay = query => {
    return post('su/payAdd', query)
}
export const delSupplierPay = query => {
    return get('su/payDel', query)
}
export const getSupplierGoods = query => {
    return get('su/getSupplierByGoods', query)
}
export const defectSum = query => {
    return get('su/defectSum', query)
}
export const defectClean = query => {
    return get('su/defectClean', query)
}

/**
 * 采购 - 货柜信息
 */
export const addGoodsToContainer = query => {
    return post('ca/addGoods', query)
}
export const addOrUpdateContainer = query => {
    return post('ca/addOrUpdate', query)
}
export const confirmArrival = query => {
    return get('ca/confirm', query)
}
export const delContainer = query => {
    return get('ca/del', query)
}
export const containerDetail = query => {
    return get('ca/detail', query)
}
export const getAllContainer = query => {
    return get('ca/getAll', query)
}
export const getContainerPage = query => {
    return get('ca/getTbLogisticsPage', query)
}
export const updateContainer = query => {
    return get('ca/update', query)
}
export const itemTransportRecord = query => {
    return get('ca/getSkuCon', query)
}

/**
 * 采购 - 运输公司
 */
export const addOrUpdateTransporter = query => {
    return post('tr/addOrUpdate', query)
}
export const delTransporter = query => {
    return get('tr/del', query)
}
export const getAllTransporter = query => {
    return get('tr/getAll', query)
}
export const getTransporterPage = query => {
    return get('tr/getTransporterPage', query)
}

/**
 * 
 * 客户信息 
 */

export const registerCustomer = query => {
    return post('user/ht/register', query)
}
export const getBestCustomer = query => {
    return get('me/star', query)
} 
/** 
 * 单品
 */
export const createGoods = query => {
    return post('ht/createGoods', query)
}
export const goodsDetail = query => {
    return post('ht/goodsForDetail', query)
}
export const updateGoods = query => {
    return post('ht/goodsForUpdate', query)
}
export const getGoods = query => {
    return post('sku/getSkuPage', query)
}
export const getItemSellRecord = query => {
    return get('sku/getSkuSell', query)
}
export const getStockStatistics = query => {
    return get('sku/getSkuStock', query)
}

export const addOrder = query => {
    return post('sku/addOrder', query)
}




/** 
 * 销售 - 订单
 */
export const approvalOrder = query => {
    return get('order/approval', query)
}
export const createOrUpdateOrder = query => {
    return post('order/createOrUpdate', query, true, true)
}
export const delOrder = query => {
    return get('order/delOrder', query)
}
export const orderDetail = query => {
    return get('order/detail', query)
}
export const getOrderByCustomer = query => {
    return get('order/getOrderByCustomer', query)
}
export const getOrderPage = query => {
    return get('order/getOrderPage', query)
}
export const sumOrder = query => {
    return post('order/orderSum', query)
}
export const payOrder = query => {
    return post('order/pay', query, true, true)
}
export const settleOrder= query => {
    return post('order/settle', query)
}
export const addDeFect= query => {
    return post('order/addDeFect', query)
}

export const delDeFect= query => {
    return get('order/delDeFect', query)
}
export const getCustomerPay= query => {
    return get('order/getCustomerPay', query)
}
export const checkSkuOrder = query => {
    return post('sku/orderSku', query)
}

/**
 * 参数
 */
export const getAttrList  = query => {
    return get('ht/getArrtibute')
}
export const createAttr  = query => {
    return post('ht/addArrtibute', query)
}
export const deleteAttr  = query => {
    return post('ht/delArrtibute', query)
}
export const updateAttr  = query => {
    return post('ht/updateArrtibute', query)
}

export const createTitle  = query => {
    return post('ht/createTitle', query)
}
export const getTitle  = query => {
    return get('ht/getTitle', query)
}
export const delTitle  = query => {
    return get('ht/delTitle', query)
}

// 统计
export const customerStatistics  = query => {
    return get('sa/customerStatistics', query)
}

export const profitSum = query => {
    return post('sa/profit', query)
}

export const dailyJournal = query => {
    return get('sa/turnover', query)
}

export const arrtibuteSum = query => {
    return post('sa/arrtibuteSum', query)
}

export const customerSum = query => {
    return get('sa/customerSum', query)
}

export const goodsSum = query => {
    return get('sa/goodsSum', query)
}

// 首页
export const getIndexArrival = query => {
    return get('index/arrival', query)
}
export const cancalStockRemind = query => {
    return get('index/cancelReminder', query)
}
export const getSellRemind = query => {
    return get('index/sellRemind', query)
}
export const getStockRemind = query => {
    return get('index/stockReminder', query)
}
export const getIndexSearch = query => {
    return get('index/search', query)
}

// 用户管理
export const getUserList = query => {
    return get('user/ht/list', query, true, true)
}
export const addUser = query => {
    return post('user/ht/add', query, true, true)
}
export const delUser = query => {
    return get('user/ht/del', query)
}
export const updatePwd = query => {
    return post('user/updatePwd', query, true, true)
}