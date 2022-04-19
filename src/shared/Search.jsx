import React from "react";
import _ from "lodash";

const Search = () => {
  const [text, setText] = React.useState("");

  const debounce = _.debounce((e) => {}, 1000);

  const throttle = _.throttle((e) => {}, 1000);

  const keyPress = React.useCallback(debounce, []);

  const onChange = (e) => {
    setText(e.target.value);
    keyPress(e);
  };

  return (
    <div>
      <input type="text" onChange={onChange} value={text} />
    </div>
  );
};

export default Search;
