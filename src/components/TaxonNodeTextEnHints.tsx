import { flatMap, uniq } from 'lodash-es'
import { MouseEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { appendHintLineToClipboard, HintLine } from '../../web-extension/helpers/hintLines'
import { SetState } from '../App'
import { checkIsIncertaeSedis } from '../helpers/checkIsIncertaeSedis'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { Taxon } from '../helpers/parse'
import { useGetWikipediaSummary } from '../hooks/useGetWikipediaSummary'
import { upperFirst } from '../utils/upperFirst'
import { Tooltip } from './Tooltip'

type Hint = undefined | string[] | string | null

const textEnHintsMap: Hint[] = []

interface TaxonNodeTextEnHintsProps {
	taxon: Taxon
	setIsPopupOpen: SetState<boolean>
}

export function TaxonNodeTextEnHints({
	taxon,
	setIsPopupOpen
}: TaxonNodeTextEnHintsProps): ReactNode {
	const index: number = taxon.index
	const { data, run, mutate, cancel } = useGetWikipediaSummary(taxon, 'en')
	const [hints, setHints] = useState<Hint>(textEnHintsMap[index])

	const handleHintMouseUp = useCallback(
		async (hint: Hint, event: MouseEvent<HTMLDivElement>) => {
			event.stopPropagation()
			if (typeof hint !== 'string') return
			setIsPopupOpen(false)
			const hintLine: HintLine = {
				lineNumber: taxon.index - 1,
				textEn: hint
			}
			await appendHintLineToClipboard(hintLine)
			setHints(hint)
		},
		[setIsPopupOpen, taxon.index]
	)

	useEffect(() => {
		if (hints !== undefined) return
		if (
			checkIsIncertaeSedis(taxon) ||
			(taxon.children !== undefined && taxon.children.length <= 1)
		) {
			mutate(null)
			return
		}
		run()
		return cancel
	}, [cancel, hints, mutate, run, taxon])

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
	}, [data, index, taxon])

	return (
		<>
			{hints === undefined && (
				<div className="flex items-center justify-center text-slate-400">...</div>
			)}

			{typeof hints === 'string' && <div className="text-slate-400">{hints}</div>}

			{Array.isArray(hints) && hints.length > 0 && (
				<div className="flex h-6 max-w-[640px]">
					<div className="flex min-w-0 gap-2">
						{hints.map((hint) => (
							<Tooltip key={hint} placement="top" distance={-4} content={hint}>
								<div
									className="cursor-copy truncate text-slate-400 underline hover:text-blue-400"
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
