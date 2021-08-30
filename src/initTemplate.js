const fs = require('fs-extra')
const path = require('path')

const gitignore = `node_modules
dist
.DS_Store
.history
.vscode
.cache
.nyc_output
coverage
.runtime`;

module.exports = (srcDir, destDir)=>{
  fs.ensureDirSync(destDir);
  const pagesFile = fs.readdirSync (srcDir);
  const ignores = ['node_modules', 'dist']
  pagesFile.forEach(file=>{
    if(ignores.includes(file)){
      return;
    }
    const filepath = path.resolve(srcDir, file);
    console.info('复制文件：', filepath)
    fs.copySync(filepath, path.resolve(destDir, file))
  })
  console.log('复制文件.ignore')
  fs.writeFileSync(path.resolve(destDir, './.gitignore'), gitignore);
}