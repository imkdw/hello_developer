import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { AuthService } from "../../../services/auth";

const StyledVerify = styled.div`
  width: 100%;
  height: 100%;
`;

// TODO: 인증 완료창이 2번 뜨는 현상 개선필요
const Verify = () => {
  const verifyToken = useParams().verifyToken as string;
  const navigator = useNavigate();

  useEffect(() => {
    const doVerify = async () => {
      const res = await AuthService.verify(verifyToken);

      if (res?.status === 200) {
        alert("인증을 성공했습니다.");
        navigator("/login");
      }
    };

    doVerify();
  }, []);

  return <StyledVerify></StyledVerify>;
};

export default Verify;
