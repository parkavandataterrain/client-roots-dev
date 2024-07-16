import React, { useMemo, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import ExternalLinkIcon from '../images/externalLink.svg';
import ClientChartImg from '../images/clientChart.svg';
import { Link } from 'react-router-dom';
import BasicTable from '../react-table/BasicTable';
import { fetchClientsInfoAsync } from '../../store/slices/clientsInfoSlice';
import { useWindowSize } from '../Utils/windowResize';
import './MyPanelStyles.css';

function getRandomDate(dates) {
  const randomIndex = Math.floor(Math.random() * dates.length);
  return dates[randomIndex];
}

function getRandomProgram(programs) {
  const randomIndex = Math.floor(Math.random() * programs.length);
  return programs[randomIndex];
}

const MyPanel = React.memo(() => {
  const { width } = useWindowSize();

  const programs = ['ECM', 'Diabetes', 'STOMP'];

  const dates = [
    '2024-03-15',
    '2024-03-16',
    '2024-03-17',
    '2024-03-18',
    '2024-03-19',
    '2024-03-20',
    '2024-03-21',
    '2024-03-22',
    '2024-03-23',
    '2024-03-24',
  ];

  const data = useSelector((state) => state.clientsInfo.data);
  const dataLoading = useSelector((state) => state.clientsInfo.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data.length && !dataLoading) {
      // Check if data is empty and loading state is false
      dispatch(fetchClientsInfoAsync());
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Client',
        accessor: 'first_name',
        align: 'left',
        Cell: ({ row }) => (
          <Link
            to={`/clientchart/${row.original.id}`}
            target="_blank"
            className="hover:underline"
          >
            {`${row.original.first_name}, ${row.original.last_name}`}
          </Link>
        ),
      },
      {
        Header: 'D.O.B',
        accessor: 'date_of_birth',
        align: 'left',
        Cell: ({ value }) => {
          if (!value) return '';

          const date = new Date(value);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();

          return `${month}-${day}-${year}`;
        },
      },
      {
        Header: 'Gender',
        accessor: 'sex',
        align: 'left',
      },
      {
        Header: 'Phone Number',
        accessor: 'mobile_number',
        align: 'left',
      },
      {
        Header: 'Date Assigned',
        accessor: 'date_assigned',
        align: 'left',
        Cell: ({ value }) => {
          if (!value) return '';

          const date = new Date(value);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();

          return `${month}-${day}-${year}`;
        },
      },
      {
        Header: 'Program',
        accessor: 'program',
        align: 'left',
      },
      {
        Header: 'Client Profile',
        Cell: ({ row }) => (
          <Link to={`/clientprofile/${row.original.id}`} target="_blank">
            <Avatar
              className="mx-auto"
              sx={{ bgcolor: '#77ceca', height: 25, width: 25, fontSize: 10 }}
            >
              {row.original?.first_name?.[0].toUpperCase() +
                row.original?.last_name?.[0].toUpperCase()}
            </Avatar>
          </Link>
        ),
      },
      {
        Header: 'Client Chart',
        Cell: ({ row }) => (
          <Link to={`/clientchart/${row.original.id}`} target="_blank">
            <img src={ClientChartImg} className="size-6 mx-auto" alt="client" />
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <div
      id="my-panel-1"
      className="bg-white rounded-md shadow-md flex flex-col col-span-8"
    >
      <div
        id="my-panel-2"
        className="flex justify-between items-center mx-3 sm:mx-8 mt-6"
      >
        <div className="flex items-center space-x-4">
          <span id="my-panel-3" className="text-lg font-medium">
            My Panel
          </span>
          <img
            id="my-panel-4"
            src={ExternalLinkIcon}
            className="size-3 sm:size-4"
            alt="link"
          />
        </div>
        <div className="space-x-2">
          <Link to={`/clientprofilenew`}>
            <button className="px-3 py-1 text-[13px] leading-5 bg-[#5BC4BF] text-white rounded-sm font-medium">
              Add New
            </button>
          </Link>
          <button
            id="my-panel-5"
            className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[13px] font-medium leading-5 text-[#2F9384]"
          >
            View all
          </button>
        </div>
      </div>
      <hr id="my-panel-6" className="w-[98%] mx-auto my-2" />
      <div className={`w-full flex-grow flex flex-col max-w-[${width}px]`}>
        <BasicTable type={'myPanel'} columns={columns} data={data} />
      </div>
    </div>
  );
});

export default MyPanel;
