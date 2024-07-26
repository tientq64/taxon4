export function testUrlPattern(input: string): boolean {
	const pattern = new URLPattern(input)
	return pattern.test(location.href)
}
