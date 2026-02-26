import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  Clock,
  Film,
  Trophy,
  Users,
  Pen,
  Video
} from "lucide-react";
import { useMovie } from "@/modules/movies/hooks/useMovie";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const DetailSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-24 mb-8" />
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-full md:w-64 h-96 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    </div>
  </div>
);

const InfoRow = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <div className="flex items-start gap-1.5 text-muted-foreground w-28 flex-shrink-0">
        {icon}
        <span>{label}</span>
      </div>
      <p className="flex-1">{value}</p>
    </div>
  );
};

const MovieDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const { data: movie, isLoading, isError } = useMovie(id ?? "");


if (isLoading) return <DetailSkeleton />;

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
        <div>
          <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-destructive text-lg font-medium mb-2">
            {isError ? "Failed to load movie details." : "Movie not found"}
          </p>
          <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-2">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
      </div>

      <main className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="w-full md:w-64 h-80 md:h-96 bg-muted rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
              {movie.poster && !imgError ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Film className="w-20 h-20 text-muted-foreground" />
              )}
            </div>

            {movie.imdb?.rating && (
              <div className="mt-4 border rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-3xl font-bold">{movie.imdb.rating}</span>
                  <span className="text-muted-foreground text-sm self-end mb-1">/10</span>
                </div>
                <p className="text-muted-foreground text-xs">IMDb Rating</p>
                {movie.imdb.votes && (
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {movie.imdb.votes.toLocaleString()} votes
                  </p>
                )}
              </div>
            )}

            {movie.awards?.text && (
              <div className="mt-4 border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold">Awards</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {movie.awards.text}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                {movie.year && <span>{movie.year}</span>}
                {runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {runtime}
                  </span>
                )}
                {movie.rated && (
                  <span className="border px-2 py-0.5 rounded text-xs font-medium">
                    {movie.rated}
                  </span>
                )}
              </div>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(g => (
                  <Badge key={g} variant="secondary">{g}</Badge>
                ))}
              </div>
            )}

            {(movie.fullplot || movie.plot) && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Plot
                </h2>
                <p className="leading-relaxed text-sm">
                  {movie.fullplot || movie.plot}
                </p>
              </div>
            )}

            <div className="space-y-3 pt-2 border-t">
              <InfoRow
                icon={<Video className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                label="Director"
                value={movie.directors?.join(", ") ?? ""}
              />
              <InfoRow
                icon={<Users className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                label="Cast"
                value={movie.cast?.slice(0, 6).join(", ") ?? ""}
              />
              <InfoRow
                icon={<Pen className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                label="Writers"
                value={movie.writers?.slice(0, 4).join(", ") ?? ""}
              />
            </div>

            {movie.languages?.length || movie.countries?.length ? (
              <div className="flex flex-wrap gap-6 pt-2 border-t text-sm">
                {movie.languages && movie.languages.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                      Language
                    </span>
                    <span>{movie.languages.join(", ")}</span>
                  </div>
                )}
                {movie.countries && movie.countries.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                      Country
                    </span>
                    <span>{movie.countries.join(", ")}</span>
                  </div>
                )}
              </div>
            ) : null}

            {movie.tomatoes?.viewer?.rating && (
              <div className="pt-2 border-t">
                <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">
                  Rotten Tomatoes Audience
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍅</span>
                  <span className="text-lg font-semibold">
                    {movie.tomatoes.viewer.rating}/5
                  </span>
                  {movie.tomatoes.viewer.numReviews && (
                    <span className="text-muted-foreground text-sm">
                      ({movie.tomatoes.viewer.numReviews.toLocaleString()} reviews)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export { MovieDetailView };
