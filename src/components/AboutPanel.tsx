import dayjs, { Dayjs } from 'dayjs'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { author, description, meta, repository, version } from '../../package.json'
import { Descriptions } from './Descriptions'

/**
 * Mục thông tin.
 */
export function AboutPanel(): ReactNode {
	const [latestCommitDate, setLatestCommitDate] = useState<Dayjs | null>(null)

	const receiveLatestCommitData = useCallback((data: any): void => {
		const newLatestCommitDate: Dayjs = dayjs(data.commit.commit.committer.date)
		setLatestCommitDate(newLatestCommitDate)
	}, [])

	useEffect(() => {
		const aborter: AbortController = new AbortController()
		fetch('https://api.github.com/repos/tientq64/taxon4/branches/main', {
			signal: aborter.signal
		})
			.then((res: Response) => res.json())
			.then(receiveLatestCommitData)
		return () => {
			aborter.abort()
		}
	}, [receiveLatestCommitData])

	return (
		<Descriptions className="px-3 pt-1">
			<dt>Tên:</dt>
			<dd>{meta.displayName}</dd>

			<dt>Phiên bản:</dt>
			<dd>{version}</dd>

			<dt>Mô tả:</dt>
			<dd>{description}</dd>

			<dt>Cập nhật lần cuối:</dt>
			<dd>{latestCommitDate?.format('DD-MM-YYYY, HH:mm') ?? 'Đang tải'}</dd>

			<dt>Tác giả:</dt>
			<dd>
				<a href={author.url} target="_blank">
					{author.name}
				</a>
			</dd>

			<dt>GitHub:</dt>
			<dd>
				<a href={repository.url} target="_blank">
					{repository.url}
				</a>
			</dd>

			<dt>Nhật ký thay đổi:</dt>
			<dd>
				Xem{' '}
				<a href={`${repository.url}/blob/main/CHANGELOG.md`} target="_blank">
					changelog
				</a>
			</dd>
		</Descriptions>
	)
}
