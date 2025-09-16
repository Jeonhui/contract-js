import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import onlyWarn from 'eslint-plugin-only-warn';
import turbo from 'eslint-plugin-turbo';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            'only-warn': onlyWarn,
            turbo,
        },
        rules: {
            ...turbo.configs.recommended.rules,
        },
    },
    prettier,
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
);
