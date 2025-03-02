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
				if (searchResult.length > 0) {
					const amount: number = event.shiftKey ? -1 : 1
					setSearchIndex(modulo(searchIndex + amount, searchResult.length))
				}
				break

			case 'Escape':
				inputRef.current?.blur()
				break
		}
	}

	useEffect(() => {
		let result: Taxon[] = []
		if (searchValue.length >= 2) {
			result = filteredTaxa.filter((taxon) => {
				return taxon.name.includes(searchValue)
			})
		}
		if (result.length === 0) {
			setSearchIndex(0)
		} else if (searchIndex >= result.length) {
			setSearchIndex(result.length - 1)
		}
		setSearchResult(result)
	}, [searchValue, filteredTaxa, searchIndex])

	useEffect(() => {
		if (searchResult.length === 0) return
		const taxon: Taxon = searchResult[searchIndex]
		scrollTo(taxon)
	}, [scrollTo, searchIndex, searchResult])

	useEffect(() => {
		if (!isPopup) return
		inputRef.current?.focus()
	}, [isPopup])

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
