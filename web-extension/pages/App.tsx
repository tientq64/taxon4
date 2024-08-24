import { forEach, upperFirst } from 'lodash-es'
import m, { Component, redraw } from 'mithril'
import { closestSelector } from '../helpers/closestSelector'
import { formatTextEn } from '../helpers/formatTextEn'
import { getSel } from '../helpers/getSel'
import { makeComboKey } from '../helpers/makeComboKey'
import { makePhotoCode } from '../helpers/makePhotoCode'
import { mark } from '../helpers/mark'
import { matchCombo } from '../helpers/matchCombo'
import { findRankBySimilarName, Rank, ranksMap } from '../helpers/ranks'
import { taxaToLinesText } from '../helpers/taxaToLinesText'
import { testUrlPattern } from '../helpers/testUrlPattern'
import { copyText } from '../utils/clipboard'
import { switchToPage } from '../helpers/switchToPage'

export type Store = {
	is: {
		wikipediaWiki: boolean
		flickrSearch: boolean
		inaturalistSearch: boolean
	}
	keys: string[]
}

export const store: Store = {
	is: {
		wikipediaWiki: testUrlPattern('*://*.wikipedia.org/wiki/*'),
		flickrSearch: testUrlPattern('*://*.flickr.com/search*'),
		inaturalistSearch: testUrlPattern('*://*.inaturalist.org/taxa/search*')
	},
	keys: []
}
export default store

export type Taxon = {
	name: string
	rank: Rank
	textEn: string
	extinct: boolean
}

let mouseDownSel: string = ''

async function press(combo: string, target: HTMLElement | null): Promise<void> {
	redraw()
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
				const taxa: Taxon[] = []

				let el: HTMLElement | null = null
				let node: ChildNode | null = null

				if (target.localName === 'li') {
					markEl = target.parentElement!
					itemEls = Array.from(markEl.children) as HTMLElement[]
				}

				for (const itemEl of itemEls) {
					let taxon: Taxon | null = null
					let rank: Rank = ranksMap.species
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
					if (rank === ranksMap.species) {
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

function handleGlobalKeyDown(event: KeyboardEvent): void {
	if (event.repeat) return
	redraw()
	const key: string = makeComboKey(event.code)
	store.keys.push(key)
}

function handleGlobalKeyUp(): void {
	if (store.keys.length === 0) return
	redraw()
	const combo: string = store.keys.join('+')
	press(combo, null)
	store.keys.splice(0, store.keys.length)
}

function handleGlobalMouseDown(event: MouseEvent): void {
	redraw()
	const key: string = makeComboKey(event.button)
	store.keys.push(key)
	mouseDownSel = getSel()
}

function handleGlobalMouseUp(event: MouseEvent): void {
	redraw()
	const combo: string = store.keys.join('+')
	press(combo, event.target as HTMLElement)
	store.keys.splice(0, store.keys.length)
	mouseDownSel = ''
}

function handleGlobalContextMenu(event: MouseEvent): void {
	event.preventDefault()
}

function handleGlobalBlur(): void {
	redraw()
	store.keys.splice(0, store.keys.length)
}

forEach(store.is, (matched: boolean, siteName: string): void => {
	if (matched) {
		document.documentElement.classList.add(`is-${siteName}`)
	}
})
window.addEventListener('keydown', handleGlobalKeyDown)
window.addEventListener('keyup', handleGlobalKeyUp)
window.addEventListener('mousedown', handleGlobalMouseDown)
window.addEventListener('mouseup', handleGlobalMouseUp)
window.addEventListener('contextmenu', handleGlobalContextMenu)
window.addEventListener('blur', handleGlobalBlur)

export function App(): Component {
	return {
		view: () => (
			<div class="fixed inset-0 flex flex-col font-[sans-serif] text-[16px] overflow-hidden pointer-events-none z-10">
				<div className="flex-1"></div>

				<div className="flex justify-center items-end h-8 px-4 py-1">
					<div className="flex-1 flex justify-center items-center">
						{store.keys.length > 0 && (
							<div class="px-2 py-1 rounded bg-zinc-800 text-white">
								{store.keys.join('+')}
							</div>
						)}
					</div>
				</div>
			</div>
		)
	}
}
