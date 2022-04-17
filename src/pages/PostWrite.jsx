import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

const PostWrite = (props) => {
  const dispatch = useDispatch();
  // Selector는 configureStore.js에서 만든 combineReducers에 들어간 값을
  // 불러오고 해당 폴더에 있는 handleActions에 들어간 initialState를 출력한다
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview);
  // 최초에는 null 이후에 dispatch(imageActions.setPreview(_post.image_url));
  // 과정으로 다시 값이 들어옴
  // console.log(preview);
  const post_list = useSelector((state) => state.post.list);

  // prop에는 history , match , location 이 있음
  // 현재 상태 -- 수정을 원할때도 같은 컴포넌트 사용중
  // 해당 router /:id 값이 현재 값과 동일함
  const post_id = props.match.params.id;
  // console.log(props);
  // 현재 상태 -- 수정 페이지 ? true : false
  const is_edit = post_id ? true : false;

  const { history } = props;

  // 수정 페이지면 그 id 값과 동일한 정보를 가져옴
  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;
  // console.log(_post); <==
  // 해당 값이 있으면 그 값의 comment input 값에 그대로 나오게
  const [contents, setContents] = React.useState(_post ? _post.contents : "");
  const [write, setWrite] = React.useState(true);

  // 해당 링크가 정확하지 않으면 ex) 고의로 write/{ramdom} 적으면
  // 즉시 전 페이지로 이동하고 해당 컴포넌트는 return
  React.useEffect(() => {
    if (is_edit && !_post) {
      console.log("포스트 정보가 없어요!");
      history.goBack();

      return;
    }
    // console.log(is_edit); <==
    if (is_edit) {
      // 해당 image_url이 setPreview를 통해 payload에 들어가서
      // initialState preview값을 변경해줌
      // 문제점 -- 그래서 수정 창 누르고 다시 write 창 가면
      // 이전에 들어간 이미지 값이 그대로 남아있음 초기화 필요
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const changeContents = (e) => {
    setContents(e.target.value);
    if (e.target.value.length > 1) {
      setWrite(false);
    } else {
      setWrite(true);
    }
  };

  const addPost = () => {
    //addPostFB contents state값을 넣어서 dispatch =>
    //addPostFB => 해당 contents 값 가져가 initialPost 내용 변경 =>
    // history.replace('/')
    if (preview) {
      dispatch(postActions.addPostFB(contents));
    } else {
      alert("이미지와 함께 업로드 해주세요");
      return;
    }
  };

  const editPost = () => {
    //editPostFB post_id(해당 id 값과 동일한지 찾기위함),
    // contents state값을 넣어서 dispatch =>
    //editPostFB => 해당 contents 값 가져가 initialState 내용 변경 =>
    // history.replace('/')
    console.log(post_id);
    dispatch(postActions.editPostFB(post_id, { contents: contents }));
  };
  // 이 부분이 Signup의 is_login 상태와 겹침 is_session이 추가가 필요함
  if (!is_login) {
    return (
      <Grid margin="100px 0px" padding="16px" center>
        <Text size="32px" bold>
          앗! 잠깐!
        </Text>
        <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
        <Button
          _onClick={() => {
            history.replace("/");
          }}
        >
          로그인 하러가기
        </Button>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text margin="0px" size="36px" bold>
          {is_edit ? "게시글 수정" : "게시글 작성"}
        </Text>
        {/* 이미지 파일 URL 가공 */}
        <Upload />
      </Grid>

      <Grid>
        <Grid padding="16px">
          <Text margin="0px" size="24px" bold>
            미리보기
          </Text>
        </Grid>

        <Image
          shape="rectangle"
          src={preview ? preview : "http://via.placeholder.com/400x300"}
        />
      </Grid>

      <Grid padding="16px">
        <Input
          value={contents}
          _onChange={changeContents}
          label="게시글 내용"
          placeholder="게시글 작성"
          multiLine
        />
      </Grid>

      <Grid padding="16px">
        {is_edit ? (
          <Button text="게시글 수정" _onClick={editPost}></Button>
        ) : (
          <Button
            text="게시글 작성"
            _onClick={addPost}
            is_float={write}
          ></Button>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
