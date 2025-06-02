interface ImgurUploadResult {
	status: number
	success: boolean
	data: {
		deletehash: string
		description: string
		height: number
		id: string
		link: string
		size: number
		title: string
		type: string
		width: number
	}
}

const imgurUploadImageApiUrl: string = 'https://api.imgur.com/3/image'

export async function uploadToImgur(data: string | File): Promise<string> {
	const headers: Headers = new Headers()
	headers.append('Authorization', 'Client-ID 92ac14aabe20918')

	const body: FormData = new FormData()
	body.append('image', data)

	const type: string = data instanceof File ? 'file' : 'url'
	body.append('type', type)

	const res: Response = await fetch(imgurUploadImageApiUrl, {
		method: 'POST',
		headers,
		body
	})
	const result: ImgurUploadResult = await res.json()

	return result.data.id
}
