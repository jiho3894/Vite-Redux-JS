import React, { useEffect } from "react";
import Post from "../components/Post";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const PostList = () => {
  const post_list = useSelector((state) => state.post.list);
  const dispatch = useDispatch();
  useEffect(() => {
    if (post_list.length === 0) {
      dispatch(postActions.getPostFB());
    }
  }, []);
  return (
    <React.Fragment>
      {/* <Post /> */}
      {post_list.map((p, index) => {
        return <Post {...p} key={index}></Post>;
      })}
    </React.Fragment>
  );
};

export default PostList;
