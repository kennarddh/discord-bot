import path from 'path'
import { Canvas, loadImage } from 'canvas'

import GetPublicDir from './GetPublicDir.js'

const GenerateFakemonImage = async (
	imageUrl: string
): Promise<Buffer | undefined> => {
	const image = await loadImage(imageUrl).catch(() => {})
	const background = await loadImage(
		path.join(GetPublicDir(), 'pokemon-background.png')
	).catch(() => {})

	if (!image) return
	if (!background) return

	const canvas = new Canvas(800, 450)

	const ctx = canvas.getContext('2d')

	ctx.drawImage(background, 0, 0, 800, 450)

	ctx.drawImage(image, 250, 0, 500, 500)

	return canvas.toBuffer()
}

export default GenerateFakemonImage
