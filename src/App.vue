<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>
<script>
import axios from 'axios';
import {Message} from 'element-ui'
import Router from 'vue-router';

export default {
    data(){
        return {
        }
    },
    mounted() {
    },
    methods: {
      
    }
}
</script>