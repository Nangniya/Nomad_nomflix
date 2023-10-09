import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  IGetLatestMovieResult,
  IGetLatestTvResult,
  getLatestMovie,
  getLatestTv,
} from "../api";
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
  width: 300px;
  background-image: url(${(props) => props.bgPhoto});
  font-size: 66px;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  transform-origin: center left;
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

function LatestTv() {
  const { data, isLoading } = useQuery<IGetLatestTvResult>(
    ["tv", "Latest"],
    getLatestTv
  );

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
            bgPhoto={makeImagePath(data?.backdrop_path || "", "w500")}
            variants={boxVariants}
            whileHover="hover"
            initial="normal"
            transition={{ type: "tween" }}
          >
            <Info variants={infoVariants}>
              <h4>{data?.name}</h4>
            </Info>
          </Box>
        </>
      )}
    </>
  );
}
export default LatestTv;
