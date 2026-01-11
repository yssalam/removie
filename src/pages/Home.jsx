import '../App.css';
import { getMoviesList, searchMovies } from '../api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchQuery.length > 3) {
                search(searchQuery);
            } else {
                setIsSearch(false);
                setIsLoading(true);
                getMoviesList().then((results) => {
                    setPopularMovies(results);
                    setIsLoading(false);
                });
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [searchQuery]);

    const search = async (q) => {
        setIsSearch(true);
        setIsLoading(true);

        const results = await searchMovies(q);
        setPopularMovies(results);

        setIsLoading(false);
    };

    const SkeletonCard = () => (
        <div className="Movie-wrapper skeleton">
            <div className="Skeleton-image" />
            <div className="Skeleton-title" />
            <div className="Skeleton-date" />
        </div>
    );

    const navigate = useNavigate();


    return (
        <div className="App">
            <header className="App-header">
                <h1>RE . MOVIE</h1>

                <input
                    placeholder="Cari Film"
                    className="Movie-search"
                    onChange={({ target }) => setSearchQuery(target.value)}
                />

                <div className="Movie-container">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : popularMovies.length > 0 ? (
                        popularMovies.map((movie) => (
                            <div
                                className="Movie-wrapper"
                                onClick={() => navigate(`/movie/${movie.id}`)}
                            >
                    <div className="Movie-rate">
                        ⭐ {movie.vote_average.toFixed(1)}
                    </div>

                    <img
                        className="Movie-image"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />

                    <div className="Movie-title">{movie.title}</div>
                    <div className="Movie-date">
                        Release {movie.release_date}
                    </div>
                </div>
                ))
                ) : isSearch ? (
                <div className="Empty-state">
                    <span className="Empty-icon">🎬</span>
                    <p>Tidak ada film</p>
                    <small>Coba kata kunci lain</small>
                </div>
                    ) : null}
        </div>
            </header >
        </div >
    );
};

export default App;
