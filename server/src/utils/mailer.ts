import { createTransport } from "nodemailer";
import config from "../config";

export class Mailer {
  static sendVerifyToken = async (email: string, nickname: string, verifyToken: string) => {
    const transporter = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        type: "OAuth2",
        user: config.mailer.gmailUser,
        clientId: config.mailer.gmailClientId,
        clientSecret: config.mailer.gmailClientSecret,
        refreshToken: config.mailer.gmailRefreshToken,
      },
    });

    const mailOptions = {
      from: "헬로디벨로퍼 <hdev.manager@gmail.com>",
      to: email,
      subject: "[헬로디벨로퍼] 회원가입 이메일 인증 메일입니다.",
      html: `<body style="margin: 0; padding: 0">
      <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start">
        <h1 >헬로디벨로퍼에 가입하신걸 환영합니다.</h1>
        <p>안녕하세요 ${nickname}(${email})님. 아래 링크를 클릭해서 인증을 완료해주세요!</p>
        <a href="http://www.naver.com?token=${verifyToken}" style="background-color: purple; color: white; font-weight: bold">이메일 인증하기</a>
      </div>
    </body>
      `,
    };

    await transporter.sendMail(mailOptions);
  };
}
