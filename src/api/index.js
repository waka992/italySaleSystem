import service from '../utils/request';
let post = service.post
let axiosGet = service.get
import qs from 'qs'

// request中配置了全是post请求
export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

function get(path, query) {
    let param = ''
    try {
        param = qs.stringify(query)
    }
    catch(err) {
        param = ''
    }
    finally {
        return axiosGet(path +'?'+ param)
    }
}
// 登陆
export const login = query => {
    return post('user/login', query)
}

// 会员
export const userList = query => {
    return post('user/ht/userList', query)
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
export const profitSum = query => {
    return post('cm/profit', query)
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
export const customerList = query => {
    return post('user/ht/userList', query)
}
export const registerCustomer = query => {
    return post('user/ht/register', query)
}
/** 
 * 单品
 */
export const createGoods = query => {
    return post('ht/createGoods', query)
}
export const updateGoods = query => {
    return post('ht/goodsForUpdate', query)
}
export const getGoods = query => {
    return post('sku/getSkuPage', query)
}


/** 
 * 销售 - 订单
 */
export const approvalOrder = query => {
    return get('order/approval', query)
}
export const createOrUpdateOrder = query => {
    return post('order/createOrUpdate', query)
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
    return post('order/pay', query)
}
export const settleOrder= query => {
    return post('order/settle', query)
}
export const checkSkuOrder = query => {
    return post('order/orderSku', query)
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