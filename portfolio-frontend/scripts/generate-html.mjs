import { readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const publicDir = join(dir, '..', '.output', 'public');

const assets = readdirSync(join(publicDir, 'assets'));
const cssFile = assets.find(f => f.startsWith('styles-'));
if (!cssFile) throw new Error('No CSS file found in assets');

const html = `<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Shashwat Bhajanka — Computer Science Student & Data Analyst</title>
    <meta name="description" content="Portfolio of Shashwat Bhajanka — CS student and data analyst building at the intersection of data, code, and impact." />
    <meta name="author" content="Shashwat Bhajanka" />
    <meta property="og:title" content="Shashwat Bhajanka — CS Student & Data Analyst" />
    <meta property="og:description" content="Editorial portfolio: education, experience, skills, and achievements." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="stylesheet" href="/static/assets/${cssFile}" />
    <link rel="icon" href="/static/favicon.ico" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" />
    <script>(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();</script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/static/client.js"></script>
  </body>
</html>`;

writeFileSync(join(publicDir, 'index.html'), html);
console.log('Generated index.html with CSS:', cssFile);
