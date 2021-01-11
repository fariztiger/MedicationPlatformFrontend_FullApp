import React from 'react'
import Select from "react-select";
import * as API_MEDICINE from "./../api/medicine-api"
import Input from "reactstrap/es/Input";
import * as API_PATIENTS from "./../api/patient-api"
import {HOST} from "./../../commons/hosts"

function isEmpty(item) {
    for(const p in item) {
        if(item.hasOwnProperty(p)) {
            return false;
        }
    }

    return JSON.stringify(item) === JSON.stringify({});
}

class PrescriptionForm extends React.Component {
    constructor(props) {
        super(props);
        this.reloadHandlerPrescription = this.props.reloadHandlerPrescription;
        this.state = {
            done: '',
            medicineList: [],
            startDate: "",
            startingTime: "",
            endDate: "",
            endingTime: "",
            selectedMedicine: [],
            selectedPatient: {},
            patientList: [],
            completed: false,
            error: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMedicineChange = this.handleMedicineChange.bind(this);
        this.handlePatientChange = this.handlePatientChange.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const {medicineList, patientList, selectedMedicine, selectedPatient} = this.state;
        let {startDate, startingTime, endDate, endingTime} = this.state;

        if (medicineList.length === 0 || !startDate || !endDate || !startingTime || !endingTime || isEmpty(selectedPatient)) {
            this.setState({completed: true}); return;
        }

        let medicineL = [];
        for (let i = 0; i < medicineList.length; ++i) {
            for (let j = 0; j < selectedMedicine.length; ++j) {
                if (selectedMedicine[j].value === medicineList[i].medicineId) {
                    //medicineL.push({name: medicineList[i].name, description: medicineList[i].description, sideEffects: medicineList[i].sideEffects});
                    medicineL.push(medicineList[i]);
                }
            }
        }

        let selPatient = {};
        for (let i = 0; i < patientList.length; i++) {
            if (patientList[i].patientId === selectedPatient.value) {
                selPatient = patientList[i];
            }
        };

        startDate = this.state.startDate + "T" + this.state.startingTime + ":00Z"
        endDate = this.state.endDate + "T" + this.state.endingTime + ":00Z"

        console.log("START DATE: " + startDate)
        console.log("END DATE: " + endDate)

        const prescription = {
            patient: selPatient,
            startDate: startDate,
            endDate: endDate,
            medicine: medicineL
        };

        this.handlePostRequest(prescription).then(r => this.setState({done: 'done'}));
        this.reloadHandlerPrescription();
    }

    handlePostRequest(prescription) {
        const req = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    'patient' : prescription.patient,
                    'startTime': prescription.startDate,
                    'endTime': prescription.endDate,
                    'medicine': prescription.medicine
                }
            )
        };
        console.log(req.body);
        return fetch(HOST.backend_api + "/doctor/prescription" , req)
            .then(response => response.json())
            .then(data => data ? JSON.parse(data) : {})
            .catch(err => console.log(err));
    }

    componentDidMount() {
        API_MEDICINE.getMedicine((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    medicineList: result
                });
            } else {
                this.setState(({
                    error: status
                }));
            }
        });

        return API_PATIENTS.getPatients((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    patientList: result
                });
            } else {
                this.setState(({
                    error: status
                }));
            }
        });
    }

    handleMedicineChange = selectedMedicine => {
        this.setState({selectedMedicine});
    };

    handlePatientChange = selectedPatient => {
        this.setState({selectedPatient});
    };

    render() {
        const {startDate, startingTime, endDate, endingTime, selectedMedicine, selectedPatient, completed} = this.state;
        const medicineElements = this.state.medicineList.map( (medicine) => ({
            value: medicine.medicineId,
            label: medicine.name
        }));
        const patientElements = this.state.patientList.map( (patient) => ({
            value: patient.patientId,
            label: patient.name
        }));
        return (
            <form name = {"prescription-form"} onSubmit={this.handleSubmit}>

                <div>
                    <label>Patient</label>
                    <Select options={patientElements} value={selectedPatient} onChange={this.handlePatientChange}/>
                    {completed && isEmpty(selectedPatient) &&
                    <div className="help">Patient is required</div>
                    }
                </div>

                <div>
                    <label>Drugs</label>
                    <Select isMulti options={medicineElements} value={selectedMedicine} onChange={this.handleMedicineChange}/>
                    {completed && selectedMedicine.length === 0 &&
                    <div className="help">Medicine is required</div>
                    }
                </div>

                <div>
                    <label>Start date</label>
                    <Input type={'date'} className={'prescription-form-control'} name={'startDate'} value={startDate}
                           onChange={this.handleChange}/>
                    {completed && !startDate &&
                    <div className="help-block">Start date is required</div>
                    }
                </div>

                <div>
                    <label>Interval start time</label>
                    <Input type={'time'} className={'prescription-form-control'} name={'startingTime'} value={startingTime}
                           onChange={this.handleChange}/>
                    {completed && !startingTime &&
                    <div className="help-block">Start time is required</div>
                    }
                </div>

                <div>
                    <label>End date</label>
                    <Input type={'date'} className={'prescription-form-control'} name={'endDate'} value={endDate}
                           onChange={this.handleChange}/>
                    {completed && !endDate &&
                    <div className="help-block">End date is required</div>
                    }
                </div>

                <div>
                    <label>Interval end time</label>
                    <Input type={'time'} className={'prescription-form-control'} name={'endingTime'} value={endingTime}
                           onChange={this.handleChange}/>
                    {completed && !endingTime &&
                    <div className="help-block">End time is required</div>
                    }
                </div>

                <div>
                    <button className={'btn btn-primary'} style={{float:'right', marginTop:'10px'}}onClick={this.handleSubmit}>
                        Create
                    </button>
                </div>
            </form>
        )
    }

}

export default PrescriptionForm;