import React, { Component } from 'react';
import cookie from 'js-cookie';

class CheckAge extends Component {
    constructor(props){
        super(props);

        this.state = {
            dob: '',
            min_age: 18,
            age_error: false,
            age_success: false,
            button: false,
            country: 'UK',
            expires: 7,
            countries: [
                {
                    country_name: 'United Kingdom',
                    age: 21,
                    country_code: 'UK'
                },
                {
                    country_name: 'United States',
                    age: 18,
                    country_code: 'USA'
                },
                {
                    country_name: 'Canada',
                    age: 18,
                    country_code: 'CA'
                },
                {
                    country_name: 'France',
                    age: 18,
                    country_code: 'FR'
                },
                {
                    country_name: 'Mexico',
                    age: 18,
                    country_code: 'MEX'
                }
            ]
        };
    }

    getAgeFromBirthDate(year, month, day)
    {
        const date = new Date();
        date.setFullYear(date.getFullYear() - year);
        date.setMonth(date.getMonth() - month);
        return date;
    }

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({
            [name]:value
        })
    }

    getAgeFromCountry(country_code)
    {
        const getAge = this.state.countries.find(element => element.country_code === country_code);
        return getAge.age;
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { dob } = this.state;
        const year = dob.split("-")[0];
        const month = dob.split("-")[1];
        const day = dob.split("-")[2];
        if(this.getAgeFromBirthDate(year, month, day).getFullYear() >= this.getAgeFromCountry(this.state.country)){
            cookie.set("ageGateConfirmation", "true", {expires: this.state.expires});
            window.location.href='/games';
            this.setState({age_success: true, button: false});
        }else{
            this.setState({age_error: true, button: true});
        }
    }

    render() {

        const countries = []

        this.state.countries.forEach(function(item,key){
            countries.push(<option value={item.country_code}>{item.country_name} - {item.country_code} ({item.age}+)</option>)
        })

        return (
            <div style={{textAlign: 'center'}}>

                {

                    this.state.age_error ?
                        <div style={{padding: '20px', backgroundColor: '#f44336',fontSize: '30px',color: 'white'}}>You are not old enough to enter this website</div>
                 :
                 ""

                }

                {

                    this.state.age_success ?
                                        <div style={{padding: '20px',
                 backgroundColor: '#4CAF50',
                 fontSize: '30px',
                 display: 'none',
                 color: 'white'}}>You are good to go, you passed the age gate!</div>
                 :
                 ""

                }

                <h1 style={{fontSize: '30px'}}>You must be of legal age to enter this site.</h1>


                <form onSubmit={this.onSubmit}>

                <div>
                <label style={{color: '#333333', fontSize: '20px'}}>Select Your Date of Birth</label>
                <br/><br/>
                </div>
                <div>
                <input className={"dateInput"} title={(this.state.button ? "You can't retry now" : "Enter DOB")} disabled={this.state.button} name="dob" required onChange={this.handleChange} type='date' style={{padding: '12px 20px',
                margin: '8px 0', boxSizing: 'border-box', border: '3px solid #555'}} />
                </div>

                <div>
                <label style={{color: '#004de2', fontSize: '25px'}}>Select Your Country</label>
                <br/><br/>
                </div>
                <div>

                <select name='country' title={(this.state.button ? "You can't retry now" : "Choose Your Country")} disabled={this.state.button} onChange={this.handleChange} required style={{width: '50%', padding: '12px 20px', margin: '8px 0', boxSizing: 'border-box', border: '3px solid #555'}}>
                <option disabled>Choose your country...</option>
                {countries}
                </select>
                </div>

                <div>
                <br/>
                <button type='submit' title={(this.state.button ? "You can't retry now" : "Enter")} style={{backgroundColor: '#004de2',
                    border: 'none',
                    color: 'white',
                    padding: '15px 32px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px'
                }} disabled={this.state.button}>Enter</button>
                </div>
                </form>
            </div>
        )
            
    }
}

export default CheckAge;