import './signup.css';
import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import firebase from '../../firebase'
import {db} from '../../firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc} from 'firebase/firestore'

import InputForm from '../../components/input-form/input-form';

class Signup extends React.Component {
  constructor() {
    super();
    this.form = React.createRef();

    // Constants
    this.employerFields = ['name', 'username', 'password', 'company name'];
    this.employerTypes = ['text', 'text', 'password', 'text'];
    this.employeeFields = ['name', 'username', 'password', 'skills'];
    this.employeeTypes = ['text', 'text', 'password', 'text'];

    this.state = {
      selectedOption: 'employee',
    };
  }

  radioButtonPressed = (ev) => {
    this.setState({
      selectedOption: ev.target.value
    });
  };

  signupPressed = () => {
    // TODO: Form Validation
    let formValid = true;

    // Gets reference to form
    const curForm = this.form.current;
    const userData = {
      ...curForm.state.user,
      skills: curForm.state.user.skills.split(' '),
      employee: this.state.selectedOption === 'employee'
    };

    const signupData = {
      username: curForm.state.user.username,
      password: curForm.state.user.password
    }

    if(formValid) {
      createUserWithEmailAndPassword(getAuth(firebase.app), signupData.username, signupData.password)
      .then((userCredential) => {
       //Signed in 
        const user = userCredential.user;
       //...
       // Create user in database to store name, skills, type, etc..
       setDoc(doc(firebase.db, "users", user.uid), userData);
       this.props.history.push('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
      });

      // axios.post(process.env.REACT_APP_BACKEND_URL + '/user', { data: userData }).then(r => {
        // if(r.data.success) {
          // this.props.history.push('/'); // Back to login
        // }
      // });
    }
  };

  isEmployee = () => this.state.selectedOption === 'employee';

  render() {
    const employee = this.isEmployee();
    const fields = employee ? this.employeeFields : this.employerFields;
    const types = employee ? this.employeeTypes : this.employerTypes;

    return (
      <div className="Signup">
        <h1 className="title"> Create a new account </h1>
        <ul>
          <label>
            <input
              type="radio"
              value="employee"
              checked={employee}
              onChange={this.radioButtonPressed}
            />
            Employee
          </label>
          <label>
            <input
              type="radio"
              value="employer"
              checked={!employee}
              onChange={this.radioButtonPressed}
            />
            Employer
          </label>
        </ul>
        <div>
          <InputForm
            inputs={fields}
            types={types}
            buttons={[{ name: 'Sign Up', callback: this.signupPressed }]}
            ref={this.form} 
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Signup);
