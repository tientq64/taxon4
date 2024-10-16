import { TaxonData } from '../App'
import { getSel } from './getSel'

export async function press(combo: string, target: HTMLElement | null): Promise<void> {
	let taxa: TaxonData[] = []
	let el: HTMLElement | null | undefined
	let $el: JQuery<HTMLElement>
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
		else if (target.matches('.mw-page-title-main, b') && matchCombo('mr, shift+mr', combo)) {
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
				taxa = []
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
					let name: string = ''
					let textEn: string = ''
					let extinct: boolean = false
					let disambEn: string = ''
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

						$el = $itemEl.closest('.wikitable :is(td, th):scope').find('i')
						if ($el[0]) {
							const link = $el.find('a')[0]
							if (link) {
								addLinkToQueue(link)
								disambEn = extractDisambEnFromLink(link) ?? disambEn
							}
							const commonNameHeadCell = $itemEl
								.closest('.wikitable')
								.find<HTMLTableCellElement>('th[scope=col], tr:first-child > th')
								.toArray()
								.find((el2) => {
									return el2.textContent?.trim().toLowerCase() === 'common name'
								})
							name = $el.text()

							if (commonNameHeadCell) {
								const $row = $el.closest('tr')
								const commonNameCell = $row.get(commonNameHeadCell.cellIndex)
								if (commonNameCell) {
									let $link = $(commonNameCell).find('a')
									if ($link) {
										addLinkToQueue($link[0])
										disambEn = extractDisambEnFromLink($link[0]) ?? disambEn
									}
									textEn =
										$link.first().text().trim() ||
										$(commonNameCell).text().trim() ||
										textEn
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

						el = closestSelector(itemEl, '.biota tr > td > p > i:scope', ':scope > a')
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

						el = itemEl.querySelector<HTMLElement>(':is(li, dd):scope > a:first-child')
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
							disambEn = extractDisambEnFromLink(el) ?? disambEn

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
								disambEn = extractDisambEnFromLink(link) ?? disambEn
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
						do {
							const varietyRegex: RegExp =
								/^(?:[A-Z][a-z-]+|[A-Z]\.)\s+(?:[a-z][a-z-]+|[a-z]\.)\s+var\.\s+([a-z-]+)$/
							matches = varietyRegex.exec(name)
							if (matches) {
								rank ??= RanksMap.variety
								name = matches[1]
								break
							}

							const subspeciesRegex: RegExp =
								/^(?:[A-Z][a-z-]+|[A-Z]\.)\s+(?:[a-z][a-z-]+|[a-z]\.)(?:\s+subsp\.)?\s+([a-zA-Z][a-z-]+)$/
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

							const speciesRegex: RegExp = /^(?:[A-Z][a-z-]+|[A-Z]\.)\s+([a-z-]+)$/
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

					if (name) {
						taxon = { name, rank, textEn, extinct, disambEn }
						taxa.push(taxon)
					} else if (textEn) {
						textEn = formatTextEn(textEn)
						if (textEn) {
							copyingText = ` - ${textEn}`
							await copyText(copyingText)
							mark(markEl)
							break
						}
					}
				}

				if (taxa.length > 0) {
					copyingText = taxaToLinesTextOrText(taxa, true)
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
				if (taxa.length > 0) {
					const hasSomeExtinct: boolean = some(taxa, 'extinct')
					taxa.forEach((taxon) => {
						taxon.extinct = !hasSomeExtinct
					})
					copyingText = taxaToLinesTextOrText(taxa)
					await copyText(copyingText)
					showToast(
						hasSomeExtinct
							? 'Đã loại bỏ tất cả dấu tuyệt chủng.'
							: 'Đã thêm dấu tuyệt chủng cho tất cả.'
					)
				}
				break

			case 't':
				if (taxa.length > 0) {
					taxa.forEach((taxon) => {
						taxon.textEn = ''
					})
					copyingText = taxaToLinesTextOrText(taxa)
					await copyText(copyingText)
					showToast('Đã loại bỏ textEn.')
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
