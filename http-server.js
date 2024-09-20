//  创建一个http server 用于测试nginx 的反向代理能力
const http = require('http');

const server = http.createServer((req, res) => {
    console.log('hello http!', req.url, req.method);
    res.end('hello world2!');
    // 匹配路径
    // if(req.url === '/api/get-api') {
    //     console.log('get');
    //     res.end('get ok!');
    // }
});

server.listen(8001);