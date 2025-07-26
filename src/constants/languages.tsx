import { CN, ES, JP, US, VN } from 'country-flag-icons/react/1x1'
import { ReactElement } from 'react'

export enum LanguageCode {
	En = 'en',
	Vi = 'vi',
	Zh = 'zh',
	Ja = 'ja',
	Es = 'es'
}

export interface Language {
	code: LanguageCode
	colorClass: string
	icon: ReactElement
}

export const languages: Language[] = [
	{
		code: LanguageCode.En,
		colorClass: 'bg-blue-400 text-blue-950',
		icon: <US className="rounded" />
	},
	{
		code: LanguageCode.Vi,
		colorClass: 'bg-pink-400 text-pink-950',
		icon: <VN className="rounded" />
	},
	{
		code: LanguageCode.Zh,
		colorClass: 'bg-rose-400 text-rose-950',
		icon: <CN className="rounded" />
	},
	{
		code: LanguageCode.Ja,
		colorClass: 'bg-violet-400 text-violet-950',
		icon: <JP className="rounded" />
	},
	{
		code: LanguageCode.Es,
		colorClass: 'bg-orange-400 text-orange-950',
		icon: <ES className="rounded" />
	}
]

export const defaultLanguage: Language = languages[0]

export function findLanguage(code: LanguageCode): Language
export function findLanguage(code: string): Language | undefined

export function findLanguage(code: string): Language | undefined {
	return languages.find((language) => language.code === code)
}
