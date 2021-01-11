import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavigationBar from './navigation-bar'
import Home from './home/home';
import DoctorContainer from "./patient/doctor-container";

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import LoginPage from "./login/login";
import CaregiverContainer from "./caregiver/caregiver-container";
import PatientPage from "./patient_component/patient";
import RegisterContainer from "./register/register-container";

class App extends React.Component {

    render() {

        return (
            <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Home/>}
                        />

                        <Route
                            exact
                            path='/patient'
                            render={() => <PatientPage/>}
                        />

                        <Route
                            exact
                            path='/doctor'
                            render={() => <DoctorContainer/>}
                        />

                        <Route
                            exact
                            path='/login'
                            render={() => <LoginPage/>}
                        />

                        <Route
                            exact
                            path='/caregiver'
                            render={() => <CaregiverContainer/>}
                        />

                        <Route
                        exact
                        path='/register'
                        render={() => <RegisterContainer/>}
                        />

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App
