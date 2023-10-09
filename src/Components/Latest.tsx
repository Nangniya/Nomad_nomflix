import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { IGetLatestMovieResult, getLatestMovie } from "../api";
import { makeImagePath } from "../utils";

const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  width: 200px;
  background-image: url(${(props) => props.bgPhoto});
  font-size: 66px;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

function Latest() {
  const { data, isLoading } = useQuery<IGetLatestMovieResult>(
    ["movie", "Latest"],
    getLatestMovie
  );
  console.log(data);

  return (
    <>
      {isLoading ? (
        <Loader>...Loading</Loader>
      ) : (
        <>
          <p>최신 상영작</p>
          <Box
            layoutId={data?.id + ""}
            key={data?.id}
            bgPhoto={makeImagePath(data?.poster_path || "")}
            variants={boxVariants}
            whileHover="hover"
            initial="normal"
            transition={{ type: "tween" }}
          >
            <Info variants={infoVariants}>
              <h4>{data?.title}</h4>
            </Info>
          </Box>
        </>
      )}
    </>
  );
}
export default Latest;
