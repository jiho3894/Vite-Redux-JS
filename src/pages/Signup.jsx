import React from "react";
import { Grid, Text, Input, Button } from "../elements";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { emailCheck } from "../shared/common";
import { useForm } from "react-hook-form";

import TextField from "@mui/material/TextField";
import { apiKey } from "../shared/firebase";

const Signup = (props) => {
  // console.log(props); history props
  const dispatch = useDispatch();

  const { history } = props;
  const user_info = useSelector((state) => state.user.user);
  console.log(user_info);

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

  const { register, handleSubmit } = useForm();

  const signup = (data) => {
    console.log(data);
    if (data.Password !== data.Password2) {
      alert("틀려");
      return;
    }
    alert("회원가입 완료");
    //signupFB id,pwd,user_name state값을 넣어서 dispatch =>
    //signupFB => setUser => history.push('/')
    // 궁금 : 로그인과 같은 setUser로 이동해 쿠키에 로그인 성공 여부를 넣은 이유는???
    dispatch(userActions.signupFB(data.id, data.Password2, data.NickName));
    history.push("/");
  };

  return (
    <React.Fragment>
      <Grid padding="16px">
        <form onSubmit={handleSubmit(signup)}>
          <TextField
            label="ID"
            variant="standard"
            placeholder="ID"
            autoFocus
            required
            {...register("id", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@/,
                message: "Only naver.com emails allowed",
              },
            })}
          />

          <TextField
            id="standard-basic"
            label="NickName"
            variant="standard"
            required
            {...register("NickName", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]/,
                message: "Only naver.com emails allowed",
              },
            })}
          />

          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            variant="standard"
            autoComplete="off"
            {...register("Password", {
              required: true,
              pattern: {
                value: /^[A-Za-z0-9._%+-]/g,
                message: "not pattern",
              },
            })}
          />

          <TextField
            id="standard-password-input"
            label="Try Password"
            type="password"
            variant="standard"
            autoComplete="off"
            {...register("Password2", {
              required: true,
              pattern: {
                value: /^[A-Za-z0-9._%+-]/g,
                message: "error",
              },
            })}
          />

          <button type="submit">Submit</button>
          {/* <Text size="32px" bold>
            회원가입
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
              label="닉네임"
              placeholder="닉네임을 입력해주세요."
              _onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </Grid>

          <Grid padding="16px 0px">
            <Input
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요."
              _onChange={(e) => {
                setPwd(e.target.value);
              }}
            />
          </Grid>

          <Grid padding="16px 0px">
            <Input
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해주세요."
              _onChange={(e) => {
                setPwdCheck(e.target.value);
              }}
            />
          </Grid>

          <Button text="회원가입하기" _onClick={signup}></Button> */}
        </form>
      </Grid>
    </React.Fragment>
  );
};

Signup.defaultProps = {};

export default Signup;
