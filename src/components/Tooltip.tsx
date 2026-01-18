import { Placement } from '@floating-ui/react'
import { useRequest } from 'ahooks'
import clsx from 'clsx'
import { t } from 'i18next'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { getWikipediaSummary } from '../api/getWikipediaSummary'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/app'
import { Icon } from './Icon'
import { Popper } from './Popper'

interface TooltipProps {
	placement?: Placement
	distance?: number
	onOpen?: () => void
	onClose?: () => void
	beforeContent?: ReactNode | (() => ReactNode)
	wikipediaFetchQuery?: Taxon | string
	wikipediaFetchLanguage?: string
	afterContent?: ReactNode | (() => ReactNode)
	children: ReactElement
}

export function Tooltip({
	placement,
	distance = 8,
	onOpen,
	onClose,
	beforeContent,
	wikipediaFetchQuery,
	wikipediaFetchLanguage,
	afterContent,
	children
}: TooltipProps): ReactNode {
	const { languageCode } = useApp()
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const { loading, data, run, cancel } = useRequest(getWikipediaSummary, { manual: true })

	useEffect(() => {
		if (isOpen) onOpen?.()
		else onClose?.()
		if (!isOpen || wikipediaFetchQuery === undefined) return
		run(wikipediaFetchQuery, wikipediaFetchLanguage ?? languageCode)
		return cancel
	}, [isOpen, languageCode, wikipediaFetchQuery, wikipediaFetchLanguage])

	return (
		<Popper
			popperClassName="pointer-events-none z-40"
			placement={placement}
			distance={distance}
			padding={2}
			hoverDelay={20}
			arrowClassName="fill-[#2f2f35]"
			arrowRightClassName="fill-[#393941]"
			onOpenChange={setIsOpen}
			content={() => (
				<div className="relative rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 px-3 py-2 shadow-lg shadow-zinc-950/80">
					<div
						className={clsx(
							wikipediaFetchQuery !== undefined && 'w-80',
							'flex flex-col divide-y divide-zinc-500 text-center leading-[1.325]'
						)}
					>
						{typeof beforeContent === 'function' ? beforeContent() : beforeContent}

						{wikipediaFetchQuery !== undefined && (
							<div className="py-1">
								{loading && (
									<div className="clear-start py-1">
										<div className="mt-px mb-2 h-3.25 rounded bg-zinc-500" />
										<div className="mb-2 h-3.25 rounded bg-zinc-500" />
										<div className="h-3.25 w-4/7 rounded rounded-bl-md bg-zinc-500" />
									</div>
								)}
								{!loading && data == null && (
									<div className="clear-start flex flex-col gap-0.75 py-2 text-center text-zinc-400">
										<Icon name="inbox" />
										{t('taxonPopup.noDataFound')}
									</div>
								)}
								{!loading && data != null && (
									<div
										className="text-justify"
										dangerouslySetInnerHTML={{
											__html: data
										}}
									/>
								)}
							</div>
						)}

						{typeof afterContent === 'function' ? afterContent() : afterContent}
					</div>
				</div>
			)}
		>
			{children}
		</Popper>
	)
}
