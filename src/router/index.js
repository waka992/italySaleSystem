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
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/main/home/HomePage.vue'),
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
                    path: '/iteminfonedit',
                    name: 'iteminfonedit',
                    component: () => import(/* webpackChunkName: "iteminfonedit" */ '../components/page/main/single/SingleInfoEdit.vue'),
                    meta: { title: '单品 - 查看单品信息' }
                },
                {
                    path: '/order',
                    name: 'order',
                    component: () => import(/* webpackChunkName: "order" */ '../components/page/main/sell/Order.vue'),
                    meta: { title: '销售 - 销售订单' }
                },
                {
                    path: '/sellstatistic',
                    name: 'sellstatistic',
                    component: () => import(/* webpackChunkName: "sellstatistic" */ '../components/page/main/sell/SellStatistic.vue'),
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
                    // component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/main/UserManage.vue'),
                    meta: { title: '会员管理' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
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
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
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
