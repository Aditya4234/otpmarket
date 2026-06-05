const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  {
    rules: {
      'no-unused-vars': 'off',
      'prefer-const': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];

export default eslintConfig;
