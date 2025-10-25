import React from 'react';
import { programs } from '../../data/mockData';
import './programList.css';

const ProgramList = () => {
  return (
    <div className="programs-container">
      <h2 className="programs-title">Available Programs</h2>
      <div className="programs-grid">
        {programs.map((program) => (
          <article className="program-card" key={program.id}>
            <h3 className="program-name">{program.name}</h3>
            <div className="program-code">Program Code: {program.code}</div>
            <p className="program-desc">{program.description}</p>
            <div className="program-meta">
              <div><strong>Duration:</strong> {program.duration}</div>
              <div><strong>Term:</strong> {program.term}</div>
              <div><strong>Start Date:</strong> {new Date(program.startDate).toLocaleDateString()}</div>
              <div><strong>End Date:</strong> {new Date(program.endDate).toLocaleDateString()}</div>
              <div className="fees"><strong>Fees:</strong></div>
              <div>Domestic: ${program.fees.domestic.toLocaleString()}</div>
              <div>International: ${program.fees.international.toLocaleString()}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProgramList;
