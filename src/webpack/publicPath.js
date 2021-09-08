module.exports = (projectConfig)=>{
  const {task = 'dev', version} = projectConfig.runtimeConfig;
  const ISDEVSERVER = task === 'dev';
  let publicPath = '/';

  if (!ISDEVSERVER) {
    // 如果项目配置文件中配置了publicPath，则直接使用该publicPath
    if (projectConfig.publicPath) {
      return projectConfig.publicPath;
    }
    publicPath = '/static/' + version;
  }
  return publicPath;
}
