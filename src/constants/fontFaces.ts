export interface FontFace2 {
	family: string
	fallbackFamilies: string
	size: number
	isDefault?: boolean
}

export const fontFaces: FontFace2[] = [
	{
		family: 'Arial',
		fallbackFamilies: 'Segoe UI, sans-serif',
		size: 16
	},
	{
		family: 'Archivo',
		fallbackFamilies: 'IBM Plex Sans, Arial, sans-serif',
		size: 16,
		isDefault: true
	},
	{
		family: 'Segoe UI',
		fallbackFamilies: 'IBM Plex Sans, Arial, sans-serif',
		size: 16
	},
	{
		family: 'IBM Plex Sans',
		fallbackFamilies: 'Segoe UI, Arial, sans-serif',
		size: 16
	},
	{
		family: 'Livvic',
		fallbackFamilies: 'Segoe UI, Arial, sans-serif',
		size: 16
	},
	{
		family: 'Clear Sans',
		fallbackFamilies: 'Segoe UI, IBM Plex Sans, Arial, sans-serif',
		size: 16
	},
	{
		family: 'Droid Sans',
		fallbackFamilies: 'Arial, sans-serif',
		size: 16
	},
	{
		family: 'Tahoma',
		fallbackFamilies: 'Arial, sans-serif',
		size: 16
	},
	{
		family: 'Roboto',
		fallbackFamilies: 'Arial, sans-serif',
		size: 16
	},
	{
		family: 'Georgia',
		fallbackFamilies: 'Cambria, serif',
		size: 16
	},
	{
		family: 'Merriweather',
		fallbackFamilies: 'serif',
		size: 15
	},
	{
		family: 'PT Mono',
		fallbackFamilies: 'Liberation Mono, monospace',
		size: 15
	}
]

export const defaultFontFace: FontFace2 = fontFaces.find((fontFace) => fontFace.isDefault)!

export function getFontFace(family: string): FontFace2 | undefined {
	return fontFaces.find((fontFace) => fontFace.family === family)
}
