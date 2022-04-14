import React from "react";
import { useEffect } from "react/cjs/react.production.min";
import { Grid, Text, Button } from "../elements";
import { deleteCookie, getCookie } from "../shared/Cookie";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators } from "../redux/modules/user";
import { history } from "../redux/configureStore";
import { apiKey } from "../shared/firebase";

const Header = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;
  console.log(is_session);
  return (
    <React.Fragment>
      <Grid is_flex padding="4px 16px">
        <Grid>
          <Text margin="0px" size="24px" bold>
            헬로
          </Text>
        </Grid>
        {is_login && is_session ? (
          <Grid is_flex>
            <Button text="내정보"></Button>
            <Button text="알림"></Button>
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

export default Header;