// eslint-disable-next-line no-shadow
import { Body, Container, Heading, Hr, Html, Img, Section, Text } from '@react-email/components'
import * as React from 'react'

interface VerifyEmailProps {
  otp: string
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  textAlign: 'center' as const,
}
const footer = {
  color: '#8898aa',
  fontSize: '12px',
}
const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}
const logo = {
  margin: '0 auto',
}
const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #ddd',
  borderRadius: '5px',
  marginTop: '10px',
  width: '480px',
  maxWidth: '100%',
  margin: '0 auto',
  padding: '5%',
}

const codeDescription = {
  textAlign: 'center' as const,
}

const codeContainer = {
  background: 'rgba(0,0,0,.05)',
  borderRadius: '4px',
  margin: '16px auto 14px',
  verticalAlign: 'middle',
  width: '280px',
  maxWidth: '100%',
}

const codeStyle = {
  color: '#000',
  display: 'inline-block',
  paddingBottom: '8px',
  paddingTop: '8px',
  margin: '0 auto',
  width: '100%',
  textAlign: 'center' as const,
  letterSpacing: '8px',
}

export const OtpEmail = ({ otp }: VerifyEmailProps) => (
  <Html>
    <Body style={main}>
      <Container style={container}>
        <Img src={`https://dev.image.lunas.vn/logo.png`} width="200" height="77" alt="Logo" style={logo} />
        <Text style={codeDescription}>
          Đây là mã xác thực gmail của bạn. Vui lòng không chia se mã này với bất kỳ ai.
        </Text>
        <Text style={codeDescription}>
          Hãy nhập mã hoặc bấm vào nút đăng nhập bên dưới để xác thực gmail. Mã xác thực sẽ hết hạn sau 5 phút.
        </Text>
        <Section style={codeContainer}>
          <Heading style={codeStyle}>{otp}</Heading>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Đây là mail tự động gửi, vui lòng không phản hồi</Text>
      </Container>
    </Body>
  </Html>
)
