import React from "react";
import Select from "react-select";
import validate from "../patient/components/validators/validators";
import * as API_PATIENTS from "../patient/api/patient-api";
import * as API_CAREGIVERS from "../patient/api/caregiver-api";
import * as API_USERS from "../login/user-api";
import * as API_DOCTORS from "../patient/api/doctor-api"
import {FormGroup, Input, Label} from "reactstrap";

function isEmpty(item) {
    for(const p in item) {
        if(item.hasOwnProperty(p)) {
            return false;
        }
    }

    return JSON.stringify(item) === JSON.stringify({});
}

class RegisterContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.state = {
            completed: false,
            error: '',
            errorStatus: 0,
            userList: [],
            formIsValid: false,
            role: '',
            formControls: {
                username: {
                    value: '',
                    placeholder: 'Username...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                password: {
                    value: '',
                    placeholder: 'Password...',
                    valid: false,
                    touched: false,
                    type: "password",
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                name: {
                    value: '',
                    placeholder: 'Name...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Cluj, Zorilor, Str. Lalelelor 21...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                birthDate: {
                    value: '',
                    type: "date",
                    placeholder: 'Birth Date...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                }
            }
        };
    }

    componentDidMount() {
        API_USERS.getUsers((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    userList: result
                });
            } else {
                this.setState(({
                    error: status
                }));
            }
        });
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

    handleSelectionChange = role => {
        this.setState({role})
    }

    registerPatient(patient) {
        return API_PATIENTS.postPatient(patient, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted patient with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    registerCaregiver(caregiver) {
        return API_CAREGIVERS.postCaregiver(caregiver, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted caregiver with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    registerDoctor(doctor) {
        return API_DOCTORS.postDoctor(doctor, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted doctor with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit() {
        const {userList} = this.state;
        let unique = true;
        for (let i = 0; i < userList.length; ++i) {
            if (userList[i].username === this.state.formControls.username.value) {
                unique = false;
                break;
            }
        }
        if (!unique) {
            alert("Username is taken. Try again.");
        } else {
            console.log(this.state.formControls);
            let person = {
                username: this.state.formControls.username.value,
                password: this.state.formControls.password.value,
                name: this.state.formControls.name.value,
                address: this.state.formControls.address.value,
                birthDate: this.state.formControls.birthDate.value,
                role: this.state.role
            };
            switch (this.state.role.value) {
                case 'PATIENT':
                    let patient = {
                        username: this.state.formControls.username.value,
                        password: this.state.formControls.password.value,
                        name: this.state.formControls.name.value,
                        address: this.state.formControls.address.value,
                        birthDate: this.state.formControls.birthDate.value,
                        role: this.state.role,
                        caregiverId: 1
                    };
                    console.log("Patient " + patient);
                    this.registerPatient(patient);
                    break;
                case 'CAREGIVER':
                    console.log("Caregiver " + person);
                    this.registerCaregiver(person);
                    break;
                case 'DOCTOR':
                    console.log("Doctor " + person);
                    this.registerDoctor(person);
                    break;
                default:
                    console.log(person);
            }
            window.location.href = "/login";
        }
    }

    render() {
        const {role} = this.state;
        const roles = [];
        roles.push({value: 'PATIENT', label: 'PATIENT'});
        roles.push({value: 'CAREGIVER', label: 'CAREGIVER'});
        roles.push({value: 'DOCTOR', label: 'DOCTOR'});

        const defaultRole = roles[0];
        return (
            <div>
                <h1 style={{marginLeft: "auto", marginRight:"auto", width:'300px', textAlign:'center'}}>Register</h1>
                <FormGroup id='username' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='usernameField'> Username: </Label>
                    <Input name='username' id='usernameField' placeholder={this.state.formControls.username.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.username.value}
                           touched={this.state.formControls.username.touched? 1 : 0}
                           valid={this.state.formControls.username.valid}
                           required
                    />
                    {this.state.formControls.username.touched && !this.state.formControls.username.valid &&
                    <div className={"error-message"}> * Username not valid </div>}
                </FormGroup>

                <FormGroup id='password' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='passwordField'> Password: </Label>
                    <Input name='password' id='passwordField' placeholder={this.state.formControls.password.placeholder}
                           type="password"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.password.value}
                           touched={this.state.formControls.password.touched? 1 : 0}
                           valid={this.state.formControls.password.valid}
                           required
                    />
                    {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                    <div className={"error-message"}> * Password not valid </div>}
                </FormGroup>

                <FormGroup id='name' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.name.value}
                           touched={this.state.formControls.name.touched? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                    <div className={"error-message"}> * Name not valid </div>}
                </FormGroup>

                <FormGroup id='address' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           required
                    />
                    {this.state.formControls.address.touched && !this.state.formControls.address.valid &&
                    <div className={"error-message"}> * Address not valid </div>}
                </FormGroup>

                <FormGroup id='birthDate' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='birthDateField'> Birth Date: </Label>
                    <Input name='birthDate' id='birthDateField' placeholder={this.state.formControls.birthDate.placeholder}
                           type="date"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.birthDate.value}
                           touched={this.state.formControls.birthDate.touched? 1 : 0}
                           valid={this.state.formControls.birthDate.valid}
                           required
                    />
                    {this.state.formControls.birthDate.touched && !this.state.formControls.birthDate.valid &&
                    <div className={"error-message"}> * Birth date not valid </div>}
                </FormGroup>

                <div className="form-group" style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <label>Role</label>
                    <Select options={roles} defaultValue={defaultRole} onChange={this.handleSelectionChange}/>
                    {isEmpty(role) &&
                    <div className="help">Patient is required</div>}
                </div>

                <button onClick={this.handleSubmit} disabled={!this.state.formIsValid} style={{marginLeft: "auto", marginRight:"auto", width:'300px'}} type="submit" className="btn btn-dark btn-lg btn-block">Register</button>
                <p className="forgot-password text-right">
                    Already registered? <a href="/login">Log in.</a>
                </p>
            </div>
        );
    }
};

export default RegisterContainer;