import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import apiURL from '../../apiConfig';


const CarePlanForm = () => {
  const [carePlan, setCarePlan] = useState(null);
  const { clientId } = useParams();

  useEffect(() => {
    // Fetch care plan data from API
    const fetchCarePlan = async () => {
      try {
        console.log(`${apiURL}}/client-care-plans/${clientId}`,"care-plan-url")
        const response = await axios.get(`${apiURL}/client-care-plans/${clientId}`);
        setCarePlan(response.data);
      } catch (error) {
        console.error('Error fetching care plan:', error);
      }
    };

    fetchCarePlan();
  }, []);

  return (
    <div>
      {carePlan && (
        <div>
          <h2>Care Plan</h2>
          <p>Client Name: {carePlan.client_information.first_name} {carePlan.client_information.last_name}</p>
          <p>Preferred Pronouns: {carePlan.client_information.preferred_pronouns}</p>
          <p>Date of Birth: {carePlan.client_information.date_of_birth}</p>
          <p>System ID: {carePlan.system_id}</p>
          <p>Primary Phone: {carePlan.client_information.primary_phone}</p>
          <p>Email: {carePlan.client_information.email_address}</p>
          <p>User Name: {carePlan.user_name}</p>
          <p>Facility: {carePlan.facility}</p>
          <p>Program: {carePlan.program}</p>
          <p>Care Plan Template: {carePlan.care_plan_template}</p>
          <p>created Date: {carePlan.created_date}</p>
          
          <br></br>
          <br></br>
          <h3>Client Goals:</h3>
          {carePlan.client_goals.map((goal) => (
            <div key={goal.id}>
              <p>Goal: {goal.smart_goal_summary}</p>
              <p>Start Date: {goal.start_date}</p>
              <p>Problem: {goal.problem}</p>
              <p>Status: {goal.goal_status}</p>
              <p>Priority: {goal.goal_priority}</p>
              <p>Readiness: {goal.stage_of_readiness}</p>
              <p>Strengths: {goal.client_strengths}</p>
              <p>Barriers: {goal.potential_barriers}</p>
              <p>Comments: {goal.comments}</p>
              <p>Goal Date: {goal.goal_date}</p>
              
              <br></br>
              <h4>Interventions:</h4>
              {goal.interventions.map((intervention) => (
                <div key={intervention.id}>
                  <p>Intervention: {intervention.intervention}</p>
                  <p>Due Date: {intervention.due_date}</p>
                  <p>Completed Date: {intervention.completed_date}</p>
                  <p>Notes: {intervention.notes}</p>
                </div>
              ))}
            </div>
          ))}
         <br></br>
         <br></br>
          <h3>Client History:</h3>
          {carePlan.client_history.map((history) => (
            <div key={history.id}>
              <p>User: {history.user}</p>
              <p>Action: {history.action}</p>
              <p>Date: {history.date}</p>
              <p>Time: {history.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarePlanForm;
