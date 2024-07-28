export function testUrlPattern(input: string): boolean {
	const pattern: URLPattern = new URLPattern(input)
	return pattern.test(location.href)
}
