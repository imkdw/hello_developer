import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    // TODO: 하드코딩된 OAuth 토큰 변경필요
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'hdev.manager@gmail.com',
        clientId:
          '410471175654-3kjjvt31rhp1brj58m3io8mjbahe2414.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken:
          '1//04xyTxO9h39B1CgYIARAAGAQSNwF-L9Ir19z1ygBO7RhPsr4KKtryaCjd2Mk7it1WTUfr9dFLh8n47PIn6y1UDf1ohYfbwsDBNtc',
      },
    });
  }

  async sendVerifyUserEmail(email: string, verifyToken: string) {
    const url = `http://localhost:3000/verify/${verifyToken}`;

    const mailOptions = {
      from: '헬로디벨로퍼 <hdev.manager@gmail.com>',
      to: email,
      subject: '[헬로디벨로퍼] 회원가입 이메일 인증 메일입니다.',
      html: `<body style="margin: 0; padding: 0">
      <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start">
        <h1 >헬로디벨로퍼에 가입하신걸 환영합니다.</h1>
        <p>안녕하세요 ${email}님. 아래 링크를 클릭해서 인증을 완료해주세요!</p>
        <a href="${url}" style="background-color: purple; color: white; font-weight: bold">이메일 인증하기</a>
      </div>
    </body>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
