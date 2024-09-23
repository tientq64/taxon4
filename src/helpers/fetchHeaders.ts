import pkg from '../../package.json'

const name: string = pkg.name
const version: string = pkg.version
const email: string = pkg.author.email

export const fetchHeaders: Headers = new Headers({
	'Api-User-Agent': `${name}/${version} (${email})`
})
