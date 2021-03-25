const path = require('path')
const webpack = require('webpack')
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
        },
            optimization: {
                splitChunks: {
                    chunks: 'async',
                    minSize: 30000,
                    maxSize: 0,
                    minChunks: 1,
                    maxAsyncRequests: 5,
                    maxInitialRequests: 3,
                    automaticNameDelimiter: '~',
                    name: true,
                    cacheGroups: {
                      vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                      },
                      default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                      }
                    }
                  }
            },
            plugins: [
                new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) // 忽略momentjs语言包
            ]
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