import React from "react";

import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";

import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PostWrite from "../pages/PostWrite";
import PostDetail from "../pages/PostDetail";
import Notification from "../pages/Notification";

import Header from "../components/Header";
import { Grid, Button } from "../elements";
import Permit from "./Permit";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { apiKey } from "./firebase";
import { Container } from "@mui/material";

function App() {
  const dispatch = useDispatch();

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  React.useEffect(() => {
    if (is_session) {
      // session 이 존재하면 즉, 로그인 했을때 header 등 여러가지 컨트롤용
      //
      dispatch(userActions.loginCheckFB());
    }
  }, []);

  return (
    <React.Fragment>
      <Container>
        <Grid>
          <Header></Header>
          <ConnectedRouter history={history}>
            <Route path="/" exact component={PostList} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/write" exact component={PostWrite} />
            <Route path="/write/:id" exact component={PostWrite} />
            <Route path="/post/:id" exact component={PostDetail} />
            <Route path="/noti" exact component={Notification} />
          </ConnectedRouter>
        </Grid>
        <Permit>
          <Button
            is_float
            text="+"
            _onClick={() => {
              history.push("/write");
            }}
          ></Button>
        </Permit>
      </Container>
    </React.Fragment>
  );
}

export default App;
