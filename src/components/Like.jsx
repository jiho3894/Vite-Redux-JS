import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as likeActions } from "../redux/modules/like";
import { Text } from "../elements";
import { apiKey } from "../shared/firebase";
import { history } from "../redux/configureStore";

const Like = (props) => {
  const disPatch = useDispatch();
  const [is_like, setIsLike] = React.useState(true);
  const { post_id, id } = props;
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;
  const like_list = useSelector((state) => state.like.list);
  const user_info = useSelector((state) => state.user.user);
  React.useEffect(() => {
    if (id) {
      disPatch(likeActions.getLikeFB(post_id));
    }
  }, [id, is_like]);
  const addLike = () => {
    if (is_session) {
      disPatch(likeActions.addLikeFB(post_id));
      setIsLike((prev) => !prev);
    } else {
      alert("로그인이 필요합니다");
      history.push("/login");
    }
  };
  const delLike = () => {
    if (is_session) {
      const delIndex = like_list[post_id].findIndex(
        (p) => p.user_id?.uid === user_info?.uid
      );
      disPatch(likeActions.delLikeFB(like_list[post_id][delIndex].id, post_id));
      setIsLike((prev) => !prev);
    } else {
      alert("로그인이 필요합니다");
      history.push("/login");
    }
  };
  return (
    <React.Fragment>
      <Text margin="0px" bold>
        {like_list[post_id]?.findIndex((p) => p.user_id.uid === id) === -1 ? (
          <FavoriteBorderIcon onClick={addLike} />
        ) : (
          <FavoriteIcon onClick={delLike} />
        )}
        {is_session
          ? `좋아요 ${like_list[post_id]?.length}개`
          : `로그인 후 이용`}
      </Text>
    </React.Fragment>
  );
};

export default Like;
