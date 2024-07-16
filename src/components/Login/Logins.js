import React, { useState } from 'react';
import axios from 'axios'; // Don't forget to import axios if it's not already imported
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../store/slices/authSlice';
import { fetchPermissionList } from '../../store/slices/userInfoSlice';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';

// import RootsLogo from "../../image/root.png";
import RootsLogo from '../images/logo-full-v.png';
import apiURL from '../.././apiConfig';
import AlertSuccess from '../common/AlertSuccess';
import AlertError from '../common/AlertError';
import { Navigate, useNavigate } from 'react-router-dom';
import { routes } from '../../constants/routes';

const LoginForm = () => {
  const navigate = useNavigate();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSuccessAlert, setSuccessShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);
  // const [staySignedIn, setStaySignedIn] = useState(false);

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  const closeSuccessAlert = () => {
    setSuccessShowAlert(false);
  };

  const closeErrorAlert = () => {
    setErrorShowAlert(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    setValue: setValueLogin,
    formState: { errors: errorsLogin },
    reset: resetLogin,
  } = useForm();

  const dispatch = useDispatch();

  const handleLogin = (loginData) => {
    setErrorShowAlert(false);
    console.log('Login data ', loginData);
    const user = {
      email: loginData.userEmail,
      password: loginData.password,
    };
    try {
      setIsLoading(true);
      dispatch(loginAsync(user)).then((result) => {
        // 'result' here contains either the fulfilled action payload or the rejected action payload
        if (result.payload.detail) {
          setErrorMsg(result.payload.detail);
        } else if (result.payload) {
          setErrorMsg(result.payload);
          // navigate('/');
        }
        setErrorShowAlert(true);
        setIsLoading(false);
        dispatch(fetchPermissionList());
      });
    } catch (error) {
      console.error('Login error:', error);
    }

    console.log('Login');
  };
  
  const handlePasswordReset = (resetData) => {
    console.log(resetData);
    
    axios
    .post(`${apiURL}/api/password/reset/`, resetData)
      .then((response) => {
        console.log(response.data);
        setSuccessMsg('Password reset email has been sent');
        setErrorShowAlert(false);
        setSuccessShowAlert(true);
      })
      .catch((error) => {
        console.error(
          'Error fetching Client Diagnosis Data:',
          error.response.data
        );
        setErrorMsg(error?.response?.data?.error);
        setSuccessShowAlert(false);
        setErrorShowAlert(true);
      });
  };

  if (isLoggedIn) {
    return <Navigate to={routes.dashboard} replace={true} />;
  }

  return (
    <div
      className="w-screen h-screen relative bg-white bg-cover bg-center"
      style={{ backgroundImage: "url('./login/background.png')" }}
    >
      <div className={`flex items-center justify-center h-screen`}>
        {isFlipped ? (
          <div
            className={`w-96 h-fit flex flex-col bg-white rounded shadow`}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {showSuccessAlert && (
              <div style={{ transform: 'rotateY(180deg)' }}>
                <AlertSuccess
                  message={successMsg}
                  handleClose={closeSuccessAlert}
                />{' '}
              </div>
            )}
            {showErrorAlert && (
              <div style={{ transform: 'rotateY(180deg)' }}>
                <AlertError message={errorMsg} handleClose={closeErrorAlert} />{' '}
              </div>
            )}
            <form onSubmit={handleSubmit(handlePasswordReset)}>
              <div style={{ transform: 'rotateY(180deg)' }}>
                <div
                  className={`flex flex-col items-center space-y-0 pb-5 ${
                    showSuccessAlert || showErrorAlert ? 'pt-0' : 'pt-5'
                  }`}
                >
                  <img className="w-24 h-100" src={RootsLogo} />
                  <div className="font-medium text-2xl pt-3">
                    Reset Password
                  </div>
                </div>
                <div className="flex flex-col items-start px-4">
                  <div className=" text-gray-800 text-opacity-50 text-xs font-normal">
                    Enter Roots Email Address
                  </div>
                  <input
                    data-testid="reset-email-address"
                    id="reset-email-address"
                    className="border-b border-gray-800  focus:outline-none px-2 py-1 w-full mb-2"
                    {...register('email', {
                      required: 'Email Address is required',
                      pattern: {
                        // value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        // message: "Invalid email address",
                        value: /^[A-Z0-9._%+-]+@rootscommunityhealth\.org$/i,
                        message:
                          'Email must be from the rootscommunityhealth.org domain',
                      },
                    })}
                  />
                  {errors.email && (
                    <p role="alert" className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                  <div className="flex w-full justify-evenly pb-5 pt-12">
                    <div className="p-3">
                      <button
                        data-testid="reset-cancel"
                        id="reset-cancel"
                        className="w-28 h-8 border-1 border-[#0F7235] text-md rounded-sm"
                        onClick={() => {
                          setIsFlipped(!isFlipped);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="p-3">
                      <button
                        data-testid="reset-submit"
                        id="reset-submit"
                        type="submit"
                        className="w-28 h-8 border-1 bg-[#0F7235] text-white text-md rounded-sm"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div
            className={`w-96 h-fit flex flex-col bg-white rounded shadow ${
              showErrorAlert ? 'pt-0' : 'pt-5'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {showErrorAlert && (
              <div>
                <AlertError message={errorMsg} handleClose={closeErrorAlert} />{' '}
              </div>
            )}
            <form onSubmit={handleSubmitLogin(handleLogin)}>
              <div className="flex flex-col items-center space-y-0 pb-5 pt-0">
                <img className="w-24 h-20" src={RootsLogo} />
                <div className="font-medium text-2xl pt-3">Welcome</div>
                {isLoading && (
                  <BeatLoader
                    className="opacity-75"
                    color="#0F7235"
                    size={25}
                  />
                )}
              </div>
              <div className="">
                <div className="flex flex-col items-start px-4">
                  <div className="text-gray-800 text-opacity-50 text-xs font-normal">
                    Enter Roots Email Address
                  </div>
                  <input
                    data-testid="login-email-address"
                    id="login-email-address"
                    placeholder="rootsclinic email"
                    className="border-b border-gray-800 focus:outline-none px-2 py-1 w-full mb-2"
                    {...registerLogin('userEmail', {
                      required: 'Email Address is required',
                      pattern: {
                        // value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        // message: "Invalid email address",

                        value: /^[A-Z0-9._%+-]+@rootscommunityhealth\.org$/i,
                        message:
                          'Email must be from the rootscommunityhealth.org domain',
                      },
                    })}
                  />
                  {errorsLogin.userEmail && (
                    <p role="alert" className="text-red-500 text-xs pb-3">
                      {errorsLogin.userEmail.message}
                    </p>
                  )}
                  <div className="text-gray-800 text-opacity-50 text-xs font-normal">
                    Enter Roots Password
                  </div>
                  <input
                    data-testid="login-password"
                    id="login-password"
                    type="password"
                    className="border-b border-gray-800 focus:outline-none px-2 py-1 w-full mb-2"
                    {...registerLogin('password', {
                      required: 'Password is required',
                    })}
                  />
                  {errorsLogin.password && (
                    <p role="alert" className="text-red-500 text-xs pb-3">
                      {errorsLogin.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between pt-3 px-4 pb-12">
                <div className="flex flex-row space-x-4">
                  {/* <div data-testid="stay-signed-in" className="w-6 h-3 relative hover:cursor-pointer" onClick={() => { localStorage.setItem("StaySignedIn", !staySignedIn); setStaySignedIn(!staySignedIn); }}>
                    {staySignedIn ? (
                      <div data-testid="yes-signed-in" id="yes-signed-in">
                        <div className="w-8 h-4 left-0 top-0 absolute bg-[#0F7235] opacity-80 rounded-xl" />
                        <div className="w-4 h-4 left-4 top-0 absolute rounded-full border border-black" />
                      </div>
                    ) : (
                      <div data-testid="no-signed-in" id="no-signed-in"><div className="w-8 h-4 left-0 top-0 absolute bg-zinc-300 rounded-xl" />
                        <div className="w-4 h-4 left-0 top-0 absolute rounded-full border border-black" />
                      </div>)}
                  </div>
                  <div className="text-black-500 text-xs font-normal">
                    Stay Signed In
                  </div> */}
                </div>
                <div
                  data-testid="reset-password-click"
                  id="reset-password-click"
                  className="text-black-500 text-xs font-normal hover:cursor-pointer"
                  onClick={() => {
                    // (e) => {
                    // e.preventDefault();
                    setIsFlipped(!isFlipped);
                    setErrorShowAlert(false);
                    setSuccessShowAlert(false);
                    reset();
                  }}
                >
                  Reset Your Password
                </div>
              </div>
              <div className="flex flex-col items-center pb-5">
                <button
                  data-testid="login-in-button"
                  id="login-in-button"
                  type="submit"
                  className="w-36 h-10 border-1 bg-[#0F7235] text-white text-md rounded-sm"
                >
                  SIGN IN
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {/* {
        showModal && (
          <PasswordReset toggleModal={toggleModal} />
        )
      } */}
      <div className="absolute bottom-0 right-0">
        <img src="./login/flower-pot.png" className="w-44 h-72"></img>
      </div>
    </div>
  );
};

export default LoginForm;
