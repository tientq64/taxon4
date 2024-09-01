import { createRoot } from 'react-dom/client'
import { App } from './App'
import './style.scss'

const css: string = GM_getResourceText('css')
GM_addStyle(css)

export const rootEl: HTMLDivElement = document.createElement('div')
rootEl.className = 'taxon4'
document.body.appendChild(rootEl)

const root = createRoot(rootEl)
root.render(<App />)
