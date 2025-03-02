export interface FontFace2 {
	family: string
	fallbackFamilies: string
}

export const fontFaces: FontFace2[] = [
	{
		family: 'Arial',
		fallbackFamilies: 'sans-serif'
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
		family: 'Segoe UI',
		fallbackFamilies: 'Arial, sans-serif'
	},
	{
		family: 'Georgia',
		fallbackFamilies: 'serif'
	},
	{
		family: 'NK57 Monospace',
		fallbackFamilies: 'Cascadia Mono, Consolas, monospace'
	}
]

export function getFontFace(family: string): FontFace2 | undefined {
	return fontFaces.find((fontFace) => fontFace.family === family)
}
