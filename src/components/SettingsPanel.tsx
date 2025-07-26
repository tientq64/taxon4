import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { fontFaces } from '../constants/fontFaces'
import { LanguageCode, languages } from '../constants/languages'
import { Ranks } from '../constants/ranks'
import { checkIsDevEnv } from '../helpers/checkIsDevEnv'
import { useLoadCss } from '../hooks/useLoadCss'
import { app, useApp } from '../store/useAppStore'
import { Descriptions } from './Descriptions'
import { Select, SelectItem, SelectItemType } from './Select'
import { Switch } from './Switch'

/** Mục cài đặt. */
export function SettingsPanel(): ReactNode {
	const {
		languageCode,
		popupLanguageCode,
		maxRankLevelShown,
		fontFaceFamily,
		striped,
		indentGuideVisible,
		minimapVisible,
		developerModeEnabled
	} = useApp()

	const { t } = useTranslation()

	const handleLanguageCodeChange = (languageCode: LanguageCode): void => {
		app.languageCode = languageCode
	}

	const handlePopupLanguageCodeChange = (languageCode: LanguageCode): void => {
		app.popupLanguageCode = languageCode
	}

	const handleFontFaceFamilyChange = (fontFaceFamily: string): void => {
		app.fontFaceFamily = fontFaceFamily
	}

	const handleMaxRankLevelShownChange = (maxRankLevelShown: number): void => {
		app.maxRankLevelShown = maxRankLevelShown
	}

	fontFaces.forEach((fontFace) => {
		useLoadCss(
			`https://fonts.googleapis.com/css2?family=${fontFace.family}:wght@400;700&display=swap&text=${fontFace.family}`
		)
	})

	return (
		<Descriptions className="px-3">
			<div>{t('settings.language')}:</div>
			<Select
				fill
				value={languageCode}
				onChange={handleLanguageCodeChange}
				items={languages.map((language) => ({
					label: t(`languages.${language.code}`, { lng: language.code }),
					value: language.code,
					icon: language.icon
				}))}
			/>

			<div>{t('settings.popupLanguage')}:</div>
			<Select
				fill
				value={popupLanguageCode}
				onChange={handlePopupLanguageCodeChange}
				items={languages.map((language) => ({
					label: t(`languages.${language.code}`),
					value: language.code,
					icon: language.icon
				}))}
			/>

			<div>{t('settings.fontFaceFamily')}:</div>
			<Select
				fill
				value={fontFaceFamily}
				onChange={handleFontFaceFamilyChange}
				items={fontFaces
					.map<SelectItem>((fontFace) => ({
						label: fontFace.family,
						value: fontFace.family,
						style: {
							fontFamily: `${fontFace.family}, ${fontFace.fallbackFamilies}`,
							fontSize: fontFace.size
						}
					}))
					.toSpliced(9, 0, {
						type: SelectItemType.Divider
					})
					.toSpliced(12, 0, {
						type: SelectItemType.Divider
					})}
			/>

			<div>{t('settings.maxRankLevelShown')}:</div>
			<Select
				fill
				value={maxRankLevelShown}
				onChange={handleMaxRankLevelShownChange}
				items={Ranks.map((rank) => ({
					label: (
						<div className="flex justify-between text-zinc-400">
							<span className={rank.colorClass}>{rank.textEn}</span>
							{rank.textVi}
						</div>
					),
					value: rank.level
				})).concat()}
			/>

			<div className="!mt-4">
				<Switch
					fill
					checked={striped}
					onChange={(checked) => (app.striped = checked)}
					label={t('settings.striped')}
				/>
				<Switch
					fill
					checked={indentGuideVisible}
					onChange={(checked) => (app.indentGuideVisible = checked)}
					label={t('settings.indentGuideVisible')}
				/>
				<Switch
					fill
					checked={minimapVisible}
					onChange={(checked) => (app.minimapVisible = checked)}
					label={t('settings.minimapVisible')}
					subLabel={t('others.experiment')}
				/>
				<Switch
					fill
					disabled={!checkIsDevEnv()}
					checked={developerModeEnabled}
					onChange={(checked) => (app.developerModeEnabled = checked)}
					label={t('settings.developerModeEnabled')}
				/>
			</div>
		</Descriptions>
	)
}
