import { useEventListener } from 'ahooks'
import { reject, some } from 'lodash-es'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { findRankBySimilarName, findRankByTaxonName, Rank, RanksMap } from '../src/constants/ranks'
import { lowerFirst } from '../src/utils/lowerFirst'
import { upperFirst } from '../src/utils/upperFirst'
import { ComboKeysSection } from './components/ComboKeysSection'
import { GitHubUploadDialog } from './components/GitHubUploadDialog'
import { SideBar } from './components/SideBar'
import { ToastsSection } from './components/ToastsSection'
import { comboPhotoCaptionsMap } from './constants/comboPhotoCaptionsMap'
import { closestSelector } from './helpers/closestSelector'
import { extractDisambEnFromLink } from './helpers/extractDisambEnFromLink'
import { fillHerpmapperSpeciesListToSpeciesInClipboard } from './helpers/fillHerpmapperSpeciesListToSpeciesInClipboard'
import { formatTextEn } from './helpers/formatTextEn'
import { formatTextVi } from './helpers/formatTextVi'
import { emptySel, getSel } from './helpers/getSel'
import { getTextNodes } from './helpers/getTextNodes'
import { isWikipediaEdit } from './helpers/isWikipediaEdit'
import { makeComboKey } from './helpers/makeComboKey'
import { makePhotoCode } from './helpers/makePhotoCode'
import { mark } from './helpers/mark'
import { matchCombo } from './helpers/matchCombo'
import { fillRepfocusSpeciesListToSpeciesInClipboard } from './helpers/pickRepfocusSpeciesListToSpeciesInClipboard'
import { setupHerplist } from './helpers/setupHerplist'
import { setupInaturalistSearch } from './helpers/setupInaturalistSearch'
import { setupInaturalistTaxon } from './helpers/setupInaturalistTaxon'
import { setupRepfocus } from './helpers/setupRepfocus'
import { setupSites } from './helpers/setupSites'
import { setupWikipedia } from './helpers/setupWikipedia'
import { showToast, Toast } from './helpers/showToast'
import { switchToPage } from './helpers/switchToPage'
import { taxaToLinesTextOrText } from './helpers/taxaToLinesTextOrText'
import { uploadToImgbb } from './helpers/uploadToImgbb'
import { uploadToImgur } from './helpers/uploadToImgur'
import { uploadToImgurFromClipboard } from './helpers/uploadToImgurFromClipboard'
import { useUrlChange } from './hooks/useUrlChange'
import { ext, initialComboKeys, SiteName, useExt } from './store/ext'
import { checkEmptyTextNode } from './utils/checkEmptyTextNode'
import { copyText } from './utils/clipboard'
import { $ } from './utils/jquery'

export type TaxonData = {
	name: string
	rank: Rank
	textEn: string
	extinct: boolean
	candidatus: boolean
	disambEn: string
}

const hybridChar: string = '\xd7'
const graftChar: string = '+'
const modifierKeys: readonly string[] = ['ctrl', 'shift', 'alt']

let copyingText: string | undefined = undefined
let preventContextMenuCombo: string = ''

