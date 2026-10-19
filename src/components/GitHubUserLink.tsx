import { Placement } from '@floating-ui/react'
import { author } from '../../package.json'
import { Link } from './Link'
import { Tooltip } from './Tooltip'

export interface GitHubUserLinkProps {
	username?: string
	email?: string
	placement?: Placement
}

export function GitHubUserLink({
	username = author.name,
	email = author.email,
	placement
}: GitHubUserLinkProps) {
	const tooltipContent = (
		<div className="grid grid-cols-[repeat(2,min-content)] gap-x-3 p-1 text-left text-nowrap *:odd:text-zinc-400">
			<div>GitHub</div>
			<div>{username}</div>

			<div>Email</div>
			<div>{email}</div>
		</div>
	)

	return (
		<Tooltip placement={placement} beforeContent={tooltipContent}>
			<Link href={author.url}>{username}</Link>
		</Tooltip>
	)
}
