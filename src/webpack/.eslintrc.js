module.exports = {
  env: {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  root: true,
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parser: "babel-eslint",
  globals: {
    process: true,
    __PAGES__: true,
    __dirname: true,
    __PROJECT_CONFIG__: true,
    
  },
  parserOptions: {
    "ecmaFeatures": {
      "jsx": true,
      "legacyDecorators": true
    },
    "sourceType": "module"
  },
  "settings": {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "16.2.0", // React version, default to the latest React stable release
    },
    "propWrapperFunctions": ["forbidExtraProps"]
  },
  plugins: [
    "react",
    "import",
    "react-hooks"
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn", // 检查 effect 的依赖
    "indent": ["error", 2],
    "react/jsx-indent": ["error", 2],
    "no-console": ["off"],
    "no-debugger": ["off"],
    "import/no-unresolved": ["off"],
    "comma-dangle": ["off"],
    "react/no-find-dom-node": ["off"],
    'no-undef': ["warn"],
    'no-unused-vars': ["warn"],
    'react/display-name': ["off"],
    'react/react-in-jsx-scope': ['off'],
    'no-empty': ['off'],
    "complexity": ["error", 30],
    "max-depth": ["error", 4],
    "max-nested-callbacks": ["error", 3],
    "no-useless-escape": [0]
  }
};