const path = require('path')
module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import '~@/assets/css/reset.scss';` //新版本
            }
        }
    },
    configureWebpack:{
        resolve:{
          alias:{
            '@':path.resolve('./src')
          }
        }
    }
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
}