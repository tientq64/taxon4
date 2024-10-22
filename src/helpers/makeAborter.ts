/**
 * Tạo một đối tượng `AbortController`. Phương thức `abort` được bind giúp tránh lỗi mất tham chiếu đến đối tượng chứa nó khi gọi.
 * @returns Đối tượng `AbortController`.
 */
export function makeAborter(): AbortController {
	const aborter: AbortController = new AbortController()
	aborter.abort = aborter.abort.bind(aborter)

	return aborter
}
