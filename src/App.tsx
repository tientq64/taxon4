import m, { VnodeDOM } from 'mithril'
import logoImage from '../public/assets/images/logo.png'
import { Node, parse } from './helpers/parse'
import { ranksMap } from './models/ranks'
import { loadPersist } from './helpers/loadPersist'
import { savePersist } from './helpers/savePersist'

export type Store = {
	scrollTop: number
	nodes: Node[]
}

const store: Store = {
	scrollTop: 0,
	nodes: []
}
export default store

export function App() {
	let viewNodes: Node[] = []
	let scrollHeight: number = 0
	let scrollerEl: HTMLDivElement | null = null
	let scrollerHeight: number = 0

	loadPersist()

	const handleCreate = async (): Promise<void> => {
		const text: string = await m.request('data/data.taxon', { responseType: 'text' })
		store.nodes = parse(text)
		scrollHeight = store.nodes[store.nodes.length - 1].bottom
	}

	const handleScrollScroller = (event: Event): void => {
		event.redraw = false
		scroll()
	}

	const scroll = (): void => {
		if (scrollerEl === null) return
		const scrollTop: number = scrollerEl.scrollTop
		const scrollBottom: number = scrollTop + scrollerHeight
		viewNodes = store.nodes.filter(
			(node) => node.bottom >= scrollTop && node.top <= scrollBottom
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
				{store.nodes.length === 0 && (
					<div class="flex flex-col gap-4 justify-center items-center h-full">
						<img class="h-24" src={logoImage} />
						Đang tải...
					</div>
				)}
				{store.nodes.length > 0 && (
					<div
						class="flex h-full overflow-auto"
						oncreate={handleCreateScroller}
						onscroll={handleScrollScroller}
					>
						<div
							style={{
								translate: `0 ${viewNodes[0]?.top}px`
							}}
						>
							{viewNodes.map((node, i) =>
								node.rank.level < ranksMap.species.level ? (
									<div
										key={node.index}
										class="flex items-center h-6"
										style={{ marginLeft: `${node.rank.level * 16}px` }}
									>
										<div class={node.rank.colorClass}>{node.name}</div>
										{node.extinct && (
											<div class="ml-1 text-rose-400">{'\u2020'}</div>
										)}
										{node.textEn && (
											<div className="flex items-center text-zinc-400">
												<div className="mx-2">&middot;</div>
												{node.textEn}
											</div>
										)}
									</div>
								) : (
									<div
										key={node.index}
										class="inline-flex flex-col items-center w-40 px-4 py-1 align-top"
										style={{
											height: `${node.bottom - node.top}px`,
											marginLeft: `${
												i === 0
													? ranksMap.species.level * 16 +
													  (node.subIndex! % 7) * 160
													: node.subIndex! % 7 === 0
													? ranksMap.species.level * 16
													: 0
											}px`
										}}
									>
										{node.photoUrl !== undefined && (
											<div className="flex justify-center items-center w-32 h-24">
												<img
													class="max-h-24 p-1 rounded bg-zinc-700"
													src={node.photoUrl}
													loading="lazy"
												/>
											</div>
										)}
										{node.photoUrl === undefined && (
											<div className="w-32 h-24 border border-dashed border-zinc-800 rounded" />
										)}
										<div
											className={`flex items-center text-xs ${node.rank.colorClass}`}
										>
											{node.rank.abbr} {node.name}
											{node.extinct && (
												<div class="ml-1 text-rose-400">{'\u2020'}</div>
											)}
										</div>
										{node.textEn && (
											<div className="flex items-center h-5 text-xs leading-3 text-center text-zinc-400">
												{node.textEn}
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
