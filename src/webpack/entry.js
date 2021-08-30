const path = require('path')

module.exports = (projectConfig)=> {
  const {runtimeConfig} = projectConfig;
  return {
    home: { import: [
      path.resolve(runtimeConfig.srcPath, './index')
    ]}
  }
}
