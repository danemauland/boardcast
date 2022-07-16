const httpProxy = require('http-proxy');
const http = require('http')
const url = require('url');

const proxy = httpProxy.createProxyServer({});

const options = {
    '/dev/api': 'http://localhost:3002',
    '/dev/': 'http://localhost:3001',
}

const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;

    for (const [pattern, target] of Object.entries(options)) {
        if (pathname.startsWith(pattern)) {
            console.log({target})
            proxy.web(req, res, {target});
            break;
        }
    }
})

console.log("listening on port 3000")
server.listen(3000);