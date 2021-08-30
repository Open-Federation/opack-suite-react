const { getConfigContent, configHash } = require('./configHash');
const path = require('path');
const babelConfig = require('./babel.config')
const {createHandleInnerLoaderOptions} = require('./utils')
/**
 * 因为 babelConfig 和 postcssConfig 各个项目改动较多，所以提供自定义方法
 * @param {*} ctx 
 */
module.exports = (ctx)=>{
  const handleInnerLoaderOptions = createHandleInnerLoaderOptions(ctx);
  const {projectConfig} = ctx;
  const configContent = getConfigContent(projectConfig.curProjectPath);

  const { runtimeConfig } = projectConfig;
  const { task = 'dev' } = runtimeConfig;
  const ISDEVSERVER = task === 'dev';

  if(ISDEVSERVER){
    babelConfig.plugins.push('react-refresh/babel')
  }
  
  const babelLoader = {
    loader: 'babel-loader',
    options: handleInnerLoaderOptions('babel-loader')(babelConfig)
  };

  const postcssOptions = {
    postcssOptions: {
      plugins:[
        require('autoprefixer')({
          overrideBrowserslist:['last 10 versions','Firefox >= 20','Android >= 4.0','iOS >= 8']
        })
      ]
    }
  }

  const postcssLoader = {
    loader:'postcss-loader',
    options: handleInnerLoaderOptions('postcss-loader')(postcssOptions)
  }

  const cacheLoader =
    process.env.NODE_ENV === 'production'
      ? {
        loader: 'cache-loader',
        options: {
          cacheKey: (options, request) => {
            const { cacheDirectory } = options;
            const hash = configHash(configContent, request);
            return path.join(cacheDirectory, `${hash}.json`);
          }
        }
      }
      : null;
  
  const cssLoader = {
    loader: 'css-loader',
    options: handleInnerLoaderOptions('css-loader')({})
  }

  const sassLoader = {
    loader: 'sass-loader',
    options: handleInnerLoaderOptions('sass-loader')({})
  }

  const lessLoader = {
    loader: 'less-loader',
    options: handleInnerLoaderOptions('less-loader')({})
  }

  //初始化 webpack loaderas, entry, plugins
  return {
    cssRule: [cacheLoader, cssLoader, postcssLoader].filter((item) => item),
    scssRule: [cacheLoader, cssLoader, postcssLoader, sassLoader].filter((item) => item),
    lessRule: [
      cacheLoader,
      cssLoader,
      postcssLoader,
      lessLoader,
    ].filter((item) => item),
    cacheLoader,
    babelLoader
  };
};
