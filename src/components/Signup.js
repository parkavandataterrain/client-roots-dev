import React, { useState } from 'react';
import { serverAddress } from './constants';
import apiURL from '.././apiConfig';

const SignupPage = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value); // Corrected to update password state
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };


  const handlesignup = async () => {
    try {
      // const response = await fetch(`${apiURL}/api/signup/`, {
      const response = await fetch(serverAddress+"api/signup/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, confirm_password })
      });
  
      const data = await response.json(); // Parse response JSON
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      window.location.href = '/';
  
   
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };





  return (
    <section className="vh-100" style={{ backgroundColor: '#eee' }}>
      <div className="container-fluid h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: '25px' }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                    <form className="mx-1 mx-md-4">

                      <div className="mb-4 row align-items-center">
                        <label className="col-sm-3 col-form-label">Your Name</label>
                        <div className="col-sm-9">
                          <div className="d-flex flex-row align-items-center">
                            <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                            <input type="text" id="form3Example1c" className="form-control"  value={username} onChange={handleUsernameChange}/>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 row align-items-center">
                        <label className="col-sm-3 col-form-label">Your Email</label>
                        <div className="col-sm-9">
                          <div className="d-flex flex-row align-items-center">
                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                            <input type="email" id="form3Example3c" className="form-control"   value={email} onChange={handleEmailChange}/>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 row align-items-center">
                        <label className="col-sm-3 col-form-label">Password</label>
                        <div className="col-sm-9">
                          <div className="d-flex flex-row align-items-center">
                            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                            <input type="password" id="form3Example4c" className="form-control"  value={password} onChange={handlePasswordChange} />
                            
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 row align-items-center">
                        <label className="col-sm-3 col-form-label">Repeat your password</label>
                        <div className="col-sm-9">
                          <div className="d-flex flex-row align-items-center">
                            <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                            <input type="password" id="form3Example4cd" className="form-control" value={confirm_password} onChange={handleConfirmPasswordChange} />
                          </div>
                        </div>
                      </div>

                      <div className="form-check d-flex justify-content-center mb-5">
                        <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3c" />
                        <label className="form-check-label" htmlFor="form2Example3">
                          I agree all statements in <a href="#!">Terms of service</a>
                        </label>
                      </div>

                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="button" className="btn btn-primary btn-lg" onClick={handlesignup}>Register</button>
                      </div>

                    </form>

                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid" alt="Sample image" />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;
