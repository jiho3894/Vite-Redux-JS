import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import "moment";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";

const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));

const initialState = {
  list: [],
};

const initialPost = {
  image_url:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXIZ5TkLzY7zdURZgU2u172GrUwhjTosxfkg&usqp=CAU",
  contents: "",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    // 애초에 id가 없으면 return
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }
    // Upload.js에서 이미지 가공한 url 값
    const _image = getState().image.preview;
    // addPost로 만들어진 initialState 배열
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(getState().post.list);

    const postDB = firestore.collection("post");

    //////////////////////////////////
    // 이후 FB 문법 변경'
    console.log(_image === _post.image_url);
    console.log(post_id, { ...post });
    // 업로드 하는 이미지가 같으면 contents만 보내주기
    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          /* id 값과 , 변경하는 contents */
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });

      return;
      //////////////////////////////////
      // 이후 FB 문법 변경'
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);

            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                /* id 값과 , 변경하는 post contents, image_url */
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    // setUser로 생성한 session 정보
    const _user = getState().user.user;
    // console.log(_user); <==
    // 새로 만들어 주기 => 현재 프로필은 없음
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };
    //
    const _post = {
      ...initialPost,
      // 위는 Default 이후는 들어간 값
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const _image = getState().image.preview;

    //////////////////////////////////
    // 이후 FB 문법 변경
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);

          return url;
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              // 가공한 데이터 addPost로 initial 배열에 넣어주기
              dispatch(addPost(post));
              history.replace("/");
              // 다시 null로 만들어 사진 값 비워주기 ( 이게 미리보기랑 연관이 있는건지 확인 필요)
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", err);
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};

const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    //////////////////////////////////
    // 이후 FB 문법 변경
    postDB.get().then((docs) => {
      let post_list = [];
      docs.forEach((doc) => {
        let _post = doc.data();

        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        post_list.push(post);
      });

      console.log(post_list);
      // 가공한 배열 list setPost를 통해 initialState 배열에 넣어주기
      dispatch(setPost(post_list));
    });
  };
};

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list;
        // 해당 값들 initialState에 넣어주기
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        // 포스트 내용을 앞 배열에 넣어주기 ( 최신순으로 보이기 위함 )
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        console.log(draft.list[idx], action.payload.post);
        /* 0 : id 값에 맞는 위치의 내용과 , 1 : 수정한 contents , image_url */
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
};

export { actionCreators };
