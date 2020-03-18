import React from 'react';
import "./CheckAge.css";

const CheckAge = (props) => {

    const [data] = React.useState(null)

    return (
        <div className="container">
            <form name='agegate'>
                <input type='number' name='year' placeholder="Year" />
                    <input type='number' name='month' placeholder="month" />
                        <input type='number' name='day' placeholder="day" />
                <button type='submit'>Enter</button>
            </form>
        </div>
    )
};

export default CheckAge;

