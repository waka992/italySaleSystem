<template>
    <div class="header">
        <div class="logo" ref="logo">
            进出库系统
            <div class="collapse-btn" @click.stop="showDropList">
                <i v-if="!collapse">+</i>
            </div>
            <div class="drop-list" v-show="dropCollapse">
                <span class="drop-list-item" v-for="list in headerList" :key="list.name">{{list.name}}</span>
            </div>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <!-- <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div> -->
                <!-- 消息中心 -->
                <!-- <div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="message?`有${message}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div> -->
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../assets/img/img.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
                        </a> -->
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            dropCollapse: false,
            fullscreen: false,
            name: 'linxin',
            message: 2,
            headerList: [
                {id: 0, name: '创建销售订单'}, 
                {id: 1, name: '添加流水'}, 
                {id: 2, name: '添加单品'}, 
                {id: 3, name: '添加新客户'}
            ]
        };
    },
    computed: {
        username() {
            let username = localStorage.getItem('ms_username');
            return username ? username : this.name;
        }
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                localStorage.removeItem('ms_username');
                this.$router.push('/login');
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        showDropList() {
            this.dropCollapse = !this.dropCollapse
        }
    },
    mounted() {
        document.addEventListener('click', (e) => { 
            let that = this
            if (!this.$refs.logo.contains(e.target)) this.dropCollapse = false 
        })
    }
};
</script>
<style scoped lang="scss">
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    font-size: 22px;
    color: #fff;
    background-color: #283457;
}
.collapse-btn {
    position: absolute;
    float: left;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    background-color: #2183EA;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    text-align: center;
    line-height: 21px;
    font-size: 22px;
    color: #fff;
    user-select: none;

    i {
        font-style: normal;
    }
}
.header .logo {
    position: relative;
    box-sizing: border-box;
    float: left;
    width: 165px;
    line-height: 70px;
    padding-left: 26px;
    background-color: #001529;
    font-size: 14px;
}

.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 48px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 22px;
    height: 22px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.drop-list {
    position: absolute;
    z-index: 999;
    top: 60px;
    left: 63px;
    width: 150px;
    padding: 2px 0;
    line-height: 1;
    background-color: #fff;
    display: inline-block; 
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.5);
    border-radius: 8px;
    overflow: hidden;
    

    &::after {
        content: '';
        position: absolute;
        top: -8px;
        border: 4px solid transparent;
        border-bottom: 4px solid #fff;

        @include xcenter;
    }
}

.drop-list-item {
    display: inline-block;
    border-bottom: 1px solid #E3E3E3;
    width: 100%;
    height: 38px;
    padding: 14px 0 0 12px;
    font-size: 9px;
    color: #1F1F21;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    cursor: pointer;
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background-color: rgba(0,0,0,.1);
    }
}
</style>
