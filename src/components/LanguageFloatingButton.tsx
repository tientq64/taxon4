import clsx from 'clsx'
import { find } from 'lodash-es'
import { memo, ReactNode, useContext, useMemo } from 'react'
import { AppContext } from '../App'
import { Language, popupLanguages } from '../models/popupLanguages'
import { Tooltip } from './Tooltip'

export const LanguageFloatingButton = memo(function (): ReactNode {
	const { popupLanguageCode, setPopupLanguageCode } = useContext(AppContext)!

	const popupLanguage = useMemo<Language>(() => {
		return find(popupLanguages, { code: popupLanguageCode })!
	}, [popupLanguageCode])
	if (popupLanguage === undefined) return

	const switchLanguage = (): void => {
		setPopupLanguageCode(popupLanguageCode === 'en' ? 'vi' : 'en')
	}

	return (
		<Tooltip
			placement="top"
			content={`Nhấn để đổi sang tiếng ${popupLanguageCode === 'en' ? 'Việt' : 'Anh'}`}
		>
			<button
				className={clsx(
					'flex justify-center items-center absolute right-7 bottom-3 size-7 rounded',
					popupLanguage.colorClass
				)}
				onClick={switchLanguage}
			>
				{popupLanguageCode}
			</button>
		</Tooltip>
	)
})
