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

const depends = {
  "@reach/router": "^1.3.4",
  "@yxfe/moox": "^1.0.9",
  "react": "^17.0.1",
  "react-dom": "^17.0.1"
}

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

  const packagePath = path.resolve(destDir, './package.json');
  const packageJson = require(packagePath);
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...depends,
  };

  fs.writeFileSync(path.resolve(destDir, './package.json'), JSON.stringify(packageJson,null,2))

  console.log('复制文件.ignore')
  fs.writeFileSync(path.resolve(destDir, './.gitignore'), gitignore);
}
