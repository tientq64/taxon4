import { ReactNode } from 'react'
import logoImage from '/assets/images/logo.png'

export function SplashScreen(): ReactNode {
	return (
		<div className="flex flex-col gap-4 justify-center items-center h-full">
			<img className="size-24 p-1 rounded-full bg-zinc-300" src={logoImage} />
			Đang tải...
		</div>
	)
}
