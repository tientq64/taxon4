type GMValue = string | number | boolean | Record<string, GMValue> | GMValue[]

declare function GM_getResourceText(
	resourceName: string,
	responseType: XMLHttpRequestResponseType = 'text'
): string

declare function GM_addStyle(css: string): void
declare function GM_getValue(name: string, defaultValue: GMValue): GMValue | undefined
declare function GM_setValue(name: string, value: GMValue): void
declare function GM_deleteValue(name: string): void

type GMOpenInTabOptions = {
	active?: boolean
	insert?: number | boolean
	setParent?: boolean
	incognito?: boolean
	loadInBackground?: boolean
}

type GMOpenedWindow = {
	readonly closed: boolean
	name?: string
	onclose: (() => void) | null
	focus(): void
	close(): void
}

declare function GM_openInTab(url: string, loadInBackground?: boolean): GMOpenedWindow
declare function GM_openInTab(url: string, options?: GMOpenInTabOptions): GMOpenedWindow
