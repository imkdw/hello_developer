import styled from "styled-components";

const StyledIntro = styled.div`
  width: 45%;
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

const IntroBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${process.env.PUBLIC_URL + "/img/auth/intro_image.png"});
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(5px);
`;

const Header = styled.header`
  font-size: 40px;
  letter-spacing: 2px;
  color: white;
  position: relative;
  z-index: 999;
  line-height: 70px;
  font-weight: bold;
`;

const Content = styled.p`
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
      <Header>
        Welcome
        <br />
        HELLO, DEVELOPER
      </Header>
      <Content>
        개발자들을 위한 커뮤니티
        <br />
        Hello, Developer 입니다.
      </Content>
    </StyledIntro>
  );
};

export default Intro;
