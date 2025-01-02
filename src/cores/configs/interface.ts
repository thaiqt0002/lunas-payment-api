/* eslint-disable @typescript-eslint/no-unused-vars */
import config from './index'

const data = config()
export type TConfig = Record<keyof typeof data, string>
