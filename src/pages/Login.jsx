import React from "react";
import { Text, Input, Grid, Button } from "../elements";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { emailCheck } from "../shared/common";
import { apiKey } from "../shared/firebase";

const Login = (props) => {
  // console.log(props); history props
  const dispatch = useDispatch();
  const { history } = props;
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  React.useEffect(() => {
    if (is_session) {
      // session 이 존재하면 로그인 페이지 벗어나기
      //
      alert("로그인 상태");
      history.push("/");
    }
  }, []);
  const [id, setId] = React.useState("");
  const [pwd, setPwd] = React.useState("");
  const [write, setWrite] = React.useState(true);

  const login = () => {
    if (id === "" || pwd === "") {
      window.alert("아이디 혹은 비밀번호가 공란입니다! 입력해주세요!");
      return;
    }
    //common.js 정규식 체크하기
    if (!emailCheck(id)) {
      window.alert("이메일 형식이 맞지 않습니다!");
      return;
    }
    //loginFB id,pwd state값을 넣어서 dispatch =>
    //loginFB => setUser => setCookie에 로그인 success 여부 만들기
    // history.push('/')
    dispatch(userActions.loginFB(id, pwd));
  };

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text size="32px" bold>
          로그인
        </Text>

        <Grid padding="16px 0px">
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요."
            _onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </Grid>

        <Grid padding="16px 0px">
          <Input
            label="패스워드"
            placeholder="패스워드 입력해주세요."
            type="password"
            _onChange={(e) => {
              setPwd(e.target.value);
              if (e.target.value.length > 1) {
                setWrite(false);
              } else {
                setWrite(true);
              }
            }}
            value={pwd}
            is_submit
            onSubmit={login}
          />
        </Grid>

        <Button
          text="로그인하기"
          _onClick={() => {
            login();
          }}
          is_float={write}
        ></Button>
      </Grid>
    </React.Fragment>
  );
};

export default Login;
