
const shell = require('shelljs');

function checkNode() {
  const nodeVersion = shell.exec('node -v', { silent: true });
  let v = +nodeVersion.trim().split('.')[0].substr(1);
  if ( v< 10 || v>14) {
    throw `错误的版本号:${nodeVersion}, node 版本必须大于10，小于14`;
  }

  const npmVersion = shell.exec('npm -v', { silent: true });
  if (npmVersion.trim().split('.')[0] < 5) {
    throw `错误的npm版本号:${npmVersion}, npm 版本必须大于5.0.0`;
  }
}

checkNode();