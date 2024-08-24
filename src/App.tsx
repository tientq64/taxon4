import m, { VnodeDOM } from 'mithril'
import resolveConfig from 'tailwindcss/resolveConfig'
import pkg from '../package.json'
import tailwindConfig from '../tailwind.config'
import { loadPersist } from './helpers/loadPersist'
import { parse, Taxon } from './helpers/parse'
import { savePersist } from './helpers/savePersist'
import { modulo } from './utils/modulo'
import logoImage from '/assets/images/logo.png'

export type Store = {
	scrollTop: number
	taxa: Taxon[]
}

const store: Store = {
	scrollTop: 0,
	taxa: []
}
export default store

type Panel = {
	name: string
	icon: string
	text: string
}

export function App() {
	loadPersist()

	let rankLevelWidth: number
	let lineHeight: number = 24
	let lines: Taxon[] = []
	let linesNumber: number = 0
	let scrollbarHeight: number = 0
	let scrollerEl: HTMLDivElement | null = null
	let scrollerHeight: number = 0
	let scrollTop: number = store.scrollTop
	let linesTop: number = 0

	let searchValue: string = ''
	let searchResult: Taxon[] = []
	let searchIndex: number = 0

	const tailwind = resolveConfig(tailwindConfig)
	const screenLg: number = parseInt(tailwind.theme.screens.lg)
	const screenXl: number = parseInt(tailwind.theme.screens.xl)
	const screen2xl: number = parseInt(tailwind.theme.screens['2xl'])

	const panels: Panel[] = [
		{
			name: 'ranks',
			icon: 'account_tree',
			text: 'Phân cấp'
		},
		{
			name: 'search',
			icon: 'search',
			text: 'Tìm kiếm'
		},
		{
			name: 'stats',
			icon: 'bar_chart',
			text: 'Thống kê'
		},
		{
			name: 'settings',
			icon: 'settings',
			text: 'Cài đặt'
		},
		{
			name: 'about',
			icon: 'info',
			text: 'Thông tin'
		}
	]
	let currentPanel: Panel = panels[0]

	const oncreate = async (): Promise<void> => {
		const text: string = await m.request('data/data.taxon4', { responseType: 'text' })
		store.taxa = parse(text)
		scrollbarHeight = store.taxa.length * lineHeight
		window.addEventListener('resize', handleWindowResize)
	}

	const handleScrollerCreate = (vnode: VnodeDOM): void => {
		scrollerEl = vnode.dom as HTMLDivElement
		updateResize()
		scroll(store.scrollTop)
	}

	const getParents = (taxon: Taxon): Taxon[] => {
		const parents: Taxon[] = []
		let parent = taxon.parent
		while (parent !== undefined) {
			parents.push(parent)
			parent = parent.parent
		}
		return parents
	}

	const scroll = (top?: number): void => {
		if (scrollerEl === null) return

		if (top !== undefined) {
			scrollerEl.scrollTop = top
		}
		scrollTop = scrollerEl.scrollTop
		linesTop = Math.floor(scrollTop / lineHeight) * lineHeight
		const startIndex: number = Math.floor(scrollTop / lineHeight)
		const endIndex: number = startIndex + linesNumber + 1
		lines = store.taxa.slice(startIndex, endIndex)
		store.scrollTop = scrollTop
		savePersist()
		m.redraw()
	}

	const scrollToTaxon = (taxon: Taxon): void => {
		scroll(taxon.index * lineHeight)
	}

	const search = (): void => {
		if (searchValue.length < 2) {
			searchResult = []
		} else {
			searchResult = store.taxa.filter((taxon) => {
				return taxon.name.includes(searchValue)
			})
		}
		if (searchResult.length === 0) {
			searchIndex = 0
		} else if (searchIndex >= searchResult.length) {
			searchIndex = searchResult.length - 1
		}
		scrollSearch(searchIndex)
		m.redraw()
	}

	const scrollSearch = (index: number): void => {
		if (searchResult.length === 0) return

		searchIndex = modulo(index, searchResult.length)
		const taxon: Taxon = searchResult[searchIndex]
		scrollToTaxon(taxon)
		m.redraw()
	}

	const handleScrollerScroll = (event: Event): void => {
		event.redraw = false
		scroll()
	}

	const updateRankLevelWidth = (): void => {
		if (innerWidth < screenLg) {
			rankLevelWidth = 0
		} else if (innerWidth < screenXl) {
			rankLevelWidth = 4
		} else if (innerWidth < screen2xl) {
			rankLevelWidth = 8
		} else {
			rankLevelWidth = 16
		}
	}

	const updateResize = (): void => {
		if (scrollerEl === null) return
		scrollerHeight = scrollerEl.offsetHeight
		linesNumber = Math.ceil(scrollerHeight / lineHeight)
		updateRankLevelWidth()
		m.redraw()
	}

	const handlePanelClick = (panel: Panel): void => {
		currentPanel = panel
	}

	const handleSearchValueInput = (event: InputEvent): void => {
		const target = event.target as HTMLInputElement
		searchValue = target.value
		search()
	}

	const handleSearchValueKeyDown = (event: KeyboardEvent): void => {
		if (event.code === 'Enter') {
			const amount: number = event.shiftKey ? -1 : 1
			scrollSearch(searchIndex + amount)
		}
	}

	const handleSearchValueCreate = (vnode: VnodeDOM): void => {
		const inputEl = vnode.dom as HTMLInputElement
		inputEl.focus()
	}

	const handleSearchPanelRemove = (): void => {
		searchValue = ''
		search()
	}

	const handleWindowResize = (): void => {
		updateResize()
		scroll()
	}

	return {
		view: () => (
			<div class="h-full" oncreate={oncreate}>
				{store.taxa.length === 0 && (
					<div class="flex flex-col gap-4 justify-center items-center h-full">
						<img class="size-24 p-1 rounded-full bg-zinc-300" src={logoImage} />
						Đang tải...
					</div>
				)}

				{store.taxa.length > 0 && (
					<div class="flex h-full">
						<div class="flex">
							<div class="flex flex-col bg-zinc-950">
								<button class="flex justify-center items-center p-2 size-12 my-1">
									<img
										class="p-px rounded-full bg-zinc-300"
										src={logoImage}
										alt="Logo"
									/>
								</button>

								{panels.map((panel) => (
									<button
										key={panel.name}
										class={`
											flex justify-center items-center p-2 size-12
											${
												currentPanel.name === panel.name
													? 'text-white pointer-events-none'
													: 'text-zinc-500 hover:text-zinc-400'
											}
										`}
										onclick={() => handlePanelClick(panel)}
									>
										<span class="text-3xl material-symbols-rounded">
											{panel.icon}
										</span>
									</button>
								))}
							</div>

							<div class="flex-1 flex flex-col gap-2 w-[17rem] py-2 px-3">
								<div class="uppercase">{currentPanel.text}</div>

								<div class="flex-1 overflow-hidden">
									{currentPanel.name === 'ranks' && lines[1] && (
										<div class="flex flex-col h-full">
											<div>
												{getParents(lines[1])
													.toReversed()
													.map((parent) => (
														<div
															key={parent.index}
															class="flex items-center gap-2"
															onclick={() => scrollToTaxon(parent)}
														>
															<div
																class={`flex-1 truncate ${parent.rank.colorClass}`}
															>
																{parent.name}
															</div>
															{parent.textEn && (
																<div class="flex-1 truncate text-slate-400">
																	{parent.textEn}
																</div>
															)}
														</div>
													))}
											</div>

											<div class="flex-1 mt-2 pt-2 border-t border-zinc-700 overflow-auto scrollbar-none">
												{lines[1].parent?.children?.map((child) => (
													<div
														key={child.index}
														class="flex items-center gap-2"
														onclick={() => scrollToTaxon(child)}
													>
														<div
															class={`flex-1 truncate ${child.rank.colorClass}`}
														>
															{child.name}
														</div>
														{child.textEn && (
															<div class="flex-1 truncate text-slate-400">
																{child.textEn}
															</div>
														)}
													</div>
												))}
											</div>
										</div>
									)}

									{currentPanel.name === 'search' && (
										<div
											class="flex flex-col gap-2"
											onremove={handleSearchPanelRemove}
										>
											<div>
												<div class="text-zinc-400">Nhập tìm kiếm:</div>
												<input
													class="w-full px-2 border border-zinc-600 focus:border-blue-500 rounded bg-zinc-800"
													value={searchValue}
													oninput={handleSearchValueInput}
													onkeydown={handleSearchValueKeyDown}
													oncreate={handleSearchValueCreate}
												/>
												<div class="text-right">
													{searchIndex + 1}/{searchResult.length}
												</div>
											</div>
										</div>
									)}

									{currentPanel.name === 'stats' && 'Chưa làm'}

									{currentPanel.name === 'settings' && 'Chưa làm'}

									{currentPanel.name === 'about' && (
										<div class="[&>:nth-child(odd)]:text-zinc-400 [&>:nth-child(even)]:mb-2">
											<div>Tên:</div>
											<div>{pkg.displayName}</div>

											<div>Phiên bản:</div>
											<div>{pkg.version}</div>

											<div>Mô tả:</div>
											<div>{pkg.description}</div>

											<div>Tác giả:</div>
											<div>{pkg.author.name}</div>

											<div>GitHub:</div>
											<div>{pkg.repository.url}</div>
										</div>
									)}
								</div>
							</div>
						</div>

						<div
							class="flex-1 flex h-full overflow-auto"
							oncreate={handleScrollerCreate}
							onscroll={handleScrollerScroll}
						>
							<div
								class="w-full"
								style={{
									translate: `0 ${linesTop}px`
								}}
							>
								{lines.map((line) => (
									<div
										key={line.index}
										class={`relative flex items-center w-full h-6 ${
											line.index % 2 ? 'bg-zinc-800/20' : ''
										}`}
										style={{
											paddingLeft: `${line.rank.level * rankLevelWidth}px`
										}}
									>
										{getParents(line).map((parent) => (
											<div
												class="absolute h-full border-l border-zinc-700"
												style={{
													left: `${parent.rank.level * rankLevelWidth}px`
												}}
											/>
										))}
										<div class="flex items-center min-w-32 mr-2">
											<div class={line.rank.colorClass}>{line.name}</div>
											{line.extinct && (
												<div class="ml-1 text-rose-400">{'\u2020'}</div>
											)}
										</div>
										{line.textEn && (
											<div class="flex items-center text-slate-400">
												{line.textEn}
											</div>
										)}
										{line.textEn && line.textVi && (
											<div class="mx-2 text-stone-400">&middot;</div>
										)}
										{line.textVi && (
											<div class="flex items-center text-stone-400">
												{line.textVi}
											</div>
										)}
									</div>
								))}
							</div>

							<div class="invisible" style={{ height: `${scrollbarHeight}px` }} />
						</div>
					</div>
				)}
			</div>
		)
	}
}
