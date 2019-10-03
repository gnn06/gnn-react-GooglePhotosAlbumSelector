import React from 'react';
import DatePicker  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class DateFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date()
        }

        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.dateFilterSubmit = this.dateFilterSubmit.bind(this);
    }

    setStartDate(date) {
        this.setState({startDate: date});
    }

    setEndDate(date) {
        this.setState({endDate: date});
    }

    dateFilterSubmit() {
        this.props.dateFilterHandle({start: this.state.startDate, end: this.state.endDate});
    }   

    render() {
        return <div>
            De <DatePicker selected={this.state.startDate} onChange={date => this.setStartDate(date)}/> 
                        à <DatePicker selected={this.state.endDate} onChange={date => this.setEndDate(date)}/>
            <button onClick={this.dateFilterSubmit}>filter</button>
        </div>;
    }
    
}

