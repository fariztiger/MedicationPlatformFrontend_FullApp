import React from 'react';
import * as API_USERS from "./user-api"
import PatientContainer from "../patient/doctor-container";
import PatientPage from "../patient_component/patient";
import CaregiverContainer from "../caregiver/caregiver-container";


function login(username, password, userList) {
    let user = {};
    for (let i = 0; i < userList.length; ++i) {

        if (userList[i].username === username && userList[i].password === password) {
            user = userList[i];
            return user;
        }
    }
    return user;
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            completed: false,
            error: '',
            userList: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    getPath(userRole) {
        console.log(userRole);
        let path_comp = {};
        switch(userRole) {
            case 'DOCTOR':
                path_comp = {
                    path: '/doctor',
                    comp: PatientContainer
                };
                break;
            case 'PATIENT':
                path_comp = {
                    path: '/patient',
                    comp: PatientPage
                };
                break;
            case 'CAREGIVER':
                path_comp = {
                    path: '/caregiver',
                    comp: CaregiverContainer
                };
                break;
            default:
                path_comp = {
                    path: '/login',
                    comp: LoginPage
                }
        }

        return path_comp;
    }

    handleSubmit(e) {
        e.preventDefault();
        const {userList} = this.state;
        this.setState({completed: true, error: ''});
        const {username, password} = this.state;
        if (!username || !password) {
            return;
        }
        let user = login(username, password, userList);
        console.log(user);
        localStorage.setItem('loggedUser', JSON.stringify(user));
        const path = this.getPath(user.role);
        window.location.href = path.path;
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value})
    }

    jumpToRegister() {
        window.location.href = "/register";
    }

    render() {
        const {username, password, completed, error} = this.state;
        return (
            <div className="col-md-3 col-md-offset-3">
                <h2 style={{float:'right'}}>Login
                <small className="text-muted"> to continue.</small>
                </h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group'}>
                        <label> Username </label>
                        <input  type={'text'} className={'input-group input-group-sm'} name={'username'} value={username}
                               onChange={this.handleChange}/>
                        {completed && !username &&
                        <div className="error-message">Username is required</div>
                        }
                    </div>
                    <div className={'form-group'}>
                        <label> Password </label>
                        <input type='password' className={'input-group input-group-sm'} name={'password'} value={password}
                               onChange={this.handleChange}/>
                        {
                            completed && !username &&
                            <div className='error-message'>Password is required</div>
                        }
                    </div>

                    <div className={'form-group'}>
                        <button style={{float:'right', marginLeft:'10px'}} className={'btn btn-lg btn-dark'}>
                            Login
                        </button>
                    </div>
                    <div className={'form-group'}>
                        <button onClick={this.jumpToRegister} style={{float:'right'}} className={'btn btn-lg btn-light'}>
                            Register
                        </button>
                    </div>
                    {error && <div className={'alert alert-danger'}>{error}</div>}
                </form>

            </div>

        );
    }
}

export default LoginPage;