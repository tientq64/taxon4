import { flatMap, uniq } from 'lodash-es'
import { MouseEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { appendHintLineToClipboard, HintLine } from '../../web-extension/helpers/hintLines'
import { SetState } from '../App'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { Taxon } from '../helpers/parse'
import { useGetWikipediaSummary } from '../hooks/useGetWikipediaSummary'
import { upperFirst } from '../utils/upperFirst'
import { Tooltip } from './Tooltip'

type Hint = undefined | string[] | string | null
const textEnHintsMap: Hint[] = []

type Props = {
	taxon: Taxon
	setIsPopupOpen: SetState<boolean>
}
export function TaxonNodeTextEnHints({ taxon, setIsPopupOpen }: Props): ReactNode {
	const index: number = taxon.index
	const { data, run, mutate, cancel } = useGetWikipediaSummary()
	const [hints, setHints] = useState<Hint>(textEnHintsMap[index])

	const handleHintMouseUp = useCallback(async (hint: Hint, event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		if (typeof hint !== 'string') return
		setIsPopupOpen(false)
		const hintLine: HintLine = {
			lineNumber: taxon.index - 1,
			textEn: hint
		}
		await appendHintLineToClipboard(hintLine)
		setHints(hint)
	}, [])

	useEffect(() => {
		if (hints !== undefined) return
		if (taxon.children !== undefined && taxon.children.length <= 1) {
			mutate(null)
			return
		}
		run(taxon, 'en')
		return cancel
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

			{Array.isArray(hints) && hints.length > 0 && (
				<div className="flex max-w-[640px] h-6">
					<div className="flex gap-2 min-w-0">
						{hints.map((hint) => (
							<Tooltip key={hint} placement="top" distance={-4} content={hint}>
								<div
									className="truncate underline text-slate-400 hover:text-blue-400 cursor-copy"
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
