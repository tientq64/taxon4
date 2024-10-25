import { ReactNode } from 'react'
import { Descriptions } from './Descriptions'

/**
 * Mục hướng dẫn.
 */
export function HelpPanel(): ReactNode {
	return (
		<div className="h-full px-3 overflow-auto scrollbar-none">
			<Descriptions>
				<dt>Chuyển đổi ngôn ngữ popup:</dt>
				<dd>
					<kbd>V</kbd>
				</dd>

				<dt>Mở cửa sổ tìm kiếm:</dt>
				<dd>
					<kbd>F</kbd>
				</dd>

				<dt>Hủy bỏ, đóng:</dt>
				<dd>
					<kbd>Esc</kbd>
				</dd>

				<dt>Cuộn nhanh:</dt>
				<dd>
					<kbd>Alt</kbd>+<kbd>Cuộn chuột</kbd>
				</dd>
			</Descriptions>
		</div>
	)
}
