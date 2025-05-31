import vitePluginTailwind from '@tailwindcss/vite'
import { build } from 'vite'
import vitePluginHtml from 'vite-plugin-html-config'
import { vitePluginHtmlConfig } from './vitePluginHtmlConfig'

await build({
	plugins: [vitePluginHtml(vitePluginHtmlConfig), vitePluginTailwind()]
})
