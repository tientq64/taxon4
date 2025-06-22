import { pull } from 'lodash-es'
import { nanoid } from 'nanoid'
import { proxy } from 'valtio'
import { ext } from '../store/ext'

export const defaultToastDuration: number = 3000

export interface Toast {
	id: string
	message: string
	duration: number
	timeoutId: number
	updateDuration: (duration: number) => Toast
	update: (message?: string, duration?: number) => Toast
	close: () => void
}

/**
 * Hiện thông báo đẩy lên màn hình trong một khoảng thời gian.
 *
 * @param message Nội dung thông báo.
 * @param duration Khoảng thời gian hiển thị thông báo, tính theo mili giây, mặc định là
 *   `3000`. Nếu muốn đóng thông báo thủ công, có thể đặt là `Infinity` để nó không tự
 *   động đóng.
 * @returns Một đối tượng {@link Toast}.
 */
export function showToast(message: string, duration: number = defaultToastDuration): Toast {
	const toast: Toast = proxy({
		id: nanoid(),
		message,
		duration,
		timeoutId: 0,

		updateDuration: (duration) => {
			window.clearTimeout(toast.timeoutId)
			if (duration !== Infinity) {
				toast.timeoutId = window.setTimeout(toast.close, duration)
			}
			return toast
		},

		/**
		 * Cập nhật thông báo.
		 *
		 * @param toast Đối tượng {@link Toast} cần cập nhật.
		 * @param message Nội dung thông báo mới, nếu có.
		 * @param duration Thời lượng tự động đóng thông báo mới. Nếu không được đặt, nó
		 *   sẽ được đặt theo giá trị mặc định là `3000`.
		 * @returns Đối tượng {@link Toast} hiện tại.
		 */
		update: (message, duration = defaultToastDuration) => {
			if (message !== undefined) {
				toast.message = message
			}
			toast.updateDuration(duration)
			return toast
		},

		close: () => {
			pull(ext.toasts, toast)
		}
	})

	ext.toasts.push(toast)
	toast.updateDuration(duration)

	return toast
}
