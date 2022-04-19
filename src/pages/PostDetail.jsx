import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

import Permit from "../shared/Permit";

const PostDetail = (props) => {
  // console.log(props); history props
  const dispatch = useDispatch();
  const id = props.match.params.id;
  // params로 받아온 /post/:id의 id의 값
  // const { user_id, is_like, like_cnt } = props;

  // user login 정보와 , post list 불러오기 (id값 대조할려고)
  const user_info = useSelector((state) => state.user.user);
  const post_list = useSelector((store) => store.post.list);
  const post_idx = post_list.findIndex((p) => p.id === id);
  const post = post_list[post_idx];
  // console.log(post);
  // 해당 id값과 동일한 post 하나만 호출 성공
  // console.log(post);
  React.useEffect(() => {
    if (post) {
      return;
    }
    // 없다면 호출하기 무조건 없음 처음은..
    dispatch(postActions.getOnePostFB(id));
  }, []);
  return (
    <React.Fragment>
      {/* 해당 포스터 작성자와 현재 로그인 작성자가 동일하면 수정 버튼 나오게 */}
      {post && (
        <Post {...post} is_me={post.user_info.user_id === user_info?.uid} />
      )}
      {/* 로그아웃 상태에서는 댓글 작성 불가 permit로 session 검사 */}
      <Permit>
        <CommentWrite post_id={id} />
      </Permit>
      <CommentList post_id={id} />
    </React.Fragment>
  );
};

export default PostDetail;
