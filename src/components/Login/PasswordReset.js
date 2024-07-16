import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginAsync } from "../../store/slices/authSlice";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import RootsLogo from "../../image/root.png";
import apiURL from "../../apiConfig";
// import PasswordReset from "./PasswordReset";
import AlertSuccess from "../common/AlertSuccess";
import AlertError from "../common/AlertError";

const PasswordReset = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [showSuccessAlert, setSuccessShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

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
    watch,
  } = useForm();

  const onPasswordConfirm = (resetData) => {
    console.log(resetData);
    reset();
    const reset_url = `${apiURL}/api/password/reset/confirm/?token=${token}&email=${email}`;
    const data = {
      new_password: resetData.newPassword,
      confirm_password: resetData.confirmPassword,
    };
    axios
      .post(reset_url, data)
      .then((response) => {
        console.log(response.data);
        setErrorShowAlert(false);
        setSuccessShowAlert(true);
        setSuccessMsg(response.data?.success);
      })
      .catch((error) => {
        console.error(
          "Error fetching Client Diagnosis Data:",
          error.response.data
        );
        setSuccessShowAlert(false);
        setErrorShowAlert(true);
        setErrorMsg(error?.response?.data?.error);
      });
  };

  return (
    <div
      className="w-screen h-screen relative bg-white bg-cover bg-center"
      style={{ backgroundImage: "url('./background.png')" }}
    >
      <div className={`flex items-center justify-center h-screen`}>
        <div className={`w-96 h-fit flex flex-col bg-white rounded shadow`}>
          {showSuccessAlert && (
            <div>
              <AlertSuccess
                message={successMsg}
                handleClose={closeSuccessAlert}
              />{" "}
            </div>
          )}
          {showErrorAlert && (
            <div>
              <AlertError message={errorMsg} handleClose={closeErrorAlert} />{" "}
            </div>
          )}
          <form onSubmit={handleSubmit(onPasswordConfirm)}>
            <div>
              <div
                className={`flex flex-col items-center space-y-0 pb-5 ${
                  showSuccessAlert || showErrorAlert ? "pt-0" : "pt-5"
                }`}
              >
                <img className="w-24 h-20" src={RootsLogo} />
                <div className="font-medium text-2xl pt-3">Reset Password</div>
              </div>
              <div className="flex flex-col items-start px-4">
                <div className=" text-gray-800 text-opacity-50 text-xs font-normal">
                  Enter New Password
                </div>
                <input
                  type="password"
                  class="border-b border-gray-800  focus:outline-none px-2 py-1 w-full mb-2"
                  {...register("newPassword", {
                    required: "Password is required",
                  })}
                />
                {errors.newPassword && (
                  <p role="alert" className="text-red-500 text-xs pb-3">
                    {errors.newPassword.message}
                  </p>
                )}
                <div className=" text-gray-800 text-opacity-50 text-xs font-normal">
                  Confirm Password
                </div>
                <input
                  type="password"
                  class="border-b border-gray-800  focus:outline-none px-2 py-1 w-full mb-2"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (val) => {
                      if (watch("newPassword") != val) {
                        return "Your passwords do no match";
                      }
                    },
                  })}
                />
                {errors.confirmPassword && (
                  <p role="alert" className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
                <div className="flex w-full justify-evenly pb-5 pt-12">
                  <div className="p-3">
                    <button
                      className="w-28 h-8 border-1 border-[#0F7235] text-md rounded-sm"
                      onClick={() => {
                        reset();
                      }}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="p-3">
                    <button
                      type="submit"
                      className="w-28 h-8 border-1 bg-[#0F7235] text-white text-md rounded-sm"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* {
        showModal && (
          <PasswordReset toggleModal={toggleModal} />
        )
      } */}
      <div className="absolute bottom-0 right-0">
        <img src="./flower-pot.png" className="w-44 h-72"></img>
      </div>
    </div>
  );
};

export default PasswordReset;
