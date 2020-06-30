import React from 'react';
import ReactDOM from 'react-dom'

import {
    Container,
    Row,
    Col,
    Button,
    Input,
    Label,
    UncontrolledTooltip,
} from 'reactstrap';

import './Weather.css';

import WeatherCard from './WeatherCard';

import icon_favorite_empty from './icon_favorite_empty.png';
import icon_favorite_filled from './icon_favorite_filled.png';

import axios from "axios";


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCity: {},
            dailyForecasts: [],
            favoriteCities: [],
            countryName: 'Israel',
        };
        this.homeRefs = {};
    }

    countryChanged = (e) => {
        let countryNameTyped = e.target.value;
        // only english characters and space and dash RegEx
        let reg = /^[a-zA-Z -]+$/;
        if (reg.test(countryNameTyped)) {
            this.setState({ countryName: countryNameTyped }, () => {
                const cityNameTyped = ReactDOM.findDOMNode(this.homeRefs.cityInput).value;
                if (cityNameTyped) this.cityChanged({ target: { value: cityNameTyped } });
            });
        }
    }

    cityChanged = (e, newCityName) => {
        if (newCityName) ReactDOM.findDOMNode(this.homeRefs.cityInput).value = newCityName;

        let cityKey = undefined;
        let cityNameTyped = e.target.value;
        const apiKey = "bdWkVvotYK2MLmLZjk3JHIujQpjWHNEt";
        // only english characters and space and dash RegEx
        let reg = /^[a-zA-Z -]+$/;
        if (reg.test(cityNameTyped)) {
            axios.get('https://dataservice.accuweather.com/locations/v1/cities/autocomplete',
                {
                    params: {
                        // q - City Name
                        q: cityNameTyped,
                        apikey: apiKey,
                    }
                }
            ).then(res => {
                let filteredCities = res.data.filter(element => element.Country.LocalizedName === this.state.countryName /*'Israel'*/);
                if (filteredCities.length === 1) {
                    cityKey = filteredCities[0].Key;
                    const cityNameFound = filteredCities[0].LocalizedName;
                    axios.get(`https://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${apiKey}`)
                        .then(res => {
                            this.setState({
                                selectedCity: {
                                    id: cityKey,
                                    cityName: cityNameFound,
                                    weather: res.data[0],
                                }
                            });
                        })
                        .catch((err) => {
                            alert(err);
                        })

                    let metric = this.props.temperatureUnit === 'Metric' ? true : false;
                    axios.get(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${apiKey}&language=en&metric=${metric}`)
                        .then(res => {
                            this.setState({ dailyForecasts: res.data.DailyForecasts });
                        })
                        .catch((err) => {
                            alert(err);
                        })
                }
            })
                .catch((err) => {
                    alert(err);
                })
        }
    }

    favoriteButtonClicked = () => {
        let newFavoriteCities = this.state.favoriteCities.concat([{
            ...this.state.selectedCity,
        }]);
        this.setState({ favoriteCities: newFavoriteCities });
    }

    removeFromFavoritesButtonClicked = () => {
        let newFavoriteCities = this.state.favoriteCities.filter(element => element.id !== this.state.selectedCity.id)
        this.setState({ favoriteCities: newFavoriteCities });
    }

    isFavoritesIncludeCity = () => {
        let findCityResult = this.state.favoriteCities.find(element => {
            if (element.cityName === this.state.selectedCity.cityName) return true
            else return false
        });
        return findCityResult
    }

    getFavoriteCities = () => {
        return this.state.favoriteCities
    }

    componentDidMount() {
        this.cityChanged({ target: { value: "Tel Aviv" } });
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                const latLonText = position.coords.latitude + ',' + position.coords.longitude;
                axios.get('https://dataservice.accuweather.com/locations/v1/cities/geoposition/search', {
                    params: {
                        // q - a comma-separated lat/lon pair: "lat,lon"
                        q: latLonText,
                        apikey: 'bdWkVvotYK2MLmLZjk3JHIujQpjWHNEt',
                        toplevel: true,
                    }
                })
                    .then(res => {
                        const countryNameLocated = res.data.Country.LocalizedName;
                        const cityNameLocated = res.data.LocalizedName;

                        ReactDOM.findDOMNode(this.homeRefs.countryInput).value = countryNameLocated;
                        this.countryChanged({ target: { value: countryNameLocated } })

                        ReactDOM.findDOMNode(this.homeRefs.cityInput).value = cityNameLocated;
                        this.cityChanged({ target: { value: cityNameLocated } })
                    })
                    .catch((err) => {
                        alert(err);
                    })
            })
        }
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        Home
                    </Col>
                </Row>
                <Row className="justify-content-center mt-2 mb-3">
                    <Label for="countryInput" sm='2' >
                        Country:
                    </Label>
                    <Col sm='4'>
                        <UncontrolledTooltip placement="right" target="countryInput" >
                            Attention! Make sure to type a correct country Localized Name.
                            For example: "United States" - correct, "US" - not correct.
                        </UncontrolledTooltip>
                        <Input
                            id="countryInput"
                            ref={(input) => { this.homeRefs.countryInput = input }}
                            value={this.state.countryName}
                            onChange={this.countryChanged}
                        />
                    </Col>
                    <Label for="cityInput" sm='2'>
                        City:
                        </Label>
                    <Col sm='4'>
                        <Input
                            id='cityInput'
                            ref={(input) => { this.homeRefs.cityInput = input }}
                            defaultValue="Tel Aviv"
                            onChange={this.cityChanged}
                        />
                    </Col>
                </Row>

                <Container className="border rounded pl-4 pr-4 pt-4 pb-4">
                    {this.state.selectedCity.weather &&
                        <Row className="align-items-center justify-content-between">
                            <Col xl='2' lg='2' md='3' sm='3' xs='4'>
                                <WeatherCard
                                    {...this.state.selectedCity}
                                    temperatureUnit={this.props.temperatureUnit}
                                />
                            </Col>
                            <Col xl='6' lg='6' md='4' sm='4' xs='1' />
                            <Col xl='2' lg='2' md='2' sm='2' xs='3' className="text-center">
                                <img
                                    alt={this.isFavoritesIncludeCity() ? "Favorite" : "Not Favorite"}
                                    src={this.isFavoritesIncludeCity() ? icon_favorite_filled : icon_favorite_empty}
                                    width="64"
                                    height="64"
                                />
                            </Col>
                            <Col xl='2' lg='2' md='3' sm='3' xs='3'>
                                {this.isFavoritesIncludeCity() ?
                                    <Button
                                        color={"danger"}
                                        onClick={this.removeFromFavoritesButtonClicked}
                                    >
                                        Remove from Favorites
                                    </Button>
                                    :
                                    <Button
                                        color={"warning"}
                                        onClick={this.favoriteButtonClicked}
                                    >
                                        Add to Favorites
                                    </Button>
                                }
                            </Col>
                        </Row>
                    }
                    {this.state.selectedCity.weather &&
                        <Row className="justify-content-center mt-5 mb-5 text-center font-weight-bold text-success homeWeatherText">
                            <Col sm='8'>
                                {this.state.selectedCity.weather.WeatherText}
                            </Col>
                        </Row>
                    }
                    <Row className="justify-content-center">
                        {this.state.dailyForecasts.map((day, index) => {
                            return <Col className="mb-1" xl='2' lg='3' md='4' sm='5' xs='6' key={index} >
                                <WeatherCard
                                    day={day}
                                    showDate={true}
                                    temperatureUnit={this.props.temperatureUnit}
                                />
                            </Col>
                        })
                        }
                    </Row>
                </Container>
            </>
        )
    }
}