export interface FontFace2 {
	family: string
	fallbackFamilies: string
}

export const fontFaces: FontFace2[] = [
	{
		family: 'Arial',
		fallbackFamilies: 'Segoe UI, sans-serif'
	},
	{
		family: 'Archivo',
		fallbackFamilies: 'IBM Plex Sans, Arial, sans-serif'
	},
	{
		family: 'Segoe UI',
		fallbackFamilies: 'IBM Plex Sans, Arial, sans-serif'
	},
	{
		family: 'Droid Sans',
		fallbackFamilies: 'Arial, sans-serif'
	},
	{
		family: 'IBM Plex Sans',
		fallbackFamilies: 'Segoe UI, Arial, sans-serif'
	},
	{
		family: 'Clear Sans',
		fallbackFamilies: 'Segoe UI, IBM Plex Sans, Arial, sans-serif'
	},
	{
		family: 'Tahoma',
		fallbackFamilies: 'Arial, sans-serif'
	},
	{
		family: 'Roboto',
		fallbackFamilies: 'Arial, sans-serif'
	},
	{
		family: 'Georgia',
		fallbackFamilies: 'serif'
	},
	{
		family: 'PT Mono',
		fallbackFamilies: 'Liberation Mono, monospace'
	}
]

export function getFontFace(family: string): FontFace2 | undefined {
	return fontFaces.find((fontFace) => fontFace.family === family)
}
