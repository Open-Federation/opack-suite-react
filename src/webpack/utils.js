const createHandleInnerLoaderOptions = (ctx)=> (name)=>(options = {})=>{
  const {projectConfig} = ctx;
  const {webpackBuild} = projectConfig;
  const {updates = {}} = webpackBuild; 
  const {innerLoaderOptions} = updates;
  if(!innerLoaderOptions)return options;
  let newData = innerLoaderOptions(name)(options)
  if(!newData)return undefined;
  if(Object.keys(newData).length === 0){
    return undefined;
  }
  return newData;
}

const createHandleInnerRulusOptions = (ctx)=> (name)=>(options = {})=>{
  const {projectConfig} = ctx;
  const {webpackBuild} = projectConfig;
  const {updates = {}} = webpackBuild; 
  const {innerRuleOptions} = updates;

  if(!innerRuleOptions)return options;
  let newData = innerRuleOptions(name)(options)
  if(!newData)return undefined;
  return newData;
}

const createHandleInnerPluginOptions = (ctx)=> (name)=>(options ={})=>{
  const {projectConfig} = ctx;
  const {webpackBuild} = projectConfig;
  const {updates = {}} = webpackBuild; 
  const {innerPluginOptions} = updates;

  if(!innerPluginOptions)return options;
  let newData =  innerPluginOptions(name)(options);
  if(!newData)return undefined;
  if(Object.keys(newData).length === 0){
    return undefined;
  }
  return newData;
}

exports.createHandleInnerLoaderOptions = createHandleInnerLoaderOptions;
exports.createHandleInnerPluginOptions = createHandleInnerPluginOptions;
exports.createHandleInnerRulusOptions = createHandleInnerRulusOptions;