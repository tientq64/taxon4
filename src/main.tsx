import m from 'mithril'
import { App } from './App'
import './main.scss'

const appEl = document.querySelector<HTMLDivElement>('#app')!
m.mount(appEl, App)
