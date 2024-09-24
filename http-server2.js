//  创建一个http server 用于测试nginx 的反向代理能力
const http = require('http');

const server = http.createServer((req, res) => {
    console.log('hello http!', req.url, req.method);
    if(req.url === '/') {
        console.log('请求根目录!');
        return res.end('hello http-world');
    }
    // res.end('hello world2!');
    // 匹配路径 (get请求)
    if(req.url === '/api/api-get') {
        console.log('get');
        return res.end('get ok!');
    }

    if(req.url === '/api/api-post') {
        console.log('post');
        return res.end('post ok');
    }

    res.end('no match resourse');
});

server.listen(8002);