import React from 'react';
import { programs } from '../../data/mockData';
import './programList.style.css';

const ProgramList = () => {
  return (
    <div className="program-container">
      <h1 className="program-title">Available Programs</h1>
      <div className="program-grid">
        {programs.map((program) => (
          <div className="program-card" key={program.id}>
            <h2 className="program-name">{program.name}</h2>
            <div className="program-code">Program Code: {program.code}</div>
            <p className="program-description">{program.description}</p>
            <div className="program-details">
              <div className="program-detail">
                <strong>Duration:</strong> 
                <span>{program.duration}</span>
              </div>
              <div className="program-detail">
                <strong>Term:</strong> 
                <span>{program.term}</span>
              </div>
              <div className="program-detail">
                <strong>Start Date:</strong> 
                <span>{new Date(program.startDate).toLocaleDateString()}</span>
              </div>
              <div className="program-detail">
                <strong>End Date:</strong> 
                <span>{new Date(program.endDate).toLocaleDateString()}</span>
              </div>
              
              <div className="fees-section">
                <div className="fees-title">Program Fees</div>
                <div className="program-detail">
                  <strong>Domestic:</strong> 
                  <span className="fee-amount">${program.fees.domestic.toLocaleString()}</span>
                </div>
                <div className="program-detail">
                  <strong>International:</strong> 
                  <span className="fee-amount">${program.fees.international.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramList;
