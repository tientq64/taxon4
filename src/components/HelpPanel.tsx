import { ReactNode } from 'react'
import { Descriptions } from './Descriptions'

export function HelpPanel(): ReactNode {
	return (
		<div className="h-full px-3 overflow-auto scrollbar-none">
			<Descriptions>
				<div>Chuyển đổi ngôn ngữ popup</div>
				<div>
					<kbd>V</kbd>
				</div>

				<div>Mở popup tìm kiếm</div>
				<div>
					<kbd>F</kbd>
				</div>

				<div>Hủy bỏ, đóng</div>
				<div>
					<kbd>Esc</kbd>
				</div>

				<div>Cuộn nhanh</div>
				<div>
					<kbd>Alt</kbd>+<kbd>Cuộn chuột</kbd>
				</div>
			</Descriptions>
		</div>
	)
}
