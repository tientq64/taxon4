import { useDebounceEffect, useEventListener } from 'ahooks'
import {
	ChangeEvent,
	KeyboardEvent,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'
import { ScrollToContext } from '../App'
import { Taxon } from '../helpers/parse'
import { searchTaxon } from '../helpers/searchTaxon'
import { shouldIgnoreKeyDown } from '../helpers/shouldIgnoreKeyDown'
import { useAppStore } from '../store/useAppStore'
import { modulo } from '../utils/modulo'

interface SearchContentProps {
	isPopup?: boolean
}

export function SearchContent({ isPopup = false }: SearchContentProps): ReactNode {
	const filteredTaxa = useAppStore((state) => state.filteredTaxa)

	const scrollTo = useContext(ScrollToContext)!

	const [searchValue, setSearchValue] = useState<string>('')
	const [searchResult, setSearchResult] = useState<Taxon[]>([])
	const [searchIndex, setSearchIndex] = useState<number>(0)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setSearchValue(event.target.value)
	}

	const handleSearchValueKeyDown = (event: KeyboardEvent): void => {
		switch (event.code) {
			case 'Enter':
			case 'F3':
				event.preventDefault()
				if (searchResult.length > 0) {
					const amount: number = event.shiftKey ? -1 : 1
					const newSearchIndex: number = modulo(searchIndex + amount, searchResult.length)
					setSearchIndex(newSearchIndex)
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
				result = searchTaxon(filteredTaxa, searchValue)
				const newSearchIndex: number = result.length === 0 ? 0 : result.length - 1
				setSearchIndex(newSearchIndex)
			}
			setSearchResult(result)
		},
		[searchValue, filteredTaxa],
		{ wait: 200 }
	)

	useEffect(() => {
		if (searchResult.length === 0) return
		const selectedTaxon: Taxon = searchResult[searchIndex]
		scrollTo(selectedTaxon)
	}, [scrollTo, searchIndex, searchResult])

	useEffect(() => {
		if (!isPopup) return
		inputRef.current?.focus()
	}, [isPopup])

	useEventListener('keydown', (event: globalThis.KeyboardEvent): void => {
		if (shouldIgnoreKeyDown(event)) return

		const code: string = event.code
		switch (code) {
			case 'KeyF':
			case 'F3':
				event.preventDefault()
				inputRef.current?.focus()
				break
		}
	})

	return (
		<div>
			<div className="text-zinc-400">Nhập tìm kiếm:</div>
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
