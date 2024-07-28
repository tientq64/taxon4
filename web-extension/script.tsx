import m from 'mithril'
import { App } from './pages/App'
import './style.scss'

const css: string = GM_getResourceText('css')
GM_addStyle(css)

export const rootEl: HTMLDivElement = document.createElement('div')
rootEl.className = 'taxon4'
document.body.appendChild(rootEl)

m.mount(rootEl, App)
