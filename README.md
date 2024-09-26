# nginx 的安装和启动

### 下载地址（windows 安装最为简单）
1. 这是下载地址 [nginx url](https://nginx.org/en/download.html);    
2. 下载最稳定的版本：下图标示
![Nginx下载版本截图](static/images/nginx.jpg "nginx")
3. 找到自己下载的文件， 解压并进入文件(存在nginx.exe的那一层目录)， 执行start nginx.exe, 会看到一闪而过现象， 
4. 然后在本层目录下， 有个conf ， 进入查看nginx.conf文件, 
![nginx_conf](static/images/nginx_conf.png),
会看到默认的server地址是localhost:80， 访问看这个下面的界面， 就是启动成功了
![access_nginx](/static/images/access_nginx.png)
5. 一些nginx的操作
    1. nginx -s stop 强制关闭nginx 进程
    2. nginx -s quit 这种方式比较温和， 会等进程处理任务完成之后关闭进程
    3. nginx -v 查看版本
    4. nginx -s reload  修改配置之后， 重新加载配置
    5. tasklist | findstr nginx  查看当前nginx 的进程
        1.下列图片显示
        ![find nginx](/static/images//find_nginx.png)
    6. nginx -t 查看配置文件是否有语法错误
    
### 在windows 使用nginx 的过程中碰到一些问题
1. 多次启动nginx,  会造成多个nginx进程同时运行，影响电脑性能， 改变配置文件， 可能无效等问题， 解决方法就是杀掉所有的nginx 进程。为避免这个问题 保证关掉上一个nginx进程， 再开启新的nginx 服务  
杀掉所有nginx 进程命令： 
`
taskkill /f /im nginx.exe
`
![kill nginx](/static/images/kill_nginx.png)
---
# linux的安装
过程未整理, 留坑位，以后整理，目前只为熟悉nginx 的操作。 在window 系统上操作  
---
# 文件目录
```
|--cert                 存放证书
|--static               静态文件,
|  --images             存放照片 
|--vue                  创建的vue项目， 模拟client端，发出请求
|--.gitignore       
|--http-server.js       创建http server, client 向这个服务器发出请求
|--https-server.js      创建https server, client 向这个服务器发出请求
```
# nginx的配置，反向代理以实现client的跨域请求
1. 运行http-server.js/https-server.js 的请求，会得到一个localshot:8000/localhost:8001的server
2. client 端， 请cd 进入执行vue 项目， npm run dev 运行项目，项目运行在localhost:8081, 会在浏览器得到一个页面， 如下
    ![vue-demo](/static/images/vue-demo.png)
3. 这样， 当我们从client(localhost:8081) 发出请求到server(localhost:8001)， 肯定是跨域的， 我们配置nginx解决这个问题，配置如下图。 配置```proxy_pass  http://localhost:8001/``` 以及 设置响应头 ```add_header 'Access-Control-Allow-Oringin' '*' #(允许所有请求源跨域请求)```,  还有一些其他响应头添加可设置, 这里不再记录。
    ![nginx-conf-cross-origin](/static/images/nginx-conf-cross-origin.png)
4. 请求路径：client端是 localhost:8081 => nginx server是 localhost:80(反向代理，代理的是目标server) =>  目标server 是localhost:8000， 这样client 端就可以请求目标server的资源

# 负载均衡
1. 在ningx.conf 中配置upstream(上游服务器群, 也是反向代理得服务器群)
```
http: {
    // ...... 省略其他配置
    upstream myserver {
        // 当请求到这里时， 默认是轮询请求；可以通过配置weight, 分配请求.
        // weight是配置服务器得权重， 对应得到分配请求得数量， 这就是负载均衡，避免服务器压力过大
        // ip_hash 绑定处理请求得服务器。第一次请求时， 会根据客户端得IP 算出一个hash， 将请求分配到集群中得某一个服务器， 后续这个客户端得所有请求， 都只在这个服务器处理，
        ip_hash;
        server localhost:8000 weight=1; 
        server localhost:8001 weight=1; 
        ...
    }
    // ...... 省略其他配置
}
```
2. 在location 中使用上游服务器群
```
http: {
    ......
    server: {
        ...
        listen 80;
        server_name localhost;
        location / {
            proxy_pass http://myserver/;
            ...
        }
        ...
    }
    ......
}
```
3. 本案例测试得方法
    1.  分别运行http-server.js/ http-server2.js , 会启动两个服务器localhost:8001/localhost:8002, nginx.conf 已经配置好这两个server, 
    2.  运行nginx,  访问nginx(本案例是访问localhost:80); 查看服务端输出验证

# 动静分离（静态资源存储在nginx, 动态资源从目标资源请求到nginx， 再转发到请求客户端）
1. 我是把本项目中得static文件放到了nginx得根目录中，只是一些照片
2. 在nginx.conf 中配置location
```
......
#　~* 得意思是匹配规则使用正则， 且不区分大小写
# location 得匹配规则还有待学习......
location ~* \.(png|jpg)$ {
    root static/images;
}
......
```
3. 浏览器中请求localhost:8009/kill_nginx.png ,可以成功看到照片，
# https 服务器得反向代理
1.  首先， 创建一个https 服务器（https-server.js 文件）
2.  针对nginx , 在配置https 得反向代理时， 需要将证书文件放在/conf文件夹下， 和nginx.conf 同目录
3.  在配置https得server中，配置证书
```
......
# 省略一些配置
server {
    listen 443 ssl;
    server_name localhost;

    ssl_certificate cert/certificate.pem;
    ssl_certificate_key cert/private.pem;

    location / {
        root html
        index index.html index.htm;
        proxy_pass https://localhost:8000/
    }
}
......
```


