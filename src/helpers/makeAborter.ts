export function makeAborter(): AbortController {
	const aborter: AbortController = new AbortController()
	aborter.abort = aborter.abort.bind(aborter)

	return aborter
}
