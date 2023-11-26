module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    '@nuxtjs'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    indent: ['error', 2, { flatTernaryExpressions: true }]
  }
}
