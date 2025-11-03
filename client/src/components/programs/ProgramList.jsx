import React from 'react';
import { programs } from '../../data/mockData';
import './programList.css';

const ProgramList = () => {
  return (
    <div className="programs-section">
      <div className="programs-hero">
      </div>
      
      <div className="programs-container">
        <h2 className="programs-title">Available Programs</h2>
        <div className="programs-grid">
          {programs.map((program) => (
            <article className="program-card" key={program.id}>
              <div className="program-card-content">
                <h3 className="program-name">{program.name}</h3>
                <div className="program-code">Program Code: {program.code}</div>
                <p className="program-desc">{program.description}</p>
                <div className="program-meta">
                  <div className="meta-item"><strong>Duration:</strong> {program.duration}</div>
                  <div className="meta-item"><strong>Term:</strong> {program.term}</div>
                  <div className="meta-item"><strong>Start Date:</strong> {new Date(program.startDate).toLocaleDateString()}</div>
                  <div className="meta-item"><strong>End Date:</strong> {new Date(program.endDate).toLocaleDateString()}</div>
                  <div className="fees-section">
                    <div className="fees-title"><strong>Fees:</strong></div>
                    <div className="fees-item">Domestic: ${program.fees.domestic.toLocaleString()}</div>
                    <div className="fees-item">International: ${program.fees.international.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramList;
