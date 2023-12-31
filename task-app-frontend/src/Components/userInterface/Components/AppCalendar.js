import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import '../../../App.css'

export default function AppCalendar(props) {

    //const [deadline, setDeadline] = useState(new Date())

    const handleDateChange = (date) => {
        props.setDeadline(date)
    }

    return (
        <div>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>Select Deadline</h2><br />
            <div className='calendar-container'>
                <Calendar onChange={handleDateChange} value={props.deadline} />
            </div>
        </div>
    );
}