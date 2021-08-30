const path = require('path');
const fs = require('fs');

function isFile(filepath) {
  try {
    let stat = fs.lstatSync(filepath);
    return stat.isFile()
  } catch (err) {
    return false;
  }
}

module.exports = (projectConfig) => {
  const { buildModules = [] } = projectConfig;
  const { runtimeRootPath, PageRootPath, } = projectConfig.runtimeConfig;
  let entryCode = ['module.exports = {']
  let pagesModule = [];
  let id = 1;

  const getId = () => {
    id++;
    return id;
  }

  let includeModules = null;
  if (process.env.MODULE) {
    let findModules = buildModules.find(item => item.name === process.env.MODULE);
    if (findModules) {
      includeModules = findModules.include;
      projectConfig.key = projectConfig.key + '-' + findModules.name;
    }
  }

  const findPagePath = (dirs = '', parentId = null, level = 1) => {
    const pagesFile = fs.readdirSync(dirs);
    pagesFile.forEach(file => {
      let stat = fs.lstatSync(path.resolve(dirs, file));
      if (!stat.isDirectory()) {
        return;
      }
      let configFilePath = path.resolve(dirs, file, 'page.config.js');
      if (!isFile(configFilePath)) return;
      if (!/^[a-z\\-]+$/.test(file)) {
        throw new Error('当前page:' + file + ', Page 路径只能由『小写字母，-』组成')
      }
      const customConfig = require(configFilePath);
      const dir = path.resolve(dirs, file);
      const name = dir.substr(PageRootPath.length + 1);
      const config = {
        _id: getId(),
        _pid: parentId,
        _level: level,
        title: name,
        name: name,
        dir,
        router: '/' + name,
        ...customConfig
      }
      pagesModule.push(config);
      findPagePath(dir, config._id, level + 1);
    })
  }
  findPagePath(PageRootPath)
  pagesModule.forEach(pageModule => {
    const { name, dir } = pageModule;
    if (includeModules && !includeModules.includes(name)) {
      return;
    }
    entryCode.push(`  "${name}" : ()=> import('${dir}/index'),`)
  });

  entryCode.push('}')
  entryCode = entryCode.join('\n')

  if (projectConfig.runtimeConfig.task === 'dev') {
    fs.writeFileSync(path.resolve(runtimeRootPath, 'entryCode.js'), 'module.exports = {}');
  } else {
    fs.writeFileSync(path.resolve(runtimeRootPath, 'entryCode.js'), entryCode);
  }
  return {
    pagesModule,  // 页面模块集合
  };
};
