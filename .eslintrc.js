module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'typescript-sort-keys',
    'unused-imports',
    'prettier',
    'sort-class-members',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-nested-ternary': 'off',
    'no-plusplus': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'prettier/prettier': 'error',
    'react/destructuring-assignment': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/react-in-jsx-scope': 'off',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
    'unused-imports/no-unused-imports': ['error', { ignoreRestSiblings: true }],
    'sort-class-members/sort-class-members': [
      'error',
      {
        order: [
          '[static-properties]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[static-methods]',
          '[methods]',
          '[conventional-private-methods]',
        ],
        accessorPairPositioning: 'getThenSet',
      },
    ],
    // Commence custom rules (not from template)
    'no-void': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          // Do not allow full lodash import, only allow specific functions
          // i.e. import isEqual from 'lodash/isEqual'.
          'lodash',
          // Require .js extension on nextjs imports.
          // https://github.com/chakra-ui/chakra-ui/issues/7363
          'next/link',
          'next/router',
          // Require .js extension on any react-bootstrap imports.
          'react-bootstrap',
        ],
      },
    ],
    // @todo remove this once standard config merged.
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    // @todo: Some good rules to keep
    // no-alert
    // no-restricted-globals
    // react/button-has-type)
    // react/no-array-index-key
    // jsx-a11y/label-has-associated-control
    'arrow-body-style': 'off',
    'no-underscore-dangle': 'off',
  },
};
