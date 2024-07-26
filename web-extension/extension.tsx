import { App } from './pages/App'

const css: string = GM_getResourceText('css')
GM_addStyle(css)

const el = document.createElement('div')
el.className = 'taxon4'
document.body.appendChild(el)
//
;<App $mount=".taxon4" />
