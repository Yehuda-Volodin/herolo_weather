import React from 'react';

import {
    Card,
    CardText,
    CardBody,
    CardTitle,
    CardHeader,
} from 'reactstrap';

import './Weather.css';

export default class WeatherCard extends React.Component {
    render() {
        return (
            <Card className="text-center text-light" color={this.props.cityName ? "primary" : "info"} >
                {this.props.cityName
                    && <CardHeader className="font-weight-bold">
                        {this.props.cityName}
                    </CardHeader>
                }
                <CardBody>
                    {this.props.showDate && this.props.weather
                        && <CardTitle>
                            {this.props.weather.LocalObservationDateTime.split('T', 1)[0]}
                        </CardTitle>
                    }
                    {this.props.showDate && this.props.day
                        && <CardTitle>
                            {this.props.day.Date.split('T', 1)[0]}
                        </CardTitle>
                    }

                    {this.props.weather
                        && <CardTitle className="mt-2">
                            {this.props.weather.Temperature[this.props.temperatureUnit].Value + " "
                                + this.props.weather.Temperature[this.props.temperatureUnit].Unit}
                        </CardTitle>
                    }
                    {this.props.day
                        && <CardTitle>
                            {this.props.day.Temperature.Minimum.Value + " " + this.props.day.Temperature.Minimum.Unit + " - "
                                + this.props.day.Temperature.Maximum.Value + " " + this.props.day.Temperature.Maximum.Unit}
                        </CardTitle>
                    }

                    {this.props.showWeatherText && this.props.weather
                        && <CardText className="favoritesWeatherText">
                            {this.props.weather.WeatherText}
                        </CardText>
                    }
                </CardBody>
            </Card>
        )
    }
}