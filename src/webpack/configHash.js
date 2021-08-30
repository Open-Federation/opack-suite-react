/**
 * 基于 cache-loader hash 算法
 */


const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto-browserify');
function isFile(filepath) {
  try {
    let stat = fs.lstatSync(filepath);
    return stat.isFile()
  } catch (err) {
    return false;
  }
}
function digest(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function getConfigContent(projectPath, files = []) {
  const configFiles = [...files];
  let content = '';

  const rootFiles = fs.readdirSync (projectPath);
  const exts = ['.js', '.json', '.lock']
  rootFiles.forEach(rootFile=>{
    const extName = path.extname(rootFile);
    if(exts.includes(extName)){
      configFiles.push(path.resolve(projectPath, rootFile))
    }
  })
  
  configFiles.forEach((item) => {
    if (isFile(item)) {
      content = content + fs.readFileSync(item);
    }
  });
  return content;
}

function configHash(content, str = '') {
  return digest(content + str);
}

module.exports = { getConfigContent, configHash };
