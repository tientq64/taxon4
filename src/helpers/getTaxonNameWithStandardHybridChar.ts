export function getTaxonNameWithStandardHybridChar(taxonName: string): string {
	return taxonName.replace(/^x /, '\xd7 ')
}
