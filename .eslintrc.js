// ESLint配置文件
module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
  },
  root: true,
  env: {
    node: true,
  },
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  extends: [
    '@vue/prettier',
    'plugin:vue/essential',
    'plugin:prettier/recommended',
  ],
}
