const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server')
const color = require('bash-color');
const { getProjectConfig} = require('opack-cli');
const path = require('path')
const initProjectFromTemplatePath = require('./initTemplate.js')
const shell = require('shelljs')


const runDevServer = (options) => {
  const getWebpackConfig = require('./webpack/webpack.config');
  const webpackConfig = getWebpackConfig(options);
  const compiler = Webpack(webpackConfig);
  const devServerOptions = Object.assign({}, webpackConfig.devServer, {
    stats: {
      colors: true,
    },
  });
  process.stdout.write(color.yellow('服务正在启动中\n'))
  const server = new WebpackDevServer(compiler, devServerOptions);
  const detect = require('detect-port');

  const port = webpackConfig.devServer.port
  detect(port, (err, _port) => {
    if (err) {
      console.log(err);
    }

    if (port !== _port) {
      console.log(color.yellow(`port: ${port} was occupied, try port: ${_port}`));
    }
    webpackConfig.devServer.port = _port;
    server.listen(_port, webpackConfig.devServer.host, () => {
      process.stdout.write(color.green('服务启动成功\n'))
    });
  });

}

const build = (options, cb)=>{
  const projectConfig = getProjectConfig();
  const {webpackBuild} = projectConfig;
  const {lifecycle = {}} = webpackBuild;
  const {before, after} = lifecycle;
  if(before)before();
  const getWebpackConfig = require('./webpack/webpack.config');
  const webpackConfig = getWebpackConfig(options);
  const compiler = Webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString({
      chunks: false,  // Makes the build much quieter
      colors: true    // Shows colors in the console
    }));
    if(after)after();
    if(cb){
      cb()
    }
  })
}

const runBuildServer = (options) => {
  build(options)
}

module.exports = {
  init() {
    const projectPath = process.cwd();
    const template = path.resolve(__dirname, '../template');
    initProjectFromTemplatePath(template, projectPath);
    shell.cd(projectPath)
    console.log(require('bash-color').green('初始化完成'))
  },
  dev() {
    runDevServer({
      task: 'dev'
    })
  },
  build() {
    runBuildServer({
      task: 'build'
    })
  },
  pub() {
    console.log('pub')
  }
}
