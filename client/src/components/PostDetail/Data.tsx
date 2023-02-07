import styled from "styled-components";

const StyledData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Tags = styled.div`
  display: flex;
  gap: 10px;
`;

const TagText = styled.p`
  width: auto;
  padding: 0 15px 0 15px;
  background-color: #f3f4f6;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  @media screen and (max-width: 767px) {
    font-size: 12px;
    padding: 0 10px 0 10px;
  }
`;

const RecommendData = styled.div`
  display: flex;
  gap: 20px;

  @media screen and (max-width: 767px) {
    gap: 10px;
  }
`;

const RecommendCount = styled.button`
  width: auto;
  padding: 5px 15px 5px 15px;
  display: flex;
  border: 1px solid #b9b9b9;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;

  @media screen and (max-width: 767px) {
    padding: 5px 10px 5px 10px;
  }
`;

const RecommendIcon = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.01953 14.124V26.3899C1.01953 26.8735 1.41094 27.266 1.89352 27.266H9.75756V13.2477H1.89352C1.41094 13.2477 1.01953 13.6403 1.01953 14.124Z"
        fill="#1872D9"
      />
      <path
        d="M25.4854 11.4954H18.4951V6.23842C18.4951 4.30559 16.9276 2.7341 15.0002 2.7341H12.3785C11.8964 2.7341 11.5051 3.1265 11.5051 3.60996V7.75781L8.12514 13.6894C8.0482 13.8223 8.00977 13.9714 8.00977 14.124V26.3899C8.00977 26.8734 8.40117 27.266 8.8834 27.266H22.9077C24.2885 27.266 25.5432 26.4478 26.1006 25.1844L28.9036 18.8602C28.9544 18.7483 28.9807 18.6271 28.9807 18.5047V15C28.9808 13.067 27.413 11.4954 25.4854 11.4954Z"
        fill="#BCDFFD"
      />
    </svg>
  );
};

const NonRecommendIcon = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.01953 15.876V3.6099C1.01953 3.12644 1.41064 2.73404 1.89352 2.73404H9.75744V16.7521H1.89352C1.41064 16.752 1.01953 16.3595 1.01953 15.876Z"
        fill="#1872D9"
      />
      <path
        d="M25.4856 18.5045H18.4951V23.7616C18.4951 25.6939 16.9279 27.2661 15.0004 27.2661H12.3784C11.8967 27.2661 11.5051 26.8735 11.5051 26.3897V22.2422L8.12514 16.3106C8.0482 16.1778 8.00977 16.0286 8.00977 15.8761V3.6099C8.00977 3.12644 8.40141 2.73404 8.88375 2.73404H22.9078C24.2887 2.73404 25.5433 3.55224 26.1009 4.81535L28.9035 11.1394C28.9547 11.2518 28.981 11.3729 28.981 11.4953V15C28.9811 16.9324 27.4133 18.5045 25.4856 18.5045Z"
        fill="#BCDFFD"
      />
    </svg>
  );
};

const Data = () => {
  return (
    <StyledData>
      <Tags>
        <TagText>#Typescript</TagText>
        <TagText>#node.js</TagText>
      </Tags>
      <RecommendData>
        <RecommendCount>
          <RecommendIcon />
          10
        </RecommendCount>
        <RecommendCount>
          <NonRecommendIcon />0
        </RecommendCount>
      </RecommendData>
    </StyledData>
  );
};

export default Data;
