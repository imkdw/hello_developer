import styled from "styled-components";

import introBackgroundImage from "../../../assets/images/auth/intro_background.png";

const StyledIntro = styled.div`
  width: 50%;
  height: 100%;
  position: relative;
  border-radius: 15px 0 0 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20em;

  @media screen and (max-width: 767px) {
    display: none;
  }
`;

/** 블러처리를 위한 엘리먼트 */
const IntroBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${introBackgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(5px);
`;

/** 인트로에 표시될 제목 */
const IntroHeader = styled.header`
  font-size: 40px;
  letter-spacing: 2px;
  color: white;
  position: relative;
  z-index: 999;
  line-height: 70px;
  font-weight: bold;
`;

/** 인트로에 표시될 환영문구 */
const IntroContent = styled.p`
  font-size: 25px;
  color: white;
  position: relative;
  z-index: 999;
  line-height: 70px;
`;

const Intro = () => {
  return (
    <StyledIntro>
      <IntroBackground />
      <IntroHeader>
        Welcome
        <br />
        HELLO, DEVELOPER
      </IntroHeader>
      <IntroContent>
        개발자들을 위한 커뮤니티
        <br />
        Hello, Developer 입니다.
      </IntroContent>
    </StyledIntro>
  );
};

export default Intro;
