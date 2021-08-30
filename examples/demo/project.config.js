module.exports = {
  title: 'test',
  key: "test", //项目appkey，请在camel注册
  apiPrefix: ['/api'], // api 代理前缀，devServer 使用
  sso: {
    enable: true
  },
  webpackBuild: {
    appends: {
      rules: [],
      alias: {},
      plugins: [],
      extensions: [],
    },
    updates:{
      htmlContent: (html) => {
        return html;
      },
      innerRuleOptions : (ruleName)=>(options)=>{
        return options;
      },
      innerLoaderOptions: (loaderName)=> (options)=> {
        return options;
      },
      innerPluginOptions: (pluginName)=> (options)=>{
        return options;
      },
      webpackChanel: ()=>{},
      /**
       * 不推荐使用
       * @param {*} config
       */
      __dangerouslySetCustomWebpackConfig(config) {
        return config;
      }
    },
    lifecycle: {
      before: ()=>{

      },
      after: ()=>{

      }
    },
  }
};
