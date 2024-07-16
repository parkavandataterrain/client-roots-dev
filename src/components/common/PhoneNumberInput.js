import zIndex from '@mui/material/styles/zIndex';
import React, { useRef, useState } from 'react';
// import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

import 'react-phone-input-2/lib/material.css';

const PhoneNumberInput = (
  name,
  id = { name },
  placeholder,
  width = 480,
  height = '7vh',
  isEdittable,
  value,
  handleChange,
  register,
  registerProps = {}
) => {
  const bgDisabled = isEdittable ? '#F6F7F7' : '';
  const bgLabelDisabled = isEdittable ? '#F6F7F7' : 'white';

  if (!register) {
    register = () => {};
  }
  return (
    <div>
      <PhoneInput
        name={name}
        id={id || name}
        country={'us'}
        value={value}
        onlyCountries={['us']}
        countryCodeEditable={false}
        specialLabel={placeholder || 'Mobile Number *'}
        inputStyle={{ height: height, background: bgDisabled }}
        disabled={isEdittable}
        onChange={handleChange}
        {...register(name, registerProps)}
      />
    </div>
  );
};

export default PhoneNumberInput;
