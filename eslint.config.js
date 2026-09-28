import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        ignores: ['node_modules/**', 'dist/**', 'release/**'],
    },
    js.configs.recommended,
    eslintConfigPrettier,
    {
        files: ['**/*.{js,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tsParser,
        },
        plugins: {
            react,
            prettier,
            '@typescript-eslint': typescriptEslint,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            'prettier/prettier': 'error',
            'react/prop-types': 'off',
            'arrow-body-style': ['error', 'as-needed'],
            'react/react-in-jsx-scope': 'off',
            'react/display-name': 'off',
            'react/self-closing-comp': [
                'error',
                {
                    component: true,
                    html: true,
                },
            ],
            'no-redeclare': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'no-undef': 'off',
            'react/jsx-curly-brace-presence': [
                'error',
                { props: 'never', children: 'never' },
            ],
            'prefer-template': 'error',
            'no-multi-spaces': 'error',
            'no-useless-escape': 'off',
        },
    },
];
