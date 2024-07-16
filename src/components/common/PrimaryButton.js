

const PrimaryButton = ({ text, width = 150, height = 50, handleClick, isDisabled, type = "button" }) => {
    return (
        <button
            type={type}
            style={{ height }}
            className="w-full border-1 bg-green-800 text-white text-lg rounded-md"
            onClick={handleClick}
            disabled={isDisabled}
        >
            {text}
        </button>
    );
}

export default PrimaryButton;
