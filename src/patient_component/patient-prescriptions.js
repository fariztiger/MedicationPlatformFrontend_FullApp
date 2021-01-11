import React from 'react';
import Card from "react-bootstrap/Card";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";

class PatientPrescriptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            prescription: props.prescription
        }
    }

    render() {
        const {prescription} = this.state;

        const medicine = prescription.medicine.map((med) => {
            return (
                <li>
                    <label className={"font-weight-bold"}> Name: <label className="text-muted font-weight-light"> {med.name} </label> </label> <br/>
                    <label className={"font-weight-bold"}> Description: <label className="text-muted font-weight-light"> {med.description} </label> </label> <br/>
                    <label className={"font-weight-bold"}> Side effects: <label className="text-muted font-weight-light"> {med.sideEffects} </label> </label> <br/>
                </li>
            )
        });
        return (
            <Card style={{marginLeft:'10px'}}>
                <CardHeader>
                    Prescription with ID #{prescription.prescriptionId}
                </CardHeader>
                <CardBody>
                    <label className={"font-weight-bold"}>Start date: <label className="text-muted font-weight-light"> {prescription.startTime}  </label> </label> <br/>
                    <label className={"font-weight-bold"}>End date: <label className="text-muted font-weight-light"> {prescription.endTime} </label>  </label>  <br/>
                    <label className={"font-weight-bold"}>Medicine: </label>
                    <ul >
                        {medicine}
                    </ul>
                </CardBody>
            </Card>
        )
    }
}

export {PatientPrescriptions};