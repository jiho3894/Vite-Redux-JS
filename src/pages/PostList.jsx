import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post";
import { actionCreators as postActions } from "../redux/modules/post";

const PostList = (props) => {
  // console.log(props); history props
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  console.log(post_list);
  const user_info = useSelector((state) => state.user.user);
  // console.log(user_info); <== 현재 user를 확인해 수정 버튼 토글
  React.useEffect(() => {
    // 확인 용도 vite connected 전 빈 배열이긴함
    if (post_list.length === 0) {
      //getPostFB dispatch =>
      //getPostFB => 해당 contents 값 가져가 initialPost 내용 변경
      dispatch(postActions.getPostFB());
    }
  }, []);

  return (
    <React.Fragment>
      {post_list.map((p, idx) => {
        if (p.user_info.user_id === user_info?.uid) {
          // is_me 기존에 false
          return <Post key={p.id} {...p} is_me />;
        } else {
          return <Post key={p.id} {...p} />;
        }
      })}
    </React.Fragment>
  );
};

export default PostList;
