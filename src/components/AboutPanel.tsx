import dayjs, { Dayjs } from 'dayjs'
import { ReactNode, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Twemoji from 'react-twemoji'
import { author, repository, version } from '../../package.json'
import { Descriptions } from './Descriptions'
import { Link } from './Link'
import { Tooltip } from './Tooltip'

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

	const authorTooltipContent: ReactNode = (
		<div className="grid grid-cols-[repeat(2,min-content)] gap-x-3 p-1 text-left text-nowrap [&>*]:odd:text-zinc-400">
			<div>GitHub</div>
			<div>{author.name}</div>

			<div>Email</div>
			<div>{author.email}</div>
		</div>
	)

	return (
		<div className="flex h-full flex-col divide-y divide-zinc-700">
			<Descriptions className="scrollbar-overlay flex-1 overflow-auto px-3">
				<dt>{t('about.appName')}:</dt>
				<dd>Taxon 4</dd>

				<dt>{t('about.version')}:</dt>
				<dd>{version}</dd>

				<dt>{t('about.descriptionApp')}:</dt>
				<dd>{t('app.description')}</dd>

				<dt>{t('about.lastUpdated')}:</dt>
				<dd>
					{latestCommitDate === null && <>{t('others.loading')}...</>}
					{latestCommitDate !== null && (
						<>
							{latestCommitDate.format(t('others.dateTime'))}
							{' ('}
							<Link href={latestCommitUrl}>{latestCommitSha.slice(0, 7)}</Link>
							{')'}
						</>
					)}
				</dd>

				<dt>{t('about.author')}:</dt>
				<dd>
					<Tooltip placement="right" beforeContent={authorTooltipContent}>
						<Link href={author.url}>{author.name}</Link>
					</Tooltip>
				</dd>

				<dt>{t('about.gitHub')}:</dt>
				<dd>
					<Link href={repository.url}>{repository.url}</Link>
				</dd>

				<dt>{t('about.changelog')}:</dt>
				<dd>
					<Trans i18nKey="about.seeChangelog">
						<Link href={changelogUrl} />
					</Trans>
				</dd>
			</Descriptions>

			<div className="px-3 text-center">
				<Twemoji>
					<Trans
						i18nKey="about.madeWith"
						components={{
							rice: (
								<Tooltip placement="top" beforeContent={t('about.rice')}>
									<span>🍚</span>
								</Tooltip>
							)
						}}
						values={{ author: author.name }}
					/>
				</Twemoji>
			</div>
		</div>
	)
}
