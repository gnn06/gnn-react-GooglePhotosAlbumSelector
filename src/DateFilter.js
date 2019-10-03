import React, { useState } from 'react';
import DatePicker  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function DateFilter() {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());


    return <div>
            De <DatePicker selected={startDate} onChange={date => setStartDate(date)}/> 
                        à <DatePicker selected={endDate} onChange={date => setEndDate(date)}/>
            <button>filter</button>
        </div>;
    
}

