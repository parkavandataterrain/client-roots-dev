import React from 'react';

const PasswordResetForm = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card text-center" style={{ width: "300px" }}>
                <div className="card-header h5 text-white bg-primary">Password Reset</div>
                <div className="card-body px-5">
                    <p className="card-text py-2">
                        Enter your email address and we'll send you an email with instructions to reset your password.
                    </p>
                    <div className="form-outline">
                        <input type="email" id="typeEmail" className="form-control my-3" />
                        <label className="form-label" htmlFor="typeEmail">Email input</label>
                    </div>
                    <button className="btn btn-primary w-100">Reset password</button>
                    <div className="d-flex justify-content-between mt-4">
                        <a href="#">Login</a>
                        <a href="#">Register</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PasswordResetForm;
