// 创建一个https server , 用于测试nginx 的反向代理
const https = require('https');
const fs = require('fs');

const server = https.createServer({
    key: fs.readFileSync('cert/private.pem'),
    cert: fs.readFileSync('cert/certificate.pem'),
}, (req, res) => {
    console.log('hello, https!');
    res.writeHead(200);
    res.end('hello https!');
})

server.listen('8000');