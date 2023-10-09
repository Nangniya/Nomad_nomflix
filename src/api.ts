const API_KEY = "ee9c7beff338a515a2965667c7ac4c3d";
const BASE_PATH = "https://api.themoviedb.org/3/";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export interface IGetLatestMovieResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetLatestTvResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}
export function getLatestMovie() {
  return fetch(`
  ${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getUpComingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

interface ITV {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvsResult {
  page: number;
  results: ITV[];
}

export function getTvs() {
  return fetch(`
  ${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRatedTvs() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularTvs() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getLatestTv() {
  return fetch(`
  ${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getMovieDetail(movieId: number) {
  return fetch(`
  ${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export interface IGetMovieDetail {
  release_date: string;
  runtime: number;
  genres: {
    name: string;
  }[];
}

export function GetSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?query=${keyword}&api_key=${API_KEY}`
  ).then((response) => response.json());
}
interface ISearch {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetSearchResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}
