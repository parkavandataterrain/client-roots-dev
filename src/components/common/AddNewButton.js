import GreenPlusPNG from '../images/green-plus.png'

const AddNewButton = ({ text, width = 150, height = 50, handleClick, isDisabled }) => {
    return (
        <button className="flex items-center px-3 py-2 w-32 h-12 bg-white rounded-md border-1 border-green-800"
            onClick={(e) => handleClick(e)}
        >
            <span className="w-14 text-green-800 text-xs font-normal">Add New</span>
            <img src={GreenPlusPNG} alt="green plus" className="ml-2 h-6 w-7" />
        </button>
    );
}

export default AddNewButton;
