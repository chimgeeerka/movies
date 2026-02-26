import { Router } from "express";
import { getMovies, getMovieById,getMovieGenre } from "../controllers/movieController";

const router = Router();

router.get("/", getMovies);
router.get("/genres",getMovieGenre)
router.get("/:id", getMovieById);

export default router;
