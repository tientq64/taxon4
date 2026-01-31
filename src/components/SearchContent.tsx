import { useDebounceEffect, useEventListener } from 'ahooks'
import { ChangeEvent, KeyboardEvent, ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PanelName } from '../constants/panels'
import { Taxon } from '../helpers/parse'
import { searchTaxa } from '../helpers/searchTaxa'
import { shouldIgnoreKeyDown } from '../helpers/shouldIgnoreKeyDown'
import { app, useApp } from '../store/app'
import { modulo } from '../utils/modulo'
import { ref } from '../utils/ref'
import { SearchFilters } from './SearchFilters'

interface SearchContentProps {
	isPopup?: boolean
}

export function SearchContent({ isPopup = false }: SearchContentProps): ReactNode {
	const {
		filteredTaxa,
		scrollToTaxon,
		searchValue,
		searchResult,
		searchIndex,
		isSearchCaseSensitive,
		searchModeName,
		searchTargetName,
		activePanelName
	} = useApp(true)

	const inputRef = useRef<HTMLInputElement>(null)
	const { t } = useTranslation()

	const isSearchPanelVisible: boolean = activePanelName === PanelName.Search
	const shouldSkipSearchLogic: boolean = isSearchPanelVisible && isPopup

	const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
		app.searchValue = event.target.value
	}

	const handleSearchValueKeyDown = (event: KeyboardEvent): void => {
		switch (event.code) {
			case 'Enter':
			case 'F3':
				event.preventDefault()
				if (searchResult.length > 0) {
					const offset: number = event.shiftKey ? -1 : 1
					const newSearchIndex: number = modulo(searchIndex + offset, searchResult.length)
					app.searchIndex = newSearchIndex
				}
				break

			case 'KeyF':
				if (event.ctrlKey) {
					event.preventDefault()
				}
				break

			case 'Escape':
				inputRef.current?.blur()
				break
		}
	}

	// Thực hiện tìm kiếm. Chỉ chạy khi người dùng ngừng nhập sau 200 ms, giúp cải thiện hiệu suất.
	useDebounceEffect(
		() => {
			if (shouldSkipSearchLogic) return
			let result: Taxon[] = []
			if (searchValue.length >= 2) {
				result = searchTaxa(filteredTaxa as Taxon[], searchValue)
				const newSearchIndex: number = result.length === 0 ? 0 : result.length - 1
				app.searchIndex = newSearchIndex
			}
			app.searchResult = ref(result)
		},
		[
			searchValue,
			filteredTaxa,
			isSearchCaseSensitive,
			searchModeName,
			searchTargetName,
			shouldSkipSearchLogic
		],
		{ wait: 200 }
	)

	// Cuộn đến taxon xác định khi kết quả tìm kiếm hoặc vị trí thay đổi.
	useEffect(() => {
		if (searchResult.length === 0) return
		if (scrollToTaxon === undefined) return
		const selectedTaxon = searchResult[searchIndex] as Taxon
		scrollToTaxon(selectedTaxon)
	}, [searchResult, searchIndex, scrollToTaxon])

	// Tập trung lại vào ô nhập khi nhấn phím tắt tìm kiếm. Chỉ hoạt động với cửa sổ tìm kiếm, không phải thanh bên.
	useEventListener(
		'keydown',
		(event: globalThis.KeyboardEvent) => {
			if (shouldIgnoreKeyDown(event)) return
			switch (event.code) {
				case 'KeyF':
				case 'F3':
					inputRef.current?.focus()
					break
			}
		},
		{ enable: isPopup }
	)

	return (
		<div>
			<div className="text-zinc-400">{t('search.enterSearch')}:</div>
			<input
				ref={inputRef}
				className="h-7 w-full rounded border border-zinc-600 bg-zinc-800 px-2 focus:border-blue-500"
				autoFocus
				value={searchValue}
				onChange={handleSearchValueChange}
				onKeyDown={handleSearchValueKeyDown}
			/>
			<div className="text-right text-sm">
				{searchResult.length > 0 ? searchIndex + 1 : 0}/{searchResult.length}
			</div>

			<hr className="mt-1 mb-2 border-zinc-700" />
			<SearchFilters />
		</div>
	)
}
