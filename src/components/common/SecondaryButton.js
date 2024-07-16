const SecondaryButton = ({ text, width = 150, height = 50 }) => {
    return (
        <button
            type="button"
            style={{ width, height }}
            className="text-green-800 border-1 border-green-800 rounded-md text-lg"
        >
            {text}
        </button>
    );
}

export default SecondaryButton;

