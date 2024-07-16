export const serverAddress = "http://127.0.0.1:8000/"

export const COLUMNS = [
    {
        Header: 'Client',
        accessor: row => `${row.first_name}, ${row.last_name}`,
        width: 150,
    },
    {
        Header: 'DOB',
        accessor: 'date_of_birth',
        width: 130,
    },
    {
        Header: 'Gender',
        accessor: 'sex',
        width: 50,
    },
    {
        Header: 'Phone',
        accessor: 'mobile_number',
        width: 50,
    },
    //    {
    //        Header: 'Date Assigned',
    //        accessor: 'date_assigned',
    //        width: 130,
    //    },
    //    {
    //        Header: 'Program',
    //        accessor: 'program',
    //        width: 50,
    //    },
    // {
    //     Header: 'Status',
    //     accessor: 'status',
    // },
    // {
    //     Header: 'HMIS ID',
    //     accessor: 'hmis_id',
    // },
    // {
    //     Header: 'Housing Status',
    //     accessor: 'housing_status',
    // },
    // {
    //     Header: 'CE Application Exper Date',
    //     accessor: 'ce_application_date ',
    // },
    // {
    //     Header: 'Social Risk Score: Housing',
    //     accessor: 'social_risk_score_housing',
    // },
    // {
    //     Header: 'Latest Housing Status Update',
    //     accessor: 'latest_housing_status',
    // },
    // {
    //     Header: 'Staff Signed to Client',
    //     accessor: 'staff_signed_to_client',
    // },
    // {
    //     Header: 'Last Reviewed',
    //     accessor: 'last_reviewed',
    // },
    // {
    //     Header: 'Latest Encounter Date',
    //     accessor: 'latest_encounter_date',
    // },
    // {
    //     Header: 'Latest Encounter Note [Summary Field]',
    //     accessor: 'latest_encounter_note',
    // },
    // {
    //     Header: 'Client Profile',
    //     accessor: 'clientProfile',
    // },
    // {
    //     Header: 'Client Chart',
    //     accessor: 'clientChart',
    // },
    // {
    //     Header: 'New Encounter Note',
    //     accessor: 'newEncounterNote',
    // },
];


export const SOCIAL_VITAL_COLUMNS = [
    {
        Header: 'Domain',
        accessor: 'domain',
        width: 250,
    },
    {
        Header: 'Risk',
        accessor: 'risk',
        width: 250,
    },
    //    {
    //        Header: 'Date Last Accessed',
    //        accessor: 'date_last_accessed',
    //        width: 250,
    //    },
];

export const DIAGNOSIS_COLUMNS = [
    {
        Header: 'Diagnosis Name',
        accessor: 'diagnosis_name',
        width: 250,
    },
    {
        Header: 'ICD10 Code',
        accessor: 'icd10_code',
        width: 180,
    },
    {
        Header: 'Comments',
        accessor: 'comments',
        width: 180,
    },
    {
        Header: 'Last Updated By',
        accessor: 'last_updated_by',
        width: 200,
    },
    {
        Header: 'Last Updated Date',
        accessor: 'last_updated_date',
        width: 220,
    },
    {
        Header: 'Start Date',
        accessor: 'start_date',
        width: 150,
    },
    {
        Header: 'Stop Date',
        accessor: 'stop_date',
        width: 150,
    },
    {
        Header: 'Status',
        accessor: 'diagnosis_status',
        width: 100,
    },
];

export const MEDICATION_COLUMNS = [
    {
        Header: 'Medication',
        accessor: 'medication',
        width: 150,
    },
    {
        Header: 'Comments',
        accessor: 'comments',
        width: 150,
    },
    {
        Header: 'Last Updated By',
        accessor: 'last_updated_by',
        width: 200,
    },
    {
        Header: 'Last Updated Date',
        accessor: 'last_updated_date',
        width: 220,
    },
    {
        Header: 'Start Date',
        accessor: 'start_date',
        width: 150,
    },
    {
        Header: 'Stop Date',
        accessor: 'stop_date',
        width: 150,
    },
    {
        Header: 'Status',
        accessor: 'status',
        width: 100,
    },
];