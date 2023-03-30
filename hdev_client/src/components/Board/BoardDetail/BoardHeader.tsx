import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { MenuIcon } from "../../../assets/icon";
import { loggedInUserState } from "../../../recoil";
import { boardDetailState } from "../../../recoil/board";
import { removeBoard } from "../../../services/BoardService";
import { dateFormater } from "../../../utils/Common";
import { ProfileImage } from "../../Common/User";

const StyledBoardHeader = styled.div`
  width: 90%;
  display: flex;
  margin-top: 30px;
  gap: 10px;
  position: relative;
`;

const Writer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Username = styled.div`
  @media screen and (max-width: 767px) {
    font-size: 15px;
  }
`;

const CreatedAt = styled.div`
  @media screen and (max-width: 767px) {
    font-size: 13px;
  }
  color: #767e8c;
`;

const UtilButtons = styled.div`
  display: flex;
  position: absolute;
  right: 0;
`;

const Button = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  @media screen and (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`;

const ButtonMenu = styled.div`
  width: 100px;
  height: 80px;
  position: absolute;
  top: 100%;
  right: 0;
  border-radius: 10px;
  border: 1px solid #dbdbdb;
`;

const MenuItem = styled(Link)`
  width: 100%;
  height: 50%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    background-color: #dbdbdb;
  }
`;

const BoardHeader = () => {
  const boardDetail = useRecoilValue(boardDetailState);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [enableMenu, setEnableMenu] = useState(false);
  const navigator = useNavigate();

  const menuHandler = () => {
    setEnableMenu((prevState) => !prevState);
  };

  const removeHandler = async () => {
    try {
      const isRemove = window.confirm("게시글을 삭제하면 복구가 불가능합니다. 정말 삭제하실껀가요?");
      if (isRemove) {
        const res = await removeBoard(boardDetail.boardId, loggedInUser.accessToken);
        if (res.data.accessToken) {
          setLoggedInUser((prevState) => {
            return { ...prevState, accessToken: res.data.accessToken };
          });
        }

        alert("게시글 삭제가 완료되었습니다.");
        navigator(-1);
      }
    } catch (err: any) {
      const { status, data } = err.response;
      let errMessage = "서버 오류입니다. 다시 시도해주세요.";

      switch (status) {
        case 401:
          switch (data.message) {
            case "unauthorized_user":
              errMessage = "인증되지 않은 사용자입니다. 다시 로그인해주세요";
          }
          break;

        case 404:
          switch (data.message) {
            case "board_not_found":
              errMessage = "게시글을 찾을수 없습니다.";
          }
          break;
      }

      alert(errMessage);
    }
  };

  return (
    <StyledBoardHeader>
      <ProfileImage profileImg={boardDetail.user.profileImg} />
      <Writer>
        <Username>{boardDetail.user.nickname}</Username>
        <CreatedAt>
          {dateFormater(boardDetail.createdAt)} · 조회수 {boardDetail.view.viewCnt}회
        </CreatedAt>
      </Writer>
      {loggedInUser.userId === boardDetail.user.userId && (
        <UtilButtons>
          <Button onClick={menuHandler}>
            <MenuIcon />
            {enableMenu && (
              <ButtonMenu>
                <MenuItem to={`/boards/${boardDetail.boardId}/update`}>수정하기</MenuItem>
                <MenuItem to="" onClick={removeHandler}>
                  삭제하기
                </MenuItem>
              </ButtonMenu>
            )}
          </Button>
        </UtilButtons>
      )}
    </StyledBoardHeader>
  );
};

export default BoardHeader;
