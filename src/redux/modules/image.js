import { createAction, handleActions } from "redux-actions";
import produce from "immer";

import { storage } from "../../shared/firebase";

// actions
const UPLOADING = "UPLOADING";
const UPLOAD_IMAGE = "UPLOAD_IMAGE";
const SET_PREVIEW = "SET_PREVIEW";

// action creators
const uploading = createAction(UPLOADING, (uploading) => ({ uploading }));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({ image_url }));
const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview }));

function uploadImageFB(image) {
  return function (dispatch, getState, { history }) {
    dispatch(uploading(true));
    // FB에 들어갈 사진 이름
    console.log(`images/${new Date().getTime()}_${image.name}`);
    const _upload = storage.ref(`images/${image.name}`).put(image);
    //////////////////////////////////
    // 이후 FB 문법 변경
    _upload
      .then((snapshot) => {
        console.log(snapshot);

        snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
          // 가공한 url initialState image_url 변경
          dispatch(uploadImage(url));
        });
      })
      .catch((err) => {
        // 오류 catch시 업로드 금지
        dispatch(uploading(false));
      });
  };
}

// initial state
const initialState = {
  image_url: "http://via.placeholder.com/400x300",
  // 연속 파일 업로드 금지
  uploading: false,
  preview: null,
};

// reducer
export default handleActions(
  {
    [UPLOAD_IMAGE]: (state, action) =>
      produce(state, (draft) => {
        draft.image_url = action.payload.image_url;
        draft.uploading = false;
      }),

    [UPLOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.uploading = action.payload.uploading;
      }),

    [SET_PREVIEW]: (state, action) =>
      produce(state, (draft) => {
        // reader.result 값이 preview에 들어감 initialState
        draft.preview = action.payload.preview;
        // console.log(action.payload.preview); <==
      }),
  },
  initialState
);

const actionCreators = {
  uploadImage,
  uploadImageFB,
  setPreview,
};

export { actionCreators };
