import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verify } from "../../services/AuthService";

const Verify = () => {
  const verifyToken = useParams().verifyToken as string;
  const navigator = useNavigate();

  useEffect(() => {
    const doVerify = async () => {
      await verify(verifyToken);

      alert("인증을 성공했습니다. 로그인 페이지로 이동합니다.");
      navigator("/login");
    };

    if (verifyToken) {
      doVerify();
    }
  }, [verifyToken, navigator]);

  return <div></div>;
};

export default Verify;
