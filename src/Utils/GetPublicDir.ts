import { fileURLToPath } from 'url'
import path from 'path'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const GetPublicDir = ():string=>{
    return path.resolve(__dirname, '../../public/')
}

export default GetPublicDir