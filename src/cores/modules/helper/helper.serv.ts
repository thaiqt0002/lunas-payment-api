import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'

import { AnyType } from '~/cores/interfaces'

@Injectable()
export class HelperServ {
  constructor(private readonly configService: ConfigService) {}

  public isObjectsUniqueValueKey(arr: object[], key: string): boolean {
    const values = arr.map((item) => item[key])
    return new Set(values).size === values.length
  }

  public slugify(str: string): string {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return str
      .toString()
      .toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/\s+/g, '-')
      .replace(p, (c) => b.charAt(a.indexOf(c)))
      .replace(/&/g, '-and-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  public filterObject(obj: object, keys: string[]): object {
    return keys.reduce((newObj: { [key: string]: AnyType }, key) => {
      let el: object = {}
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (obj[key]) {
        // eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment
        el = { [key]: obj[key] }
      }
      return { ...newObj, ...el }
    }, {})
  }

  public getURLImage(image: string): string {
    const url = this.configService.get<string>('IMAGE_BASE_URL') ?? ''
    if (!url) {
      throw new Error('IMAGE_BASE_URL not found in .env')
    }
    return `${url}/${image}`
  }

  public getUniqueListBy<Type extends object>(arr: Type[], key: keyof Type): Type[] {
    return [...new Map(arr.map((item) => [item[key], item])).values()]
  }

  public getUserNameRandomFromEmail(email: string): string | null {
    let [username] = email.split('@')
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    Array.from({ length: 5 }).forEach(() => {
      username += possible.charAt(Math.floor(Math.random() * possible.length))
    })
    return username ?? null
  }

  public generateUUID(): string {
    return uuidv4()
  }

  public generateOTP(): string {
    const min = 1000
    const step = 9000
    const otp = Math.floor(min + Math.random() * step).toString()
    return otp
  }

  public generateKey(length: number) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const { length: charactersLength } = characters
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result + String(new Date().getTime())
  }
}
