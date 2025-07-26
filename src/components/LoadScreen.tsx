import { useAsyncEffect } from 'ahooks'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ParseError } from '../constants/ParseError'
import { Taxon, parse } from '../helpers/parse'
import { app } from '../store/useAppStore'
import { ref } from '../utils/ref'
import { Descriptions } from './Descriptions'
import { Icon } from './Icon'
import { Loading } from './Loading'
import logoImage from '/assets/images/logo.png'

enum LoadStatus {
	Loading = 1,
	Parsing = 2,
	Success = 3,
	Error = 4
}

export function LoadScreen(): ReactNode {
	const [status, setStatus] = useState<LoadStatus>(LoadStatus.Loading)
	const [error, setError] = useState<unknown>(undefined)
	const { t } = useTranslation()

	useAsyncEffect(async () => {
		try {
			setStatus(LoadStatus.Loading)
			const data: string = await (await fetch('/data/data.taxon4')).text()

			setStatus(LoadStatus.Parsing)
			const newTaxa: Taxon[] = parse(data, app.developerModeEnabled)

			setStatus(LoadStatus.Success)
			app.taxa = ref(newTaxa)
		} catch (error: unknown) {
			setStatus(LoadStatus.Error)
			setError(error)
		}
	}, [])

	return (
		<div className="m-auto flex h-full w-1/3 flex-col items-center justify-center gap-4">
			<img className="size-32" src={logoImage} />

			{(status === LoadStatus.Loading || status === LoadStatus.Parsing) && (
				<Loading>{t('others.classifying')}...</Loading>
			)}

			{status === LoadStatus.Error && (
				<div className="flex w-full flex-col gap-2">
					<div className="flex items-center justify-center gap-2 text-rose-400">
						<Icon name="bug_report" />
						Đã xảy ra lỗi!
					</div>

					<Descriptions>
						<div>Lý do:</div>
						<div>{String(error)}</div>

						{error instanceof ParseError && (
							<>
								<div>Dòng:</div>
								<div>{error.ln}</div>

								<div>Nội dung:</div>
								<div>{error.line}</div>
							</>
						)}
					</Descriptions>
				</div>
			)}
		</div>
	)
}
