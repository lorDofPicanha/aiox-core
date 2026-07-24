const http=require('http'),fs=require('fs'),p=require('path');
const root="D:/AIOS/docs/projects/site-prospector/03-proposal-mockups";
const M={'.html':'text/html; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp'};
http.createServer((q,s)=>{let u=decodeURIComponent(q.url.split('?')[0]);if(u.endsWith('/'))u+='index.html';let f=p.join(root,u);fs.readFile(f,(e,d)=>{if(e){s.statusCode=404;return s.end('404 '+u);}s.setHeader('Content-Type',M[p.extname(f).toLowerCase()]||'application/octet-stream');s.end(d);});}).listen(8792,'127.0.0.1',()=>console.log('serving proposal-mockups on 8792'));
