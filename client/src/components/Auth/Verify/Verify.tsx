import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { VERIFY_URL } from "../../../config/api";

const StyledVerify = styled.div`
  width: 100%;
  height: 100%;
`;

const Verify = () => {
  const verifyToken = useParams().verifyToken;
  const navigator = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const res = await axios.get(`${VERIFY_URL}/${verifyToken}`);

      if (res.status !== 200) {
        alert("서버 오류입니다. 다시 시도해주세요.");
        return;
      }

      alert("이메일 인증이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigator("/login");
      return;
    };

    if (!verifyToken) {
      alert("잘못된 접근입니다. 메인페이지로 이동합니다.");
      return;
    }

    verifyUser();
  }, [verifyToken, navigator]);

  return <StyledVerify></StyledVerify>;
};

export default Verify;
