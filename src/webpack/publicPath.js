module.exports = (projectConfig)=>{
  const {task = 'dev', version} = projectConfig.runtimeConfig;
  const ISDEVSERVER = task === 'dev';
  let publicPath = '/';
  const bucket = 'grocery-fe-common-cdn';
  const bucketGroup = '1f3dca8fe8534e6fa640054bf3ad2ba6';

  if (!ISDEVSERVER) {
    // 如果项目配置文件中配置了publicPath，则直接使用该publicPath
    if (projectConfig.publicPath) {
      return projectConfig.publicPath;
    }
    if (task === 'publish') {
      publicPath = `https://s3.meituan.net/v1/mss_${bucketGroup}/${bucket}/${projectConfig.key}-${version}/static/`;
    } else {
      publicPath = '/static/';
    }
  }
  return publicPath;
}
