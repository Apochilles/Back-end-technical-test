import React, { Component } from "react";
import axios from "axios";

function sortByPrice(a, b) {
  if (a.price > b.price) {
    return -1;
  } else return 1;
}

class App extends Component {
  state = {
    movies: [],
    err: null,
    isLoading: true,
  };
  componentDidMount() {
    this.setState({ isLoading: true });
    Promise.all([
      axios.get(
        "https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/cinemaworld/movies/"
      ),

      axios.get(
        "https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/filmworld/movies/"
      ),
    ])
      .then((responseArray) => {
        const newArray = [...responseArray[0].data, ...responseArray[1].data];
        newArray.sort(sortByPrice);
        this.setState({ movies: newArray, isLoading: false });

        console.log(this.state.movies);
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          err,
        });
      });
  }

  render() {
    let { movies, err, isLoading } = this.state;
    if (err) {
      // Here you can either render error message or Error component
      // In this example, I have used message
      return <div> {"Movies are unavalible: " + err.message} </div>;
    }
    if (isLoading) {
      return <div> Loading... </div>;
    }
    return (
      <div className="container">
        <div className="col-xs-12">
          <h1>Movies</h1>
          {this.state.movies.map((movie) => (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <h5 className="card-title">${movie.price}</h5>
                <h5 className="card-title">{movie.body}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default App;
