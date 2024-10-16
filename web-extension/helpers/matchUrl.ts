export function matchUrl(regexV2Text: string): boolean {
	const regexSource: string = regexV2Text.replace(/\./g, '\\.').replace(/(?<!\\)\^/g, '.')
	const regex: RegExp = RegExp(`^${regexSource}$`)
	return regex.test(location.href)
}
