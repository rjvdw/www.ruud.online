'use strict'

module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['src/js/**/*.js'],
      env: {
        node: false,
        browser: true,
      },
    },
    {
      files: ['tests/**/*.js'],
      env: {
        jest: true,
      },
    },
  ],
}
