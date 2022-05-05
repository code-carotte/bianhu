module.exports = {
    publicPath: './',
    devServer: {
        // host: 'localhost',
        // port: 8080,
        // 代理解决跨域 相当于是使用 http://localhost:8080 代理了 http://api.vikingship.xyz
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
// axios.get('http://localhost:8080/api/columns') OK
// axios.get('/api/columns') OK
