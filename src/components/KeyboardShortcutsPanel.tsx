import { ReactNode } from 'react'

export function KeyboardShortcutsPanel(): ReactNode {
	return (
		<div className="h-full overflow-auto scrollbar-none">
			<div className="grid grid-cols-[auto,auto] gap-y-2 [&>:nth-child(odd)]:text-zinc-400 [&>:nth-child(even)]:text-right">
				<div>Chuyển đổi ngôn ngữ popup</div>
				<div>V</div>

				<div>Mở popup tìm kiếm</div>
				<div>F</div>

				<div>Hủy bỏ, đóng</div>
				<div>Esc</div>
			</div>
		</div>
	)
}
