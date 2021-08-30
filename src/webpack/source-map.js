module.exports = function getDevTool() {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return 'eval-cheap-module-source-map';
}