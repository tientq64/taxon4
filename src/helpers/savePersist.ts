import store from '../App'
import { Persist } from './loadPersist'

export function savePersist(): void {
	const persist: Persist = {
		scrollTop: store.scrollTop
	}
	const text: string = JSON.stringify(persist)
	localStorage.setItem('taxon4:persist', text)
}
