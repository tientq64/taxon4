import { createRoot } from 'react-dom/client'
import { App } from './App'
import './style.css'

const css: string = GM_getResourceText('css')
GM_addStyle(css)

/**
 * Element gốc của web extension này.
 */
export const rootEl: HTMLDivElement = document.createElement('div')

rootEl.className = 'taxon4'
document.body.appendChild(rootEl)

const root = createRoot(rootEl)
root.render(<App />)
