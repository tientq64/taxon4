import { useAsyncEffect } from 'ahooks'
import { ReactNode, useState } from 'react'
import { parse, Taxon } from '../helpers/parse'
import { ParseError } from '../models/ParseError'
import { useStore } from '../store/useStore'
import { Descriptions } from './Descriptions'
import { Icon } from './Icon'
import logoImage from '/assets/images/logo.png'

type Status = 'loading' | 'parsing' | 'success' | 'error'

export function TaxaLoader(): ReactNode {
	const setTaxa = useStore((state) => state.setTaxa)

	const [status, setStatus] = useState<Status>('loading')
	const [error, setError] = useState<any>(undefined)

	useAsyncEffect(async () => {
		try {
			setStatus('loading')
			const text: string = await (await fetch('/data/data.taxon4')).text()

			setStatus('parsing')
			const newTaxa: Taxon[] = parse(text)

			setStatus('success')
			setTaxa(newTaxa)
		} catch (error: any) {
			setStatus('error')
			setError(error)
		}
	}, [])

	return (
		<div className="flex flex-col gap-4 justify-center items-center h-full">
			<img className="size-24 p-1 rounded-full bg-zinc-300" src={logoImage} />

			{status === 'loading' && (
				<div className="flex items-center gap-2 text-zinc-400">
					<Icon className="animate-spin" name="progress_activity" />
					Đang tải...
				</div>
			)}

			{status === 'parsing' && (
				<div className="flex items-center gap-2 text-zinc-400">
					<Icon name="account_tree" />
					Đang phân loại...
				</div>
			)}

			{status === 'error' && (
				<div className="flex flex-col gap-2">
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