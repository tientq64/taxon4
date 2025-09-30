import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Descriptions } from './Descriptions'

/** Mục hướng dẫn. */
export function HelpPanel(): ReactNode {
	const { t } = useTranslation()

	return (
		<div className="scrollbar-none h-full overflow-auto px-3">
			<Descriptions>
				<dt>{t('help.switchLanguage')}:</dt>
				<dd>
					<kbd>D</kbd>
				</dd>

				<dt>{t('help.openSearchPopup')}:</dt>
				<dd>
					<kbd>F</kbd>
				</dd>

				<dt>{t('help.escape')}:</dt>
				<dd>
					<kbd>Esc</kbd>
				</dd>

				<dt>{t('help.fastScroll')}:</dt>
				<dd>
					<kbd>Alt</kbd> + <kbd>{t('help.mouseScroll')}</kbd>
				</dd>
			</Descriptions>
		</div>
	)
}
