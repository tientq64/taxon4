import { useAsyncEffect } from 'ahooks'
import { ReactNode, useState } from 'react'
import { ParseError } from '../constants/ParseError'
import { Taxon, parse } from '../helpers/parse'
import { useAppStore } from '../store/useAppStore'
import { Descriptions } from './Descriptions'
import { Icon } from './Icon'
import { Loading } from './Loading'
import logoImage from '/assets/images/logo.png'

enum Statuses {
	Loading = 1,
	Parsing = 2,
	Success = 3,
	Error = 4
}

export function LoadScreen(): ReactNode {
	const setTaxa = useAppStore((state) => state.setTaxa)
	const isDev = useAppStore((state) => state.isDev)

	const [status, setStatus] = useState<Statuses>(Statuses.Loading)
	const [error, setError] = useState<any>(undefined)

	useAsyncEffect(async () => {
		try {
			setStatus(Statuses.Loading)
			const data: string = await (await fetch('/data/data.taxon4')).text()

			setStatus(Statuses.Parsing)
			const newTaxa: Taxon[] = parse(data, isDev)

			setStatus(Statuses.Success)
			setTaxa(newTaxa)
		} catch (error: any) {
			setStatus(Statuses.Error)
			setError(error)
		}
	}, [])

	return (
		<div className="m-auto flex h-full w-1/3 flex-col items-center justify-center gap-4">
			<img className="size-32" src={logoImage} />

			{(status === Statuses.Loading || status === Statuses.Parsing) && (
				<Loading>Đang phân loại...</Loading>
			)}

			{status === Statuses.Error && (
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
