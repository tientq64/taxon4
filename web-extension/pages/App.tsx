import { useEventListener } from 'ahooks'
import { forEach, upperFirst } from 'lodash-es'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { closestSelector } from '../helpers/closestSelector'
import { formatTextEn } from '../helpers/formatTextEn'
import { getSel } from '../helpers/getSel'
import { makeComboKey } from '../helpers/makeComboKey'
import { makePhotoCode } from '../helpers/makePhotoCode'
import { mark } from '../helpers/mark'
import { matchCombo } from '../helpers/matchCombo'
import { findRankBySimilarName, Rank, RanksMap } from '../models/Ranks'
import { switchToPage } from '../helpers/switchToPage'
import { taxaToLinesText } from '../helpers/taxaToLinesText'
import { testUrlPattern } from '../helpers/testUrlPattern'
import { copyText } from '../utils/clipboard'

export type Sites = {
	wikipediaWiki: boolean
	flickrSearch: boolean
	inaturalistSearch: boolean
}

export type AppStore = {
	sites: Sites
	comboKeys: string[]
}

export const AppContext = createContext<AppStore | null>(null)

export type TaxonData = {
	name: string
	rank: Rank
	textEn: string
	extinct: boolean
}

export const sites: Sites = {
	wikipediaWiki: testUrlPattern('*://*.wikipedia.org/wiki/*'),
	flickrSearch: testUrlPattern('*://*.flickr.com/search*'),
	inaturalistSearch: testUrlPattern('*://*.inaturalist.org/taxa/search*')
}

export function App(): ReactNode {
	const [comboKeys, setComboKeys] = useState<string[]>([])
	const [mouseDownSel, setMouseDownSel] = useState<string>('')

	const press = async (combo: string, target: HTMLElement | null): Promise<void> => {
		let sel: string = getSel()
		if (sel !== mouseDownSel) return

		let copyingText: string | undefined = undefined

		if (sel) {
			if (combo === 'ml') {
				let text: string = upperFirst(sel)
				copyingText = ` - ${text}`
				copyText(copyingText)
			}
		}
		//
		else if (target) {
			if (target.localName === 'img' || target.style.backgroundImage) {
				if (matchCombo('mr, *+mr', combo)) {
					let imageUrl: string
					if (target.localName === 'img') {
						imageUrl = (target as HTMLImageElement).src
					} else {
						imageUrl = target.style.backgroundImage.replace(/^url\("(.+)"\)$/, '$1')
					}
					if (imageUrl.startsWith('//')) {
						imageUrl = location.protocol + imageUrl
					}
					const photoCode: string = makePhotoCode(imageUrl)
					if (photoCode) {
						let template: string | undefined
						switch (combo) {
							case 'mr':
								template = ' | photoCode'
								break
							case 'shift+mr':
								template = ' / photoCode'
								break
							case 'alt+mr':
								template = ' ; photoCode ; .'
								break
							case 'f+mr':
								template = ' ; photoCode ; fossil'
								break
						}
						if (template !== undefined) {
							copyingText = template.replace('photoCode', photoCode)
							await copyText(copyingText)
							mark(target)
						}
					}
				}
			}
			//
			else {
				if (combo === 'ml') {
					let markEl: HTMLElement = target
					let itemEls: HTMLElement[] = [target]
					const taxa: TaxonData[] = []

					let el: HTMLElement | null = null
					let node: ChildNode | null = null

					if (target.localName === 'li') {
						markEl = target.parentElement!
						itemEls = Array.from(markEl.children) as HTMLElement[]
					}

					for (const itemEl of itemEls) {
						let taxon: TaxonData | null = null
						let rank: Rank = RanksMap.species
						let name: string = ''
						let textEn: string = ''
						let extinct: boolean = false

						;((): void => {
							el = closestSelector(
								itemEl,
								'.biota tr:has(td:scope)',
								':scope > td:first-child'
							)
							if (el) {
								rank = findRankBySimilarName(el.innerText) ?? rank
								return
							}

							el = closestSelector(
								itemEl,
								'table:has(li:scope)',
								':scope > tbody > tr:has(+ tr > td > ul > li) > th'
							)
							if (el) {
								rank = findRankBySimilarName(el.innerText) ?? rank
								return
							}
						})()
						//
						;((): void => {
							el = closestSelector(
								itemEl,
								'.biota tr td:scope',
								':scope > i > a, :scope > a > i'
							)
							if (el) {
								name = el.innerText
								markEl = el
								return
							}

							el = itemEl.closest('.biota tr td:scope')
							if (el) {
								name = el.innerText
								return
							}

							el = itemEl.querySelector('li:scope > i > a')
							if (el) {
								name = el.innerText

								node = el.parentElement?.nextSibling || null
								if (node && node.nodeType === Node.TEXT_NODE) {
									textEn = formatTextEn(node.textContent)
									if (textEn) return
								}

								node = el.parentElement?.previousSibling || null
								if (node && node.nodeType === Node.TEXT_NODE) {
									textEn = formatTextEn(node.textContent)
									if (textEn) return
								}
								return
							}

							el = itemEl.querySelector('li:scope > a')
							if (el) {
								name = el.innerText
								return
							}
						})()

						name = name.trim()
						if (rank === RanksMap.species) {
							name = name.split(/ +/).slice(0, 2).at(-1)!
						}
						name = name.trim()

						if (itemEl.innerText.includes('\u2020')) {
							extinct = true
						}

						if (name) {
							taxon = { name, rank, textEn, extinct }
							taxa.push(taxon)
						}
					}

					if (taxa.length > 0) {
						copyingText = taxaToLinesText(taxa)
						await copyText(copyingText)
						mark(markEl)
					}
				}
			}
		}
		//
		else {
			switch (combo) {
				case 'g+w':
					switchToPage('wikipediaWiki')
					break

				case 'k':
					switchToPage('flickrSearch')
					break

				case 'n':
					switchToPage('inaturalistSearch')
					break
			}
		}
	}

	useEventListener('keydown', (event: KeyboardEvent): void => {
		if (event.repeat) return
		const key: string = makeComboKey(event.code)
		setComboKeys(comboKeys.concat(key))
	})

	useEventListener('keyup', (): void => {
		if (comboKeys.length === 0) return
		const combo: string = comboKeys.join('+')
		press(combo, null)
		setComboKeys([])
	})

	useEventListener('mousedown', (event: MouseEvent): void => {
		const key: string = makeComboKey(event.button)
		setComboKeys(comboKeys.concat(key))
		setMouseDownSel(getSel())
	})

	useEventListener('mouseup', (event: MouseEvent): void => {
		const combo: string = comboKeys.join('+')
		press(combo, event.target as HTMLElement)
		setComboKeys([])
		setMouseDownSel('')
	})

	useEventListener('contextmenu', (event: MouseEvent): void => {
		event.preventDefault()
	})

	useEventListener('blur', (): void => {
		setComboKeys([])
	})

	useEffect(() => {
		forEach(sites, (matched: boolean, siteName: string): void => {
			if (!matched) return
			document.documentElement.classList.add(`site-${siteName}`)
		})
	}, [])

	return (
		<div className="fixed inset-0 flex flex-col font-[sans-serif] text-[16px] overflow-hidden pointer-events-none z-10">
			<div className="flex-1"></div>

			<div className="flex justify-center items-end h-8 px-4 py-1">
				<div className="flex-1 flex justify-center items-center">
					{comboKeys.length > 0 && (
						<div className="px-2 py-1 rounded bg-zinc-800 text-white">
							{comboKeys.join('+')}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
