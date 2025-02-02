import { find, remove } from 'lodash-es'
import { nanoid } from 'nanoid'
import { create, StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { matchUrl } from '../helpers/matchUrl'

export interface Sites {
	wikipedia: boolean
	wikispecies: boolean
	flickr: boolean
	inaturalistSearch: boolean
	inaturalistTaxon: boolean
	herpmapper: boolean
	repfocus: boolean
}

export interface Toast {
	id: string
	message: string
	duration: number
}

export interface ExtStore {
	sites: Sites

	comboKeys: string[]
	setComboKeys: (comboKeys: string[]) => void

	mouseDownSel: string
	setMouseDownSel: (mouseDownSel: string) => void

	hasSubspecies: boolean
	setHasSubspecies: (hasSubspecies: boolean) => void

	toasts: Toast[]
	showToast: (message: string, duration?: number) => Toast
	pushToast: (toast: Toast) => void
	updateToastMessage: (toast: Toast, message?: string, duration?: number) => void
	closeToast: (toast: Toast) => void
}

export const initialComboKeys: string[] = ['', '', '']

const extStore: StateCreator<ExtStore, [['zustand/immer', never]]> = (set, get) => ({
	sites: {
		wikipedia: matchUrl('https://^+.wikipedia.org/wiki/^+'),
		wikispecies: matchUrl('https://species.wikimedia.org/wiki/^+'),
		flickr: matchUrl('https://www.flickr.com/^*'),
		inaturalistSearch: matchUrl('https://www.inaturalist.org/taxa/search^+'),
		inaturalistTaxon: matchUrl(String.raw`https://www.inaturalist.org/taxa/\d+-^+`),
		herpmapper: matchUrl('https://herpmapper.org/taxon/^+'),
		repfocus: matchUrl('https://repfocus.dk/^+.html')
	},

	comboKeys: [...initialComboKeys],
	setComboKeys: (comboKeys) => set({ comboKeys }),

	mouseDownSel: '',
	setMouseDownSel: (mouseDownSel) => set({ mouseDownSel }),

	hasSubspecies: false,
	setHasSubspecies: (hasSubspecies) => set({ hasSubspecies }),

	toasts: [],
	showToast: (message, duration = 3000) => {
		const toast: Toast = {
			id: nanoid(),
			message,
			duration
		}
		get().pushToast(toast)
		return toast
	},
	pushToast: (toast) => {
		set((state) => {
			state.toasts.push(toast)
		})
	},
	updateToastMessage: (toast, message, duration = 3000) => {
		set((state) => {
			const toast2 = find(state.toasts, { id: toast.id })
			if (toast2 === undefined) return
			if (message !== undefined) {
				toast2.message = message
			}
			toast2.duration = duration
		})
	},
	closeToast: (toast) => {
		set((state) => {
			remove(state.toasts, { id: toast.id })
		})
	}
})

export const useExtStore = create<ExtStore>()(immer(extStore))
