import moment from "moment";
import { firestore } from "../../shared/firebase";
import { produce } from "immer";
import { createAction, handleActions } from "redux-actions";

import { actionCreators as postActions } from "./post";

const SET_LIKE = "SET_LIKE";
const ADD_LIKE = "ADD_LIKE";
const DEL_LIKE = "DEL_LIKE";

const setLike = createAction(SET_LIKE, (post_id, like_list) => ({
  post_id,
  like_list,
}));
const addLike = createAction(ADD_LIKE, (like_list) => ({ like_list }));
const delLike = createAction(DEL_LIKE, (post_id, real, like_list) => ({
  post_id,
  real,
  like_list,
}));

const initialState = {
  list: {},
};

const addLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    const likeDB = firestore.collection("like");
    let like = {
      user_id: getState().user.user,
      post_id: post_id,
    };
    likeDB
      .add({ ...like })
      .then(() => {
        let like_list = { ...like };
        dispatch(addLike(like_list));
        alert("좋아요 완료!");
        // const postDB = firestore.collection("post");
        // const post = getState().post.list.find((l) => l.id === post_id);
        // const increment = firebase.firestore.FieldValue.increment(1);
        // postDB
        //   .doc(post_id)
        //   .update({ like_cnt: increment })
        //   .then(() => {
        //     dispatch(
        //       postActions.editPost(post_id, {
        //         like_cnt: parseInt(post.like_cnt) + 1,
        //       })
        //     );
        //   });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const delLikeFB = (post_id, real) => {
  return function (dispatch, getState, { history }) {
    const LikeDB = firestore.collection("like");
    // console.log(getState().like.list[real]);
    LikeDB.doc(post_id)
      .delete()
      .then(() => {
        dispatch(delLike(post_id, real, getState().like.list[real]));
        alert("삭제 완료");
        history.replace(`/post/${real}`);
      })
      .catch((err) => {
        console.error(err);
      });

    // .delete()
    // .then(() => {
    //   console.log("success");
    // })
    // .catch((err) => {
    //   console.error(err);
    // });
  };
};

const getLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    const likeDB = firestore.collection("like");
    console.log(post_id);
    if (!post_id) {
      return;
    }

    likeDB
      .where("post_id", "==", post_id)
      .get()
      .then((docs) => {
        let list = [];
        docs.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        dispatch(setLike(post_id, list));
        console.log(list);
      })
      .catch((err) => {
        console.log(post_id, err);
      });
  };
};

export default handleActions(
  {
    [SET_LIKE]: (state, action) =>
      produce(state, (draft) => {
        // comment는 딕셔너리 구조로 만들어서,
        // post_id로 나눠 보관

        draft.list[action.payload.post_id] = [...action.payload.like_list];
      }),
    [ADD_LIKE]: (state, action) => produce(state, (draft) => {}),
    [DEL_LIKE]: (state, action) =>
      produce(state, (draft) => {
        let delList = state.list[action.payload.real].findIndex(
          (p) => p.id === action.payload.post_id
        );
        console.log(action.payload);
        console.log(state, action);
        draft.list[action.payload.post_id] = [...action.payload.like_list];
        draft.list[action.payload.post_id].splice(delList, 1);
        console.log(draft.list[action.payload.post_id]);
      }),
  },
  initialState
);

const actionCreators = {
  addLikeFB,
  getLikeFB,
  delLikeFB,
};

export { actionCreators };
