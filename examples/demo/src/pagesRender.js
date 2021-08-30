import React from 'react';
import { Router} from '@reach/router';
import { render } from 'react-dom';
import './pages-render.css'

const prefix = (()=>{
  let p = __PROJECT_CONFIG__.prefix;
  let alias = p + '-alias';
  if(location.pathname.indexOf(alias) === 0){
    return alias
  }
  return p || '/';
})();

const InitTitleComponent = (props) => {
  const {title, Child} = props;  //eslint-disable-line
  if (title) {
    document.title = title;
  }
  return <Child {...props} />;
};

const PreviewCreator = (pages) => () => {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="yxpack-preview-table">
        <h3>页面列表</h3>
        <table>
          <thead><tr><th>标题</th><th>路径</th></tr></thead>
          <tbody>
            {pages.map((item) => {
              const routerPrefix = prefix === '/' ? '' : prefix;
              return (
                <tr key={item.name}>
                  <td>{new Array(item._level - 1).fill(0).map(()=> '　').join('')}{item.title || ''}</td>
                  <td><a href={routerPrefix + item.router }>{item.name} </a></td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    );
  }
  return <h1>路径有误，请联系管理员</h1>;
};

export default (pageComponents, hoc) => {
  const pages = __PAGES__.map((item) => {
    const PageComponent = React.lazy(pageComponents[item.name]);
    return {
      ...item,
      key: item.name,
      Child: hoc ? hoc(item)(PageComponent) : PageComponent,
    };
  });
  const Preview = PreviewCreator(pages);
  const App = ()=>{
    return (
      <React.Suspense fallback={""}>
        <Router basepath={prefix || '/'}>
          <Preview path="/page-preview" />
          {pages.map((item) => {
            return <InitTitleComponent
              {...item}
              path={item.router + (item.spa ? '/*' : '')}
              key={item.router}
            />
          })}
        </Router>
      </React.Suspense>
    );
  }

  return render(<App />, document.getElementById('root'));
};
