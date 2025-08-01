import { exec } from 'child_process'
import cors from 'cors'
import express, { Express, Request } from 'express'
import fetch from 'node-fetch'
import { base64ToText } from '../web-extension/utils/base64ToText'

export const app: Express = express()

app.use(cors())

app.get(
	'/download/:encodedUrl',
	async (req: Request<{ encodedUrl: string }>, res): Promise<void> => {
		const url: string = base64ToText(req.params.encodedUrl)
		try {
			const response = await fetch(url)
			if (!response.ok) {
				res.status(response.status).send(response.statusText)
				return
			}
			response.body?.pipe(res)
		} catch (error) {
			res.status(500).send(error)
		}
	}
)

app.get('/open/:encodedVscodeFilePath', (req: Request<{ encodedVscodeFilePath: string }>, res) => {
	const vscodeFilePath: string = base64ToText(req.params.encodedVscodeFilePath)
	exec(`code --goto ${vscodeFilePath}`)
	res.sendStatus(200)
})
