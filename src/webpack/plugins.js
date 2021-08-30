const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const moment = require('moment');
const getHtmlContent = require('./page/html');
const path = require('path');
const {createHandleInnerPluginOptions, createHandleInnerLoaderOptions} = require('./utils')

const filterRule = (key)=>{
  if(key === 'NODE_ENV') return true;
  return key.indexOf('USER_') === 0;
}

const getEnv = (envs)=>{
  const newEnvs = {}
  Object.keys(envs).forEach(key=>{
    if(filterRule(key)){
      newEnvs[key] = envs[key];
    }
  })
  return newEnvs;
}

module.exports = (ctx) => {
  const { projectConfig, pagesConfig, loaders } = ctx;
  const { curProjectPath, buildPath, runtimeConfig } = projectConfig;
  const { task = 'dev' } = runtimeConfig;
  const ISDEVSERVER = task === 'dev';
  const env = getEnv(process.env);
  const handleInnerPluginOptions = createHandleInnerPluginOptions(ctx);
  const handleInnerLoaderOptions = createHandleInnerLoaderOptions(ctx);

  const {webpackBuild} = projectConfig;
  const {appends} = webpackBuild; 

  const devFlagPlugin = new webpack.DefinePlugin(handleInnerPluginOptions('DefinePlugin')({
    __PAGES__: JSON.stringify(pagesConfig.pagesModule),
    __PROJECT_CONFIG__: JSON.stringify(projectConfig),
    'process.env': JSON.stringify(env)
  }));

  const customHtmlContent = projectConfig.webpackBuild.updates.htmlContent || (r => r);
  const htmlContent = customHtmlContent(getHtmlContent(projectConfig));

  const ESLintPlugin = require('eslint-webpack-plugin');


  const plugins = [
    devFlagPlugin,
    require('progress-bar-webpack-plugin')(),
    new ESLintPlugin(handleInnerPluginOptions('ESLintPlugin')({
      baseConfig: require(path.resolve(__dirname, '.eslintrc.js'))
    })),
  ];

  plugins.push(
    new HtmlWebpackPlugin(handleInnerPluginOptions('HtmlWebpackPlugin')({
      title: projectConfig.title,
      template: path.resolve(__dirname, './page/index.html'),
      versionTime: moment().utcOffset(8).format('YYYY-MMDD-HH:mm:ss'),
      filename: ISDEVSERVER ? 'index.html' : path.resolve(curProjectPath, buildPath, 'index.html'),
      head: htmlContent.head.join('\n'),
      body: htmlContent.body.join('\n'),
      inject: false,
      minify: {
        collapseWhitespace: false,
        removeComments: false
      }
    }))
  );

  const cssLoader = ['cssRule', 'scssRule', 'lessRule']

  if (ISDEVSERVER) {
    //dev 环境css直接加载到 js
    Object.keys(loaders).forEach((item) => {
      if (cssLoader.includes(item)) {
        loaders[item].unshift({
          loader: 'style-loader',
          options: handleInnerLoaderOptions('style-loader')({})
        });
      }

    });

    plugins.push(new webpack.HotModuleReplacementPlugin(handleInnerPluginOptions('HotModuleReplacementPlugin')({})));
    const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
    plugins.push(new ReactRefreshWebpackPlugin(
      handleInnerPluginOptions('ReactRefreshWebpackPlugin')({})
    ))
  } else {
    //prd 环境提取 css 到文件
    Object.keys(loaders).forEach((item) => {
      if (cssLoader.includes(item)) {
        loaders[item].unshift(MiniCssExtractPlugin.loader);
      }

    });

    plugins.unshift(
      new MiniCssExtractPlugin(handleInnerPluginOptions('MiniCssExtractPlugin')({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[chunkhash].css'
      }))
    );
    plugins.unshift(new CleanWebpackPlugin(handleInnerPluginOptions('CleanWebpackPlugin')()));
  }

  /**
   * 多个参数，用数组处理
   */
  plugins.push(new webpack.ContextReplacementPlugin(
    ...handleInnerPluginOptions('ContextReplacementPlugin')([
      /moment[\\\/]locale$/, 
      /^\.\/(zh-cn|en-gb)$/
    ]))
  );
  
  plugins.push(
    ...appends.plugins
  )
  return plugins;

}