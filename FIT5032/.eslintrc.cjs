/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    node: true, 
    browser: true,
  },
  rules: {
    'max-len': ['error', { code: 210 }], 
    'no-undef': 'off', 
    'no-unused-vars': 'warn', 
  },
  globals: {
    $: 'readonly',  
    process: 'readonly'  
  },
  overrides: [
    {
      files: ['src/components/icons/*.vue'],
      rules: {
        'max-len': 'off'  
      }
    }
  ]

}
