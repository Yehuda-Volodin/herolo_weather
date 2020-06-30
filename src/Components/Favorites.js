import React from 'react';

import {
    Row,
    Col,
} from 'reactstrap';

import WeatherCard from './WeatherCard';

export default class Favorites extends React.Component {
    render() {
        let favoriteCities = this.props.favoriteCities;

        return (
            <>
                <Row>
                    <Col>
                        Favorites
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    {favoriteCities.map((city, index) => {
                        return (
                            <Col
                                xl='2' lg='2' md='3' sm='3' xs='4'
                                key={index}
                                onClick={() => {
                                    this.props.closeFavorites();
                                    this.props.cityChanged({ target: { value: city.cityName } }, city.cityName);
                                }}
                            >
                                <WeatherCard
                                    {...city}
                                    temperatureUnit={this.props.temperatureUnit}
                                />
                            </Col>
                        )
                    })
                    }
                </Row>
            </>
        )
    }
}