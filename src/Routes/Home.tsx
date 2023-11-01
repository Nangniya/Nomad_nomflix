import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  IGetMovieDetail,
  IGetMoviesResult,
  getMovieDetail,
  getMovies,
  getTopRatedMovies,
  getUpComingMovies,
} from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import TopRated from "../Components/TopRated";
import UpComing from "../Components/UpComing";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Slider = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  top: -100px;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 300px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverView = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
`;

const BigRuntime = styled.span`
  background-color: black;
  border-radius: 15px;
  padding: 10px 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
`;

const Chevron = styled.svg`
  padding: 10px;
  width: 50px;
  height: 200px;
  z-index: 99;
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

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: topRatedData, isLoading: isTopRatedLoading } =
    useQuery<IGetMoviesResult>(["movies", "Latest"], getTopRatedMovies);
  const { data: upComingData, isLoading: isUpComingLoading } =
    useQuery<IGetMoviesResult>(["movies", "UpComing"], getUpComingMovies);
  const totalData = (data?.results || [])
    .concat(topRatedData?.results || [])
    .concat(upComingData?.results || []);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const { data: detailData, isLoading: isDetailLoading } =
    useQuery<IGetMovieDetail>(["movie", "detail", selectedMovieId], () =>
      getMovieDetail(selectedMovieId as number)
    );
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
    setSelectedMovieId(movieId);
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    totalData.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>...Loading</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
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
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
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
          <TopRated />
          <UpComing />
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverView>
                        {clickedMovie.overview.slice(0, 300)}...
                      </BigOverView>
                      <BigRuntime>
                        상영시간 : {detailData?.runtime} 분
                      </BigRuntime>
                      {detailData?.genres.map((genre) => (
                        <BigRuntime>{genre.name}</BigRuntime>
                      ))}
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
