import m, { VnodeDOM } from 'mithril'
import logoImage from '/assets/images/logo.png'
import { Taxon, parse } from './helpers/parse'
import { ranksMap } from '../web-extension/helpers/ranks'
import { loadPersist } from './helpers/loadPersist'
import { savePersist } from './helpers/savePersist'

export type Store = {
	scrollTop: number
	taxa: Taxon[]
}

const store: Store = {
	scrollTop: 0,
	taxa: []
}
export default store

export function App() {
	let viewTaxa: Taxon[] = []
	let scrollHeight: number = 0
	let scrollerEl: HTMLDivElement | null = null
	let scrollerHeight: number = 0

	loadPersist()

	const handleCreate = async (): Promise<void> => {
		const text: string = await m.request('data/data.taxon4', { responseType: 'text' })
		store.taxa = parse(text)
		scrollHeight = store.taxa[store.taxa.length - 1].bottom
	}

	const handleScrollScroller = (event: Event): void => {
		event.redraw = false
		scroll()
	}

	const scroll = (): void => {
		if (scrollerEl === null) return
		const scrollTop: number = scrollerEl.scrollTop
		const scrollBottom: number = scrollTop + scrollerHeight
		viewTaxa = store.taxa.filter(
			(taxon) => taxon.bottom >= scrollTop && taxon.top <= scrollBottom
		)
		store.scrollTop = scrollTop
		savePersist()
		m.redraw()
	}

	const handleCreateScroller = (vnode: VnodeDOM): void => {
		scrollerEl = vnode.dom as HTMLDivElement
		scrollerHeight = scrollerEl.offsetHeight
		if (store.scrollTop > 0) {
			scrollerEl.scrollTop = store.scrollTop
		} else {
			scroll()
		}
	}

	return {
		view: () => (
			<div class="h-full" oncreate={handleCreate}>
				{store.taxa.length === 0 && (
					<div class="flex flex-col gap-4 justify-center items-center h-full">
						<img class="h-24" src={logoImage} />
						Đang tải...
					</div>
				)}
				{store.taxa.length > 0 && (
					<div
						class="flex h-full overflow-auto"
						oncreate={handleCreateScroller}
						onscroll={handleScrollScroller}
					>
						<div
							style={{
								translate: `0 ${viewTaxa[0]?.top}px`
							}}
						>
							{viewTaxa.map((taxon, i) =>
								taxon.rank.level < ranksMap.species.level ? (
									<div
										key={taxon.index}
										class="flex items-center h-6"
										style={{ marginLeft: `${taxon.rank.level * 16}px` }}
									>
										<div class={taxon.rank.colorClass}>{taxon.name}</div>
										{taxon.extinct && (
											<div class="ml-1 text-rose-400">{'\u2020'}</div>
										)}
										{taxon.textEn && (
											<div className="flex items-center text-zinc-400">
												<div className="mx-2">&middot;</div>
												{taxon.textEn}
											</div>
										)}
									</div>
								) : (
									<div
										key={taxon.index}
										class="inline-flex flex-col items-center w-40 px-4 py-1 align-top"
										style={{
											height: `${taxon.bottom - taxon.top}px`,
											marginLeft: `${
												i === 0
													? ranksMap.species.level * 16 +
													  (taxon.subIndex! % 7) * 160
													: taxon.subIndex! % 7 === 0
													? ranksMap.species.level * 16
													: 0
											}px`
										}}
									>
										{taxon.photoUrl !== undefined && (
											<div className="flex justify-center items-center w-32 h-24">
												<img
													class="max-h-24 p-1 rounded bg-zinc-700"
													src={taxon.photoUrl}
													loading="lazy"
												/>
											</div>
										)}
										{taxon.photoUrl === undefined && (
											<div className="w-32 h-24 border border-dashed border-zinc-800 rounded" />
										)}
										<div
											className={`flex items-center text-xs ${taxon.rank.colorClass}`}
										>
											{taxon.rank.abbr} {taxon.name}
											{taxon.extinct && (
												<div class="ml-1 text-rose-400">{'\u2020'}</div>
											)}
										</div>
										{taxon.textEn && (
											<div className="flex items-center h-5 text-xs leading-3 text-center text-zinc-400">
												{taxon.textEn}
											</div>
										)}
									</div>
								)
							)}
						</div>

						<div class="invisible" style={{ height: `${scrollHeight}px` }} />
					</div>
				)}
			</div>
		)
	}
}
