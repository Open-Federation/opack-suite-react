const {createHandleInnerLoaderOptions, createHandleInnerRulusOptions} = require('./utils')

module.exports = (ctx)=>{
  const {loaders} = ctx;
  const {cacheLoader, babelLoader} = loaders;
  const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
  );
  
  const handleInnerLoaderOptions = createHandleInnerLoaderOptions(ctx);
  const handleInnerRulusOptions = createHandleInnerRulusOptions(ctx)
  const {projectConfig} = ctx;
  const {webpackBuild} = projectConfig;
  const {appends} = webpackBuild; 
  const {rules} = appends;

  return [
    /**
     * fix webpack5 https://github.com/graphql/graphql-js/issues/2721
     */
    { test: /\.m?js/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false
      }
    },
    handleInnerRulusOptions('ts')({
      test: /\.tsx?$/,
      use: [babelLoader],
      exclude: /node_modules/
    }),
    handleInnerRulusOptions('md')({
      test: /\.(md)$/,
      use: [
        {
          loader: 'html-loader',
          options: handleInnerLoaderOptions('html-loader')({})
        }
      ]
    }),
    handleInnerRulusOptions('js')({
      test: /\.js$/,
      /**
       * fix webpack5 https://github.com/graphql/graphql-js/issues/2721
       */
      type: 'javascript/auto', 
      use: [cacheLoader, babelLoader].filter((item) => item),
      exclude: /node_modules/
    }),
    handleInnerRulusOptions('css')({
      test: /\.css$/,
      use: loaders.cssRule
    }),
    handleInnerRulusOptions('scss')({
      test: /\.scss$/,
      use: loaders.scssRule
    }),
    handleInnerRulusOptions('less')({
      test: /\.less$/,
      use: loaders.lessRule
    }),
    handleInnerRulusOptions('font')({
      test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
      use: [{
        loader: 'url-loader',
        options: handleInnerLoaderOptions('font-url-loader')({
          limit: 1,
          name: 'fonts/[name].[ext]'
        })
      }]
    }),
    handleInnerRulusOptions('image')({
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: 'url-loader',
      options: handleInnerLoaderOptions('image-url-loader')({
        limit: imageInlineSizeLimit,
        name: 'static/imgs/[name].[hash:8].[ext]',
      }),
    }),
    handleInnerRulusOptions('json')({
      test: /\.json$/,
      loader: 'json-loader'
    }),
    ...rules
  ].filter(_p=> _p)
}