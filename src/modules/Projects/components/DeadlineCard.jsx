import React from 'react';

const DeadlineCard = ({ project }) => {
  const isUrgent = new Date(project.due_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return (
    <div className={`card ${isUrgent ? 'border-red-300 bg-red-50' : ''}`}>
      <h4 className={`font-medium ${isUrgent ? 'text-red-700' : ''}`}>{project.title}</h4>
      <p className={`text-sm ${isUrgent ? 'text-red-600' : 'text-gray-500'}`}>
        Due: {new Date(project.due_date).toLocaleDateString()}
      </p>
    </div>
  );
};

export default DeadlineCard;