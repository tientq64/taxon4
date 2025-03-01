interface UploadToImgurResult {
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

export async function uploadToImgur(imageUrl: string): Promise<string> {
	const headers: Headers = new Headers()
	headers.append('Authorization', 'Client-ID 92ac14aabe20918')

	const body: FormData = new FormData()
	body.append('image', imageUrl)
	body.append('type', 'url')
	body.append('description', imageUrl)

	const res: Response = await fetch(imgurUploadImageApiUrl, {
		method: 'POST',
		headers,
		body
	})
	const result: UploadToImgurResult = await res.json()

	return result.data.id
}
