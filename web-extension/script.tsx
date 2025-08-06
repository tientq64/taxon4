import { createRoot } from 'react-dom/client'
import { App } from './App'
import './style.css'

const cssText: string = GM_getResourceText('css')
GM_addStyle(cssText)

/** Element gốc của userscript này. */
export const rootEl = document.createElement('div')

rootEl.className = 'taxon4'
document.body.appendChild(rootEl)

const root = createRoot(rootEl)
root.render(<App />)
