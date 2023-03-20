import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { boardDetailState } from "../../../../recoil/board";
import { dateFormater } from "../../../../utils/Common";

const StyledBoardHeader = styled.div`
  width: 100%;
  display: flex;
  margin-top: 30px;
  gap: 10px;
  position: relative;
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
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
  left: 0;
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

  return (
    <StyledBoardHeader>
      <Profile src={boardDetail.user.profileImg} />
      <Writer>
        <Username>{boardDetail.user.nickname}</Username>
        <CreatedAt>
          {dateFormater(boardDetail.createdAt)} · 조회수 {boardDetail.view.viewCnt}회
        </CreatedAt>
      </Writer>
      {/* <UtilButtons>
        <Button onClick={() => enableMenuHandler("menu")}>
          <MenuIcon />
          {enableMenu.menu && (
            <ButtonMenu>
              <MenuItem to={"/post/update/" + currentPostId}>수정하기</MenuItem>
              <MenuItem to="" onClick={deleteHandler}>
                삭제하기
              </MenuItem>
            </ButtonMenu>
          )}
        </Button>
      </UtilButtons> */}
    </StyledBoardHeader>
  );
};

export default BoardHeader;
