import dayjs, { Dayjs } from 'dayjs'
import { ReactNode, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { author, repository, version } from '../../package.json'
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

/** Mục thông tin. */
export function AboutPanel(): ReactNode {
	const { t } = useTranslation()
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
			<dt>{t('about.name')}:</dt>
			<dd>{t('app.name')}</dd>

			<dt>{t('about.version')}:</dt>
			<dd>{version}</dd>

			<dt>{t('about.description')}:</dt>
			<dd>{t('app.description')}</dd>

			<dt>{t('about.lastUpdated')}:</dt>
			<dd>
				{latestCommitDate === null && <>{t('others.loading')}...</>}
				{latestCommitDate !== null && (
					<>
						{latestCommitDate.format(t('others.dateTime'))}
						{' ('}
						<a href={latestCommitUrl} target="_blank">
							{latestCommitSha.slice(0, 7)}
						</a>
						{')'}
					</>
				)}
			</dd>

			<dt>{t('about.author')}:</dt>
			<dd>
				<a href={author.url} target="_blank">
					{author.name}
				</a>
			</dd>

			<dt>{t('about.gitHub')}:</dt>
			<dd>
				<a href={repository.url} target="_blank">
					{repository.url}
				</a>
			</dd>

			<dt>{t('about.changelog')}:</dt>
			<dd>
				<Trans i18nKey="about.seeChangelog">
					<a href={changelogUrl} target="_blank" />
				</Trans>
			</dd>
		</Descriptions>
	)
}
