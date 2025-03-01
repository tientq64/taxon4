import dayjs, { Dayjs } from 'dayjs'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { author, description, repository, version } from '../../package.json'
import { Descriptions } from './Descriptions'

interface PartialGitHubCommitResponse {
	commit: {
		commit: {
			committer: {
				date: string
				email: string
				name: string
			}
			message: string
		}
	}
}

const gitHubCommitApiUrl: string = 'https://api.github.com/repos/tientq64/taxon4/branches/main'
const changelogUrl: string = `${repository.url}/blob/main/CHANGELOG.md`

/**
 * Mục thông tin.
 */
export function AboutPanel(): ReactNode {
	const [latestCommitDate, setLatestCommitDate] = useState<Dayjs | null>(null)

	const latestCommitText = useMemo<string>(() => {
		if (latestCommitDate === null) {
			return 'Đang tải...'
		}
		return latestCommitDate.format('DD-MM-YYYY, HH:mm')
	}, [latestCommitDate])

	const receiveLatestCommitData = (data: PartialGitHubCommitResponse): void => {
		const newLatestCommitDate: Dayjs = dayjs(data.commit.commit.committer.date)
		setLatestCommitDate(newLatestCommitDate)
	}

	useEffect(() => {
		const aborter: AbortController = new AbortController()
		fetch(gitHubCommitApiUrl, { signal: aborter.signal })
			.then((res) => res.json())
			.then(receiveLatestCommitData)
		return () => {
			aborter.abort()
		}
	}, [])

	return (
		<Descriptions className="px-3 pt-1">
			<dt>Tên:</dt>
			<dd>Phân loại sinh học</dd>

			<dt>Phiên bản:</dt>
			<dd>{version}</dd>

			<dt>Mô tả:</dt>
			<dd>{description}</dd>

			<dt>Cập nhật lần cuối:</dt>
			<dd>{latestCommitText}</dd>

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
				<a href={changelogUrl} target="_blank">
					changelog
				</a>
			</dd>
		</Descriptions>
	)
}
