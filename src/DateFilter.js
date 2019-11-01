import React from 'react';
import DatePicker, { registerLocale }  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import fr from "date-fns/locale/fr";

registerLocale("fr", fr);

export default class DateFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.dateFilter.startDate,
            endDate: this.props.dateFilter.endDate
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
            De <DatePicker 
                    selected={this.state.endDate}
                    onChange={date => this.setEndDate(date)}
                    locale="fr"
                    dateFormat="dd/MM/yyyy"/>
            à <DatePicker
                    selected={this.state.startDate}
                    onChange={date => this.setStartDate(date)}
                    locale="fr"
                    dateFormat="dd/MM/yyyy"/> 
            <button className="btn btn-primary" onClick={this.dateFilterSubmit}>filter</button>
        </div>;
    }
    
}

