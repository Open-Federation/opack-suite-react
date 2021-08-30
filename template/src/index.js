import pageComponents from '~/.runtime/entryCode'
import pagesRender from './pagesRender'

/**
 * 渲染多页面
 */
const hoc = (options) => (Wrap) => {
  if(process.env.NODE_ENV === 'development'){
    console.info(options)
  }
  return Wrap;
}
pagesRender(pageComponents, hoc)


/**
 * 热更新，请勿删除
 */
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }
}
