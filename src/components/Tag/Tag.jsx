import { useMemo } from "react";

const options = {
  high: "bg-[#FFE5E5] text-[#E0382D]",
  medium: "bg-[#FEE4D0] text-[#F79421]",
  low: "bg-[#FEFAE5] text-[#F5D11E]",
  no: "bg-[#E9FEFB] text-[#2F9384]",
  yes: "bg-[#FFE5E5] text-[#FF0A0A]",
  pending: "bg-[#FFE5E5] text-[#E0382D]",
  active: "bg-[#FEE4D0] text-[#F79421]",
  done: "bg-[#E9FEFB] text-[#2F9384]",
};

const Tag = ({ text }) => {
  const styles = useMemo(() => {
    return options[text?.toLowerCase()];
  }, [text]);

  return (
    <div
      className={`${styles} text-center text-xs w-[70px] mx-auto py-1 rounded-[2px]`}
    >
      {text}
    </div>
  );
};

export default Tag;
