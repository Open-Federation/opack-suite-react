const path = require('path');
const fs = require('fs-extra');
const {getProjectConfig} = require('opack-cli');
const getDevTool = require('./source-map');
const defaultRuntimeConfig = require('./runtimeConfig')
require('./check')
const getPagesConfig = require('./page/getPagesConfig')

module.exports = (options = {}) => {
  const projectConfig = getProjectConfig();
  const curProjectPath = projectConfig.curProjectPath;
  projectConfig.runtimeConfig = {
    ...defaultRuntimeConfig,
    ...options
  }
  const {runtimeConfig} = projectConfig;

  const srcPath = path.resolve(curProjectPath, './src');  //这里统一定义 src 路径，方便未来支持多模块多路由独立打包

  const PageRootPath = path.resolve(srcPath, './pages');
  const buildPath = projectConfig.buildPath;
  const runtimeRootPath = path.resolve(curProjectPath, '.runtime');
  const ctx = {}; //存放一些各个模块公用的数据，非配置文件
  fs.ensureDirSync(runtimeRootPath);

  runtimeConfig.PageRootPath = PageRootPath;
  runtimeConfig.runtimeRootPath = runtimeRootPath;
  runtimeConfig.srcPath = srcPath;

  const pagesConfig = getPagesConfig(projectConfig);

  ctx.projectConfig = projectConfig;
  ctx.pagesConfig = pagesConfig;
  const loaders = require('./loaders')(ctx);
  ctx.loaders = loaders;

  const plugins= require('./plugins')(ctx);
  const externals = {};
  const publicPath = require('./publicPath')(projectConfig);
  const devServer = require('./devServer')(ctx)

  const {webpackBuild} = projectConfig;
  const {appends} = webpackBuild;

  const config = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    target: process.env.NODE_ENV === 'production' ? ['web', 'es5'] : 'web',
    entry: require('./entry')(projectConfig),
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(curProjectPath, buildPath, 'static'),
      publicPath,
      pathinfo: process.env.NODE_ENV === 'production' ? false : true
    },
    devServer,
    cache: process.env.NODE_ENV === 'development' ?true : false, //生产环境关闭缓存，避免引起一些奇怪问题，不建议开启
    resolve: {
      alias: {
        '~': path.resolve(curProjectPath, './'),
        ...appends.alias,
      },
      fallback :{
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
        "assert": false
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', ...appends.extensions]
    },
    devtool: getDevTool(),
    module: {
      rules: require('./rules')(ctx)
    },
    plugins: plugins,
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 262144,
        maxSize: 1048576,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'async',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            chunks: 'async',
            reuseExistingChunk: true,
          }
        }
      },
      minimize: process.env.NODE_ENV === 'production',
    },
    // stats: {
    //   children: false,
    //   assets: false,
    //   chunks: false,
    //   builtAt: false,
    //   chunkModules: false,
    //   cached:false,
    //   cachedAssets: false,
    //   modules: false,
    //   usedExports: false,
    //   moduleAssets:false,
    //   modulesSpace: 1,
    //   runtimeModules: false,
    // },
    // stats: 'errors-only',
    externals
  };
  /**
   * __dangerouslySetCustomWebpackConfig 不推荐使用，因为无法保证升级质量
   */
  return projectConfig.webpackBuild.updates.__dangerouslySetCustomWebpackConfig(config);
};
