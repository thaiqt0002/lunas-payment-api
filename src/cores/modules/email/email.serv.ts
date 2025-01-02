import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import React from 'react'
import { Resend } from 'resend'

import { OtpEmail } from './components/verify-email'

abstract class IEmailService {
  public abstract sendEmail(to: string[], subject: string, text: string): Promise<void>
  public abstract templateEmailVerify(to: string[], token: string): Promise<void>
}

@Injectable()
class EmailServ implements IEmailService {
  readonly #resend = new Resend(this.configSerivce.get<string>('RESEND_API_KEY'))
  readonly #resendEmail = this.configSerivce.get<string>('RESEND_SENDER')
  constructor(private readonly configSerivce: ConfigService) {}

  public async sendEmail(to: string[], subject: string, text?: string, react?: React.ReactNode) {
    if (!this.#resendEmail) {
      throw new Error('RESEND_SENDER is not defined')
    }
    await this.#resend.emails.send({
      from: this.#resendEmail,
      to,
      subject,
      text,
      react,
    })
  }

  public async templateEmailVerify(to: string[], token: string) {
    const baseUrl = this.configSerivce.get<string>('WEB_BASE_URL')
    if (!baseUrl) {
      throw new Error('WEB_BASE_URL is not defined')
    }
    const url = `${baseUrl}/verify?token=${token}`
    const subject = 'Verify Email'
    const text = `Click this link to verify your email: ${url}`
    await this.sendEmail(to, subject, text)
  }

  public async templateEmailOtp(to: string[], otp: string) {
    const subject = 'OTP EMAIL'
    const react = OtpEmail({ otp })
    await this.sendEmail(to, subject, undefined, react)
  }
}
export default EmailServ
