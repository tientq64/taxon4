import { reject } from 'lodash-es'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

interface Toast {
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
	updateToastMessage: (toast: Toast, message: string) => void
	closeToast: (toast: Toast) => void
}

export const initialComboKeys: string[] = ['', '', '']

export const useExtStore = create<ExtStore, [['zustand/persist', Partial<ExtStore>]]>(
	persist(
		(set, get) => ({
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
				set({ toasts: [...get().toasts, toast] })
			},
			updateToastMessage: (toast, message) => {
				set({
					toasts: get().toasts.map((toast2) => {
						return toast2.id === toast.id ? { ...toast2, message } : toast2
					})
				})
			},
			closeToast: (toast) => {
				set({ toasts: reject(get().toasts, { id: toast.id }) })
			}
		}),
		{
			name: 'tientq64/taxon4:extension',
			partialize: () => ({})
		}
	)
)
