import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "../components/Post";
import { Grid } from "../elements";
import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";

const PostList = (props) => {
  // console.log(props); history props
  const dispatch = useDispatch();
  const is_loading = useSelector((state) => state.post.is_loading);
  const paging = useSelector((state) => state.post.paging);
  // console.log(is_loading, paging);
  const post_list = useSelector((state) => state.post.list);
  console.log(post_list);
  const user_info = useSelector((state) => state.user.user);
  // console.log(user_info); <== 현재 user를 확인해 수정 버튼 토글
  const { history } = props;
  console.log(post_list);
  React.useEffect(() => {
    // 확인 용도 vite connected 전 빈 배열이긴함
    if (post_list.length < 2) {
      //getPostFB dispatch =>
      //getPostFB => 해당 contents 값 가져가 initialPost 내용 변경
      ////////////////////BE
      dispatch(postActions.getPostFB());
    }
  }, []);
  return (
    <React.Fragment>
      <Grid bg={"#EFF6FF"} padding="20px">
        <InfinityScroll
          callNext={() => dispatch(postActions.getPostFB(paging.next))}
          is_next={paging.next ? true : false}
          loading={is_loading}
        >
          {post_list.map((p, idx) => {
            return (
              <Grid
                bg="#ffffff"
                margin="8px 0px"
                key={p.id}
                _onClick={() => {
                  history.push(`/post/${p.id}`);
                }}
              >
                <Post {...p} />
              </Grid>
            );
          })}
        </InfinityScroll>
      </Grid>
    </React.Fragment>
  );
};

export default PostList;
