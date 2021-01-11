import React from 'react';
import validate from "./../patient/components/validators/validators";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {HOST} from "../commons/hosts";


class UpdatePatientInfo extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.patient = this.props.patient;
        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
                username: {
                    value: '',
                    placeholder: 'Username...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                password: {
                    value: '',
                    placeholder: 'Password...',
                    valid: true,
                    touched: true,
                    type: "password",
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                name: {
                    value: '',
                    placeholder: 'Name...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Cluj, Zorilor, Str. Lalelelor 21...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                birthDate: {
                    value: '',
                    type: "date",
                    placeholder: 'Birth Date...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true
                    }
                },
                caregiverId: {
                    value: '',
                    placeholder: 'Caregiver ID...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true
                    }
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    }


    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;

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
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };

    registerPatient(patient) {
        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'patientId': patient.patientId,
                    'name': patient.name,
                    'address': patient.address,
                    'birthDate': patient.birthDate,
                    'username': patient.username,
                    'password': patient.password,
                    'role': patient.role,
                    'caregiverId': patient.caregiverId
                }
            )
        }

        fetch(HOST.backend_api + '/patient/update', putMethod)
            .then(response => response.json())
            .then(data => data ? JSON.parse(data) : {})
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        console.log(this.state.formControls);
        let patientId = 0, username = null, password = null, name = null, address = null, birthDate = null, caregiverId = null;
        patientId = this.patient.patientId;
        if (this.state.formControls.username.value === undefined || this.state.formControls.username.value === '') {
            username = this.patient.user.username;
        } else {
            username = this.state.formControls.username.value;
        }
        if (this.state.formControls.password.value === undefined || this.state.formControls.password.value === '') {
            password = this.patient.user.password;
        } else {
            password = this.state.formControls.password.value;
        }
        if (this.state.formControls.name.value === undefined || this.state.formControls.name.value === '') {
            name = this.patient.name;
        } else {
            name = this.state.formControls.name.value;
        }
        if (this.state.formControls.address.value === undefined || this.state.formControls.address.value === '') {
            address = this.patient.address;
        } else {
            address = this.state.formControls.address.value;
        }
        if (this.state.formControls.birthDate.value === undefined || this.state.formControls.birthDate.value === '') {
            birthDate = this.patient.birthDate;
        } else {
            birthDate = this.state.formControls.birthDate.value;
        }
        if (this.state.formControls.caregiverId.value === undefined || this.state.formControls.caregiverId.value === '') {
            caregiverId = this.patient.caregiverDTO.caregiverId;
        } else {
            caregiverId = this.state.formControls.caregiverId.value;
        }

        let person = {
            patientId: patientId,
            username: username,
            password: password,
            name: name,
            address: address,
            birthDate: birthDate,
            role: 'PATIENT',
            caregiverId: caregiverId
        };

        console.log(person);
        this.registerPatient(person);
        this.toggleForm();
    }

    render() {
        return (
            <div>

                <FormGroup id='username'>
                    <Label for='usernameField'> Username: </Label>
                    <Input name='username' id='usernameField' placeholder={this.state.formControls.username.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.patient.user.username}
                           touched={this.state.formControls.username.touched? 1 : 0}
                           valid={this.state.formControls.username.valid}
                           required
                    />
                    {this.state.formControls.username.touched && !this.state.formControls.username.valid &&
                    <div className={"error-message"}> * Username not valid </div>}
                </FormGroup>

                <FormGroup id='password'>
                    <Label for='passwordField'> Password: </Label>
                    <Input name='password' id='passwordField' placeholder={this.state.formControls.password.placeholder}
                           type="password"
                           onChange={this.handleChange}
                           defaultValue={this.patient.user.password}
                           touched={this.state.formControls.password.touched? 1 : 0}
                           valid={this.state.formControls.password.valid}
                           required
                    />
                    {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                    <div className={"error-message"}> * Password not valid </div>}
                </FormGroup>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.patient.name}
                           touched={this.state.formControls.name.touched? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                    <div className={"error-message"}> * Name not valid </div>}
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.patient.address}
                           touched={this.state.formControls.address.touched? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           required
                    />
                    {this.state.formControls.address.touched && !this.state.formControls.address.valid &&
                    <div className={"error-message"}> * Address not valid </div>}
                </FormGroup>

                <FormGroup id='birthDate'>
                    <Label for='birthDateField'> Birth Date: </Label>
                    <Input name='birthDate' id='birthDateField' placeholder={this.state.formControls.birthDate.placeholder}
                           type="date"
                           onChange={this.handleChange}
                           defaultValue={this.patient.birthDate}
                           touched={this.state.formControls.birthDate.touched? 1 : 0}
                           valid={this.state.formControls.birthDate.valid}
                           required
                    />
                    {this.state.formControls.birthDate.touched && !this.state.formControls.birthDate.valid &&
                    <div className={"error-message"}> * Birth date not valid </div>}
                </FormGroup>

                <FormGroup id='caregiverId'>
                    <Label for='caregiverIdField'> Caregiver ID: </Label>
                    <Input name='caregiverId' id='caregiverIdField' placeholder={this.state.formControls.caregiverId.placeholder}
                           min={1} max={100} type="number"
                           onChange={this.handleChange}
                           defaultValue={this.patient.caregiverDTO.caregiverId}
                           touched={this.state.formControls.caregiverId.touched? 1 : 0}
                           valid={this.state.formControls.caregiverId.valid}
                           required
                    />
                    {this.state.formControls.caregiverId.touched && !this.state.formControls.caregiverId.valid &&
                    <div className={"error-message"}> * Caregiver ID not valid </div>}
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
                    </Col>
                </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        ) ;
    }
}

export default UpdatePatientInfo;
