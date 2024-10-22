import pkg from '../../package.json'

const name: string = pkg.name
const version: string = pkg.version
const email: string = pkg.author.email

/**
 * Header được gửi kèm khi fetch dữ liệu từ API Wikipedia, giúp họ có thể liên hệ với người dùng một cách nhanh nhất.
 * @see https://en.wikipedia.org/api/rest_v1/
 */
export const fetchHeaders: Headers = new Headers({
	'Api-User-Agent': `${name}/${version} (${email})`
})
