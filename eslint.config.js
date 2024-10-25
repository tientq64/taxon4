import typescriptParser from '@typescript-eslint/parser'
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
	{
		rules: {
			'eqeqeq': ['error', 'always', { null: 'ignore' }],
			'require-await': ['error'],
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn'
		},
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: typescriptParser
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
			'jsx-a11y': jsxA11y
		}
	}
]
