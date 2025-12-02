import { environment } from "src/environments/environment"

const BASE_URL:string = environment.base_url;
const SERVER_URL:string = environment.server_url;
export const httpEndPoints={
    getTopRatedMoviesEndpoint:`${BASE_URL}/movie/top_rated`,
    getMovieDetailsEndpoint:(movieId:string)=>`${BASE_URL}/movie/${movieId}`,
    registerUserEndpoint:`${SERVER_URL}/register`,
    loginUserEndpoint:`${SERVER_URL}/login`,

}