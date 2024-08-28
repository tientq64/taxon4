import { ReactNode } from 'react'
import pkg from '../../package.json'

export function AboutPanel(): ReactNode {
	return (
		<div className="[&>:nth-child(odd)]:text-zinc-400 [&>:nth-child(even)]:mb-2">
			<div>Tên:</div>
			<div>{pkg.taxon4.displayName}</div>

			<div>Phiên bản:</div>
			<div>{pkg.version}</div>

			<div>Mô tả:</div>
			<div>{pkg.description}</div>

			<div>Tác giả:</div>
			<div>
				<a href={pkg.author.url} target="_blank">
					{pkg.author.name}
				</a>
			</div>

			<div>GitHub:</div>
			<div>
				<a href={pkg.repository.url} target="_blank">
					{pkg.repository.url}
				</a>
			</div>
		</div>
	)
}
