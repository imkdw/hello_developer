import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('nodemailer.user'),
        clientId: this.configService.get<string>('nodemailer.clientId'),
        clientSecret: this.configService.get<string>('nodemailer.clientSecret'),
        refreshToken: this.configService.get<string>('nodemailer.refreshToken'),
      },
    });
  }

  async sendVerifyEmail(email: string, verifyToken: string) {
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
