import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { En, Language, languages, Vi } from '../constants/languages'
import { app, useApp } from '../store/app'
import { Tooltip } from './Tooltip'

export function LanguageFloatingButton(): ReactNode {
	const { languageCode, minimapVisible } = useApp()

	const language = useMemo<Language | undefined>(() => {
		return languages.find((lang) => lang.code === languageCode)
	}, [languageCode])

	const handleLanguageClick = (lang: Language): void => {
		app.languageCode = lang.code
	}

	const handleSwitchLanguage = (): void => {
		app.languageCode = languageCode === En ? Vi : En
	}

	if (language === undefined) return null

	return (
		<div
			className={clsx(
				'group absolute bottom-0 z-30 flex flex-col gap-2 p-3',
				minimapVisible ? 'right-44' : 'right-4'
			)}
		>
			<div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100">
				{languages.map((lang) => (
					<button
						key={lang.code}
						className={clsx(
							'flex size-7 cursor-pointer items-center justify-center rounded',
							lang.colorClass
						)}
						type="button"
						onClick={() => handleLanguageClick(lang)}
					>
						{lang.code}
					</button>
				))}
			</div>

			<Tooltip
				placement="left"
				beforeContent={`Nhấn để đổi sang tiếng ${languageCode === En ? 'Việt' : 'Anh'}`}
			>
				<button
					className={clsx(
						'flex size-7 cursor-pointer items-center justify-center rounded',
						language.colorClass
					)}
					type="button"
					onClick={handleSwitchLanguage}
				>
					{languageCode}
				</button>
			</Tooltip>
		</div>
	)
}
