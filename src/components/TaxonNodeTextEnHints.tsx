import { flatMap, uniq } from 'lodash-es'
import { MouseEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { copyText } from '../../web-extension/utils/clipboard'
import { Taxon } from '../helpers/parse'
import { useGetWikipediaSummary } from '../hooks/useGetWikipediaSummary'
import { upperFirst } from '../utils/upperFirst'
import { Tooltip } from './Tooltip'
import { SetState } from '../App'
import { getTaxonFullName } from '../helpers/getTaxonFullName'

type Hint = undefined | string[] | string | null
const textEnHintsMap: Hint[] = []

type Props = {
	taxon: Taxon
	setIsPopupOpen: SetState<boolean>
}
export function TaxonNodeTextEnHints({ taxon, setIsPopupOpen }: Props): ReactNode {
	const index: number = taxon.index
	const { data, run, cancel } = useGetWikipediaSummary()
	const [hints, setHints] = useState<Hint>(textEnHintsMap[index])

	const handleHintMouseUp = useCallback(async (hint: Hint, event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		setIsPopupOpen(false)
		const copiedText: string = ` - ${hint}`
		await copyText(copiedText)
		setHints(hint)
	}, [])

	useEffect(() => {
		if (hints !== undefined) return
		const timeoutId: number = window.setTimeout(() => {
			run(taxon, 'en')
		}, 1000)
		return () => {
			window.clearTimeout(timeoutId)
			cancel()
		}
	}, [])

	useEffect(() => {
		if (data === undefined) return
		if (data === null) {
			setHints(null)
			textEnHintsMap[index] = null
			return
		}
		const parser: DOMParser = new DOMParser()
		const dom: Document = parser.parseFromString(data, 'text/html')
		const hintEls = dom.querySelectorAll<HTMLElement>('b')
		let newHints: string[] = flatMap(hintEls, (hintEl) => {
			return hintEl.textContent!.split(/\s*,\s*/)
		})
		newHints = uniq(newHints)
		const taxonFullName: string = getTaxonFullName(taxon, true)
		newHints = newHints.filter((hint) => hint !== taxonFullName)
		newHints = newHints.map((hint) => upperFirst(hint))
		setHints(newHints)
		textEnHintsMap[index] = newHints
	}, [data])

	return (
		<>
			{hints === undefined && (
				<div className="flex justify-center items-center text-slate-400">...</div>
			)}

			{typeof hints === 'string' && <div className="text-slate-400">{hints}</div>}

			{Array.isArray(hints) && (
				<div className="flex max-w-[640px] h-6">
					<div className="flex gap-2 min-w-0">
						{hints.map((hint) => (
							<Tooltip key={hint} placement="top" distance={-4} content={hint}>
								<div
									className="truncate underline text-slate-400 hover:text-sky-400 cursor-copy"
									onMouseUp={handleHintMouseUp.bind(null, hint)}
								>
									{hint}
								</div>
							</Tooltip>
						))}
					</div>
				</div>
			)}
		</>
	)
}
