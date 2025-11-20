import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPlus, BsPerson, BsFolder } from 'react-icons/bs';
import { fetchClients, createClient } from '../modules/Clients/services/clientsSlice';
import { createProject } from '../modules/Projects/services/projectsSlice';

const QuickClientProjectEntry = () => {
  const dispatch = useDispatch();
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const { clients, loading: clientsLoading } = useSelector((state) => state.clients);

  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    company: ''
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    clientId: '',
    description: '',
    endDate: '',
    hourlyRate: ''
  });

  useEffect(() => {
    if (clients.length === 0) {
      dispatch(fetchClients());
    }
  }, [dispatch, clients.length]);

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createClient({
        name: clientForm.name,
        contactEmail: clientForm.email,
        company: clientForm.company
      })).unwrap();
      setShowClientModal(false);
      setClientForm({ name: '', email: '', company: '' });
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createProject({
        title: projectForm.title,
        clientId: projectForm.clientId,
        description: projectForm.description,
        endDate: projectForm.endDate,
        hourlyRate: parseFloat(projectForm.hourlyRate) || 0
      })).unwrap();
      setShowProjectModal(false);
      setProjectForm({ title: '', clientId: '', description: '', endDate: '', hourlyRate: '' });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#0015AA] to-[#003366] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Entry</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setShowClientModal(true)}
            className="flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg border-2 border-dashed border-white/30 hover:border-[#FBB03B]/50 transition-all duration-300 transform hover:scale-105"
          >
            <BsPerson className="mr-2 text-white" size={20} />
            <span className="text-white font-medium">+ New Client</span>
          </button>

          <button
            onClick={() => setShowProjectModal(true)}
            className="flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg border-2 border-dashed border-white/30 hover:border-[#FBB03B]/50 transition-all duration-300 transform hover:scale-105"
          >
            <BsFolder className="mr-2 text-white" size={20} />
            <span className="text-white font-medium">+ New Project</span>
          </button>
        </div>
      </div>

      {/* Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Client</h3>
            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company (optional)</label>
                <input
                  type="text"
                  value={clientForm.company}
                  onChange={(e) => setClientForm({...clientForm, company: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Project</h3>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select
                  value={projectForm.clientId}
                  onChange={(e) => setProjectForm({...projectForm, clientId: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={clientsLoading}
                >
                  <option value="">
                    {clientsLoading ? 'Loading clients...' : 'Select a client'}
                  </option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company ? `(${client.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate ($/hr)</label>
                  <input
                    type="number"
                    value={projectForm.hourlyRate}
                    onChange={(e) => setProjectForm({...projectForm, hourlyRate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickClientProjectEntry;