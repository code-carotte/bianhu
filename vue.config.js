module.exports = {
    publicPath: './',
    devServer: {
        // host: 'localhost',
        // port: 8080,
        proxy: {
            '/api': {
                // 目标路径 
                target: 'http://api.vikingship.xyz/api',
                // 允许跨域 
                changeOrigin: true,
                // 重写路径 使用 api 代替了 http://api.vikingship.xyz/api
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
} 
