export interface Movie {
  _id: string;
  title: string;
  year: number;
  rated?: string;
  runtime?: number;
  genres?: string[];
  directors?: string[];
  cast?: string[];
  writers?: string[];
  plot?: string;
  fullplot?: string;
  poster?: string;
  imdb?: {
    rating?: number;
    votes?: number;
    id?: number;
  };
  awards?: {
    wins?: number;
    nominations?: number;
    text?: string;
  };
  languages?: string[];
  countries?: string[];
  type?: string;
  num_mflix_comments?: number;
  released?: string;
  lastupdated?: string;
  tomatoes?: {
    viewer?: {
      rating?: number;
      numReviews?: number;
      meter?: number;
    };
    fresh?: number;
    critic?: {
      rating?: number;
      numReviews?: number;
      meter?: number;
    };
    rotten?: number;
    lastUpdated?: string;
  };
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}; 

