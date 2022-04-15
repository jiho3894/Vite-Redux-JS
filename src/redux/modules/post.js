import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import moment from "moment";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";

const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));

const initialState = {
  list: [],
};

const initialPost = {
  image_url:
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSwuQAK8o6B1HpAkQWsV9Gqf39ozTuYs8bRPnxrirp4wkJ3Ls_x",
  contents: "",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    const _user = getState().user.user;
    const _image = getState().image.preview;
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    // 잘 만들어졌나 확인해보세요!!
    postDB
      .add({ ...user_info, _post })
      .then((doc) => {
        let post = { user_info, ..._post, id: doc.id };
        dispatch(addPost(post));
        history.replace("/");
      })
      .catch((err) => {
        console.log("작성실패", err);
      });
  };
};
const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB.get().then((docs) => {
      let post_list = [];
      docs.forEach((doc) => {
        let _post = {
          id: doc.id,
          ...doc.data(),
        };

        let post = {
          id: doc.id,
          user_info: {
            user_name: _post.user_name,
            user_profile: _post.user_profile,
          },
          image_url: _post.image_url,
          contents: _post.contents,
          comment_cnt: _post.comment_cnt,
          insert_dt: _post.insert_dt,
        };
        post_list.push(post);
      });
      dispatch(setPost(post_list));
    });
  };
};

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list;
      }),
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
};

export { actionCreators };
