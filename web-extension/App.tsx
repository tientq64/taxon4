import { useEventListener } from 'ahooks'
import { forEach, reject, some, upperFirst } from 'lodash-es'
import { nanoid } from 'nanoid'
import { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import { closestSelector } from './helpers/closestSelector'
import { formatTextEn } from './helpers/formatTextEn'
import { formatTextVi } from './helpers/formatTextVi'
import { getSel } from './helpers/getSel'
import { getTextNodes } from './helpers/getTextNodes'
import { makeComboKey } from './helpers/makeComboKey'
import { makePhotoCode } from './helpers/makePhotoCode'
import { mark } from './helpers/mark'
import { matchCombo } from './helpers/matchCombo'
import { matchUrl } from './helpers/matchUrl'
import { switchToPage } from './helpers/switchToPage'
import { taxaToLinesTextOrText } from './helpers/taxaToLinesTextOrText'
import { findRankBySimilarName, Rank, RanksMap } from './models/Ranks'
import { copyText } from './utils/clipboard'

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

type Toast = {
	id: string
	message: string
	duration: number
	update: (message: string) => void
	close: () => void
}

const r = String.raw
const modifierKeys: string[] = ['ctrl', 'shift', 'alt']
const initialComboKeys: string[] = ['', '', '']

export const sites: Sites = {
	wikipediaWiki: matchUrl('https://_+.wikipedia.org/wiki/_+'),
	flickrSearch: matchUrl('https://www.flickr.com/search_+'),
	inaturalistSearch: matchUrl('https://www.inaturalist.org/taxa/search_+'),
	inaturalistTaxon: matchUrl(r`https://www.inaturalist.org/taxa/\d+-\w+`)
}

let copyingText: string | undefined = undefined
let preventContextMenuCombo: string = ''

export function App(): ReactNode {
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
		let node: ChildNode | null | undefined
		let textNode: Text | undefined

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
							mr: ' % photoCode ; .',
							'b+mr': ' % photoCode ; breeding',
							'c+mr': ' % photoCode ; reconstruction',
							'e+mr': ' % photoCode ; teeth',
							'f+mr': ' % photoCode ; fossil',
							'k+mr': ' % photoCode ; skeleton',
							'q+mr': ' | photoCode ; .',
							'r+mr': ' % photoCode ; restoration',
							'u+mr': ' % photoCode ; skull',
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
				if (matchCombo('ml, alt+ml', combo)) {
					taxa.current = []
					let markEl: HTMLElement = target
					let itemEls: HTMLElement[] = [target]
					let openedLinkCount: number = 10

					if (target.matches('li, dd')) {
						markEl = target.parentElement!
						itemEls = Array.from(markEl.children) as HTMLElement[]
					} else if (target.closest('.biota tr > td > p:has(> i > a)')) {
						itemEls = Array.from(target.children) as HTMLElement[]
						itemEls = reject(itemEls, { localName: 'br' })
					}

					for (const itemEl of itemEls) {
						let taxon: TaxonData | null = null
						let rank: Rank | undefined
						let name: string
						let textEn: string
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
								'.biota tr > td:scope',
								':scope > i > a, :scope > a > i'
							)
							if (el) {
								name = el.innerText
								markEl = el
								return
							}

							el = itemEl.closest<HTMLElement>('.biota tr > td:scope')
							if (el) {
								name = el.innerText
								return
							}

							el = closestSelector(
								itemEl,
								'.biota tr > td > p > i:scope',
								':scope > a'
							)
							if (el) {
								name = el.innerText

								el = el
									.closest('tr')
									?.previousElementSibling?.querySelector('tr:scope > th')
								if (el) {
									rank = findRankBySimilarName(el.innerText) ?? rank
									return
								}
								return
							}

							el = itemEl.querySelector<HTMLElement>(
								':is(li, dd):scope > i:first-child > a'
							)
							if (el) {
								name = el.innerText

								if (combo === 'alt+ml') {
									if (
										el instanceof HTMLAnchorElement &&
										!el.classList.contains('new') &&
										!el.classList.contains('opened-link') &&
										openedLinkCount > 0
									) {
										el.classList.add(
											'opened-link',
											'underline',
											'!text-violet-600'
										)
										openedLinkCount--
										window.open(el.href, '_blank')
									}
								}

								node = el.parentElement?.nextSibling || null
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									rank = findRankBySimilarName(wholeText) ?? rank
									if (!rank) {
										textEn = formatTextEn(wholeText)
										if (textEn) return
									}
								}

								node = el.parentElement?.previousSibling || null
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									rank = findRankBySimilarName(wholeText) ?? rank
									if (!rank) {
										textEn = formatTextEn(wholeText)
										if (textEn) return
									}
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

							el = itemEl.querySelector<HTMLElement>(':is(li, dd):scope > i')
							if (el) {
								name = el.innerText

								node = el.previousSibling
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									if (wholeText === 'subsp.') {
										rank = RanksMap.subspecies
										return
									}
								}
								return
							}

							el = itemEl.querySelector<HTMLElement>(':is(li, dd):scope > a')
							if (el) {
								name = el.innerText
								return
							}

							el = itemEl.closest<HTMLElement>('.comname')
							if (el) {
								textEn = formatTextEn(el.textContent)
								return
							}

							if (itemEl.matches('.mw-page-title-main, .vernacular, b, em')) {
								textEn = formatTextEn(itemEl.textContent)
								return
							}

							el = itemEl.querySelector<HTMLElement>('[jscontroller] h3')
							if (el) {
								markEl = el
								const text: string = el.textContent!.replace(/\(.+?\)/, '').trim()
								textEn = formatTextEn(text)
								if (textEn) return
							}
						})()

						name ??= ''
						textEn ??= ''

						if (name) {
							name = name.trim().split('\n')[0]
						}

						if (itemEl.innerText.includes('\u2020')) {
							extinct = true
						}

						if (name) {
							;((): void => {
								const subspeciesRegex: RegExp =
									/^([A-Z][a-z-]+|[A-Z]\.) +([a-z][a-z-]+|[a-z]\.) +[a-z-]+$/

								if (subspeciesRegex.test(name)) {
									rank ??= RanksMap.subspecies
									name = name.split(/\s+/).at(2)!
									return
								}

								const speciesRegex: RegExp = /^([A-Z][a-z-]+|[A-Z]\.) +[a-z-]+$/

								if (speciesRegex.test(name)) {
									rank ??= RanksMap.species
									name = name.split(/\s+/).at(1)!
									return
								}
							})()
						}

						rank ??= RanksMap.genus

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
					switchToPage('wikipediaWiki')
					break

				case 'k':
					switchToPage('flickrSearch')
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
					if (sites.wikipediaWiki) {
						switchToPage('flickrSearch')
					} else if (sites.flickrSearch) {
						switchToPage('inaturalistSearch')
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

				case 'w':
					window.close()
					break

				case 'z':
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
