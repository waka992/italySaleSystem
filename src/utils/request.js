import axios from 'axios';
import {Message} from 'element-ui'
import Router from 'vue-router';

axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://2o6465101l.wicp.vip/',
    // baseURL: 'http://www.bruceyao.cn:8085/',

    timeout: 10000,
});

service.interceptors.request.use(
    config => {
        let token = localStorage.getItem('xc-token');
        if (token) {
            config.headers['xc-token'] = token
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if (response.data.code == 1) {
                // token
                if (response.headers['xc-token']) {
                    localStorage.setItem('xc-token', response.headers['xc-token']) // 获取header的token
                }
                // 正常data
                if (response.data.data) {
                    return response.data.data;
                }
                else {
                    return {}
                }
            }
            else if (response.data.code == 6666) {
                localStorage.setItem('ms_username', '');
                Router.push('/login');
            }
            else {
                Message({
                    message: response.data.desc,
                    type: 'error'
                })
                return
                // Promise.reject();
            }
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);
export default service;
