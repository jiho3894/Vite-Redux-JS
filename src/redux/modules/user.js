import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";

import { auth } from "../../shared/firebase";
import firebase from "firebase/app";

// actions
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// initialState
const initialState = {
  user: null,
  is_login: false,
};

// middleware actions
const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    //////////////////////////////////
    // 이후 FB 문법 변경
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {
      auth
        .signInWithEmailAndPassword(id, pwd)
        .then((user) => {
          console.log(user);
          // 로그인 유저에 대한 정보 setUser를 통해 initialState 변경
          dispatch(
            setUser({
              user_name: user.user.displayName,
              id: id,
              user_profile: "",
              uid: user.user.uid,
            })
            //////////////////////////////////////
            // id, user_profile, uid 필요없음
            // user_password 양식 따로 필요함
            // 결론 : user_name => user_email(수정) , user_password
          );
          // 로그인 이후 메인페이지 이동
          history.push("/");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorCode, errorMessage);
        });
    });
  };
};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    //////////////////////////////////
    // 이후 FB 문법 변경
    auth
      .createUserWithEmailAndPassword(id, pwd)
      .then((user) => {
        console.log(user);

        auth.currentUser
          .updateProfile({
            displayName: user_name,
          })
          .then(() => {
            dispatch(
              setUser({
                user_name: user_name,
                id: id,
                // 여기가 없어서 동일한 default 사진이 나옴
                user_profile: "",
                uid: user.user.uid,
                //////////////////////////////////////
                // id, user_profile, uid 필요없음
                // user_password 양식 따로 필요함
                // 결론 : user_email(아이디) , user_password(비밀번호) , user_name(닉네임)
              })
            );
            // 회원가입이후 메인페이지로 이동
            history.push("/");
            console.log(initialState);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
  };
};

const loginCheckFB = () => {
  return function (dispatch, getState, { history }) {
    //////////////////////////////////
    // 이후 FB 문법 변경
    auth.onAuthStateChanged((user) => {
      if (user) {
        // 해당 유저 마다 정보 저장
        dispatch(
          setUser({
            user_name: user.displayName,
            user_profile: "",
            id: user.email,
            uid: user.uid,
          })
        );
      } else {
        // deleteCookie 함수 실행
        dispatch(logOut());
      }
    });
  };
};

const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    //////////////////////////////////
    // 이후 FB 문법 변경
    auth.signOut().then(() => {
      // deleteCookie 함수 실행
      dispatch(logOut());
      // 메인 페이지로 이동
      history.replace("/");
    });
  };
};

// reducer
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        // 로그인시 cookie에 is_login success 발동
        // is_session 처리는 어케 할건지 아까 수정때 이미지 살아있는거
        setCookie("is_login", "success");
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        // 로그아웃 다 다운 시키기
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

// action creator export
const actionCreators = {
  logOut,
  getUser,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
};

export { actionCreators };
