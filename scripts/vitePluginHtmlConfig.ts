import pkg from '../package.json'

export const vitePluginHtmlConfig = {
	favicon: '/assets/images/logo.png',
	metas: [
		{
			name: 'description',
			content: pkg.description
		},
		{
			name: 'keywords',
			content: pkg.keywords.join(', ')
		},
		{
			name: 'author',
			content: pkg.author.name
		},
		{
			name: 'theme-color',
			content: '#18181b'
		}
	],
	links: [
		{
			rel: 'stylesheet',
			href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,200'
		}
	]
}