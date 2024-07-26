import store from '../App'

export type Persist = {
	scrollTop: number
}

export function loadPersist(): void {
	const text: string | null = localStorage.getItem('taxon4:persist')
	if (text) {
		try {
			const persist: Persist = JSON.parse(text)
			Object.assign(store, persist)
		} catch {}
	}
}
