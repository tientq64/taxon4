export function matchUrl(regexV2Text: string): boolean {
	const regexSource: string = regexV2Text.replace(/\./g, '\\.').replace(/(?<!\\)_/g, '.')
	const regex: RegExp = RegExp(`^${regexSource}$`)
	return regex.test(location.href)
}
