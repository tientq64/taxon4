import { useAsyncEffect } from 'ahooks'
import { ReactNode, useState } from 'react'
import { Taxon, parse } from '../helpers/parse'
import { ParseError } from '../models/ParseError'
import { useStore } from '../store/useStore'
import { Descriptions } from './Descriptions'
import { Icon } from './Icon'
import logoImage from '/assets/images/logo.png'
import { Loading } from './Loading'

type Status = 'loading' | 'parsing' | 'success' | 'error'

export function LoadScreen(): ReactNode {
	const setTaxa = useStore((state) => state.setTaxa)
	const isDev = useStore((state) => state.isDev)

	const [status, setStatus] = useState<Status>('loading')
	const [error, setError] = useState<any>(undefined)

	useAsyncEffect(async () => {
		try {
			setStatus('loading')
			const data: string = await (await fetch('/data/data.taxon4')).text()

			setStatus('parsing')
			const newTaxa: Taxon[] = parse(data, isDev)

			setStatus('success')
			setTaxa(newTaxa)
		} catch (error: any) {
			setStatus('error')
			setError(error)
		}
	}, [])

	return (
		<div className="flex flex-col gap-4 justify-center items-center w-1/3 h-full m-auto">
			<img className="size-32" src={logoImage} />

			{(status === 'loading' || status === 'parsing') && <Loading>Đang phân loại...</Loading>}

			{status === 'error' && (
				<div className="flex flex-col gap-2 w-full">
					<div className="flex items-center gap-2 justify-center text-rose-400">
						<Icon name="bug_report" />
						Đã xảy ra lỗi!
					</div>

					<Descriptions>
						<div>Lý do:</div>
						<div>{String(error)}</div>

						{error instanceof ParseError && (
							<>
								<div>Dòng:</div>
								<div>{error.ln + 1}</div>

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
