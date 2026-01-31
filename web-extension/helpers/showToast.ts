import { pull } from 'lodash-es'
import { nanoid } from 'nanoid'
import { proxy } from 'valtio'
import { ext } from '../store/ext'

export const defaultToastDuration: number = 3000

export interface Toast {
	/** ID của thông báo. */
	id: string

	/** Nội dung thông báo. */
	message: string

	/** Thời lượng tự động đóng thông báo, tính bằng mili giây. */
	duration: number

	timeoutId: number

	/** Đặt lại thời lượng tự động đóng thông báo. */
	updateDuration: (duration: number) => Toast

	/**
	 * Cập nhật thông báo.
	 *
	 * @param toast Đối tượng {@link Toast} cần cập nhật.
	 * @param message Nội dung thông báo mới, nếu có.
	 * @param duration Thời lượng tự động đóng thông báo mới. Nếu không được đặt, nó sẽ
	 *   được đặt theo giá trị mặc định là `3000`.
	 * @returns Đối tượng {@link Toast} hiện tại.
	 */
	update: (message?: string, duration?: number) => Toast

	/** Đóng thông báo. */
	close: () => void
}

/**
 * Hiện thông báo đẩy lên màn hình trong một khoảng thời gian.
 *
 * @param value Nội dung thông báo.
 * @param duration Khoảng thời gian hiển thị thông báo, tính theo mili giây, mặc định là
 *   `3000`. Nếu muốn đóng thông báo thủ công, có thể đặt là `Infinity` để nó không tự
 *   động đóng.
 * @returns Một đối tượng {@link Toast}.
 */
export function showToast(value: unknown, duration: number = defaultToastDuration): Toast {
	const message: string = String(value)

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
