module.exports = ()=> {
  const config = {
    head: [],
    body: []
  }
  if(process.env.NODE_ENV === 'development'){  //为加快本地页面速度，关闭第三方sdk，如需要，请自定义这部分
    return {
      head: [],
      body: []
    }
  }else{
    return config;
  }
}
