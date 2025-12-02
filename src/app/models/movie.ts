export interface MovieGenreModel {
  id: number;
  name: string;
}
export interface MovieDetailsModel {
  adult: boolean;
  backdrop_path: string | null;
  genres:MovieGenreModel[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MoviesResponseModel {
  page: number;
  results: MovieDetailsModel[];
  total_pages: number;
  total_results: number;
}
