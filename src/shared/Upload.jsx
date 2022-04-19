import React from "react";

import { Button } from "../elements";
import { storage } from "./firebase";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
  const dispatch = useDispatch();
  // 연속으로 올리기 금지할려고 만듦
  const is_uploading = useSelector((state) => state.image.uploading);
  //console.log(is_uploading); <==
  const fileInput = React.useRef();

  const selectFile = (e) => {
    // 해당 두개 값이 동일함
    // console.log(e.target.files[0]); console.log(fileInput.current.files[0]);
    // file web API
    const reader = new FileReader();
    const file = fileInput.current.files[0];

    reader.readAsDataURL(file);
    // 읽으면 새로운 data url reader.result에 들어감
    reader.onloadend = () => {
      //setPreview reader.result값을 넣어서 dispatch =>
      //setPreview => 해당 contents 값 가져가 initialPost 내용 변경
      dispatch(imageActions.setPreview(reader.result));
    };
  };

  const uploadFB = () => {
    let image = fileInput.current.files[0];
    // 이미지를 안 넣었을 경우 return
    if (!image) {
      alert("이미지 넣어주세요");
      return;
    }
    //setPreview reader.result값을 넣어서 dispatch =>
    //setPreview => 해당 contents 값 가져가 initialPost 내용 변경
    dispatch(imageActions.uploadImageFB(image));
  };

  return (
    <React.Fragment>
      <input
        type="file"
        onChange={selectFile}
        ref={fileInput}
        disabled={is_uploading}
      />
      <Button _onClick={uploadFB}>업로드하기</Button>
    </React.Fragment>
  );
};

export default Upload;
