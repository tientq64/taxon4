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
	ebird: boolean
	googleImage: boolean
}

export interface Toast {
	id: string
	message: string
	duration: number
	timeoutId?: number
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
	/**
	 * Hiện thông báo đẩy lên màn hình trong một khoảng thời gian.
	 *
	 * @param message Nội dung thông báo.
	 * @param duration Thời lượng tự động đóng thông báo, tính theo mili giây, mặc định là
	 *   `3000`. Nếu muốn đóng thông báo thủ công, có thể đặt là `Infinity` để nó không tự
	 *   động đóng.
	 * @returns Một đối tượng {@linkcode Toast}.
	 */
	showToast: (message: string, duration?: number) => Toast
	/**
	 * Thêm thông báo vào danh sách.
	 *
	 * @private
	 * @param toast Đối tượng {@linkcode Toast} cần thêm.
	 */
	pushToast: (toast: Toast) => void
	/**
	 * Cập nhật thông báo.
	 *
	 * @param toast Đối tượng {@linkcode Toast} cần cập nhật.
	 * @param message Nội dung thông báo mới, nếu có.
	 * @param duration Thời lượng tự động đóng thông báo mới. Nếu không được đặt, nó sẽ
	 *   được đặt theo giá trị mặc định là `3000`.
	 * @returns
	 */
	updateToast: (toast: Toast, message?: string, duration?: number) => void
	closeToast: (toast: Toast) => void
}

export const initialComboKeys: string[] = ['', '', '']
export const defaultToastDuration: number = 3000

const extStore: StateCreator<ExtStore, [['zustand/immer', never]]> = (set, get) => ({
	sites: {
		wikipedia: matchUrl('https://^+.wikipedia.org/wiki/^+'),
		wikispecies: matchUrl('https://species.wikimedia.org/wiki/^+'),
		flickr: matchUrl('https://www.flickr.com/^*'),
		inaturalistSearch: matchUrl('https://www.inaturalist.org/taxa/search^+'),
		inaturalistTaxon: matchUrl('https://www.inaturalist.org/taxa/\\d+-^+'),
		herpmapper: matchUrl('https://herpmapper.org/taxon/^+'),
		repfocus: matchUrl('https://repfocus.dk/^+.html'),
		ebird: matchUrl('https://ebird.org/species/^+'),
		googleImage: matchUrl('https://www.google.com/search^+')
	},

	comboKeys: [...initialComboKeys],
	setComboKeys: (comboKeys) => set({ comboKeys }),

	mouseDownSel: '',
	setMouseDownSel: (mouseDownSel) => set({ mouseDownSel }),

	hasSubspecies: false,
	setHasSubspecies: (hasSubspecies) => set({ hasSubspecies }),

	toasts: [],

	showToast: (message, duration = defaultToastDuration) => {
		const toast: Toast = {
			id: nanoid(),
			message,
			duration
		}
		if (duration !== Infinity) {
			toast.timeoutId = window.setTimeout(get().closeToast, duration, toast)
		}
		get().pushToast(toast)
		return toast
	},

	pushToast: (toast) => {
		set((state) => {
			state.toasts.push(toast)
		})
	},

	updateToast: (toast, message, duration) => {
		set((state) => {
			const toast2 = find(state.toasts, { id: toast.id })
			if (toast2 === undefined) return
			if (message !== undefined) {
				toast2.message = message
			}
			if (duration !== undefined) {
				window.clearTimeout(toast2.timeoutId)
				toast2.duration = duration
				if (duration !== Infinity) {
					toast2.timeoutId = window.setTimeout(get().closeToast, duration, toast)
				}
			}
		})
	},

	closeToast: (toast) => {
		set((state) => {
			remove(state.toasts, { id: toast.id })
		})
	}
})

export const useExtStore = create<ExtStore>()(immer(extStore))
