import { useDebounceEffect, useEventListener } from 'ahooks'
import { ChangeEvent, KeyboardEvent, ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Taxon } from '../helpers/parse'
import { searchTaxon } from '../helpers/searchTaxon'
import { shouldIgnoreKeyDown } from '../helpers/shouldIgnoreKeyDown'
import { app, useApp } from '../store/app'
import { modulo } from '../utils/modulo'
import { ref } from '../utils/ref'

interface SearchContentProps {
	isPopup?: boolean
}

export function SearchContent({ isPopup = false }: SearchContentProps): ReactNode {
	const { filteredTaxa, scrollToTaxon, searchValue, searchResult, searchIndex } = useApp()

	const inputRef = useRef<HTMLInputElement>(null)
	const { t } = useTranslation()

	const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
		app.searchValue = event.target.value
	}

	const handleSearchValueKeyDown = (event: KeyboardEvent): void => {
		switch (event.code) {
			case 'Enter':
			case 'F3':
				event.preventDefault()
				if (searchResult.length > 0) {
					const amount: number = event.shiftKey ? -1 : 1
					const newSearchIndex: number = modulo(searchIndex + amount, searchResult.length)
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

	useDebounceEffect(
		() => {
			let result: Taxon[] = []
			if (searchValue.length >= 2) {
				result = searchTaxon(filteredTaxa as Taxon[], searchValue)
				const newSearchIndex: number = result.length === 0 ? 0 : result.length - 1
				app.searchIndex = newSearchIndex
			}
			app.searchResult = ref(result)
		},
		[searchValue, filteredTaxa],
		{ wait: 200 }
	)

	useEffect(() => {
		if (searchResult.length === 0) return
		if (scrollToTaxon === undefined) return
		const selectedTaxon = searchResult[searchIndex] as Taxon
		scrollToTaxon(selectedTaxon)
	}, [searchResult, searchIndex, scrollToTaxon])

	useEffect(() => {
		if (!isPopup) return
		inputRef.current?.focus()
	}, [isPopup])

	useEventListener('keydown', (event: globalThis.KeyboardEvent) => {
		if (shouldIgnoreKeyDown(event)) return
		const code: string = event.code
		switch (code) {
			case 'KeyF':
			case 'F3':
				event.preventDefault()
				if (isPopup) {
					inputRef.current?.focus()
				}
				break
		}
	})

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
			<div className="text-right">
				{searchResult.length > 0 ? searchIndex + 1 : 0}/{searchResult.length}
			</div>
		</div>
	)
}
