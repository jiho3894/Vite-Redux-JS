import styled from "styled-components";

const CategoryType = (props) => {
  const { category } = props;
  if (category === "A") {
    return <AType>{props.children}</AType>;
  }

  if (category === "B") {
    return <BType>{props.children}</BType>;
  }

  if (category === "C") {
    return <CType>{props.children}</CType>;
  }
};

export default CategoryType;

const AType = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const BType = styled.div``;

const CType = styled.div`
  display: flex;
`;
