import React from 'react';

import BackgroundImg from '../commons/images/medicine.jpg';

import {Container, Jumbotron} from 'reactstrap';

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundColor: 'white',
    backgroundSize: 'null',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "900px",
    backgroundImage: `url(${BackgroundImg})`
};
const textStyle = {color: 'black'};

class Home extends React.Component {

    render() {

        return (

            <div>
                <Jumbotron fluid style={backgroundStyle}>
                    <Container fluid style={{float:'center'}}>
                        <h1 className="display-4" style={textStyle}>Integrated Medical Monitoring Platform for Home-care assistance</h1>
                        <p className="lead" style={textStyle}> <b>Enabling real time monitoring of patients, remote-assisted care services and
                            smart intake mechanism for prescribed medication.</b> </p>

                        <hr className="my-2"/>
                        <p  style={textStyle}> <b>This assignment represents the first module of the distributed software system "Integrated
                            Medical Monitoring Platform for Home-care assistance that represents the final project
                            for the Distributed Systems course. </b> </p>
                        <p style={{float:'right'}} className="lead">
                            For more information, <a className={"font-weight-bold"} href={"/login"}> login </a> or <a className={"font-weight-bold"} href={"/register"}> register </a>.

                        </p>
                    </Container>
                </Jumbotron>

            </div>
        )
    };
}

export default Home
