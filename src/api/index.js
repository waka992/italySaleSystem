import service from '../utils/request';
let post = service.post
let get = service.get

// request中配置了全是post请求
export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

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
