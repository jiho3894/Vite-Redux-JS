import React from "react";
import { Grid, Button } from "../elements";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators } from "../redux/modules/user";
import { history } from "../redux/configureStore";
import { apiKey } from "../shared/firebase";
import styled from "styled-components";
import NotiBadge from "./NotiBadge";

const Header = (props) => {
  const dispatch = useDispatch();
  // 로그인 여부에 따른 헤더 모양 변경
  const is_login = useSelector((state) => state.user.is_login);
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  // 세션 존재 여부까지 확인
  const is_session = sessionStorage.getItem(_session_key) ? true : false;
  return (
    <React.Fragment>
      <Grid is_flex padding="24px">
        <Grid>
          <MainHome onClick={() => history.push("/")}>
            <span>헬로우</span>
          </MainHome>
        </Grid>
        {is_login && is_session ? (
          <Grid is_flex>
            {/* <NotiBadge
              _onClick={() => {
                history.push("/noti");
              }}
            /> */}
            {/* <Button text="내정보" /> */}
            {/* deleteCookie */}
            <Button
              text="로그아웃"
              _onClick={() => dispatch(actionCreators.logoutFB({}))}
            ></Button>
          </Grid>
        ) : (
          <Grid is_flex>
            <Button
              text="로그인"
              _onClick={() => history.push("/login")}
            ></Button>
            <Button
              text="회원가입"
              _onClick={() => history.push("/signup")}
            ></Button>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

Header.defaultProps = {};

/* 임시 헤더 제목 창 클릭용 */
const MainHome = styled.div`
  width: 50%;
  cursor: pointer;
  font-size: 24px;
  font-weight: 600;
`;

export default Header;
