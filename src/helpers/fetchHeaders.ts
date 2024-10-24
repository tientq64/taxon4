import pkg from '../../package.json'

const appName: string = pkg.name
const appVersion: string = pkg.version
const authorEmail: string = pkg.author.email

/**
 * Header được gửi kèm khi fetch dữ liệu từ API Wikipedia, giúp quản trị viên có thể liên hệ khi cần thiết.
 * @see https://en.wikipedia.org/api/rest_v1/
 */
export const fetchHeaders: Headers = new Headers({
	'Api-User-Agent': `${appName}/${appVersion} (${authorEmail})`
})
