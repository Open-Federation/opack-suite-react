module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
          chrome: '58',
          ie: '11'
        },
        "useBuiltIns": "usage",
        "corejs": 2
      }
    ],
    '@babel/react'
  ],
  plugins: [
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-nullish-coalescing-operator'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/proposal-object-rest-spread', { legacy: true }],
    'lodash',
  ]
};
