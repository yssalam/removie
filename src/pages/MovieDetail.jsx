
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const apikey = process.env.REACT_APP_APIKEY;
const baseurl = process.env.REACT_APP_BASEURL;

const MovieDetail = () => {
 
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setIsLoading(true);

        const detailRes = await axios.get(
          `${baseurl}/movie/${id}?api_key=${apikey}`
        );

        const videoRes = await axios.get(
          `${baseurl}/movie/${id}/videos?api_key=${apikey}`
        );

        const trailerData = videoRes.data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );

        setMovie(detailRes.data);
        setTrailer(trailerData);
      } catch (error) {
        console.error("Error fetch movie detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);


  const DetailSkeleton = () => (
    <div className="Detail-container">
      <div className="Detail-skeleton-poster skeleton-box" />
      <div className="Detail-info">
        <div className="skeleton-line title" />
        <div className="skeleton-line subtitle" />
        <div className="skeleton-line meta" />
        <div className="skeleton-line paragraph" />
        <div className="skeleton-line paragraph" />
      </div>
    </div>
  );

 
  if (isLoading || !movie) return <DetailSkeleton />;

 
  return (
    <div className="Detail-container">
      <button className="Back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <img
        className="Detail-poster"
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />

      <div className="Detail-info">
        <h1>{movie.title}</h1>

        {movie.tagline && (
          <p className="Detail-tagline">“{movie.tagline}”</p>
        )}

        <div className="Detail-meta">
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
          <span>⏱️ {movie.runtime} mins</span>
          <span>📆 {movie.release_date}</span>
        </div>

        <p className="Detail-overview">{movie.overview}</p>

        {trailer ? (
          <div className="Detail-trailer">
            <h2>Trailer</h2>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Movie Trailer"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="No-trailer">No trailer available.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
