import typescriptParser from '@typescript-eslint/parser'

export default [
	{
		rules: {
			eqeqeq: ['error', 'always', { null: 'ignore' }]
		},
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: typescriptParser
		}
	}
]
