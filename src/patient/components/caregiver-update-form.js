import React from 'react';
import validate from "../../patient/components/validators/validators";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {HOST} from "../../commons/hosts";


class CaregiverUpdateForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.caregiver = this.props.caregiver;
        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
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

    registerPatient(caregiver) {
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
                    'birthDate': caregiver.birthDate
                }
            )
        }

        fetch(HOST.backend_api + '/caregiver', putMethod)
            .then(response => response.json())
            .then(data => data ? JSON.parse(data) : {})
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        console.log(this.state.formControls);
        let caregiverId = 0, name = null, address = null, birthDate = null;
        caregiverId = this.caregiver.caregiverId;
        if (this.state.formControls.name.value === undefined || this.state.formControls.name.value === '') {
            name = this.caregiver.name;
        } else {
            name = this.state.formControls.name.value;
        }
        if (this.state.formControls.address.value === undefined || this.state.formControls.address.value === '') {
            address = this.caregiver.address;
        } else {
            address = this.state.formControls.address.value;
        }
        if (this.state.formControls.birthDate.value === undefined || this.state.formControls.birthDate.value === '') {
            birthDate = this.caregiver.birthDate;
        } else {
            birthDate = this.state.formControls.birthDate.value;
        }

        let person = {
            caregiverId: caregiverId,
            name: name,
            address: address,
            birthDate: birthDate
        };

        console.log(person);
        this.registerPatient(person);
        this.toggleForm();
    }

    render() {
        return (
            <div>
                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.caregiver.name}
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
                           defaultValue={this.caregiver.address}
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
                           defaultValue={this.caregiver.birthDate}
                           touched={this.state.formControls.birthDate.touched? 1 : 0}
                           valid={this.state.formControls.birthDate.valid}
                           required
                    />
                    {this.state.formControls.birthDate.touched && !this.state.formControls.birthDate.valid &&
                    <div className={"error-message"}> * Birth date not valid </div>}
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

export default CaregiverUpdateForm;
