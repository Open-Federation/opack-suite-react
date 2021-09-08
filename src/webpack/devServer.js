const path = require('path')
const fs = require('fs-extra');
const pages = [];

module.exports = ctx=>{
  const {projectConfig, pagesConfig} = ctx;
  const {runtimeConfig} = projectConfig;
  const {runtimeRootPath, task, srcPath} = runtimeConfig;
  const {server = {}} = projectConfig;

  const userCustomRuntimeConfig = require('./userCustom')(projectConfig.apiPrefix, runtimeRootPath, projectConfig);
  const ssoEnv = userCustomRuntimeConfig.ssoEnv;

  if(projectConfig.sso.enable && task === 'dev'){
    console.log('ssoEnv:', ssoEnv);
  }

  const previewPrefix = (projectConfig.prefix ? projectConfig.prefix.substr(1) : '');
  return {
    openPage: previewPrefix ? previewPrefix + '/page-preview' : 'page-preview',
    overlay: false,
    host: '0.0.0.0', //支持外部访问
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    port: 8765,
    hot: true,
    open: true,
    inline: true,
    historyApiFallback: true,
    proxy: userCustomRuntimeConfig.option,
    liveReload: false,
    before: (app) => {
      const run = function (req, res, next) {
        let pagePath = null;
        let maxLen = 0;
        console.log('HTTP REQUEST:', req.path)
        for(let i=0; i< pagesConfig.pagesModule.length; i++){
          const pageModule = pagesConfig.pagesModule[i];
          if(pageModule.router === req.path){
            pagePath = pageModule.name;
            break;
          }else if(req.path.indexOf(pageModule.router) === 0){
            if(pageModule.name.length > maxLen){
              maxLen = pageModule.name.length;
              pagePath = pageModule.name;
            }
          }
        }

        if(!pagePath){
          next();
          return;
        }

        const runtimePath = path.resolve(runtimeRootPath, './entryCode.js');
        if(pages.includes(pagePath)){
          next();
          return;
        }
        pages.push(pagePath);
        let code = pages.map(pageFilePath=>{
          return `"${pageFilePath}" : ()=> import('${srcPath}/pages/${pageFilePath}/index'),`
        }).join('\n')
        const content = `module.exports = {
         ${code}
        }`;
        const oldContent = fs.readFileSync(runtimePath, 'utf8');
        if (oldContent === content) {
          next();
        } else {
          console.log('The file was modified，compiler beging...');
          fs.writeFileSync(runtimePath, content, 'utf8');
          setTimeout(() => {
            next();
          }, 1000);
        }
      };


      if(server.before){
        server.before(app)
      }
      app.use(`${projectConfig.prefix}`, run);
    }
  }
}
