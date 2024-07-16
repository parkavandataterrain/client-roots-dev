import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="w-full my-10">
            <h1 className="text-center font-normal text-lg pb-10">Dashboard</h1>
            <div className='flex flex-row justify-around'>
                <Link to="/admin-dashboard" className="text-teal-600">
                    Admin Dashboard
                </Link>
                <Link to="/create-form" className="text-teal-600">
                    Create Form
                </Link>
                <Link to="/care-form" className="text-teal-600">
                    Care Plan Form
                </Link>
                <Link to="/encounter-form" className="text-teal-600">
                    Encounter Form
                </Link>
            </div>

        </div>
    );
}

export default Dashboard;