import React from 'react';
import {
    CardHeader,
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';

import * as API_USERS from "./api/patient-api"
import * as API_CAREGIVERS from "./api/caregiver-api";
import PatientForm from "./components/patient-form";
import CaregiverForm from "./components/caregiver-form";
import * as API_MEDICINE from "./api/medicine-api";
import MedicineForm from "./components/medicine-form";
import {HOST} from "../commons/hosts";
import PrescriptionForm from "./components/prescription-form";
import CardBody from "reactstrap/es/CardBody";
import PatientUpdateForm from "./components/patient-update-form";
import CaregiverUpdateForm from "./components/caregiver-update-form";
import MedicineUpdateForm from "./components/medicine-update-form";

function handleLogout() {
    localStorage.removeItem('loggedUser');
    window.location.href = "/";
}

function goToHomePage() {
    window.location.href = "/";
}

class DoctorContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.toggleFormCaregiver = this.toggleFormCaregiver.bind(this);
        this.toggleFormMedicine = this.toggleFormMedicine.bind(this);
        this.togglePrescriptionForm = this.togglePrescriptionForm.bind(this);

        this.toggleFormUP = this.toggleFormUP.bind(this);
        this.toggleFormUC = this.toggleFormUC.bind(this);
        this.toggleFormUM = this.toggleFormUM.bind(this);


        this.reload = this.reload.bind(this);
        this.reloadC = this.reloadC.bind(this);
        this.reloadM = this.reloadM.bind(this);
        this.reloadP = this.reloadP.bind(this);
        this.getPage = this.getPage.bind(this);
        this.state = {
            selected: false,
            selected_caregiver: false,
            selected_medicine: false,

            selected_p_update: false,
            selected_c_update: false,
            selected_m_update: false,

            collapseForm: false,

            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,

            caregiverTableData: [],
            caregiverIsLoaded: false,
            errorCaregiver: null,
            errorCaregiverStatus: 0,

            medicineTableData: [],
            medicineIsLoaded: false,
            errorMedicine: null,
            errorMedicineStatus: 0,

            prescription_form_selected: false,
            isPrescriptionLoaded: false,

            selected_patient: {},
            selected_caregiver_update: {},
            selected_medicine_update: {}
        }
    }

    componentDidMount() {
        this.fetchPatients();
        this.fetchMedicine();
        this.fetchCaregivers();
    }

    fetchPatients() {
        return API_USERS.getPatients((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    tableData: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    fetchCaregivers() {
        return API_CAREGIVERS.getCaregivers((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    caregiverTableData: result,
                    caregiverIsLoaded: true
                });
            } else {
                this.setState(({
                    caregiverErrorStatus: status,
                    caregiverError: err
                }));
            }
        });
    }

    fetchMedicine() {
        return API_MEDICINE.getMedicine((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    medicineTableData: result,
                    medicineIsLoaded: true
                });
            } else {
                this.setState(({
                    medicineErrorStatus: status,
                    medicineError: err
                }));
            }
        });
    }

    toggleForm() {
        this.setState({selected: !this.state.selected});
    }

    toggleFormCaregiver() {
        this.setState({selected_caregiver: !this.state.selected_caregiver})
    }

    toggleFormMedicine() {
        this.setState({selected_medicine: !this.state.selected_medicine})
    }

    togglePrescriptionForm() {
        this.setState({prescription_form_selected: !this.state.prescription_form_selected})
    }

    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        this.fetchPatients();
    }

    reloadP() {
        this.setState({
           isPrescriptionLoaded : false
        });
        this.togglePrescriptionForm();
    }

    reloadC() {
        this.setState({
            caregiverIsLoaded: false
        });
        this.toggleFormCaregiver();
        this.fetchCaregivers();
    }

    reloadM() {
        this.setState({
            medicineIsLoaded: false
        });
        this.toggleFormMedicine();
        this.fetchMedicine();
    }

    refresh() {
       window.location.reload(false);
    }

    handleDeletePatient(id) {
        fetch(HOST.backend_api + '/patient/' + id, {method: 'DELETE'})
            .then(response => response.json());
        this.refresh();
    }

    handleDeleteCaregiver(id) {
        fetch(HOST.backend_api + '/caregiver/' + id, {method: 'DELETE'})
            .then(response => response.json());
        this.refresh();
    }

    handleDeleteMedicine(id) {
        fetch(HOST.backend_api + '/medicine/' + id, {method: 'DELETE'})
            .then(response => response.json());
        this.refresh();
    }

    toggleFormUP(patient) {
        this.setState({selected_p_update: !this.state.selected_p_update,
        selected_patient: patient})
    }

    toggleFormUC(caregiver) {
        this.setState({selected_c_update: !this.state.selected_c_update,
        selected_caregiver_update: caregiver})
    }

    toggleFormUM(medicine) {
        this.setState({selected_m_update: !this.state.selected_m_update,
        selected_medicine_update: medicine})
    }

    getPage() {
        const user = JSON.parse(localStorage.getItem('loggedUser'));
        if (user !== null && user !== undefined && user.role === 'DOCTOR') {
            return (
                <div>
                    <CardHeader>
                        <strong> Patient Management
                            <button className="btn btn-success btn-sm" style={{marginLeft: '10px', float: 'right'}}
                                    onClick={this.toggleForm}>Add patient </button>
                            <button className="btn btn-warning btn-sm" style={{marginLeft: '10px', float: 'right'}}
                                    onClick={this.togglePrescriptionForm}>Add prescription
                            </button>
                            <button className="btn btn-dark btn-sm" style={{marginLeft: '10px', float: 'right'}}
                                    onClick={handleLogout}>Logout
                            </button>
                        </strong>
                    </CardHeader>

                    <CardBody style={{marginLeft:'50px', marginRight:'50px'}}>
                        <div className="row">
                            <table className="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th className="text-center" width='50px'> ID</th>
                                    <th className="text-center"> First Name</th>
                                    <th className="text-center"> Address</th>
                                    <th className="text-center"> Birth Date</th>
                                    <th className="text-center" width='200px'> Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.tableData.map(
                                        patient =>
                                            <tr key={patient.patientId}>
                                                <td className="text-center"> {patient.patientId} </td>
                                                <td className="text-center"> {patient.name} </td>
                                                <td className="text-center"> {patient.address}</td>
                                                <td className="text-center"> {patient.birthDate}</td>
                                                <td className="text-center">
                                                    <button style={{marginLeft: "10px"}}
                                                            onClick={() => this.handleDeletePatient(patient.patientId)}
                                                            className="btn btn-danger btn-sm">Delete
                                                    </button>
                                                    <button style={{marginLeft: "10px"}}
                                                            onClick={() => this.toggleFormUP(patient)}
                                                            className="btn btn-primary btn-sm">Update
                                                    </button>

                                                </td>
                                            </tr>
                                    )
                                }
                                </tbody>
                            </table>

                        </div>
                    </CardBody>

                    <Modal isOpen={this.state.prescription_form_selected} toggle={this.togglePrescriptionForm}
                           className={this.props.className} size="lg">
                        <ModalHeader toggle={this.togglePrescriptionForm}> Add prescription: </ModalHeader>
                        <ModalBody>
                            <PrescriptionForm reloadHandlerPrescription={this.reloadP}/>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={this.state.selected_p_update} toggle={this.toggleFormUP}
                           className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggleFormUP}> Update patient: </ModalHeader>
                        <ModalBody>
                            <PatientUpdateForm patient={this.state.selected_patient} reloadHandler={this.refresh}/>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                           className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggleForm}> Add patient: </ModalHeader>
                        <ModalBody>
                            <PatientForm reloadHandler={this.reload}/>
                        </ModalBody>
                    </Modal>

                    <CardHeader>
                        <strong> Caregiver Management
                            <button className="btn btn-success btn-sm" style={{float: 'right'}}
                                    onClick={this.toggleFormCaregiver}>Add caregiver </button>
                        </strong>
                    </CardHeader>

                    <CardBody style={{marginLeft:'50px', marginRight:'50px'}}>
                        <div className="row">
                            <table className="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th className="text-center" width='50px'> ID</th>
                                    <th className="text-center"> First Name</th>
                                    <th className="text-center"> Address</th>
                                    <th className="text-center"> Birth Date</th>
                                    <th className="text-center" width='200px'> Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.caregiverTableData.map(
                                        caregiver =>
                                            <tr key={caregiver.caregiverId}>
                                                <td className="text-center"> {caregiver.caregiverId} </td>
                                                <td className="text-center"> {caregiver.name} </td>
                                                <td className="text-center"> {caregiver.address}</td>
                                                <td className="text-center"> {caregiver.birthDate}</td>
                                                <td className="text-center">
                                                    <button style={{marginLeft: "10px"}}
                                                            onClick={() => this.handleDeleteCaregiver(caregiver.caregiverId)}
                                                            className="btn btn-danger btn-sm">Delete
                                                    </button>
                                                    <button color="blue" style={{marginLeft: "10px"}}
                                                            onClick={() => this.toggleFormUC(caregiver)}
                                                            className="btn btn-primary btn-sm">Update
                                                    </button>
                                                </td>
                                            </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </CardBody>

                    <Modal isOpen={this.state.selected_c_update} toggle={this.toggleFormUC}
                           className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggleFormUC}> Update caregiver: </ModalHeader>
                        <ModalBody>
                            <CaregiverUpdateForm caregiver={this.state.selected_caregiver_update} reloadHandler={this.refresh}/>
                        </ModalBody>
                    </Modal>


                    <Modal isOpen={this.state.selected_caregiver} toggle={this.toggleFormCaregiver}
                           className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggleFormCaregiver}> Add caregiver: </ModalHeader>
                        <ModalBody>
                            <CaregiverForm reloadHandlerCaregiver={this.reloadC}/>
                        </ModalBody>
                    </Modal>


                    <CardHeader>
                        <strong> Medicine Management
                            <button className="btn btn-success btn-sm" style={{float: 'right'}}
                                    onClick={this.toggleFormMedicine}>Add medicine </button>
                        </strong>
                    </CardHeader>

                    <CardBody style={{marginLeft:'50px', marginRight:'50px'}}>
                        <div className="row">
                            <table className="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th className="text-center" width='50px'> ID</th>
                                    <th className="text-center"> Drug name</th>
                                    <th className="text-center"> Description</th>
                                    <th className="text-center" width='300px'> Side effects</th>
                                    <th className="text-center" width='200px'> Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.medicineTableData.map(
                                        medicine =>
                                            <tr key={medicine.medicineId}>
                                                <td className="text-center"> {medicine.medicineId} </td>
                                                <td className="text-center"> {medicine.name} </td>
                                                <td className="text-center"> {medicine.description}</td>
                                                <td className="text-center"> {medicine.sideEffects}</td>
                                                <td className="text-center">
                                                    <button style={{marginLeft: "10px"}}
                                                            onClick={() => this.handleDeleteMedicine(medicine.medicineId)}
                                                            className="btn btn-danger btn-sm">Delete
                                                    </button>
                                                    <button color="blue" style={{marginLeft: "10px"}}
                                                            onClick={() => this.toggleFormUM(medicine)}
                                                            className="btn btn-primary btn-sm">Update
                                                    </button>
                                                </td>
                                            </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </CardBody>

                    <Modal isOpen={this.state.selected_m_update} toggle={this.toggleFormUM}
                           className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggleFormUM}> Update medicine: </ModalHeader>
                        <ModalBody>
                            <MedicineUpdateForm medicine={this.state.selected_medicine_update} reloadHandler={this.refresh}/>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={this.state.selected_medicine} toggle={this.toggleFormMedicine}
                           className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggleFormMedicine}> Add medicine: </ModalHeader>
                        <ModalBody>
                            <MedicineForm reloadHandlerMedicine={this.reloadM}/>
                        </ModalBody>
                    </Modal>
                </div>)
        } else {
            return (
                <div style={{margin: "auto"}}>
                    <div className="card-body">
                        <h5 className="card-title font-weight-bold">Access denied!</h5>
                        <p className="card-text">You do not have access to this page, as your role needs to be DOCTOR.</p>
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

export default DoctorContainer;
