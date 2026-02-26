import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Film } from "lucide-react";
import { useMovies } from "@/modules/movies/hooks/useMovies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MovieCard } from "./MovieCard";
import { MovieCardSkeleton } from "./MovieCardSkeleton";
import {useGenre} from "../hooks/useGenres"


const MoviesView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? ""
  );

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const selectedGenre = searchParams.get("genre") ?? "";

  const { data, isLoading, isError, refetch } = useMovies({
    page,
    limit: 20,
    search: search || undefined,
    genre: selectedGenre || undefined
  });
const {
  data: genres,
  isLoading: genreLoading,
} = useGenre(); 
  const movies = data?.movies ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleSearch = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, page: "1" });
  };

  const handleGenreSelect = (genre: string) => {
    const newGenre = selectedGenre === genre ? "" : genre;
    setSearchParams({ search, genre: newGenre, page: "1" });
  };
  if(genreLoading) {

    return <div>
      loadin 
    </div>
  }

  // console.log(genres)
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <Film className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">Movies</span>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          {total > 0 && (
            <span className="text-muted-foreground text-sm ml-auto hidden md:block">
              {total.toLocaleString()} movies
            </span>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={!selectedGenre ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchParams({ search, page: "1" })}
            className="rounded-full text-xs"
          >
            All
          </Button>
          {genres.map(genre => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreSelect(genre)}
              className="rounded-full text-xs"
            >
              {genre}
            </Button>
          ))}
        </div>

        {(search || selectedGenre) && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <span>Showing results for:</span>
            {search && <Badge variant="secondary">"{search}"</Badge>}
            {selectedGenre && (
              <Badge variant="secondary">{selectedGenre}</Badge>
            )}
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 ml-1"
              onClick={() => {
                setSearchInput("");
                setSearchParams({ page: "1" });
              }}
            >
              Clear all
            </Button>
          </div>
        )}

        {isError && (
          <div className="border border-destructive/50 text-destructive rounded-lg p-6 text-center mb-6">
            <p className="font-medium">
              Failed to load movies. Make sure the backend server is running.
            </p>
            <Button
              variant="destructive"
              onClick={() => refetch()}
              className="mt-3"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: 20 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))
            : movies.map(movie => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onClick={() => navigate(`/movies/${movie._id}`)}
                />
              ))}
        </div>

        {!isLoading && !isError && movies.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Film className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No movies found</p>
            <p className="text-sm mt-1">
              Try a different search or genre filter.
            </p>
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() =>
                setSearchParams({
                  search,
                  genre: selectedGenre,
                  page: String(page - 1)
                })
              }
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setSearchParams({
                  search,
                  genre: selectedGenre,
                  page: String(page + 1)
                })
              }
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export { MoviesView };
