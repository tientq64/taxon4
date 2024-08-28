import {
	ChangeEvent,
	KeyboardEvent,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'
import { AppContext } from '../App'
import { Taxon } from '../helpers/parse'
import { modulo } from '../utils/modulo'

export function SearchPanel(): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { taxa, scrollTo } = store

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
		if (searchValue.length < 2) {
			result = []
		} else {
			result = taxa.filter((taxon) => {
				return taxon.name.includes(searchValue)
			})
		}
		if (result.length === 0) {
			setSearchIndex(0)
		} else if (searchIndex >= result.length) {
			setSearchIndex(result.length - 1)
		}
		setSearchResult(result)
	}, [searchValue])

	useEffect(() => {
		if (searchResult.length === 0) return
		const taxon: Taxon = searchResult[searchIndex]
		scrollTo(taxon.index)
	}, [searchIndex, searchResult])

	return (
		<div className="flex flex-col gap-2">
			<div>
				<div className="text-zinc-400">Nhập tìm kiếm:</div>
				<input
					ref={inputRef}
					className="w-full h-7 px-2 border border-zinc-600 focus:border-blue-500 rounded bg-zinc-800"
					autoFocus
					value={searchValue}
					onChange={handleSearchValueChange}
					onKeyDown={handleSearchValueKeyDown}
				/>
				<div className="text-right">
					{searchResult.length > 0 ? searchIndex + 1 : 0}/{searchResult.length}
				</div>
			</div>
		</div>
	)
}
