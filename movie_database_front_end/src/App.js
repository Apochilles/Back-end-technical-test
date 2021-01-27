import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  state = {
    movies: [],
  };
  componentDidMount() {
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
        this.setState({ movies: newArray });
        console.log(this.state.movies);
      })
      .catch(console.log);
  }
  render() {
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
