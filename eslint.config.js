import typescriptParser from '@typescript-eslint/parser'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
	{
		rules: {
			'eqeqeq': ['error', 'always', { null: 'ignore' }],
			'require-await': 'error',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'prefer-const': 'error'
		},
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: typescriptParser
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
			'jsx-a11y': jsxA11y,
			'@typescript-eslint': typescriptEslint
		}
	}
]
