import dayjs, { Dayjs } from 'dayjs'
import { ReactNode, useEffect, useState } from 'react'
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
		sha: string
		html_url: string
	}
}

const gitHubCommitApiUrl: string = 'https://api.github.com/repos/tientq64/taxon4/branches/main'
const changelogUrl: string = `${repository.url}/blob/main/CHANGELOG.md`

/**
 * Mục thông tin.
 */
export function AboutPanel(): ReactNode {
	const [latestCommitDate, setLatestCommitDate] = useState<Dayjs | null>(null)
	const [latestCommitSha, setLatestCommitSha] = useState<string>('')
	const [latestCommitUrl, setLatestCommitUrl] = useState<string>('')

	const receiveLatestCommitData = ({ commit }: PartialGitHubCommitResponse): void => {
		setLatestCommitDate(dayjs(commit.commit.committer.date))
		setLatestCommitSha(commit.sha)
		setLatestCommitUrl(commit.html_url)
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
			<dd>
				{latestCommitDate === null && 'Đang tải...'}
				{latestCommitDate !== null && (
					<>
						{latestCommitDate.format('DD-MM-YYYY, HH:mm')}
						{' ('}
						<a href={latestCommitUrl} target="_blank">
							{latestCommitSha.slice(0, 7)}
						</a>
						{')'}
					</>
				)}
			</dd>

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
