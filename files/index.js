// 引入 express 模块
const express = require("express");

// 创建 express 应用程序
const app = express();

// 引入子进程模块，用于执行命令
const { exec, execSync } = require('child_process');

// 引入 http 模块，用于发送 HTTP 请求
const http = require('http');

// 设置端口号，默认为 3000
const port = process.env.SERVER_PORT || process.env.PORT || 3000;    
    
// 设置 UUID，默认为指定的值
const UUID = process.env.UUID || '592a6331-1eb6-4032-9652-1d74b8f9e5e3';

// 设置 NZ_SERVER，默认为空字符串
const NZ_SERVER = process.env.NZ_SERVER || '';     

// 设置 NZ_PORT，默认为 5555
const NZ_PORT = process.env.NZ_PORT || '5555';

// 设置 NZ_KEY，默认为空字符串
const NZ_KEY = process.env.NZ_KEY || '';

// 设置 AG_DOMAIN，默认为空字符串
const AG_DOMAIN = process.env.AG_DOMAIN || '333.7897823com.cf';

// 设置 AG_AUTH，默认为空字符串
const AG_AUTH = process.env.AG_AUTH || 'eyJhIjoiOTMwYWVmZDFiODlhZDIzYzI2OTJiNzhhYmRhNTI2ZGIiLCJ0IjoiZDFiNTY1MGItNGQ5Mi00YjNlLWEyMGUtZmQ4MTY2MWE3OGY0IiwicyI6Ik1XSTVObVpqTm1RdE1UVmhOaTAwTVRrNExUaGpaV010TkRNMFlqRTNObVpsT0RFNSJ9';

// 设置 CFIP，默认为 'canva.com'
const CFIP = process.env.CFIP || 'canva.com';

// 设置 NAME，默认为 'Choreo'
const NAME = process.env.NAME || 'Choreo';

// 定义默认的网站地址数组
const defaultUrls = ['http://example1.com', 'http://example2.com', 'http://example3.com'];

// 从环境变量中获取网站地址数组，如果未设置则使用默认数组
const envUrls = process.env.WEB_URLS ? process.env.WEB_URLS.split(',') : [];

// 合并默认数组和环境变量数组，构成最终的网站地址数组
const WEB_URLS = defaultUrls.concat(envUrls);



// 根路由的重定向目标网站数组
const targetWebsites = [
  "https://www.khanacademy.org",
  "https://doodle.com",
  "https://kizi.com",
  "https://canva.io",
  "https://pexels.com",
  "https://whales.com",
  "https://fiverr.com",
  "https://cfgs.org",
  "https://www.canva.com",
  "https://www.last.fm",
  "https://www.coursera.org",
  "https://filmmovement.com",
  "https://tetr.io",
  "https://notion.so",
  "https://daringfireball.net"
];

// 根路由处理函数
app.get("/", function (req, res) {
// 随机选择一个网站
  const randomIndex = Math.floor(Math.random() * 15); 
  const randomWebsite = targetWebsites[randomIndex];
// 重定向到随机选择的网站
  res.redirect(308, randomWebsite);
});

// sub2024 路由处理函数
app.get('/sub2024', (req, res) => {
// 执行命令获取 Cloudflare 信息
  const metaInfo = execSync(
    'curl -s https://speed.cloudflare.com/meta',
    { encoding: 'utf-8' }
  );
// 解析 JSON 数据
  const meta = JSON.parse(metaInfo);
  const city = meta.city;
  const country = meta.country;
  const ISP = country + '-' + city;

// 构建 VMESS 配置信息
  const VMESS = { v: '2', ps: `${NAME}-${ISP}`, add: CFIP, port: '443', id: UUID, aid: '0', scy: 'none', net: 'ws', type: 'none', host: AG_DOMAIN, path: '/vm-2024-vm-2024?ed=2048', tls: 'tls', sni: AG_DOMAIN, alpn: '' };
  const vlessURL = `vless://${UUID}@${CFIP}:443?encryption=none&security=tls&sni=${AG_DOMAIN}&type=ws&host=${AG_DOMAIN}&path=%2Fvl-2024-vl-2024?ed=2048#${NAME}-${ISP}`;
  const vmessURL = `vmess://${Buffer.from(JSON.stringify(VMESS)).toString('base64')}`;
  const trojanURL = `trojan://${UUID}@${CFIP}:443?security=tls&sni=${AG_DOMAIN}&type=ws&host=${AG_DOMAIN}&path=%2Ftr-2024-tr-2024?ed=2048#${NAME}-${ISP}`;
  
  const base64Content = Buffer.from(`${vlessURL}\n\n${vmessURL}\n\n${trojanURL}`).toString('base64');

// 发送配置信息
  res.type('text/plain; charset=utf-8').send(base64Content);
});

// 运行 哪吒
let NZ_TLS = '';
if (NZ_SERVER && NZ_PORT && NZ_KEY) {
  const tlsPorts = ['443', '8443', '2096', '2087', '2083', '2053'];
  if (tlsPorts.includes(NZ_PORT)) {
    NZ_TLS = '--tls';
  } else {
    NZ_TLS = '';
  }
// 执行命令运行 哪吒
  const command = `nohup ./ntp -s ${NZ_SERVER}:${NZ_PORT} -p ${NZ_KEY} ${NZ_TLS} >/dev/null 2>&1 &`;
  try {
    exec(command);
    console.log('ntp is running');

    setTimeout(() => {
      runWeb();
    }, 2000);
  } catch (error) {
    console.error(`ntp running error: ${error}`);
  }
} else {
  console.log('NZ variable is empty, skip running');
  setTimeout(() => {
    runWeb();
  }, 2000);
}

// 执行命令运行 代理服务
function runWeb() {
  const command1 = `nohup ./apache -c ./c.json >/dev/null 2>&1 &`;
  exec(command1, (error) => {
    if (error) {
      console.error(`apache running error: ${error}`);
    } else {
      console.log('apache is running');
      setTimeout(() => {
        runServer();
      }, 2000);
    }
  });
}

// 运行隧道服务
function runServer() {
  let command2 = '';
  if (AG_AUTH.match(/^[A-Z0-9a-z=]{120,250}$/)) {
    command2 = `nohup ./Mysql tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ${AG_AUTH} >/dev/null 2>&1 &`;
  } else {
    command2 = `nohup ./Mysql tunnel --edge-ip-version auto --config tunnel.yml run >/dev/null 2>&1 &`;
  }

// 执行命令运行隧道服务
  exec(command2, (error) => {
    if (error) {
      console.error(`Mysql running error: ${error}`);
    } else {
      console.log('Mysql is running');
    }
  });
}

// 启动应用程序，监听指定端口
app.listen(port, () => console.log(`App is listening on port ${port}!`));



// 定义访问间隔时间为 5 分钟
const intervalTime = 5 * 60 * 1000;

// 定义定时任务，每隔 intervalTime 访问一次网站
setInterval(() => {
  // 遍历网站地址数组
  WEB_URLS.forEach((url) => {
    // 发起 HTTP GET 请求
    http.get(url, (resp) => {
      let data = '';
      // 监听响应数据
      resp.on('data', (chunk) => {
        data += chunk;
      });
      // 监听响应结束事件
      resp.on('end', () => {
        console.log(`Received response from ${url}: ${data}`);
      });
    }).on("error", (err) => {
      console.log(`Error accessing ${url}: ${err.message}`);
    });
  });
}, intervalTime);