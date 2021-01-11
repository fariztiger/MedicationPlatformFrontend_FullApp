import React from 'react'
import logo from './commons/images/icon.png';

import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import {NavItem} from "react-bootstrap";
import Text from "recharts/lib/component/Text";

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

function getPath() {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (user !== null && user !== undefined && user !== '') {
        switch (user.role) {
            case 'PATIENT':
                return '/patient';
            case 'CAREGIVER':
                return '/caregiver';
            case 'DOCTOR':
                return '/doctor';
            default:
                return '/';
        }
    } else {
        return '/';
    }
}

const NavigationBar = () => (
    <div>
        <Navbar color={'dark'} light expand="md">
            <NavbarBrand href="/">
                <img alt="logo" src={logo} width={"50"}
                     height={"35"} />
            </NavbarBrand>
            <Nav className="mr-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle style={textStyle} nav caret>
                       Menu
                    </DropdownToggle>
                    <DropdownMenu right >

                        <DropdownItem>
                            <NavLink href="/login">Login</NavLink>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem > <NavLink href={getPath()}><Text style={{color:'white'}}>My page</Text></NavLink></NavItem>
            </Nav>
        </Navbar>
    </div>
);

export default NavigationBar
