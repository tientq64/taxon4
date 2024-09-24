import dayjs, { Dayjs } from 'dayjs'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import pkg from '../../package.json'

export function AboutPanel(): ReactNode {
	const aborter: AbortController = new AbortController()
	const [latestCommitDate, setLatestCommitDate] = useState<Dayjs | null>(null)

	const handleLatestCommitData = useCallback((commit: any): void => {
		const newLatestCommitDate: Dayjs = dayjs(commit.commit.committer.date)
		setLatestCommitDate(newLatestCommitDate)
	}, [])

	useEffect(() => {
		fetch('https://api.github.com/repos/tientq64/taxon4/branches/main', {
			signal: aborter.signal
		})
			.then((res: Response) => res.json())
			.then((data: any) => {
				handleLatestCommitData(data.commit)
			})
		return () => {
			aborter.abort()
		}
	}, [])

	return (
		<dl className="px-3 pt-1 [&>:nth-child(even)]:mb-2 [&>:nth-child(odd)]:text-zinc-400">
			<dt>Tên:</dt>
			<dd>{pkg.meta.displayName}</dd>

			<dt>Phiên bản:</dt>
			<dd>{pkg.version}</dd>

			<dt>Mô tả:</dt>
			<dd>{pkg.description}</dd>

			<dt>Cập nhật lần cuối:</dt>
			<dd>
				{latestCommitDate === null && 'Đang tải'}
				{latestCommitDate !== null && (
					<time dateTime={latestCommitDate.format('YYYY-MM-DDTHH:mm')}>
						{latestCommitDate.format('DD-MM-YYYY, HH:mm') ?? 'Đang tải'}
					</time>
				)}
			</dd>

			<dt>Tác giả:</dt>
			<dd>
				<a href={pkg.author.url} target="_blank">
					{pkg.author.name}
				</a>
			</dd>

			<dt>GitHub:</dt>
			<dd>
				<a href={pkg.repository.url} target="_blank">
					{pkg.repository.url}
				</a>
			</dd>
		</dl>
	)
}
