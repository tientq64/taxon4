import { author, description, keywords } from '../package.json'

export const vitePluginHtmlConfig = {
	favicon: '/assets/images/logo.png',
	metas: [
		{
			name: 'description',
			content: description
		},
		{
			name: 'keywords',
			content: keywords.join(', ')
		},
		{
			name: 'author',
			content: author.name
		},
		{
			name: 'theme-color',
			content: '#18181b'
		},
		{
			name: 'google-site-verification',
			content: 'dQ_LkLS43v_KhwEt6AoceDvnvCSbtySzpep94DvkmI4'
		}
	],
	links: [
		{
			rel: 'stylesheet',
			href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,200'
		}
	]
}
