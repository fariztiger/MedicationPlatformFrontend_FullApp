import React from 'react';
import validate from "../../patient/components/validators/validators";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {HOST} from "../../commons/hosts";


class MedicineUpdateForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.medicine = this.props.medicine;
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
                description: {
                    value: '',
                    placeholder: 'Description...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                sideEffects: {
                    value: '',
                    placeholder: 'Side effects...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true,
                        minLength: 5
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

    registerPatient(medicine) {
        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'medicineId': medicine.medicineId,
                    'name': medicine.name,
                    'description': medicine.description,
                    'sideEffects': medicine.sideEffects
                }
            )
        }

        fetch(HOST.backend_api + '/medicine', putMethod)
            .then(response => response.json())
            .then(data => data ? JSON.parse(data) : {})
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        console.log(this.state.formControls);
        let medicineId = 0, name = null, description = null, sideEffects = null;
        medicineId = this.medicine.medicineId;
        if (this.state.formControls.name.value === undefined || this.state.formControls.name.value === '') {
            name = this.medicine.name;
        } else {
            name = this.state.formControls.name.value;
        }
        if (this.state.formControls.description.value === undefined || this.state.formControls.description.value === '') {
            description = this.medicine.description;
        } else {
            description = this.state.formControls.description.value;
        }
        if (this.state.formControls.sideEffects.value === undefined || this.state.formControls.sideEffects.value === '') {
            sideEffects = this.medicine.sideEffects;
        } else {
            sideEffects = this.state.formControls.sideEffects.value;
        }

        let person = {
            medicineId: medicineId,
            name: name,
            description: description,
            sideEffects: sideEffects
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
                           defaultValue={this.medicine.name}
                           touched={this.state.formControls.name.touched? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                    <div className={"error-message"}> * Name not valid </div>}
                </FormGroup>

                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.medicine.description}
                           touched={this.state.formControls.description.touched? 1 : 0}
                           valid={this.state.formControls.description.valid}
                           required
                    />
                    {this.state.formControls.description.touched && !this.state.formControls.description.valid &&
                    <div className={"error-message"}> * Address not valid </div>}
                </FormGroup>

                <FormGroup id='sideEffects'>
                    <Label for='sideEffectsField'> Side effects: </Label>
                    <Input name='sideEffects' id='sideEffectsField' placeholder={this.state.formControls.sideEffects.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.medicine.sideEffects}
                           touched={this.state.formControls.sideEffects.touched? 1 : 0}
                           valid={this.state.formControls.sideEffects.valid}
                           required
                    />
                    {this.state.formControls.sideEffects.touched && !this.state.formControls.sideEffects.valid &&
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

export default MedicineUpdateForm;
