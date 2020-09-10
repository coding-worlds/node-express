import { read } from './index'
import { STORE_KEY_USERNAME, STORE_KEY_TOKEN, STORE_KEY_REALNAME, STORE_KEY_ID} from './constants'
export const username = read(STORE_KEY_USERNAME) || ''
export const realname = read(STORE_KEY_REALNAME) || ''
export const userId = read(STORE_KEY_ID) || ''
// eslint-disable-next-line camelcase
export const token = read(STORE_KEY_TOKEN) || '' // eslint-disable-line
