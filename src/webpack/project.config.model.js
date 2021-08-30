
module.exports = {
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
      
      innerLoaderOptions: (loaderName)=> (options)=> {
        if(loaderName){
          console.info(options)
        }
        return options;
      },
      innerPluginOptions: (pluginName)=> (options)=>{
        if(pluginName){
          console.info(options)
        }
        return options;
      },
      /**
       * 暂不支持
       */
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
  },
}