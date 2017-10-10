import React, { Component } from 'react';
import Map from "./Map";
import Search from "./Search";
import CarInfo from "./CarInfo";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      positions: null,
      searchValue: '',
    };
  }

  componentDidMount = () => {
    this.fetchPositions();
    setInterval(this.fetchPositions, 60000);
  };

  fetchPositions = () => {
    const comp = this;
    fetch(
      'https://cors-anywhere.herokuapp.com/https://www.worldsolarchallenge.org/api/positions',
    ).then(function(response) {
      return response.json();
    }).then(function(json) {
      comp.setState({
        positions: json,
      });
    });
  };

  handleOnChangeSearch = (value) => {
    this.setState({
      searchValue: value,
    });
  };

  filterMapCars = () => {
    const options = this.state.positions;
    const value = this.state.searchValue;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    let filteredCars = [];

    if (inputLength === 0) {
      for (let i in options) {
        const car = options[i];
        car.visible = true;
        filteredCars.push(car);
      }
    }

    let visibleCars = [];
    for (let i in options) {
      const car = options[i];
      if (car.name.toLowerCase().slice(0, inputLength) === inputValue ||
        car.car_name.toLowerCase().slice(0, inputLength) === inputValue) {
        car.visible = true;
        visibleCars.push(car);
      } else {
        car.visible = false;
        filteredCars.push(car);
      }
    }

    // Add visible cars on the end so they always appear on top of hidden cars
    return filteredCars.concat(visibleCars);
  };

  getSelectedCar = () => {
    return this.state.positions.find((p) => p.name === this.state.searchValue);
  };

  render() {
    if (!this.state.positions) {
      return (
        <div>Loading...</div>
      );
    }

    const filteredCars = this.filterMapCars();
    const selectedCar = this.getSelectedCar();

    return (
      <div style={{width: "100vw", height: "100vh"}}>
        <Map
          positions={filteredCars}
          onClick={this.handleOnChangeSearch}
          />

        <div className="auto-suggest-container">
          <Search
            cars={this.state.positions}
            onChange={this.handleOnChangeSearch}
            value={this.state.searchValue}
            />
        </div>

        {selectedCar
          ? <CarInfo
              selectedCar={selectedCar}
              clearSelected={() => this.handleOnChangeSearch('')}
              />
          : null}
      </div>
    );
  }
}

export default App;
