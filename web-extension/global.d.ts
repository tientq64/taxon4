type GMValue = string | number | boolean | Record<string, GMValue> | GMValue[]

declare function GM_getResourceText(
	resourceName: string,
	responseType: XMLHttpRequestResponseType = 'text'
): string

declare function GM_addStyle(css: string): void
declare function GM_getValue(name: string, defaultValue: GMValue): GMValue | undefined
declare function GM_setValue(name: string, value: GMValue): void
declare function GM_deleteValue(name: string): void
