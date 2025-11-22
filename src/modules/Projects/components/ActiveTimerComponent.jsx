import React from 'react';
import { useTimer } from '../../../context/TimerContext';
import apiService from '../../../services/api';

const ActiveTimerComponent = () => {
  const { activeTimer, elapsedTime, formatTime, stopTimer } = useTimer();

  const handleStopTimer = async () => {
    if (activeTimer) {
      try {
        await apiClient.patch(`/timelogs/stop/${activeTimer.taskId}/`);
        stopTimer();
      } catch (error) {
        console.error('Failed to stop timer:', error);
      }
    }
  };

  if (!activeTimer) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Ready to Work</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 bg-[#0015AA]/10 border border-[#0015AA]/20 rounded-lg px-3 py-2 max-w-xs">
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <div className="w-2 h-2 bg-[#FBB03B] rounded-full animate-pulse flex-shrink-0"></div>
        <span className="text-sm font-medium text-gray-700 truncate">
          {activeTimer.projectId} - Task {activeTimer.taskId}
        </span>
      </div>
      <div className="text-sm font-mono font-bold text-[#0015AA] flex-shrink-0">
        {formatTime(elapsedTime)}
      </div>
      <button
        onClick={handleStopTimer}
        className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex-shrink-0"
      >
        Stop
      </button>
    </div>
  );
};

export default ActiveTimerComponent;