import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stopTimer } from '../../../store/slices/timeLogsSlice';
import { useToast } from '../../../context/ToastContext';

const ActiveTimerComponent = () => {
  const dispatch = useDispatch();
  const { currentTimer } = useSelector(state => state.timeLogs);
  const { showError } = useToast();

  const handleStopTimer = async () => {
    if (currentTimer && currentTimer.id) {
      try {
        await dispatch(stopTimer(currentTimer.id)).unwrap();
      } catch (error) {
        showError('Failed to stop timer. Please try again.', 5000);
      }
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTimer) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Ready to Work</span>
      </div>
    );
  }

  // Calculate elapsed time from start time
  const elapsedTime = Math.floor((Date.now() - new Date(currentTimer.startTime).getTime()) / 1000);

  return (
    <div className="flex items-center space-x-3 bg-[#0015AA]/10 border border-[#0015AA]/20 rounded-lg px-3 py-2 max-w-xs">
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <div className="w-2 h-2 bg-[#FBB03B] rounded-full animate-pulse flex-shrink-0"></div>
        <span className="text-sm font-medium text-gray-700 truncate">
          {currentTimer.taskName || 'Active Task'}
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