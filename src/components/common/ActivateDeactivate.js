import ToggleBlackDeactivate from '../images/toggle_black_deactivate.svg';
import ToggleGreenActivate from '../images/toggle_green_activate.svg';

const ActivateDeactivate = (props) => {
    const { status, onclickAction } = props;
    const hoverBgClass = status ? "hover:bg-teal-300" : "hover:bg-red-300";
    // const className = `p-1 ${hoverBgClass} bg-opacity-50 hover:rounded`;
    const className = `p-1 bg-opacity-50 hover:rounded`;

    return <button
        className={className}
        title={
            status
                ? "Deactivate"
                : "Activate"
        }
        onClick={(e) => {
            e.stopPropagation();
            onclickAction();
        }}
    >
        <img
            src={
                status
                    ? ToggleGreenActivate
                    : ToggleBlackDeactivate
            }
            className="w-5 h-4"
            style={{ display: "block", margin: "0 auto" }}
        />
    </button>
}

export default ActivateDeactivate;