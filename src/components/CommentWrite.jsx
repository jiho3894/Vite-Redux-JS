import React from "react";
import { useDispatch } from "react-redux";
import { actionCreators as commentActions } from "../redux/modules/comment";
import { Grid, Input, Button } from "../elements";

const CommentWrite = (props) => {
  const dispatch = useDispatch();
  const [comment_text, setCommentText] = React.useState("");

  const { post_id } = props;
  // console.log(post_id);
  const onChange = (e) => {
    setCommentText(e.target.value);
  };

  const write = () => {
    if (comment_text === "") {
      window.alert("댓글을 입력해주세요!");
      return;
    }
    //addCommentFB dispatch =>
    //addCommentFB => 해당 post_id , comment_text 가져가 추가
    ///
    dispatch(commentActions.addCommentFB(post_id, comment_text));
    // input 태그 value 초기화
    setCommentText("");
  };
  /* 댓글 입력 폼 */
  return (
    <React.Fragment>
      <Grid padding="16px" is_flex>
        <Input
          placeholder="댓글 내용을 입력해주세요 :)"
          _onChange={onChange}
          value={comment_text}
          is_submit
          onSubmit={write}
        />
        <Button width="50px" margin="0px 2px 0px 2px" _onClick={write}>
          작성
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export default CommentWrite;
