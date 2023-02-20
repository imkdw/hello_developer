import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { VERIFY_URL } from "../../../config/api";

const StyledVerify = styled.div`
  width: 100%;
  height: 100%;
`;

const Verify = () => {
  const verifyToken = useParams().verifyToken;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${VERIFY_URL}/${verifyToken}`);
        if (res.status === 200) {
          alert("인증이 완료되었습니다.");
          return;
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    if (verifyToken) {
      verifyUser();
    }
  }, [verifyToken]);

  return <StyledVerify></StyledVerify>;
};

export default Verify;
