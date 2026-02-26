import { useQuery } from "@tanstack/react-query";
import { getGenre } from "@/services/api";

export const useGenre = () =>
  useQuery<string[]>({
    queryKey: ["genre"],
    queryFn: getGenre,
  });