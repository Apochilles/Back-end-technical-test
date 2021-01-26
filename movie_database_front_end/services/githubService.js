import axios from "axios";
import { axiosGetCancellable } from "../helpers/axios.helper";

const axiosConfig = {
  baseURL: "https://spxc62p1r2.execute-api.ap-southeast-2.amazonaws.com/dev/films/",
};

function searchRepos(searchText, language) {
  const query = language ? `${searchText}+language:${language}` : searchText;

  if (isServer()) {
    return axios.get(
      `search/films?q=${query}order=desc`,
      axiosConfig
    );
  }

  return axiosGetCancellable(`api/search?q=${query}&sort=stars&order=desc`);
}

function isServer() {
  return typeof window === "undefined";
}

export { searchRepos };
