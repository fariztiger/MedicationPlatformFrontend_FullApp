import React from 'react';
import * as API_USERS from "../patient/api/patient-api";
import * as API_PRESCRIPTIONS from "../patient/api/prescription-api"
import {PatientPrescriptions} from "./patient-prescriptions"
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import UpdatePatientInfo from "./update-patient-info";

function handleLogout() {
    localStorage.removeItem('loggedUser');
    window.location.href = "/";
}

function goToHomePage() {
    window.location.href = "/";
}

class PatientPage extends React.Component {


    constructor(props) {
        super(props);
        this.getPrescriptions = this.getPrescriptions.bind(this);
        this.getCorrectPrescriptions = this.getCorrectPrescriptions.bind(this);
        this.getPatients = this.getPatients.bind(this);
        this.getPage = this.getPage.bind(this);
        this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
        this.reload = this.reload.bind(this);
        this.state = {
            patient: {},
            patientList: [],
            error: '',
            isLoaded: false,
            errorStatus: 0,
            prescriptions: [],
            correctPrescriptions: [],
            isPrescriptionLoaded: false,
            selected: false
        };
    }

    getPrescriptions() {
        return API_PRESCRIPTIONS.getPrescriptions((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    prescriptions: result,
                    isPrescriptionLoaded: true
                });
                this.getCorrectPrescriptions();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }
    getCorrectPrescriptions() {
        const {prescriptions, patient} = this.state;
        let correctPrescriptions = [];
        for (let i = 0; i < prescriptions.length; ++i) {

            if (prescriptions[i].patient.patientId === patient.patientId) {
                correctPrescriptions.push(prescriptions[i]);
            }
        }
        this.setState({correctPrescriptions: correctPrescriptions});
        console.log(correctPrescriptions);
    }

    getPatients() {
        return API_USERS.getPatients((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    patientList: result,
                    isLoaded: true
                });
                this.getPatient();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    componentDidMount() {
        this.getPatients();
        this.getPrescriptions();
    }

    getPatient() {
        let currUser = JSON.parse(localStorage.getItem('loggedUser'));
        if (currUser !== undefined && currUser !== null) {
            const {patientList} = this.state;
            for (let i = 0; i < patientList.length; ++i) {
                if (patientList[i].user.username === currUser.username) {
                    this.setState({patient: patientList[i]});
                }
            }
        }
    }

    toggleUpdateForm() {
        this.setState({selected: !this.state.selected});
    }

    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
    }

    getPage() {
        const user = JSON.parse(localStorage.getItem('loggedUser'));
        if (user !== null && user !== undefined && user.role === 'PATIENT') {
            const {patient, correctPrescriptions} = this.state;
            const prescriptionContent = correctPrescriptions.map((prescription) => {
                return (
                    <PatientPrescriptions prescription={prescription}/>
                )
            });
            return (
                <div>
                    <div>
                        <h2 style={{marginLeft: '10px'}}>Prescriptions for {patient.name}

                            <button className='btn btn-dark btn-sm' style={{marginRight:'10px', marginTop:'10px', float: 'right'}}
                                             onClick={handleLogout}> Logout
                            </button>

                            <button className='btn btn-dark btn-sm' style={{marginRight:'10px', marginTop:'10px', float: 'right'}}
                                    onClick={this.toggleUpdateForm}> Edit information
                            </button>
                        </h2>
                        {correctPrescriptions.length !== 0 ? prescriptionContent : "No prescriptions for you"}
                    </div>

                    <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                           className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggleUpdateForm}> My information </ModalHeader>
                        <ModalBody>
                            <UpdatePatientInfo patient={patient} reloadHandler={this.reload}/>
                        </ModalBody>
                    </Modal>

                </div>

            )
        } else {
            return (
            <div style={{margin: "auto"}}>
                <div className="card-body">
                    <h5 className="card-title font-weight-bold">Access denied!</h5>
                    <p className="card-text">You do not have access to this page, as your role needs to be PATIENT.</p>
                    <p className="card-text"><small className="font-italic">Press "Return" to return to the homepage.</small></p>
                </div>
                <button className={"btn btn-lg btn-danger"} style={{float:'right', marginTop:'10px', marginRight:'10px'}} onClick={goToHomePage}> Return </button>
            </div> );
        }
    }

    render() {
        return this.getPage();
    }
}


export default PatientPage;
