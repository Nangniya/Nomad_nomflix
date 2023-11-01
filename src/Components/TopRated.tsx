import { useQuery } from "react-query";
import { styled } from "styled-components";
import { useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IGetMoviesResult, getTopRatedMovies } from "../api";
import { makeImagePath } from "../utils";

const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 90%;
  margin: auto;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  background-image: url(${(props) => props.bgPhoto});
  font-size: 66px;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
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
const Chevron = styled.svg`
  padding: 10px;
  width: 50px;
  height: 200px;
  z-index: 2;
  opacity: 0;
  path {
    fill: white;
    stroke: white;
  }
  &:hover {
    opacity: 1;
  }
`;

const getRowVariants = (right: boolean) => ({
  hidden: {
    x: right ? window.outerWidth + 5 : -window.outerWidth - 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: right ? -window.outerWidth - 5 : window.outerWidth + 5,
  },
});

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
const offset = 6;

function TopRated() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "Latest"],
    getTopRatedMovies
  );
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const [right, setRight] = useState(true);
  const rowVariants = getRowVariants(right);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setRight(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setRight(false);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  return (
    <>
      {isLoading ? (
        <Loader>...Loading</Loader>
      ) : (
        <>
          <p style={{ marginLeft: "80px" }}>평점이 높은 작품</p>
          <Slider>
            <Chevron
              onClick={decreaseIndex}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              style={{
                background:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent)",
              }}
            >
              <motion.path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </Chevron>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "latest"}
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Chevron
              onClick={increaseIndex}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              style={{
                background:
                  "linear-gradient(to left, rgba(0, 0, 0, 0.5), transparent)",
              }}
            >
              <motion.path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
            </Chevron>
          </Slider>
        </>
      )}
    </>
  );
}
export default TopRated;
