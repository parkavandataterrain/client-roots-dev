import React from "react";


function toggleSign(user, signs, setSigns) {
  if (signs.find((sign) => sign.staff_name === user)) {
    setSigns(signs.filter((sign) => sign.staff_name !== user));
  } else {
    setSigns([...signs, {staff_name: user, timestamp: new Date().toISOString().replace("T", " ").slice(0, 19)}]);
  }
}

function SignInput({ className, user, signs, setSigns, ...rest }) {
  return (
    <div
      className={`w-full flex justify-between items-center border rounded-[6px] ${className}`}
    >
      {!signs?.length && <div className="px-3 text-[#8C8C8C]">Signed by</div>}
      {signs?.length > 0 && (
        <div className="flex items-center gap-x-2 overflow-x-auto mr-3 mx-2">
          {signs.map((sign) => (
            <div className="bg-[#D4EDEC] my-1 p-1 flex gap-x-2 rounded-sm justify-center items-center">
              <div className="text-nowrap">{sign.staff_name + " " + sign.timestamp}</div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => toggleSign(user, signs, setSigns)}
        className="bg-[#5BC4BF] text-white px-3 py-2"
      >
        Sign Now As/Unsign
      </button>
    </div>
  );
}

export default SignInput;
