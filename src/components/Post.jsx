import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid, Image, Text, Button } from "../elements";

import { history } from "../redux/configureStore";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as likeActions } from "../redux/modules/like";
import CategoryType from "../elements/CateGoryType";
import Like from "./Like";

const Post = React.memo((props) => {
  const { category } = props;
  const post_id = props.id;
  const disPatch = useDispatch();
  // console.log(props.is_me); 본인인지 확인하기
  // console.log(props.like_cnt);
  // console.log(props.id);
  const deletePost = () => {
    confirm("삭제하시겠습니까?") == true
      ? disPatch(postActions.delPostFB(props.id))
      : false;
  };
  useEffect(() => {
    disPatch(likeActions.getLikeFB(post_id));
  }, []);

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid width="auto">
            {/* 이 부분 이 후에 user_profile 추가할때 변경 해야함 */}
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {/* 본인이 true이면 수정 버튼으로 가는 버튼 생성 */}
            {props.is_me && (
              <React.Fragment>
                <Button
                  width="auto"
                  margin="4px"
                  padding="4px"
                  _onClick={() => {
                    history.push(`/write/${props.id}`);
                  }}
                >
                  수정
                </Button>
                <Button
                  width="auto"
                  margin="4px"
                  padding="4px"
                  _onClick={deletePost}
                >
                  삭제
                </Button>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
        <CategoryType category={category}>
          <Grid padding="16px">
            <Text bold>
              <span>{props.contents}</span>
            </Text>
          </Grid>
          <Grid>
            <Image shape="rectangle" src={props.image_url} />
          </Grid>
        </CategoryType>
        <Grid padding="16px" is_flex>
          <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text>
          <Text margin="0px" bold>
            좋아요 {props.like_cnt}개
          </Text>
          {history.location.pathname === "/" ? "" : <Like post_id={post_id} />}
        </Grid>
      </Grid>
    </React.Fragment>
  );
});

Post.defaultProps = {
  user_info: {
    user_name: "jiho",
  },
  image_url:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXIZ5TkLzY7zdURZgU2u172GrUwhjTosxfkg&usqp=CAU",
  contents: "니코네요!",
  comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
  is_me: false,
};

export default Post;
