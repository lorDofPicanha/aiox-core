// Reusable Apify Instagram scraper for Site-Prospector.
// Usage: node ig-scrape.cjs <handle> <outDir> [limit]
const fs=require('fs'),p=require('path'),https=require('https');
const [handle,outDir,limitArg]=process.argv.slice(2);
const limit=parseInt(limitArg||'15',10);
if(!handle||!outDir){console.error('usage: node ig-scrape.cjs <handle> <outDir> [limit]');process.exit(1);}
// load token
const env=fs.readFileSync('D:/jarvis/apify.env','utf8');
const tok=(env.match(/APIFY_TOKEN\s*=\s*(.+)/)||[])[1];
if(!tok){console.error('no APIFY_TOKEN');process.exit(1);}
const token=tok.trim().replace(/["']/g,'');
fs.mkdirSync(outDir,{recursive:true});

function dl(url,dest){return new Promise((res,rej)=>{const f=fs.createWriteStream(dest);https.get(url,r=>{if(r.statusCode!==200){r.resume();return rej(new Error('img '+r.statusCode));}r.pipe(f);f.on('finish',()=>f.close(()=>res()));}).on('error',rej);});}

(async()=>{
  const input={directUrls:[`https://www.instagram.com/${handle}/`],resultsType:'posts',resultsLimit:limit,addParentData:false,searchType:'user'};
  const url=`https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${token}`;
  console.log('running apify instagram-scraper for @'+handle+' ...');
  const resp=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
  if(!resp.ok){console.error('apify HTTP',resp.status,(await resp.text()).slice(0,300));process.exit(2);}
  const items=await resp.json();
  console.log('got',items.length,'items');
  const prov={handle,capturedAt:new Date().toISOString(),source:`https://www.instagram.com/${handle}/`,posts:[]};
  let n=0;
  for(let i=0;i<items.length;i++){
    const it=items[i];
    const imgs=(it.images&&it.images.length?it.images:[it.displayUrl]).filter(Boolean);
    const files=[];
    for(let j=0;j<imgs.length;j++){
      const fn=`post${String(i+1).padStart(2,'0')}-img${j+1}.jpg`;
      try{await dl(imgs[j],p.join(outDir,fn));files.push(fn);n++;}catch(e){console.error('skip',fn,e.message);}
    }
    prov.posts.push({seq:i+1,type:it.type,url:it.url,timestamp:it.timestamp,likes:it.likesCount,comments:it.commentsCount,caption:(it.caption||'').slice(0,240),files});
  }
  // profile pic
  const pic=items.find(x=>x.ownerProfilePicUrl||x.profilePicUrl);
  if(pic){const u=pic.ownerProfilePicUrl||pic.profilePicUrl;try{await dl(u,p.join(outDir,'_profile-pic.jpg'));prov.profilePic=u;}catch(e){}}
  fs.writeFileSync(p.join(outDir,'provenance.json'),JSON.stringify(prov,null,1));
  console.log('DONE: downloaded',n,'images to',outDir);
})().catch(e=>{console.error('FATAL',e.message);process.exit(3);});
