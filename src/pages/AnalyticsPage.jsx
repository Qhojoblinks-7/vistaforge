import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicProjects } from '../store/slices/publicPortfolioSlice';
import { Helmet } from 'react-helmet-async';
import { BsBarChart, BsGraphUp, BsCashStack, BsClock, BsArrowUp, BsCalendar } from 'react-icons/bs';

const AnalyticsPage = () => {
  const dispatch = useDispatch();

  // Mock data - replace with real data from API
  const metrics = {
    totalRevenue: '$24,750',
    totalHours: '156.5',
    averageRate: '$158/hr',
    monthlyGrowth: '+12.5%'
  };

  const monthlyRevenue = [
    { month: 'Jan', amount: 4200 },
    { month: 'Feb', amount: 3800 },
    { month: 'Mar', amount: 5100 },
    { month: 'Apr', amount: 4600 },
    { month: 'May', amount: 6200 },
    { month: 'Jun', amount: 5850 }
  ];

  // Derive top clients from server-driven projects (names only)
  const projects = useSelector((s) => s.publicPortfolio.projects || []);

  useEffect(() => {
    dispatch(fetchPublicProjects());
  }, [dispatch]);

  const topClients = (projects || []).slice(0, 3).map((p, i) => ({
    name: p.name || p.title || p.slug || `Project ${i + 1}`,
    revenue: i === 0 ? '$8,200' : i === 1 ? '$6,500' : '$4,800',
    hours: i === 0 ? '52h' : i === 1 ? '41h' : '30h'
  }));

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#0015AA]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0015AA]">Monthly Revenue Trend</h2>
              <BsGraphUp className="text-[#FBB03B]" size={24} />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-gradient-to-t from-[#0015AA] to-[#FBB03B] w-full rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(data.amount / 6500) * 200}px` }}
                  ></div>
                  <span className="text-xs font-medium text-gray-600 mt-2">{data.month}</span>
                  <span className="text-sm font-bold text-[#0015AA]">${data.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#FBB03B]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0015AA]">Top Performing Clients</h2>
              <BsBarChart className="text-[#FBB03B]" size={24} />
            </div>
            <div className="space-y-4">
              {topClients.map((client, index) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Additional Analytics - Tertiary Importance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span className="text-lg font-bold text-[#0015AA]">12</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Active Projects</span>
                <span className="text-lg font-bold text-[#FBB03B]">3</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Average Project Value</span>
                <span className="text-lg font-bold text-gray-900">$4,125</span>
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
                <span className="text-lg font-bold text-[#0015AA]">24.5h</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">This Month</span>
                <span className="text-lg font-bold text-[#FBB03B]">98.2h</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Billable Rate</span>
                <span className="text-lg font-bold text-gray-900">89%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0015AA]">Goals & Performance</h3>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <BsArrowUp className="text-white" size={16} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Monthly Revenue Goal</span>
                  <span className="font-bold text-[#0015AA]">$6,200 / $7,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#0015AA] h-3 rounded-full transition-all duration-500" style={{ width: '88%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">88% complete</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Client Satisfaction</span>
                  <span className="font-bold text-[#FBB03B]">4.8 / 5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#FBB03B] h-3 rounded-full transition-all duration-500" style={{ width: '96%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">96% satisfaction rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;