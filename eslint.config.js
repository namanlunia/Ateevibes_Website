import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.cleanup-baseline/**',
      'scripts/**',
      'src/__tests__/**',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'no-unreachable': 'error',
      'no-empty': 'error',
      'no-constant-condition': 'error',
      'no-debugger': 'error',
      'no-console': ['error', { allow: ['warn'] }], // we will restrict ErrorBoundary separately
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    files: ['src/components/ui/ErrorBoundary.tsx'],
    rules: {
      'no-console': ['error', { allow: ['error'] }],
    },
  }
);
