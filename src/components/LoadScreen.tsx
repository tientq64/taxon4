import { useRequest } from 'ahooks'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { loadTaxaData } from '../api/loadTaxaData'
import { dataPartNames } from '../constants/dataPartNames'
import { ParseError } from '../constants/ParseError'
import { app, useApp } from '../store/app'
import { ref } from '../utils/ref'
import { Descriptions } from './Descriptions'
import { Icon } from './Icon'
import logoImage from '/assets/images/logo.png'

export function LoadScreen(): ReactNode {
	const { loadedDataPartProgress } = useApp()
	const { t } = useTranslation()
	const { run, loading, data, error } = useRequest(loadTaxaData, { manual: true })

	const percent = Math.floor((loadedDataPartProgress / (dataPartNames.length + 1)) * 100)

	useEffect(run, [])

	useEffect(() => {
		if (!Array.isArray(data)) return
		app.taxa = ref(data)
	}, [data])

	return (
		<div className="m-auto flex h-full w-1/3 flex-col items-center justify-center gap-4">
			<img className="size-32" src={logoImage} />

			{loading && (
				<div className="flex flex-col items-center gap-4">
					<div className="relative h-3 w-64 max-w-full overflow-hidden rounded bg-zinc-800">
						<div
							className="h-full rounded bg-blue-500"
							style={{
								width: percent + '%'
							}}
						></div>
					</div>
					<div>
						{t('others.loading')}: {percent}%
					</div>
				</div>
			)}

			{!loading && !!error && (
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