export function App(): ReactNode {
	const { sites, comboKeys, mouseDownSel, gitHubUploadImageUrl } = useExt()

	const changedUrl = useUrlChange()
	const [genderPhotos, setGenderPhotos] = useState<string[][]>([
		['', ''],
		['', '']
	])
	const taxa = useRef<TaxonData[]>([])

	const press = async (combo: string, target: HTMLElement | null): Promise<void> => {
		let el: HTMLElement | null | undefined
		let node: ChildNode | null | undefined
		let textNode: Text | undefined
		let matches: RegExpExecArray | null
		const isMouseButton: boolean = matchCombo('ml|mm|mr', combo)

		const sel: string = getSel()
		if (sel !== mouseDownSel && isMouseButton) return

		const preventContextMenu = (): void => {
			preventContextMenuCombo = combo
		}

		if (sel && isMouseButton) {
			if (combo === 'ml') {
				const text: string = upperFirst(sel)
				copyingText = ` - ${text}`
				copyText(copyingText)
			}
		}
		//
		else if (target) {
			if (sites.inaturalistTaxon && target.matches('.modal-link')) {
				target = target.parentElement!.nextElementSibling as HTMLElement
			}

			const $target = $(target)

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
				target.matches('.mw-page-title-main, b, .mw-first-heading, .taxon4-title') &&
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
					switch (combo) {
						case 'i+u+mr':
							{
								preventContextMenu()
								mark(target)
								const toast: Toast = showToast('Đang tải ảnh lên Imgur', Infinity)
								const imgurImageId: string = await uploadToImgur(imageUrl)
								copyingText = ` | -${imgurImageId}`
								copyText(copyingText)
								toast.update(`Đã tải ảnh lên Imgur với id: ${imgurImageId}`)
							}
							break

						case 'i+b+mr':
							{
								preventContextMenu()
								mark(target)
								const toast: Toast = showToast('Đang tải ảnh lên Imgbb', Infinity)
								const imgbbImageId: string = await uploadToImgbb(imageUrl)
								copyingText = ` | .${imgbbImageId}`
								copyText(copyingText)
								toast.update(`Đã tải ảnh lên Imgbb với id: ${imgbbImageId}`)
							}
							break

						case 'g+h+mr':
							preventContextMenu()
							mark(target)
							ext.gitHubUploadImageUrl = imageUrl
							break

						default:
							{
								const photoCode: string = makePhotoCode(imageUrl)
								if (photoCode) {
									for (const key in comboPhotoCaptionsMap) {
										const has: boolean = matchCombo(key, combo)
										const hasShift: boolean = matchCombo(`shift+${key}`, combo)
										const hasAlt: boolean = matchCombo(`alt+${key}`, combo)
										const hasShiftAlt: boolean = matchCombo(
											`shift+alt+${key}`,
											combo
										)
										if (has || hasShift || hasAlt || hasShiftAlt) {
											const template = comboPhotoCaptionsMap[key]
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
											const newGenderPhotos: string[][] =
												structuredClone(genderPhotos)
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
												.map((photoTexts) =>
													photoTexts.join('').replace(/ ; \.$/, '')
												)
												.join('')
											await copyText(copyingText)
											mark(target)
										}
									}
								}
							}
							break
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
								el.matches(':not(.new):not(.tx4-opened-link)')
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
										el.classList.add('tx4-opened-link')
										markOpenedLinkOnlyCount--
									}
								}
							}
						}
					}

					const openLink = (el: HTMLAnchorElement, active: boolean = false): void => {
						if (window.closed) return
						el.classList.add('tx4-opened-link')
						const win = GM_openInTab(el.href, { insert: false, active })
						win.onclose = openNextLinkInQueue
					}

					const openNextLinkInQueue = (): void => {
						const el: HTMLAnchorElement | undefined = openedLinkQueue.shift()
						if (el === undefined) return
						openLink(el)
					}

					do {
						if (target.closest('.comname')) break

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

						if (target.closest('.tx4-wikipedia table:not(.biota) :is(td, th)')) {
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
							'.tx4-wikispecies .mw-parser-output > p:scope'
						)
						if (el) {
							const text: string = el.innerText.trim().split('\n').at(-1)!
							forcedRank = findRankBySimilarName(text) ?? forcedRank
							itemEls = $target.find('br:nth(-2)').nextAll('i, a').toArray()
							break
						}

						el = target.closest<HTMLUListElement>('ul.plain.taxonomy')
						if (el) {
							itemEls = [...el.children] as HTMLElement[]
							markEl = el
							break
						}
					} while (false)

					for (const itemEl of itemEls) {
						let taxon: TaxonData | null = null
						let rank: Rank | undefined = forcedRank
						let name: string = ''
						let textEn: string = ''
						let extinct: boolean = false
						let candidatus: boolean = false
						let disambEn: string = ''
						const $itemEl: JQuery<HTMLElement> = $(itemEl)
						/**
						 * Phần tử `$itemEl` được sao chép toàn bộ, và đã loại bỏ các danh
						 * sách con. Mục đích để thao tác tìm kiếm. Mọi thay đổi đối với
						 * phần tử này và tất cả phần tử con bên trong sẽ không ảnh hưởng
						 * đến DOM thực tế.
						 */
						const $scopedItemEl: JQuery<HTMLElement> = $itemEl
							.clone()
							.find('ul, ol, dl')
							.remove()
							.end()

						extinct = $scopedItemEl.text().includes('\u2020')
						candidatus = $scopedItemEl.text().includes('Candidatus')

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

							el = closestSelector(itemEl, 'table :is(td, th):scope', 'i')
							if (el) {
								const link = el.querySelector('a')
								if (link) {
									addLinkToQueue(link)
									disambEn = extractDisambEnFromLink(link) ?? disambEn
								}
								const commonNameHeadCell = $itemEl
									.closest('table')
									.find<HTMLTableCellElement>(
										'th[scope=col], tr:first-child > th'
									)
									.toArray()
									.find((el2) => {
										return (
											el2.textContent?.trim().toLowerCase() === 'common name'
										)
									})
								name = (link ?? el).innerText

								if (commonNameHeadCell) {
									const row = el.closest('tr')!
									const commonNameCell = row.cells.item(
										commonNameHeadCell.cellIndex
									)
									if (commonNameCell) {
										const $link = $(commonNameCell).find(':not(.reference) > a')
										if ($link[0]) {
											addLinkToQueue($link[0])
											disambEn = extractDisambEnFromLink($link[0]) ?? disambEn
										}
										textEn =
											$link.first().text().trim() ||
											$(commonNameCell).text().trim() ||
											textEn
										textEn = formatTextEn(textEn)
									}
								}
								break
							}

							el = $itemEl.closest('.wikitable :is(td, th):scope').find('a')[0]
							if (el) {
								name = el.innerText
								addLinkToQueue(el)
								disambEn = extractDisambEnFromLink(el) ?? disambEn
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
									if (findedRank) {
										name = el.innerText
										addLinkToQueue(el)
										rank = findedRank
										disambEn = extractDisambEnFromLink(el) ?? disambEn
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
									switch (wholeText) {
										case hybridChar:
											rank ??= RanksMap.species
											el = node.nextElementSibling as HTMLElement | null
											if (el) {
												name = `x ${el.innerText}`
											}
											break
										case graftChar:
											rank ??= RanksMap.genus
											el = node.nextElementSibling as HTMLElement | null
											if (el) {
												name = `+ ${el.innerText}`
											}
											break
										case 'subg.':
											rank ??= RanksMap.subgenus
											el = node.nextElementSibling as HTMLElement | null
											if (el) {
												name = el.innerText
											}
											break
										case 'sect.':
											rank ??= RanksMap.sectionBotany
											el = node.nextElementSibling as HTMLElement | null
											if (el) {
												name = el.innerText
											}
											break
										case 'var.':
											rank ??= RanksMap.variety
											el = node.nextElementSibling as HTMLElement | null
											if (el) {
												name = el.innerText
											}
											break
										case 'f.':
											rank ??= RanksMap.form
											el = node.nextElementSibling as HTMLElement | null
											if (el) {
												name = el.innerText
											}
											break
									}
								}
								break
							}

							el = itemEl.querySelector<HTMLElement>(
								':is(li, dd, p):scope > i:first-child > a'
							)
							if (el) {
								name = el.innerText
								addLinkToQueue(el)
								disambEn = extractDisambEnFromLink(el) ?? disambEn

								node = el.parentElement
								do {
									node = node?.nextSibling
								} while (checkEmptyTextNode(node))
								if (node instanceof HTMLElement) {
									if (node.localName === 'small') {
										node = node.nextSibling
									}
									// @see https://en.wikipedia.org/wiki/Demansia
									else if (
										node.localName === 'span' &&
										node.innerText.match(/, (20|1[987])\d{2}/)
									) {
										node = node.nextSibling
									}
								}
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									// @see https://en.wikipedia.org/wiki/Juliidae#Juliinae
									if (wholeText.match(/,? (1[8-9][0-9]{2}|20[0-9]{2})( |$)/)) {
										break
									}
									// @see https://en.wikipedia.org/wiki/Juliidae#Bertheliniinae
									if (wholeText.match(/synonym of/i)) break
									rank = findRankBySimilarName(wholeText) ?? rank
									if (!rank) {
										textEn = formatTextEn(wholeText)
										if (textEn) break
									}
								}

								node = el.parentElement
								do {
									node = node?.previousSibling
								} while (checkEmptyTextNode(node))
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									// @see https://en.wikipedia.org/wiki/Juliidae#Bertheliniinae
									if (wholeText.match(/^\(recent\)$/i)) break
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
								if (el.innerText === 'Candidatus' || el.innerText === 'Ca.') {
									candidatus = true
									el = el.nextElementSibling as HTMLElement
								}
								name = el.innerText

								const link = el.previousElementSibling as HTMLAnchorElement | null
								if (link !== null && link.matches('a')) {
									textEn = link.innerText
									addLinkToQueue(link)
									disambEn = extractDisambEnFromLink(link) ?? disambEn
								}

								node = el.nextSibling
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									if (name === 'Ca.') {
										name = wholeText.replace(/"|[A-Z]\. +/g, '')
									} else {
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

							el = itemEl.querySelector<HTMLElement>(
								':is(li, dd):scope > :is(abbr[title=Extinct] + a, a)'
							)
							if (el) {
								name = el.innerText

								node = el.previousSibling
								if (node instanceof Text) {
									const wholeText: string = node.wholeText.trim()
									rank = findRankBySimilarName(wholeText) ?? rank
								}
								break
							}

							el = itemEl.querySelector<HTMLElement>(
								':is(li, dd):scope > span > i[lang] > a'
							)
							if (el) {
								name = el.innerText
								break
							}

							if (itemEl.matches('i')) {
								name = itemEl.innerText
								break
							}

							if (itemEl.matches('.tx4-wikispecies .mw-parser-output a:scope')) {
								name = itemEl.innerText
								break
							}

							if (sites.herplist && itemEl.matches('.dotted-left')) {
								name = $(itemEl).find('.sciname').text()
								textEn = formatTextEn($(itemEl).parent().find('.comname').text())
								markEl = itemEl.parentElement!
							}

							el = itemEl.closest<HTMLElement>('.sciname')
							if (el) {
								name = el.innerText
								break
							}

							el = itemEl.closest<HTMLElement>('.comname')
							if (el) {
								textEn = formatTextEn(el.innerText)
								break
							}

							el = itemEl.querySelector<HTMLElement>(
								'.tx4-inaturalistTaxon .name-row'
							)
							if (el) {
								name = $(el).find('.sciname').text()
								textEn = formatTextEn($(el).find('.comname').text())

								const span = el.querySelector<HTMLSpanElement>(':scope > span')
								if (span) {
									rank = findRankBySimilarName(span.className) ?? rank
								}
								break
							}

							if (
								itemEl.matches(
									'.mw-page-title-main, .mw-first-heading, .vernacular, b, em, font, .taxon4-title, .Heading-main'
								)
							) {
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

							if (
								itemEl.matches('.table td.col-xs-6:nth-child(1)') &&
								sites.herpmapper
							) {
								name = itemEl.innerText
								textEn = formatTextEn($itemEl.next().text())
								break
							}

							if (
								itemEl.matches('.table td.col-xs-6:nth-child(2)') &&
								sites.herpmapper
							) {
								textEn = formatTextEn(itemEl.innerText)
								break
							}

							if (
								itemEl.matches('#dataTable tbody td:nth-child(2)') &&
								sites.sealifebase
							) {
								textEn = formatTextEn(itemEl.innerText)
								break
							}
						} while (false)

						name ??= ''
						textEn ??= ''

						if (name) {
							name = name.trim().split('\n')[0]
							name = name.replace('\xd7', 'x').replace(/\xad/g, '').replace('†', '')
						}

						if (name) {
							do {
								const subgenusRegex: RegExp =
									/^(?:[A-Z][a-z-]+|[A-Z]\.)\s+subg\.\s+([a-z-]+)$/
								matches = subgenusRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.subgenus
									name = matches[1]
									break
								}

								const sectionBotanyRegex: RegExp =
									/^(?:[A-Z][a-z-]+|[A-Z]\.)\s+sect\.\s+([a-z-]+)$/
								matches = sectionBotanyRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.sectionBotany
									name = matches[1]
									break
								}

								const varietyRegex: RegExp =
									/^(?:[A-Z][a-z-]+|[A-Z]\.)\s+(?:[a-z][a-z-]+|[a-z]\.)\s+var\.\s+([a-z-]+)$/
								matches = varietyRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.variety
									name = matches[1]
									break
								}

								const subspeciesRegex: RegExp =
									/^(?:[A-Z][a-z-]+|[A-Z]\.)\s+(?:[a-z][a-z-]+|[a-z]\.)(?:\s+(?:subsp|ssp)\.)?\s+([a-zA-Z][a-z-]+)$/
								matches = subspeciesRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.subspecies
									name = lowerFirst(matches[1])
									break
								}

								const hybridSpeciesRegex: RegExp =
									/^(?:[A-Z][a-z-]+|[A-Z]\.)\s*×\s*([a-z-]+)$/
								matches = hybridSpeciesRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.species
									name = `x ${matches[1]}`
									break
								}

								const graftVarietyRegex: RegExp =
									/^\+\s*(?:[A-Z][a-z-]+|[A-Z]\.)\s*(["'])([A-Za-z\d'-]+)\1$/
								matches = graftVarietyRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.variety
									name = `+ ${matches[2]}`
									break
								}

								const speciesRegex: RegExp =
									/^(?:[A-Z][a-z-]+\s+|[A-Z]\.\s*)(?:\([A-Za-z-]+\)\s+)?([a-z-]+)$/
								matches = speciesRegex.exec(name)
								if (matches) {
									rank ??= RanksMap.species
									name = matches[1]
									break
								}
							} while (false)
						}

						if (rank === undefined && name) {
							rank = findRankByTaxonName(name)
						}

						rank ??= RanksMap.genus
						rank = forcedRank ?? rank

						textEn = formatTextEn(textEn)

						if (name) {
							taxon = { name, rank, textEn, extinct, candidatus, disambEn }
							taxa.current.push(taxon)
						} else if (textEn) {
							copyingText = ` - ${textEn}`
							await copyText(copyingText)
							mark(markEl)
							break
						}
					}

					if (taxa.current.length > 0) {
						copyingText = taxaToLinesTextOrText(taxa.current, true)
						await copyText(copyingText)
						mark(markEl)
					}
				}
			}
		}
		//
		else {
			switch (combo) {
				case 'g':
					switchToPage(SiteName.GoogleImage)
					break

				case 'g+w':
					switchToPage(SiteName.Wikipedia)
					break

				case 'g+r':
					switchToPage(SiteName.Repfocus)
					break

				case 'k':
					switchToPage(SiteName.Flickr)
					break

				case 'k+l':
					el = document.querySelector<HTMLElement>('.gn-signin > a')
					if (el !== null) {
						el.click()
					}
					break

				case 'n':
					switchToPage(SiteName.InaturalistSearch)
					break

				case 'h':
					switchToPage(SiteName.Herpmapper)
					break

				case 'e':
					switchToPage(SiteName.Ebird)
					break

				case 's':
					switchToPage(SiteName.Wikispecies)
					break

				case 'b':
					switchToPage(SiteName.SeaLifeBase)
					break

				case 'r':
					if (taxa.current.length > 0) {
						const hasSomeExtinct: boolean = some(taxa.current, 'extinct')
						taxa.current.forEach((taxon) => {
							taxon.extinct = !hasSomeExtinct
						})
						copyingText = taxaToLinesTextOrText(taxa.current)
						await copyText(copyingText)
						showToast(
							hasSomeExtinct
								? 'Đã loại bỏ tất cả dấu tuyệt chủng'
								: 'Đã thêm dấu tuyệt chủng cho tất cả'
						)
					}
					break

				case 't':
					if (taxa.current.length > 0) {
						taxa.current.forEach((taxon) => {
							taxon.textEn = ''
						})
						copyingText = taxaToLinesTextOrText(taxa.current)
						await copyText(copyingText)
						showToast('Đã loại bỏ textEn')
					}
					break

				case 'shift+t':
					await copyText('')
					showToast('Đã loại bỏ text trong clipboard')
					break

				case 'q':
					switch (true) {
						case sites.wikipedia:
							switchToPage(SiteName.InaturalistTaxon, true)
							break
						case sites.inaturalistTaxon:
							switchToPage(SiteName.Flickr)
							break
						case sites.flickr:
							switchToPage(SiteName.GoogleImage)
							break
					}
					break

				case 'd':
					{
						el = document.querySelector<HTMLElement>(
							'.interlanguage-link.interwiki-vi > a, .interlanguage-link.interwiki-en > a'
						)
						if (el) {
							el.click()
						}
					}
					break

				case 'l':
					const lowerSel: string = sel.toLowerCase()
					const func = (nodes: NodeListOf<ChildNode>): void => {
						for (const node of nodes) {
							if (node instanceof Text) {
								if (node.textContent === null) continue
								node.textContent = node.textContent.replaceAll(sel, lowerSel)
							} else {
								func(node.childNodes)
							}
						}
					}
					func(document.body.childNodes)
					break

				case 'f':
					window.find('subspecies', false)
					break

				case 'shift+f':
					window.find('subspecies', false, true)
					break

				case 'c':
					switch (true) {
						case sites.herpmapper:
							fillHerpmapperSpeciesListToSpeciesInClipboard()
							break
						case sites.repfocus:
							fillRepfocusSpeciesListToSpeciesInClipboard()
							break
					}
					break

				case 'i+u+p':
					{
						const toast: Toast = showToast('Đang tải ảnh lên Imgur', Infinity)
						try {
							const imgurImageId: string = await uploadToImgurFromClipboard()
							copyingText = ` | -${imgurImageId}`
							copyText(copyingText)
							toast.update(`Đã tải ảnh lên Imgur với id: ${imgurImageId}`)
						} catch (error: unknown) {
							toast.update(String(error))
						}
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
		if (event.altKey) {
			event.preventDefault()
		}
		if (isWikipediaEdit()) return
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
		ext.comboKeys = newComboKeys
	})

	useEventListener('keyup', (event: KeyboardEvent): void => {
		if (comboKeys.length === 0) return
		if (document.activeElement?.matches('input, textarea, select')) return
		if (isWikipediaEdit()) return
		const combo: string = comboKeys.filter(Boolean).join('+')
		if (combo === 'alt') {
			event.preventDefault()
		}
		press(combo, null)
		ext.comboKeys = [...initialComboKeys]
	})

	useEventListener('mousedown', (event: MouseEvent): void => {
		if (document.activeElement?.matches('input, textarea, select')) return
		if (isWikipediaEdit()) return

		if (event.shiftKey && event.button === 2) {
			emptySel()
		}
		if (sites.flickr && event.button === 2) {
			$('.photo-notes-scrappy-view, .facade-of-protection-neue').hide()
		}
		const key: string = makeComboKey(event.button)
		ext.comboKeys = [...comboKeys, key]
		ext.mouseDownSel = getSel()
	})

	useEventListener('mouseup', (event: MouseEvent): void => {
		if (document.activeElement?.matches('input, textarea, select')) return
		if (isWikipediaEdit()) return

		if (sites.flickr && event.button === 2) {
			$('.photo-notes-scrappy-view, .facade-of-protection-neue').show()
		}

		const combo: string = comboKeys.filter(Boolean).join('+')
		press(combo, event.target as HTMLElement)
		ext.comboKeys = [...initialComboKeys]
		ext.mouseDownSel = ''
	})

	useEventListener('contextmenu', (event: MouseEvent): void => {
		if (!preventContextMenuCombo) return

		if (matchCombo('mr, **+mr', preventContextMenuCombo)) {
			event.preventDefault()
		}
		preventContextMenuCombo = ''
	})

	useEventListener('blur', (): void => {
		ext.comboKeys = [...initialComboKeys]
	})

	useEffect(setupSites, [sites])

	useEffect(setupWikipedia, [sites.wikipedia])
	useEffect(setupInaturalistSearch, [sites.inaturalistSearch])
	useEffect(setupInaturalistTaxon, [changedUrl, sites.inaturalistTaxon])
	useEffect(setupRepfocus, [sites.repfocus])
	useEffect(setupHerplist, [sites.herplist])

	return (
		<div className="pointer-events-none fixed inset-0 z-[99999] flex flex-col overflow-hidden font-sans text-[16px] leading-normal text-white">
			<div className="flex flex-1">
				<div className="w-36" />
				<div className="flex-1" />
				<SideBar />
				<div className="w-32" />
			</div>
			{gitHubUploadImageUrl !== undefined && <GitHubUploadDialog />}
			<ToastsSection />
			<ComboKeysSection />
		</div>
	)
}
