import React from 'react';
import * as API_USERS from "../patient/api/caregiver-api";
import * as API_PATIENTS from "../patient/api/patient-api";
import * as API_PRESCRIPTIONS from "../patient/api/prescription-api";
import {CardHeader, Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import Input from "reactstrap/es/Input";
import validate from "../patient/components/validators/validators";
import {HOST} from "../commons/hosts";
import Select from "react-select";
import PatientForm from "../patient/components/patient-form";
import PrescriptionForm from "../patient/components/prescription-form";
import {PatientPrescriptions} from "../patient_component/patient-prescriptions";

function handleLogout() {
    localStorage.removeItem('loggedUser');
    window.location.href = "/";
}

function goToHomePage() {
    window.location.href = "/";
}

class CaregiverContainer extends React.Component {

    constructor(props) {
        super(props);
        this.getCaregiverUpdateForm = this.getCaregiverUpdateForm.bind(this);
        this.fetchPrescriptions = this.fetchPrescriptions.bind(this);
        this.toggleFormUC = this.toggleFormUC.bind(this);
        this.togglePrescriptionForm = this.togglePrescriptionForm.bind(this);
        this.handleCaregiverUpdateChange = this.handleCaregiverUpdateChange.bind(this);
        this.handleCaregiverUpdate = this.handleCaregiverUpdate.bind(this);
        this.getPage = this.getPage.bind(this);
        this.changeText = this.changeText.bind(this);
        //this.getPrescriptionsForPatient = this.getPrescriptionsForPatient.bind(this);
        this.state = {
            caregiver: {},
            caregiverList: [],
            error: '',
            isLoaded: false,
            errorStatus: 0,
            patients: [],
            patient: {},
            patientList: [],
            prescriptionList: [],
            isPatientLoaded: false,
            isPrescriptionLoaded: false,
            selected_c_update: false,
            selected_p: false,
            updateCaregiverFormIsValid: true,
            selectedPatient: {},
            correctPrescriptions: [],
            textValue: 'Here you will see the selected patient\'s prescriptions',
            formControlsCaregiverUpdate: {
                caregiverId: {
                    placeholder: 'ID...',
                    touched: true,
                    valid: true
                },
                name: {
                    placeholder: 'Name...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3
                    }
                },
                address: {
                    placeholder: 'Cluj, Zorilor, Str. Lalelelor 21...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3
                    }
                },
                birthDate: {
                    type: "date",
                    placeholder: 'Birth Date...',
                    valid: true,
                    touched: true,
                    validationRules:{
                        isRequired: true
                    }
                }
            },
        };
    }

    fetchPrescriptions() {
        return API_PRESCRIPTIONS.getPrescriptions((result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    prescriptionList: result,
                    isPrescriptionLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

   /* getPrescriptionsForPatient() {
        const {selectedPatient} = this.state;
        const {prescriptionList} = this.state;
        let correctPrescriptions = [];
        for (let i = 0; i < prescriptionList.length; ++i) {

            if (prescriptionList[i].patient.patientId === selectedPatient.value) {
                correctPrescriptions.push(prescriptionList[i]);
            }
        }
        this.setState({correctPrescriptions: correctPrescriptions});
        console.log(correctPrescriptions);
    }*/

    handleSelection = selectedPatient => {
        this.setState({selectedPatient});
        const {prescriptionList} = this.state;
        let correctPrescriptions = [];
        for (let i = 0; i < prescriptionList.length; ++i) {

            if (prescriptionList[i].patient.patientId === selectedPatient.value) {
                correctPrescriptions.push(prescriptionList[i]);
            }
        }
        this.setState({correctPrescriptions: correctPrescriptions});
        console.log(correctPrescriptions);
    };

    togglePrescriptionForm() {
        this.setState({selected_p: !this.state.selected_p})
    }

    changeText() {
        const {correctPrescriptions} = this.state;
        //console.log(prescriptions);

        this.setState({textValue: JSON.stringify(correctPrescriptions, null, 2)});
    }


    getPage() {
        const user = JSON.parse(localStorage.getItem('loggedUser'));
        const {patientList, selectedPatient, correctPrescriptions} = this.state;
        const patientElements = this.state.patientList.map( (patient) => ({
            value: patient.patientId,
            label: patient.name
        }));
        if (user !== null && user !== undefined && user.role === 'CAREGIVER') {
            const prescriptionContent = correctPrescriptions.map((prescription) => {
                return (
                    <PatientPrescriptions prescription={prescription}/>
                )
            });
            return (
                <div>
                    <CardHeader>
                        <strong> Patient Management
                            <button className='btn btn-dark btn-sm' style={{marginLeft:'10px', float: 'right'}}
                                    onClick={handleLogout}> Logout
                            </button>
                            <button className='btn btn-dark btn-sm' style={{float: 'right'}}
                                    onClick={ () => this.setState({selected_c_update : true})}> Edit my profile
                            </button>
                            {this.state.selected_c_update ? this.getCaregiverUpdateForm() : null}
                        </strong>
                    </CardHeader>

                    <CardHeader>
                        <div className="row">
                            <table className="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th className="text-center" width='50px'> ID</th>
                                    <th className="text-center"> First Name</th>
                                    <th className="text-center"> Address</th>
                                    <th className="text-center"> Birth Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    patientList.map(
                                        patient =>
                                            <tr key={patient.patientId}>
                                                <td className="text-center"> {patient.patientId} </td>
                                                <td className="text-center"> {patient.name} </td>
                                                <td className="text-center"> {patient.address}</td>
                                                <td className="text-center"> {patient.birthDate}</td>
                                            </tr>
                                    )
                                }
                                </tbody>
                            </table>

                        </div>
                    </CardHeader>

                    <div style={{width:'500px', float:'right', marginTop:'20px', marginRight:'10px'}}>
                        <Select options={patientElements} value={selectedPatient} onChange={this.handleSelection}/>
                        <button onClick={this.togglePrescriptionForm} className={"btn btn-sm btn-dark"} style={{float:'right', marginTop:'5px'}}> Get prescriptions </button>
                    </div>

                    <Modal isOpen={this.state.selected_p} toggle={this.togglePrescriptionForm}
                        className={this.props.className} size="lg">
                        <ModalHeader toggle={this.togglePrescriptionForm}> Prescriptions: </ModalHeader>
                        <ModalBody>
                            {correctPrescriptions.length !== 0 ? prescriptionContent : "No prescriptions for this patient"}
                        </ModalBody>
                    </Modal>
                </div>
            )
        } else {
            return (
                <div style={{margin: "auto"}}>
                    <div className="card-body">
                        <h5 className="card-title font-weight-bold">Access denied!</h5>
                        <p className="card-text">You do not have access to this page, as your role needs to be CAREGIVER.</p>
                        <p className="card-text"><small className="font-italic">Press "Return" to return to the homepage.</small></p>
                    </div>
                    <button className={"btn btn-lg btn-danger"} style={{float:'right', marginTop:'10px', marginRight:'10px'}} onClick={goToHomePage}> Return </button>
                </div>
            )

        }

    }

    fetchCaregivers() {
        return API_USERS.getCaregivers((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    caregiverList: result,
                    isLoaded: true
                });
                this.getCaregiver();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    fetchPatients() {
       return API_PATIENTS.getPatients((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    patients: result,
                    isLoaded: true
                });
                this.getCorrectPatients();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    componentDidMount() {
       this.fetchCaregivers();
       this.fetchPatients();
       this.fetchPrescriptions();
    }

    getCorrectPatients() {
        let currUser = JSON.parse(localStorage.getItem('loggedUser'));
        if (currUser !== undefined && currUser !== null) {
            let patientList = [];
            const {patients} = this.state;
            const {caregiverList} = this.state;
            let currCaregiver = {};
            for (let i = 0; i < caregiverList.length; ++i) {
                if (caregiverList[i].user.username === currUser.username) {
                    currCaregiver = caregiverList[i];
                }
            }
            for (let i = 0; i < patients.length; ++i) {
                if (patients[i].caregiverDTO.caregiverId === currCaregiver.caregiverId) {
                    patientList.push(patients[i]);
                }
            }
            this.setState({patientList: patientList});
        }
    }

    toggleFormUC() {
        this.setState({selected_c_update: !this.state.selected_c_update})
    }

    getCaregiver() {
        let currUser = JSON.parse(localStorage.getItem('loggedUser'));
        if (currUser !== undefined && currUser !== null) {
            const {caregiverList} = this.state;

            for (let i = 0; i < caregiverList.length; ++i) {
                if (caregiverList[i].user.username === currUser.username) {
                    this.setState({caregiver: caregiverList[i]});
                }
            }
        }
    }


    handleCaregiverUpdateChange = event => {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControlsCaregiverUpdate;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControlsCaregiverUpdate: updatedControls,
            updateCaregiverFormIsValid: formIsValid
        });

    };

    handleCaregiverUpdate(id) {

        let caregiver = {
            caregiverId: id,
            name: this.state.formControlsCaregiverUpdate.name.value,
            address: this.state.formControlsCaregiverUpdate.address.value,
            birthDate: this.state.formControlsCaregiverUpdate.birthDate.value
        };
        this.sendCaregiverUpdateRequest(caregiver);
        this.toggleFormUC();
        this.fetchCaregivers();
    }

    sendCaregiverUpdateRequest(caregiver) {
        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'caregiverId': caregiver.caregiverId,
                    'name': caregiver.name,
                    'address': caregiver.address,
                    'birthDate': caregiver.birthDate,
                }
            )
        }

        fetch(HOST.backend_api + '/caregiver', putMethod)
            .then(response => response.json())
            .then(data => data ? JSON.parse(data) : {})
            .catch(err => console.log(err));
    }

    getCaregiverUpdateForm() {
        const {caregiver} = this.state;
        console.log(caregiver);
        return (
            <Modal isOpen={this.state.selected_c_update}>
                <ModalHeader toggle={this.toggleFormUC}> Update caregiver: </ModalHeader>
                <ModalBody>
                    <div>
                        <form id= "update-caregiver">

                            <label>ID: </label>
                            <Input name='caregiverId' id='caregiverIdField' placeholder={"ID..."}
                                   value={caregiver.caregiverId}
                                   onChange={this.handleCaregiverUpdateChange}
                                   type="number"
                            />

                            <label>Name: </label>
                            <Input name='name' id='cnameField' placeholder={"name..."}
                                   defaultValue={caregiver.name}
                                   onChange={this.handleCaregiverUpdateChange}
                            />
                            {this.state.formControlsCaregiverUpdate.name.touched && !this.state.formControlsCaregiverUpdate.name.valid &&
                            <div className={"error-message"}> * Name not valid </div>}
                            <label>Address: </label>
                            <Input name='address' id='caddressField' placeholder={"address..."}
                                   defaultValue={caregiver.address}
                                   onChange={this.handleCaregiverUpdateChange}
                            />
                            {this.state.formControlsCaregiverUpdate.address.touched && !this.state.formControlsCaregiverUpdate.address.valid &&
                            <div className={"error-message"}> * Address not valid </div>}
                            <label>Birth Date: </label>
                            <Input name='birthDate' id='cbirthDateField' placeholder={"birth date..."}
                                   type="date"
                                   defaultValue={caregiver.birthDate}
                                   onChange={this.handleCaregiverUpdateChange}
                            />
                            {this.state.formControlsCaregiverUpdate.birthDate.touched && !this.state.formControlsCaregiverUpdate.birthDate.valid &&
                            <div className={"error-message"}> * Birth date not valid </div>}

                            <Row>
                                <Col sm={{size: '4', offset: 8}}>
                                    <button type="button" style={{marginTop: '10px', float:'right'}} className="btn btn-primary" disabled={!this.state.updateCaregiverFormIsValid} onClick={e => this.handleCaregiverUpdate(caregiver.caregiverId)}>  Submit </button>
                                </Col>
                            </Row>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

    render() {
        return this.getPage();
    }
}


export default CaregiverContainer;
