import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                Utils: 'readonly',
                Animations: 'readonly',
                App: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                IntersectionObserver: 'readonly',
                localStorage: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                performance: 'readonly',
                URLSearchParams: 'readonly',
                URL: 'readonly',
                Element: 'readonly',
                module: 'readonly',
                CustomEvent: 'readonly',
                Chart: 'readonly',
                FormData: 'readonly',
                Blob: 'readonly',
                sessionStorage: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
            'prefer-const': 'error',
            'no-var': 'error',
            'eqeqeq': 'error',
            'curly': 'error',
            'no-trailing-spaces': 'error'
        }
    }
];