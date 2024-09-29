import { useEventListener } from 'ahooks'
import $ from 'jquery'
import { forEach, lowerFirst, reject, some, upperFirst } from 'lodash-es'
import { nanoid } from 'nanoid'
import { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import { closestSelector } from './helpers/closestSelector'
import { formatTextEn } from './helpers/formatTextEn'
import { formatTextVi } from './helpers/formatTextVi'
import { emptySel, getSel } from './helpers/getSel'
import { getTextNodes } from './helpers/getTextNodes'
import { makeComboKey } from './helpers/makeComboKey'
import { makePhotoCode } from './helpers/makePhotoCode'
import { mark } from './helpers/mark'
import { matchCombo } from './helpers/matchCombo'
import { matchUrl } from './helpers/matchUrl'
import { switchToPage } from './helpers/switchToPage'
import { taxaToLinesTextOrText } from './helpers/taxaToLinesTextOrText'
import { useUrlChange } from './hooks/useUrlChange'
import { findRankBySimilarName, findRankByTaxonName, Rank, RanksMap } from './models/Ranks'
import { copyText } from './utils/clipboard'

export type Sites = {
	wikipedia: boolean
	wikispecies: boolean
	flickr: boolean
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

type Toast = {
	id: string
	message: string
	duration: number
	update: (message: string) => void
	close: () => void
}

const hybridChar: string = '\xd7'
const r = String.raw
const modifierKeys: string[] = ['ctrl', 'shift', 'alt']
const initialComboKeys: string[] = ['', '', '']

export const sites: Sites = {
	wikipedia: matchUrl('https://_+.wikipedia.org/wiki/_+'),
	wikispecies: matchUrl('https://species.wikimedia.org/wiki/_+'),
	flickr: matchUrl('https://www.flickr.com/_*'),
	inaturalistSearch: matchUrl('https://www.inaturalist.org/taxa/search_+'),
	inaturalistTaxon: matchUrl(r`https://www.inaturalist.org/taxa/\d+-_+`)
}

let copyingText: string | undefined = undefined
let preventContextMenuCombo: string = ''

export function App(): ReactNode {
	const changedUrl = useUrlChange()
	const [comboKeys, setComboKeys] = useState<string[]>(initialComboKeys)
	const [mouseDownSel, setMouseDownSel] = useState<string>('')
	const [genderPhotos, setGenderPhotos] = useState<string[][]>([
		['', ''],
		['', '']
	])
	let taxa = useRef<TaxonData[]>([])
	let [toasts, setToasts] = useState<Toast[]>([])

	const showToast = (message: string, duration: number = 3000): Toast => {
		const id: string = nanoid()
		const toast: Toast = {
			id,
			message,
			duration,
			update: (message: string) => {
				setToasts((state) =>
					state.map((toast2) => (toast2.id === id ? { ...toast2, message } : toast2))
				)
			},
			close: () => {
				setToasts((state) => reject(state, { id }))
			}
		}
		setToasts((state) => [...state, toast])
		if (duration > 0) {
			setTimeout(() => toast.close(), duration)
		}
		return toast
	}

	const press = async (combo: string, target: HTMLElement | null): Promise<void> => {
		let el: HTMLElement | null | undefined
		// let $el: JQuery<HTMLElement>
		let node: ChildNode | null | undefined
		let textNode: Text | undefined
		let matches: RegExpExecArray | null

		let sel: string = getSel()
		if (sel !== mouseDownSel) return

		const preventContextMenu = (): void => {
			preventContextMenuCombo = combo
		}

		if (sel) {
			if (combo === 'ml') {
				let text: string = upperFirst(sel)
				copyingText = ` - ${text}`
				copyText(copyingText)
			}
		}
		//
		else if (target) {
			if (sites.inaturalistTaxon && target.matches('.modal-link')) {
				target = target.parentElement!.nextElementSibling as HTMLElement
				console.log(target)
			}

			let $target = $(target)

			if ((el = target.closest<HTMLElement>('a.view.link-icon-detail'))) {
				if (matchCombo('mr, shift+mr', combo)) {
					preventContextMenu()
					copyingText = String(el.dataset.id)
					if (combo === 'mr') {
						copyingText = ` |${copyingText}`
					}
					await copyText(copyingText)
					showToast(`Đã sao chép: ${copyingText}`)
				}
			}
			//
			else if (
				target.matches('.mw-page-title-main, b') &&
				matchCombo('mr, shift+mr', combo)
			) {
				preventContextMenu()
				let textVi: string = target.innerText
				textVi = formatTextVi(textVi)
				copyingText = ` / ${textVi}`
				if (combo === 'shift+mr') {
					copyingText = ' -' + copyingText
				}
				await copyText(copyingText)
				mark(target)
			}
			//
			else if (target.localName === 'img' || target.style.backgroundImage) {
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
							'mr': ' % photoCode ; .',
							'a+mr': ' % photoCode ; adult',
							'b+mr': ' % photoCode ; breeding',
							'c+mr': ' % photoCode ; reconstruction',
							'c+t+mr': ' % photoCode ; caterpillar',
							'd+mr': ' % photoCode ; drawing',
							'd+m+mr': ' % photoCode ; dark morph',
							'f+mr': ' % photoCode ; fossil',
							'h+mr': ' % photoCode ; holotype',
							'i+p+mr': ' % photoCode ; initial phase',
							'j+mr': ' % photoCode ; juvenile',
							'j+a+mr': ' % photoCode ; jaw',
							'k+mr': ' % photoCode ; skeleton',
							'l+mr': ' % photoCode ; illustration',
							'l+m+mr': ' % photoCode ; light morph',
							'm+mr': ' % photoCode ; mandible',
							'n+mr': ' % photoCode ; nymph',
							'n+b+mr': ' % photoCode ; non-breeding',
							'p+mr': ' % photoCode ; paratype',
							'q+mr': ' | photoCode ; .',
							'r+mr': ' % photoCode ; restoration',
							's+mr': ' % photoCode ; specimen',
							't+mr': ' % photoCode ; teeth',
							't+o+mr': ' % photoCode ; tooth',
							't+p+mr': ' % photoCode ; terminal phase',
							'u+mr': ' % photoCode ; skull',
							'v+mr': ' % photoCode ; larva',
							'w+mr': ' / photoCode ; .',
							'x+mr': ' % photoCode ; exhibit'
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
								preventContextMenu()
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
				if (matchCombo('ml, alt+ml, alt+mr', combo)) {
					taxa.current = []
					let markEl: HTMLElement = target
					let itemEls: HTMLElement[] = [target]
					let openedLinkCount: number = 10
					let markOpenedLinkOnlyCount = 10
					let forcedRank: Rank | undefined = undefined
					const openedLinkQueue: HTMLAnchorElement[] = []

					const addLinkToQueue = (el: HTMLElement): void => {
						if (combo === 'alt+ml' || combo === 'alt+mr') {
							if (
								el instanceof HTMLAnchorElement &&
								el.matches(':not(.new):not(.tx-opened-link)')
							) {
								if (combo === 'alt+ml') {
									if (el.href) {
										if (openedLinkCount > 0) {
											openLink(el, openedLinkCount === 10)
										} else {
											openedLinkQueue.push(el)
										}
									}
									openedLinkCount--
								} else if (combo === 'alt+mr') {
									if (markOpenedLinkOnlyCount > 0) {
										el.classList.add('tx-opened-link')
										markOpenedLinkOnlyCount--
									}
								}
							}
						}
					}

					const openLink = (el: HTMLAnchorElement, active: boolean = false): void => {
						if (window.closed) return
						el.classList.add('tx-opened-link')
						const win = GM_openInTab(el.href, { insert: false, active })
						win.onclose = openNextLinkInQueue
					}

					const openNextLinkInQueue = (): void => {
						const el: HTMLAnchorElement | undefined = openedLinkQueue.shift()
						if (el === undefined) return
						openLink(el)
					}

					do {
						if (target.matches('li, dd')) {
							markEl = target.parentElement!
							itemEls = [...markEl.children] as HTMLElement[]
							break
						}

						if (target.closest('.biota tr > td > p:has(> i > a)')) {
							itemEls = [...target.children] as HTMLElement[]
							itemEls = reject(itemEls, { localName: 'br' })
							break
						}

						if (target.closest('.wikitable :is(td, th)')) {
							if (target instanceof HTMLTableCellElement) {
								const cellIndex: number = target.cellIndex
								itemEls = $target
									.closest('tbody')
									.find('tr')
									.map((_, tr) => tr.cells[cellIndex])
									.toArray()
								break
							}
						}

						el = target.closest<HTMLElement>(
							'.site-wikispecies .mw-parser-output > p:scope'
						)
						if (el) {
							const text: string = el.innerText.trim().split('\n').at(-1)!
							forcedRank = findRankBySimilarName(text) ?? forcedRank
							itemEls = $target.find('br:nth(-2)').nextAll('i').toArray()
							break
						}
					} while (false)

					for (const itemEl of itemEls) {
						let taxon: TaxonData | null = null
						let rank: Rank | undefined = forcedRank
						let name: string
						let textEn: string
						let extinct: boolean = false
						const $itemEl: JQuery<HTMLElement> = $(itemEl)

						/**
						 * Phần tử `$itemEl` được sao chép toàn bộ, và đã loại bỏ các danh sách con. Mục đích để thao tác tìm kiếm. Mọi thay đổi đối với phần tử này sẽ không ảnh hưởng đến DOM thực tế.
						 */
						const $scopedItemEl: JQuery<HTMLElement> = $itemEl
							.clone()
							.find('ul, ol, dl')
							.remove()
							.end()

						extinct = $scopedItemEl.text().includes('\u2020')

						do {
							el = closestSelector(
								itemEl,
								'.biota tr:has(td:scope)',
								':scope > td:first-child'
							)
							if (el) {
								rank = findRankBySimilarName(el.innerText) ?? rank
								break
							}

							el = closestSelector(
								itemEl,
								'table:has(li:scope)',
								':scope > tbody > tr:has(+ tr > td > ul > li, + tr > td > div > ul > li) > th'
							)
							if (el) {
								rank = findRankBySimilarName(el.innerText) ?? rank
								break
							}
						} while (false)
						//
						do {
							el = closestSelector(
								itemEl,
								'.biota tr > td:scope',
								':scope > i > a, :scope > a > i, :scope > b i, :scope i > b'
							)
							if (el) {
								name = el.innerText
								markEl = el
								break
							}

							el = itemEl.closest<HTMLElement>('.biota tr > td:scope')
							if (el) {
								name = el.innerText
								break
							}

							el = $itemEl.closest('.wikitable :is(td, th):scope').find('a')[0]
							if (el) {
								name = el.innerText
								addLinkToQueue(el)
								break
							}

							el = closestSelector(
								itemEl,
								'.biota tr > td > p > i:scope',
								':scope > a'
							)
							if (el) {
								name = el.innerText

								node = itemEl.previousSibling
								if (node instanceof Text && node.wholeText.trim() === '\u2020') {
									extinct = true
								}

								el = el
									.closest('tr')
									?.previousElementSibling?.querySelector('tr:scope > th')
								if (el) {
									rank = findRankBySimilarName(el.innerText) ?? rank
									break
								}
								break
							}

							el = itemEl.querySelector<HTMLElement>(
								':is(li, dd):scope > a:first-child'
							)
							if (el) {
								node = el.previousSibling
								if (node instanceof Text) {
									const findedRank: Rank | undefined = findRankBySimilarName(
										node.wholeText
									)
									if (findedRank !== undefined) {
										name = el.innerText
										addLinkToQueue(el)
										rank = findedRank
										break
									}
								}
							}

							el = itemEl.querySelector<HTMLElement>(
								':is(li, dd):scope > a:first-child > i'
							)
							if (el) {
								name = el.innerText

								node = el.nextSibling
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									if (wholeText === hybridChar) {
										rank ??= RanksMap.species
										el = node.nextElementSibling as HTMLElement | null
										if (el) {
											name = `x ${el.innerText}`
										}
									}
								}
								break
							}

							el = itemEl.querySelector<HTMLElement>(
								':is(li, dd):scope > i:first-child > a'
							)
							if (el) {
								name = el.innerText
								addLinkToQueue(el)

								node = el.parentElement?.nextSibling
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									rank = findRankBySimilarName(wholeText) ?? rank
									if (!rank) {
										textEn = formatTextEn(wholeText)
										if (textEn) break
									}
								}

								node = el.parentElement?.previousSibling
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									rank = findRankBySimilarName(wholeText) ?? rank
									if (!rank) {
										textEn = formatTextEn(wholeText)
										if (textEn) break
									}
								}

								textNode = getTextNodes(itemEl, { noEmpty: true }).at(0)
								if (textNode) {
									const wholeText: string = textNode.wholeText.trim()
									const matches = /^\((.+?)\)$/.exec(wholeText)
									if (matches) {
										textEn = formatTextEn(matches[1])
										if (textEn) break
									}
								}
								break
							}

							el = itemEl.querySelector<HTMLElement>(':is(li, dd):scope > i')
							if (el) {
								name = el.innerText

								const link = el.previousElementSibling as HTMLAnchorElement | null
								if (link !== null && link.matches('a')) {
									textEn = link.innerText
									addLinkToQueue(link)
								}

								node = el.nextSibling
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									let matchedWholeText: boolean = false
									if (wholeText === 'var.') {
										rank = RanksMap.variety
										matchedWholeText = true
									} else if (wholeText === 'subsp.') {
										rank = RanksMap.subspecies
										matchedWholeText = true
									}
									el = node.nextElementSibling as HTMLElement | null
									if (el && matchedWholeText) {
										name = el.innerText
									}
									break
								}

								node = el.previousSibling
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									if (wholeText === 'subsp.') {
										rank = RanksMap.subspecies
										break
									}
								}
								break
							}

							el = itemEl.querySelector<HTMLElement>(':is(li, dd):scope > a')
							if (el) {
								name = el.innerText
								break
							}

							if (itemEl.matches('i')) {
								name = itemEl.innerText
								break
							}

							el = itemEl.closest<HTMLElement>('.comname')
							if (el) {
								textEn = formatTextEn(el.innerText)
								break
							}

							if (itemEl.matches('.mw-page-title-main, .vernacular, b, em')) {
								textEn = formatTextEn(itemEl.innerText)
								break
							}

							el = itemEl.querySelector<HTMLElement>('[jscontroller] h3')
							if (el) {
								markEl = el
								const text: string = el.innerText!.replace(/\(.+?\)/, '').trim()
								textEn = formatTextEn(text)
								if (textEn) break
							}
						} while (false)

						name ??= ''
						textEn ??= ''

						if (name) {
							name = name.trim().split('\n')[0]
							name = name.replace('\xd7', 'x')
						}

						if (name) {
							;((): void => {
								const varietyRegex: RegExp =
									/^(?:[A-Z][a-z-]+|[A-Z]\.)\s+(?:[a-z][a-z-]+|[a-z]\.)\s+var\.\s+([a-z-]+)$/
								matches = varietyRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.variety
									name = matches[1]
									return
								}

								const subspeciesRegex: RegExp =
									/^(?:[A-Z][a-z-]+|[A-Z]\.)\s+(?:[a-z][a-z-]+|[a-z]\.)(?:\s+subsp\.)?\s+([a-zA-Z][a-z-]+)$/
								matches = subspeciesRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.subspecies
									name = lowerFirst(matches[1])
									return
								}

								const hybridSpeciesRegex: RegExp =
									/^(?:[A-Z][a-z-]+|[A-Z]\.)\s*×\s*([a-z-]+)$/
								matches = hybridSpeciesRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.species
									name = `x ${matches[1]}`
									return
								}

								const speciesRegex: RegExp =
									/^(?:[A-Z][a-z-]+|[A-Z]\.)\s+([a-z-]+)$/
								matches = speciesRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.species
									name = matches[1]
									return
								}
							})()
						}

						if (rank === undefined && name) {
							rank = findRankByTaxonName(name)
						}

						rank ??= RanksMap.genus
						rank = forcedRank ?? rank

						if (name || textEn) {
							taxon = { name, rank, textEn, extinct }
							taxa.current.push(taxon)
						}
					}

					if (taxa.current.length > 0) {
						copyingText = taxaToLinesTextOrText(taxa.current)
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
					switchToPage('wikipedia')
					break

				case 'k':
					switchToPage('flickr')
					break

				case 'k+l':
					el = document.querySelector<HTMLElement>('.gn-signin > a')
					if (el !== null) {
						el.click()
					}
					break

				case 'n':
					switchToPage('inaturalistSearch')
					break

				case 'r':
					if (taxa.current.length > 0) {
						const hasSomeExtinct: boolean = some(taxa.current, 'extinct')
						taxa.current.forEach((taxon) => {
							taxon.extinct = !hasSomeExtinct
						})
						copyingText = taxaToLinesTextOrText(taxa.current)
						await copyText(copyingText)
						showToast(hasSomeExtinct ? 'Tất cả tồn tại' : 'Tất cả tuyệt chủng')
					}
					break

				case 'q':
					if (sites.wikipedia) {
						switchToPage('inaturalistTaxon', true)
					} else if (sites.inaturalistTaxon) {
						switchToPage('flickr')
					}
					break

				case 'd':
					el = document.querySelector<HTMLElement>(
						'.interlanguage-link.interwiki-vi > a, .interlanguage-link.interwiki-en > a'
					)
					if (el) {
						el.click()
					}
					break

				case 'esc':
					if (sites.flickr) {
						el = document.querySelector<HTMLAnchorElement>('a.do-not-evict')
						if (el) {
							el.click()
						}
					}
					break

				case 'w':
					window.close()
					break

				case 'z':
					if (sites.flickr) {
						el = document.querySelector<HTMLAnchorElement>('a.do-not-evict')
						if (el) {
							el.click()
							break
						}
					}
					history.back()
					break

				case 'x':
					history.forward()
					break
			}
		}
	}

	useEventListener('keydown', (event: KeyboardEvent): void => {
		if (event.repeat) return
		if (document.activeElement?.matches('input, textarea, select')) return
		const key: string = makeComboKey(event.code)
		const newComboKeys: string[] = [...comboKeys]
		const modifierKeyIndex: number = modifierKeys.indexOf(key)
		if (modifierKeyIndex >= 0) {
			if (comboKeys.length <= 3) {
				newComboKeys[modifierKeyIndex] = key
			}
		} else {
			newComboKeys.push(key)
		}
		setComboKeys(newComboKeys)
	})

	useEventListener('keyup', (event: KeyboardEvent): void => {
		if (comboKeys.length === 0) return
		if (document.activeElement?.matches('input, textarea, select')) return
		const combo: string = comboKeys.filter(Boolean).join('+')
		if (combo === 'alt') {
			event.preventDefault()
		}
		press(combo, null)
		setComboKeys(initialComboKeys)
	})

	useEventListener('mousedown', (event: MouseEvent): void => {
		if (document.activeElement?.matches('input, textarea, select')) return
		if (event.shiftKey && event.button === 2) {
			emptySel()
		}
		const key: string = makeComboKey(event.button)
		setComboKeys([...comboKeys, key])
		setMouseDownSel(getSel())
	})

	useEventListener('mouseup', (event: MouseEvent): void => {
		if (document.activeElement?.matches('input, textarea, select')) return
		const combo: string = comboKeys.filter(Boolean).join('+')
		press(combo, event.target as HTMLElement)
		setComboKeys(initialComboKeys)
		setMouseDownSel('')
	})

	useEventListener('contextmenu', (event: MouseEvent): void => {
		if (preventContextMenuCombo) {
			if (matchCombo('mr, **+mr', preventContextMenuCombo)) {
				event.preventDefault()
			}
			preventContextMenuCombo = ''
		}
	})

	useEventListener('blur', (): void => {
		setComboKeys(initialComboKeys)
	})

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

	useEffect(() => {
		if (!sites.inaturalistTaxon) return

		const removeOtherCommonNames = (countDown: number): void => {
			if (countDown === 0) return

			const el = document.querySelector<HTMLElement>(
				'.TaxonomyTab .row:nth-child(2) .col-xs-8'
			)
			if (el === null) return

			const tds = el.querySelectorAll<HTMLTableCellElement>('tr > td:first-child')
			if (tds.length === 0) {
				setTimeout(removeOtherCommonNames, 100, countDown - 1)
				return
			}

			let count: number = tds.length
			for (const td of tds) {
				if (td.textContent === 'English' || td.textContent === 'Vietnamese') continue
				td.parentElement!.hidden = true
				count--
			}
			if (count === 0) {
				$(el).append('<i class="p-2">Không có tên tiếng Anh hoặc tiếng Việt.</i>')
			}
		}
		removeOtherCommonNames(10)
	}, [changedUrl])

	return (
		<div className="fixed inset-0 flex flex-col font-[sans-serif] text-[16px] overflow-hidden pointer-events-none z-10">
			<div className="flex-1"></div>

			<div className="flex flex-col items-start gap-0.5 absolute left-2 bottom-1 w-64">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className="px-2 py-1 rounded whitespace-pre-wrap bg-zinc-800 text-white"
					>
						{toast.message}
					</div>
				))}
			</div>

			<div className="flex justify-center items-end h-8 px-4 py-1">
				<div className="flex-1 flex justify-center items-center">
					{comboKeys.filter(Boolean).length > 0 && (
						<div className="px-2 py-1 rounded bg-zinc-800 text-white">
							{comboKeys.filter(Boolean).join('+')}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
