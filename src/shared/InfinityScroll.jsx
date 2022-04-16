import _ from "lodash";
import React, { useCallback, useEffect } from "react";
import { Spinner } from "../elements";

const InfinityScroll = (props) => {
  const { children, callNext, is_next, loading } = props;
  console.log(props);
  const _handlieScroll = _.throttle(() => {
    if (loading) {
      return;
    }
    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;

    if (scrollHeight - innerHeight - scrollTop < 200) {
      // 로딩 중이면 다음 걸 부르면 안되겠죠!
      if (loading) {
        return;
      }

      callNext();
    }
  }, 300);
  // loading이 일어나는동안
  const handleScroll = useCallback(_handlieScroll, [loading]);
  useEffect(() => {
    if (loading) {
      return;
    }
    // handleScroll 1회 실행후 remove
    if (is_next) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [is_next, loading]);
  return (
    <React.Fragment>
      {props.children}
      {/* next loading 중 스피너 컴포넌트 호출 */}
      {is_next && <Spinner />}
    </React.Fragment>
  );
};

InfinityScroll.defaultProps = {
  children: null,
  callNext: () => {},
  is_next: false,
  loading: false,
};

export default InfinityScroll;
