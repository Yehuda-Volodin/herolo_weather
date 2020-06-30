import React from 'react';

import {
    Nav,
    NavItem,
    NavLink,
    Container,
    Row,
    Col,
    Collapse,
    Button,
    Badge,
} from 'reactstrap';

import './Weather.css';

import Home from './Home';
import Favorites from './Favorites';

export default class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFavorites: false,
            temperatureUnit: 'Metric',
            lightTheme: true,
        };
        this.homeRef = React.createRef();
    }

    toggleTemperatureUnit = () => {
        if (this.state.temperatureUnit === 'Metric') this.setState({ temperatureUnit: 'Imperial' });
        else this.setState({ temperatureUnit: 'Metric' });
    }

    closeFavorites = () => {
        this.setState({ showFavorites: false });
    }

    resize = () => this.forceUpdate()

    componentDidMount() {
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    render() {
        return (
            <Container className={`weatherContainer ${this.state.lightTheme ? 'weatherLightTheme' : 'weatherDarkTheme'}`}>
                <Row className="justify-content-between align-items-center border-bottom mb-3" >
                    <Col xl='7' lg='6' md='5' sm='7' xs='7'>
                        <header className={`weatherHeader ${this.state.lightTheme ? 'weatherHeaderLightTheme' : 'weatherHeaderDarkTheme'}`}>
                            <h3>Herolo Weather Task </h3>
                        </header>
                    </Col>
                    <Col xl='2' lg='2' md='3' sm='4' xs='4'>
                        <Button
                            size='sm'
                            onClick={this.toggleTemperatureUnit}
                        >
                            Toggle C/F
                        </Button>
                        <Badge
                            className="ml-1"
                            color="primary"
                            pill
                            onClick={() => {
                                this.setState({ lightTheme: !this.state.lightTheme });
                            }}
                        >
                            D/L
                        </Badge>
                    </Col>
                    {window.innerWidth < 768 && <Col sm='4' xs='4' />}
                    <Nav>
                        <NavItem>
                            <NavLink
                                className="weatherNavLink"
                                onClick={this.closeFavorites}
                            >
                                Home
                            </NavLink>
                        </NavItem>
                        <NavItem >
                            <NavLink
                                className="weatherNavLink"
                                onClick={() => {
                                    this.setState({ showFavorites: true });
                                }}
                            >
                                Favorites
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Row>
                <Collapse isOpen={!this.state.showFavorites}>
                    <Home
                        ref={this.homeRef}
                        temperatureUnit={this.state.temperatureUnit}
                    />
                </Collapse>
                <Collapse isOpen={this.state.showFavorites}>
                    <Favorites
                        favoriteCities={this.homeRef.current ? this.homeRef.current.getFavoriteCities() : []}
                        closeFavorites={this.closeFavorites}
                        cityChanged={this.homeRef.current ? this.homeRef.current.cityChanged : () => { }}
                        temperatureUnit={this.state.temperatureUnit}
                    />
                </Collapse>
            </Container>
        )
    }
}