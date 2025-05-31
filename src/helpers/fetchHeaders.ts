import { author, name, version } from '../../package.json'

/**
 * Header được gửi kèm khi fetch dữ liệu từ Wikipedia API, giúp quản trị viên có thể liên
 * hệ khi cần thiết.
 *
 * @see https://en.wikipedia.org/api/rest_v1/
 */
export const fetchHeaders: Headers = new Headers({
	'Api-User-Agent': `${name}/${version} (${author.email})`
})
