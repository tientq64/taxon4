import { useEventListener } from 'ahooks'
import { compact, forEach, upperFirst } from 'lodash-es'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { closestSelector } from './helpers/closestSelector'
import { formatTextEn } from './helpers/formatTextEn'
import { getSel } from './helpers/getSel'
import { makeComboKey } from './helpers/makeComboKey'
import { makePhotoCode } from './helpers/makePhotoCode'
import { mark } from './helpers/mark'
import { matchCombo } from './helpers/matchCombo'
import { findRankBySimilarName, Rank, RanksMap } from './models/Ranks'
import { switchToPage } from './helpers/switchToPage'
import { taxaToLinesTextOrText } from './helpers/taxaToLinesTextOrText'
import { matchUrl } from './helpers/matchUrl'
import { copyText } from './utils/clipboard'
import { getTextNodes } from './helpers/getTextNodes'

export type Sites = {
	wikipediaWiki: boolean
	flickrSearch: boolean
	inaturalistSearch: boolean
	inaturalistTaxon: boolean
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

const r = String.raw

export const sites: Sites = {
	wikipediaWiki: matchUrl('https://_+.wikipedia.org/wiki/_+'),
	flickrSearch: matchUrl('https://www.flickr.com/search_+'),
	inaturalistSearch: matchUrl('https://www.inaturalist.org/taxa/search_+'),
	inaturalistTaxon: matchUrl(r`https://www.inaturalist.org/taxa/\d+-\w+`)
}

let copyingText: string | undefined = undefined

export function App(): ReactNode {
	const [comboKeys, setComboKeys] = useState<string[]>([])
	const [mouseDownSel, setMouseDownSel] = useState<string>('')
	const [genderPhotos, setGenderPhotos] = useState<string[][]>([
		['', ''],
		['', '']
	])

	const press = async (combo: string, target: HTMLElement | null): Promise<void> => {
		let sel: string = getSel()
		if (sel !== mouseDownSel) return

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
				if (matchCombo('mr, **+mr', combo)) {
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
						const templates: Record<string, string> = {
							mr: ' % photoCode ; .',
							'f+mr': ' % photoCode ; fossil',
							'r+mr': ' % photoCode ; restoration',
							'c+mr': ' % photoCode ; reconstruction',
							'b+mr': ' % photoCode ; breeding',
							'q+mr': ' | photoCode ; .',
							'w+mr': ' / photoCode ; .'
						}
						for (const key in templates) {
							const has: boolean = matchCombo(key, combo)
							const hasShift: boolean = matchCombo(`shift+${key}`, combo)
							const hasAlt: boolean = matchCombo(`alt+${key}`, combo)
							const hasShiftAlt: boolean = matchCombo(`shift+alt+${key}`, combo)
							if (has || hasShift || hasAlt || hasShiftAlt) {
								const template = templates[key]
								let symb: string
								if (has) {
									symb = ' | '
								} else if (hasShift) {
									symb = ' / '
								} else {
									symb = ' ; '
								}
								const photoText: string = template
									.replace(' % ', symb)
									.replace(/\bphotoCode\b/, photoCode)
								let newGenderPhotos: string[][] = structuredClone(genderPhotos)
								if (has) {
									newGenderPhotos[0][0] = photoText
								} else if (hasShift) {
									newGenderPhotos[1][0] = photoText
								} else if (hasAlt) {
									newGenderPhotos[0][1] = photoText
								} else {
									newGenderPhotos[1][1] = photoText
								}
								if (key === 'q+mr') {
									newGenderPhotos[0] = [photoText]
									newGenderPhotos[1] = [' / ? ; .']
								} else if (key === 'w+mr') {
									newGenderPhotos[0] = [' | ? ; .']
									newGenderPhotos[1] = [photoText]
								}
								setGenderPhotos(newGenderPhotos)
								copyingText = newGenderPhotos
									.map((photoTexts) => photoTexts.join('').replace(/ ; \.$/, ''))
									.join('')
								await copyText(copyingText)
								mark(target)
							}
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
					let node: ChildNode | null | undefined = null
					let textNode: Text | undefined = undefined

					if (target.localName === 'li') {
						markEl = target.parentElement!
						itemEls = Array.from(markEl.children) as HTMLElement[]
					}

					for (const itemEl of itemEls) {
						let taxon: TaxonData | null = null
						let rank: Rank | undefined
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

							el = itemEl.querySelector('li:scope > i:first-child > a')
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

								textNode = getTextNodes(itemEl, { noEmpty: true }).at(0)
								if (textNode) {
									const wholeText: string = textNode.wholeText.trim()
									const matches = /^\((.+?)\)$/.exec(wholeText)
									if (matches) {
										textEn = formatTextEn(matches[1])
										if (textEn) return
									}
								}
								return
							}

							el = itemEl.querySelector('li:scope > i:first-child')
							if (el) {
								name = el.innerText
								return
							}

							el = itemEl.querySelector('li:scope > a')
							if (el) {
								name = el.innerText
								return
							}

							el = itemEl.closest('.comname')
							if (el) {
								textEn = formatTextEn(el.textContent)
								return
							}

							if (itemEl.matches('.mw-page-title-main, b')) {
								textEn = formatTextEn(itemEl.textContent)
								return
							}
						})()

						if (name) {
							name = name.trim().split('\n')[0]
						}

						if (itemEl.innerText.includes('\u2020')) {
							extinct = true
						}

						if (rank === undefined) {
							if (name) {
								const subspeciesRegex: RegExp =
									/^([A-Z][a-z-]+|[A-Z]\.) +([a-z][a-z-]+|[a-z]\.) +[a-z-]+$/
								if (subspeciesRegex.test(name)) {
									rank = RanksMap.subspecies
								}
							}
							rank ??= RanksMap.species
						}

						if (name) {
							switch (rank) {
								case RanksMap.species:
									name = name.split(/\s+/).slice(0, 2).at(-1)!
									break
								case RanksMap.subspecies:
									name = name.split(/\s+/).slice(0, 3).at(-1)!
									break
							}
							name = name.trim()
						}

						if (name || textEn) {
							taxon = { name, rank, textEn, extinct }
							taxa.push(taxon)
						}
					}

					if (taxa.length > 0) {
						copyingText = taxaToLinesTextOrText(taxa)
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

				case 'w':
					window.close()
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
		const modfKeys: string[] = []
		let newComboKeys: string[] = [...comboKeys]
		let i: number = 0
		let needReorder: boolean = false
		for (const comboKey of comboKeys) {
			if (comboKey === 'ctrl') {
				modfKeys[0] = comboKey
				newComboKeys.shift()
				needReorder ||= i !== 0
			} else if (comboKey === 'shift') {
				modfKeys[1] = comboKey
				newComboKeys.shift()
				needReorder ||= i !== 1
			} else if (comboKey === 'alt') {
				modfKeys[2] = comboKey
				newComboKeys.shift()
				needReorder ||= i !== 2
			} else break
			i++
		}
		if (needReorder) {
			newComboKeys = compact([...modfKeys, ...newComboKeys])
			setComboKeys(newComboKeys)
		}
	}, [comboKeys])

	useEffect(() => {
		forEach(sites, (matched: boolean, siteName: string): void => {
			if (!matched) return
			document.documentElement.classList.add(`site-${siteName}`)
		})
	}, [])

	useEffect(() => {
		if (!sites.inaturalistSearch) return
		const searchParams: URLSearchParams = new URLSearchParams(location.search)
		if (searchParams.has('isCommonName')) {
			const link = document.querySelector<HTMLAnchorElement>('.taxon_list_taxon > h3 > a')!
			link.click()
		}
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
