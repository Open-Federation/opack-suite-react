const color = require ('bash-color');


function isFile(filepath){
  try{
    const fs = require('fs')
    let stat = fs.lstatSync(filepath);
    return stat.isFile()
  }catch(err){
    return false;
  }
}

function getCustomProxyConfig(runtimePath, projectConfig){
  let target = projectConfig.proxyTarget;
  let proxyCustomConfig = {};
  let mockConfig = {};
  const proxyConfigPath = require('path').resolve(runtimePath, './config.js');
  if(isFile(proxyConfigPath)){
    let _config = require(proxyConfigPath)
    target = _config.proxyTarget;
    proxyCustomConfig = _config.proxyConfig || {};
    mockConfig = _config.mockConfig || {};
  }

  let ssoEnv = 'test';

  if(proxyConfigPath.ssoEnv){
    ssoEnv = proxyConfigPath.ssoEnv;
  }
  Object.keys(proxyCustomConfig).forEach(key=>{
    proxyCustomConfig[key].secure = true;
    proxyCustomConfig[key].changeOrigin = true;
  })
  return {
    target,
    ssoEnv,
    proxyConfig: proxyCustomConfig,
    mockConfig
  };
}

module.exports = (apiPrefix = [], runtimePath, projectConfig) => {
  /**
   * target 是代理的域名
   * ssoEnv 指 sso 环境，默认会代理到 test 环境
   * proxyConfig 是用户自定义的代理，可参考 webpack-dev-server proxy
   * {
   *     target,
         secure: false,
         changeOrigin: true
   * }
   * mockConfig 是 yapi mock配置，key代表请求路径前缀，value指yapi项目id
   * {
   *    /api/xxx: 1
   * }
   */
  let {target, ssoEnv, proxyConfig, mockConfig} = getCustomProxyConfig(runtimePath, projectConfig);
  function router (req) {
    let keys = Object.keys (mockConfig);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (req.path.indexOf (key) === 0) {
        return projectConfig.yapi;
      }
    }
    return target;
  }

  let common = {
    target,
    secure: false,
    changeOrigin: true,
    pathRewrite: function (reqpath, req) {
      let apipath = reqpath;
      Object.keys(mockConfig).forEach(key=>{
        if(apipath.indexOf(key) === 0){
          apipath = '/mock/' + mockConfig[key] + apipath;
        }
      })

      let _target = router(req);
      process.stdout.write (
        `${color.yellow('Proxy')} "${color.blue(req.method)} ${req.path}" to "${color.green (_target + apipath)}"\n`
      );
      return apipath;
    },
    router: router,
  }

  let option = {
    ...proxyConfig
  }

  apiPrefix.forEach(apipath=>{
    option[apipath] = common
  })

  return {
    option,
    ssoEnv
  }
};
