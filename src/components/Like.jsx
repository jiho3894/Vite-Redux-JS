import React, { useEffect, useState } from "react";

import { actionCreators as likeActions } from "../redux/modules/like";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "../elements";
import { history } from "../redux/configureStore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { IconButton } from "@material-ui/core";

const Like = (props) => {
  // post, user id 알기위해 useState로 가져오기
  const dispatch = useDispatch();

  const like_list = useSelector((state) => state.like?.list);
  const is_login = useSelector((state) => state.user.is_login);
  // const like_list = useSelector((state) => state.like.list);
  const user_info = useSelector((state) => state.user.user);

  const { post_id } = props;

  // 체크 안한 상태
  const [checkLike, setCheckLike] = useState(false);
  useEffect(() => {
    if (like_list[post_id]?.includes(user_info?.uid)) {
      // 유저가 체크한 상태
      setCheckLike(true);
    } else {
      // 유저가 체크하지 않은 상태
      setCheckLike(false);
    }
  });

  // 하트누르면 post안에 먹혀서 post detail 페이지로 갔다가 뒤로가기누르면
  // required로 감 ...  아니면 한 번 더 누르거나..
  const updateLike = () => {
    if (!is_login) {
      window.alert("로그인시 하트를 누를 수 있습니다❤️");
      return history.replace("/login");
    }
    if (!like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.addLikeFB(post_id));
    }

    if (like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.undoLikeFB(post_id));
    }
  };
  return (
    <Text _onClick={updateLike}>
      <IconButton
        aria-label="add to favorites"
        color={checkLike ? "secondary" : "default"}
      >
        <FavoriteIcon />
      </IconButton>
    </Text>
  );
};

export default Like;
