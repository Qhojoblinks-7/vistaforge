import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicProjects } from '../store/slices/publicPortfolioSlice';
import { fetchAnalytics, selectAnalyticsData, selectAnalyticsLoading, selectAnalyticsError } from '../store/slices/analyticsSlice';
import { Helmet } from 'react-helmet-async';
import { BsBarChart, BsGraphUp, BsCashStack, BsClock, BsArrowUp, BsCalendar, BsPencil, BsCheck, BsX } from 'react-icons/bs';

const AnalyticsPage = () => {
  const dispatch = useDispatch();

  // Redux selectors for analytics
  const analyticsData = useSelector(selectAnalyticsData);
  const analyticsLoading = useSelector(selectAnalyticsLoading);
  const analyticsError = useSelector(selectAnalyticsError);


  useEffect(() => {
    dispatch(fetchPublicProjects());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  // Use only real data from the database
  const metrics = analyticsData ? {
    totalRevenue: analyticsData.totalRevenue || '$0',
    totalHours: analyticsData.totalHours || '0.0',
    averageRate: analyticsData.averageRate || '$0/hr',
    monthlyGrowth: analyticsData.monthlyGrowth || '+0.0%'
  } : {
    totalRevenue: '$0',
    totalHours: '0.0',
    averageRate: '$0/hr',
    monthlyGrowth: '+0.0%'
  };

  const monthlyRevenue = analyticsData?.monthlyRevenue || [];

  const topClients = analyticsData?.topClients || [];

  const projectPerformance = analyticsData?.projectPerformance || {
    completedProjects: 0,
    activeProjects: 0,
    averageProjectValue: '$0'
  };

  const timeTracking = analyticsData?.timeTracking || {
    thisWeek: '0.0h',
    thisMonth: '0.0h',
    billableRate: '0%'
  };

  const goals = analyticsData?.goals || {
    monthlyRevenueGoal: { current: 0, target: null },
    clientSatisfaction: null
  };

  // State for editing goals
  const [editingGoals, setEditingGoals] = useState(false);
  const [revenueTarget, setRevenueTarget] = useState(goals.monthlyRevenueGoal?.target || '');
  const [satisfactionTarget, setSatisfactionTarget] = useState(goals.clientSatisfaction?.target || '');
  const [savingGoals, setSavingGoals] = useState(false);

  // Update local state when goals data changes
  useEffect(() => {
    setRevenueTarget(goals.monthlyRevenueGoal?.target || '');
    setSatisfactionTarget(goals.clientSatisfaction?.target || '');
  }, [goals]);

  // Save goals function
  const saveGoals = async () => {
    setSavingGoals(true);
    try {
      // TODO: Implement GraphQL mutation to save goals
      // For now, just update local state
      setEditingGoals(false);
      // dispatch(updateUserGoals({ monthlyRevenueTarget: revenueTarget, clientSatisfactionTarget: satisfactionTarget }));
    } catch (error) {
      console.error('Error saving goals:', error);
    } finally {
      setSavingGoals(false);
    }
  };


  // Show loading state
  if (analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Helmet>
            <title>Analytics - Freespec</title>
            <meta name="description" content="View your business analytics and performance metrics" />
          </Helmet>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
            <span className="ml-3 text-gray-600">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (analyticsError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Helmet>
            <title>Analytics - Freespec</title>
            <meta name="description" content="View your business analytics and performance metrics" />
          </Helmet>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
                <div className="mt-2 text-sm text-red-700">{analyticsError}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Helmet>
          <title>Analytics - Freespec</title>
          <meta name="description" content="View your business analytics and performance metrics" />
        </Helmet>

        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your business performance and growth</p>
        </div> */}

        {/* Key Metrics - Primary Importance */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0015AA] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#0015AA] rounded-lg">
                <BsCashStack className="text-white" size={20} />
              </div>
              <div className="text-right">
                <div className="w-12 h-1.5 bg-[#0015AA] rounded-full opacity-20"></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0015AA] uppercase tracking-wide">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.totalRevenue}</p>
              <p className="text-xs text-gray-600 font-medium mt-2 flex items-center">
                <BsArrowUp className="mr-1" size={12} />
                15% from last month
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#FBB03B] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#FBB03B] rounded-lg">
                <BsClock className="text-white" size={20} />
              </div>
              <div className="text-right">
                <div className="w-12 h-1.5 bg-[#FBB03B] rounded-full opacity-20"></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#FBB03B] uppercase tracking-wide">Total Hours</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.totalHours}</p>
              <p className="text-xs text-gray-600 font-medium mt-2">This month</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0015AA] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#0015AA] rounded-lg">
                <BsBarChart className="text-white" size={20} />
              </div>
              <div className="text-right">
                <div className="w-12 h-1.5 bg-[#0015AA] rounded-full opacity-20"></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0015AA] uppercase tracking-wide">Average Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.averageRate}</p>
              <p className="text-xs text-gray-600 font-medium mt-2">Per hour</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#FBB03B] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#FBB03B] rounded-lg">
                <BsArrowUp className="text-white" size={20} />
              </div>
              <div className="text-right">
                <div className="w-12 h-1.5 bg-[#FBB03B] rounded-full opacity-20"></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#FBB03B] uppercase tracking-wide">Monthly Growth</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.monthlyGrowth}</p>
              <p className="text-xs text-gray-600 font-medium mt-2">Revenue increase</p>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics - Secondary Importance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#0015AA]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0015AA]">Monthly Revenue Trend</h2>
              <BsGraphUp className="text-[#FBB03B]" size={24} />
            </div>
            <div className="h-64 flex items-end justify-center">
              {monthlyRevenue.length > 0 ? (
                <div className="flex items-end justify-between space-x-2 w-full">
                  {monthlyRevenue.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="bg-gradient-to-t from-[#0015AA] to-[#FBB03B] w-full rounded-t transition-all hover:opacity-80"
                        style={{ height: `${Math.max((data.amount / 6500) * 200, 20)}px` }}
                      ></div>
                      <span className="text-xs font-medium text-gray-600 mt-2">{data.month}</span>
                      <span className="text-sm font-bold text-[#0015AA]">${data.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <BsGraphUp size={48} className="mb-4 opacity-50" />
                  <p className="text-sm">No revenue data available</p>
                  <p className="text-xs mt-1">Revenue data will appear here once invoices are created</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#FBB03B]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0015AA]">Top Performing Clients</h2>
              <BsBarChart className="text-[#FBB03B]" size={24} />
            </div>
            <div className="space-y-4">
              {topClients.length > 0 ? (
                topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${index === 0 ? 'bg-[#FBB03B]' : index === 1 ? 'bg-[#0015AA]' : 'bg-gray-400'}`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.hours} hours logged</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#0015AA]">{client.revenue}</p>
                      <p className="text-xs text-gray-600">Revenue</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <BsBarChart size={48} className="mb-4 opacity-50" />
                  <p className="text-sm">No client data available</p>
                  <p className="text-xs mt-1">Top clients will appear here once you have invoice and time log data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Analytics - Tertiary Importance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0015AA]">Project Performance</h3>
              <div className="w-8 h-8 bg-[#0015AA] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Completed Projects</span>
                <span className="text-lg font-bold text-[#0015AA]">{projectPerformance.completedProjects}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Active Projects</span>
                <span className="text-lg font-bold text-[#FBB03B]">{projectPerformance.activeProjects}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Average Project Value</span>
                <span className="text-lg font-bold text-gray-900">{projectPerformance.averageProjectValue}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0015AA]">Time Tracking Summary</h3>
              <div className="w-8 h-8 bg-[#FBB03B] rounded-full flex items-center justify-center">
                <BsClock className="text-white" size={16} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">This Week</span>
                <span className="text-lg font-bold text-[#0015AA]">{timeTracking.thisWeek}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">This Month</span>
                <span className="text-lg font-bold text-[#FBB03B]">{timeTracking.thisMonth}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Billable Rate</span>
                <span className="text-lg font-bold text-gray-900">{timeTracking.billableRate}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0015AA]">Goals & Performance</h3>
              <div className="flex items-center space-x-2">
                {!editingGoals ? (
                  <button
                    onClick={() => setEditingGoals(true)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Edit goals"
                  >
                    <BsPencil className="text-gray-600" size={14} />
                  </button>
                ) : (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={saveGoals}
                      disabled={savingGoals}
                      className="p-1 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                      title="Save goals"
                    >
                      <BsCheck className="text-green-600" size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setRevenueTarget(goals.monthlyRevenueGoal?.target || '');
                        setSatisfactionTarget(goals.clientSatisfaction?.target || '');
                        setEditingGoals(false);
                      }}
                      disabled={savingGoals}
                      className="p-1 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                      title="Cancel"
                    >
                      <BsX className="text-red-600" size={14} />
                    </button>
                  </div>
                )}
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <BsArrowUp className="text-white" size={16} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {editingGoals ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Revenue Target ($)
                    </label>
                    <input
                      type="number"
                      value={revenueTarget}
                      onChange={(e) => setRevenueTarget(e.target.value)}
                      placeholder="Enter target amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Satisfaction Target (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={satisfactionTarget}
                      onChange={(e) => setSatisfactionTarget(e.target.value)}
                      placeholder="Enter target rating"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Monthly Revenue</span>
                      <span className="font-bold text-[#0015AA]">
                        ${goals.monthlyRevenueGoal?.current || 0}
                        {goals.monthlyRevenueGoal?.target && (
                          <span className="text-gray-500"> / ${goals.monthlyRevenueGoal.target.toLocaleString()}</span>
                        )}
                      </span>
                    </div>
                    {goals.monthlyRevenueGoal?.target ? (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-[#0015AA] h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((goals.monthlyRevenueGoal.current / goals.monthlyRevenueGoal.target) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {Math.round((goals.monthlyRevenueGoal.current / goals.monthlyRevenueGoal.target) * 100)}% of target
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gray-300 h-3 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Set a revenue target to track progress</p>
                      </>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Client Satisfaction</span>
                      <span className="font-bold text-[#FBB03B]">
                        {goals.clientSatisfaction?.current ? `${goals.clientSatisfaction.current}/5.0` : 'Not set'}
                        {goals.clientSatisfaction?.target && (
                          <span className="text-gray-500"> / {goals.clientSatisfaction.target}/5.0</span>
                        )}
                      </span>
                    </div>
                    {goals.clientSatisfaction?.target ? (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-[#FBB03B] h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${((goals.clientSatisfaction.current || 0) / goals.clientSatisfaction.target) * 100}%`
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {Math.round(((goals.clientSatisfaction.current || 0) / goals.clientSatisfaction.target) * 100)}% of target
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gray-300 h-3 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Set a satisfaction target to track progress</p>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;