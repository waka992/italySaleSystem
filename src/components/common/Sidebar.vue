<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#001529"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <image class="icon-img" :src="item.iconPic" v-if="item.iconPic"></image>
                            <i v-else :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                class="sub-menu-item"
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <image class="icon-img" :src="item.iconPic" v-if="item.iconPic"></image>
                        <i v-else :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '首页'
                },
         
                {
                    icon: 'el-icon-lx-calendar',
                    index: '1',
                    title: '公司',
                    subs: [
                        {
                            index: 'baseinfo',
                            title: '基本信息'
                        },
                        {
                            index: 'flowday',
                            title: '流水日记账'
                        },
                        {
                            index: 'ratestatics',
                            title: '盈利统计'
                        },
                        
                    ]
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '2',
                    title: '采购',
                    subs: [
                        {
                            index: 'support',
                            title: '供应商'
                        },
                        {
                            index: 'transport',
                            title: '运输公司'
                        },
                        {
                            index: 'container',
                            title: '货柜信息'
                        },
                        
                    ]
                },
                {
                    icon: 'el-icon-lx-people',
                    index: 'userinfo',
                    title: '客户信息'
                },
                {
                    icon: 'el-icon-lx-people',
                    index: 'single',
                    title: '单品'
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    title: '销售',
                    subs: [
                        {
                            index: 'soldorder',
                            title: '销售订单'
                        },
                        {
                            index: 'soldstatics',
                            title: '销售统计'
                        },
                    ]
                },
                {
                    icon: 'el-icon-lx-people',
                    index: 'user',
                    title: '用户管理'
                },
                // {
                //     icon: 'el-icon-lx-copy',
                //     index: 'tabs',
                //     title: 'tab选项卡'
                // },
                // {
                //     icon: 'el-icon-lx-calendar',
                //     index: '3',
                //     title: '表单相关',
                //     subs: [
                //         {
                //             index: 'form',
                //             title: '基本表单'
                //         },
                //         {
                //             index: '3-2',
                //             title: '三级菜单',
                //             subs: [
                //                 {
                //                     index: 'editor',
                //                     title: '富文本编辑器'
                //                 },
                //                 {
                //                     index: 'markdown',
                //                     title: 'markdown编辑器'
                //                 }
                //             ]
                //         },
                //         {
                //             index: 'upload',
                //             title: '文件上传'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-emoji',
                //     index: 'icon',
                //     title: '自定义图标'
                // },
                // {
                //     icon: 'el-icon-pie-chart',
                //     index: 'charts',
                //     title: 'schart图表'
                // },
                // {
                //     icon: 'el-icon-rank',
                //     index: '6',
                //     title: '拖拽组件',
                //     subs: [
                //         {
                //             index: 'drag',
                //             title: '拖拽列表'
                //         },
                //         {
                //             index: 'dialog',
                //             title: '拖拽弹框'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-global',
                //     index: 'i18n',
                //     title: '国际化功能'
                // },
            
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped lang="scss">
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
    border-right: none;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 165px;
}
.sidebar > ul {
    height: 100%;
}
.el-menu {
    border-right: none;
}
.sub-menu-item {
    background-color: #1E2441 !important;
}
.icon-img {
    width: 24px;
    height: 18px;
    display: inline-block;
}
</style>
