import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: () => import(/* webpackChunkName: "home" */ '../components/page/main/home/HomePage.vue'),
                    meta: { title: '首页' }
                },
                {
                    path: '/baseinfo',
                    name: 'baseinfo',
                    component: () => import(/* webpackChunkName: "baseinfo" */ '../components/page/main/company/CompanyBaseInfo.vue'),
                    meta: { title: '公司 - 基本信息' }
                },
                {
                    path: '/compbaseinfodetail',
                    name: 'compbaseinfodetail',
                    component: () => import(/* webpackChunkName: "compbaseinfodetail" */ '../components/page/main/company/CompanyBaseInfoDetail.vue'),
                    meta: { title: '公司 - 基本信息 - 详情' }
                },
                {
                    path: '/dailyjournal',
                    name: 'dailyjournal',
                    component: () => import(/* webpackChunkName: "dailyjournal" */ '../components/page/main/company/DailyJournal.vue'),
                    meta: { title: '公司 - 流水日记账' }
                },
                {
                    path: '/profitstatistics',
                    name: 'profitstatistics',
                    component: () => import(/* webpackChunkName: "profitstatistics" */ '../components/page/main/company/ProfitStatistics.vue'),
                    meta: { title: '公司 - 盈利统计' }
                },
                {
                    path: '/supplier',
                    name: 'supplier',
                    component: () => import(/* webpackChunkName: "supplier" */ '../components/page/main/purchase/Supplier.vue'),
                    meta: { title: '采购 - 供应商' }
                },
                {
                    path: '/supplierdetail',
                    name: 'supplierdetail',
                    component: () => import(/* webpackChunkName: "supplierdetail" */ '../components/page/main/purchase/SupplierDetail.vue'),
                    meta: { title: '采购 - 供应商 - 详情' }
                },
                {
                    path: '/transitcompany',
                    name: 'transitcompany',
                    component: () => import(/* webpackChunkName: "transitcompany" */ '../components/page/main/purchase/TransitCompany.vue'),
                    meta: { title: '采购 - 运输公司' }
                },
                {
                    path: '/transitcompanydetail',
                    name: 'transitcompanydetail',
                    component: () => import(/* webpackChunkName: "transitcompanydetail" */ '../components/page/main/purchase/TransitCompanyDetail.vue'),
                    meta: { title: '采购 - 运输公司 - 详情' }
                },
                {
                    path: '/containerinfo',
                    name: 'containerinfo',
                    component: () => import(/* webpackChunkName: "containerinfo" */ '../components/page/main/purchase/ContainerInfo.vue'),
                    meta: { title: '采购 - 货柜信息' }
                },
                {
                    path: '/containerinfodetail',
                    name: 'containerinfodetail',
                    component: () => import(/* webpackChunkName: "containerinfodetail" */ '../components/page/main/purchase/ContainerInfoDetail.vue'),
                    meta: { title: '采购 - 货柜信息 - 详情' }
                },
                {
                    path: '/customerinfo',
                    name: 'customerinfo',
                    component: () => import(/* webpackChunkName: "customerinfo" */ '../components/page/main/customer/CustomerInfo.vue'),
                    meta: { title: '客户信息' }
                },
                {
                    path: '/customerinfodetail',
                    name: 'customerinfodetail',
                    component: () => import(/* webpackChunkName: "customerinfodetail" */ '../components/page/main/customer/CustomerInfoDetail.vue'),
                    meta: { title: '客户信息 - 详情' }
                },
                {
                    path: '/iteminfo',
                    name: 'iteminfo',
                    component: () => import(/* webpackChunkName: "iteminfo" */ '../components/page/main/single/SingleInfo.vue'),
                    meta: { title: '单品 - 入库详情' }
                },
                {
                    path: '/iteminfonew',
                    name: 'iteminfonew',
                    component: () => import(/* webpackChunkName: "iteminfonew" */ '../components/page/main/single/SingleInfoNew.vue'),
                    meta: { title: '单品 - 添加单品' }
                },
               
                {
                    path: '/order',
                    name: 'order',
                    component: () => import(/* webpackChunkName: "order" */ '../components/page/main/sell/Order.vue'),
                    meta: { title: '销售 - 销售订单' }
                },
                {
                    path: '/orderinfoedit',
                    name: 'orderinfoedit',
                    component: () => import(/* webpackChunkName: "orderinfoedit" */ '../components/page/main/sell/OrderInfoEdit.vue'),
                    meta: { title: '销售 - 销售订单详情' }
                },
                {
                    path: '/sellstatistics',
                    name: 'sellstatistics',
                    component: () => import(/* webpackChunkName: "sellstatistics" */ '../components/page/main/sell/SellStatistics.vue'),
                    meta: { title: '销售 - 销售统计' }
                },
                {
                    path: '/setting',
                    name: 'setting',
                    component: () => import(/* webpackChunkName: "setting" */ '../components/page/main/setting/Setting.vue'),
                    meta: { title: '参数配置' }
                },

                {
                    path: '/user',
                    name: 'user',
                    component: () => import(/* webpackChunkName: "user" */ '../components/page/main/UserManage.vue'),
                    meta: { title: '用户管理' }
                },

                {
                    path: '/typeform',
                    name: 'typeform',
                    component: () => import(/* webpackChunkName: "typeform" */ '../components/page/main/app/TypeForm.vue'),
                    meta: { title: 'app端 - 分类管理' }
                },
                {
                    path: '/hotlist',
                    name: 'hotlist',
                    component: () => import(/* webpackChunkName: "hotlist" */ '../components/page/main/app/HotList.vue'),
                    meta: { title: 'app端 - 热销菜单' }
                },
                {
                    path: '/custommenu',
                    name: 'custommenu',
                    component: () => import(/* webpackChunkName: "custommenu" */ '../components/page/main/app/CustomList.vue'),
                    meta: { title: 'app端 - 自定义菜单' }
                },
                {
                    path: '/appuser',
                    name: 'appuser',
                    component: () => import(/* webpackChunkName: "appuser" */ '../components/page/main/app/AppUser.vue'),
                    meta: { title: 'app端 - 会员管理' }
                },
               
                
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
             
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
