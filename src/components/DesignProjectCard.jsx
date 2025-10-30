import React from 'react';
import { Link } from 'react-router-dom';
import { Figma, Palette, Layers, Eye, ArrowRight } from 'lucide-react';

const DesignProjectCard = ({ project, isActive, onClick }) => {
    const tools = project.designTools || project.tools || []; // Support both GraphQL (designTools) and legacy (tools) formats

    return (
        <div
            className={`rounded-xl transition-all duration-300 cursor-pointer group ${
                isActive
                    ? 'border-4 border-[#FBB03B] shadow-2xl z-10 bg-white'
                    : 'bg-gray-50 opacity-70 hover:opacity-100 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            }`}
            onClick={onClick}
        >
            {/* Header Section */}
            <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold ${isActive ? 'text-[#0015AA] text-3xl' : 'text-gray-800 text-xl'}`}>
                            {project.name}
                        </h3>
                        <p className={`mt-1 text-sm font-semibold uppercase tracking-wider ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                            {project.clientType}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{project.industry}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <img
                            src={project.logo}
                            alt={`${project.name} Logo`}
                            className={`rounded-full object-cover shadow-md transition-transform duration-300 ${
                                isActive ? 'w-20 h-20' : 'w-12 h-12'
                            }`}
                        />
                        {/* Design Tools Badge */}
                        <div className="flex items-center space-x-1 bg-[#0015AA] text-white px-2 py-1 rounded-full text-xs">
                            <Palette className="w-3 h-3" />
                            <span>Design</span>
                        </div>
                    </div>
                </div>

                {/* Tools Used */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tools.includes('figma') && (
                        <div className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs">
                            <Figma className="w-3 h-3 mr-1" />
                            Figma
                        </div>
                    )}
                    {tools.includes('photoshop') && (
                        <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                            <Palette className="w-3 h-3 mr-1" />
                            Photoshop
                        </div>
                    )}
                    {tools.includes('illustrator') && (
                        <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs">
                            <Layers className="w-3 h-3 mr-1" />
                            Illustrator
                        </div>
                    )}
                    {tools.includes('xd') && (
                        <div className="flex items-center bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            XD
                        </div>
                    )}
                </div>

                {/* Project Brief */}
                <div className={`mb-4 ${isActive ? 'hidden' : 'block'}`}>
                    <p className="text-sm text-gray-700 line-clamp-3">
                        {project.intro}
                    </p>
                </div>

                {/* CTA Button */}
                <div className="flex justify-between items-center">
                    <button
                        className={`flex items-center font-bold py-2 px-4 transition-all duration-300 rounded-lg ${
                            isActive
                                ? 'text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100'
                                : 'text-[#0015AA] hover:text-[#FBB03B] bg-blue-50 hover:bg-blue-100'
                        }`}
                    >
                        {isActive ? "Collapse View" : "View Details"}
                        <ArrowRight className={`ml-2 transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`} />
                    </button>

                    {isActive && (
                        <Link
                            to={`/projects/${project.slug}`}
                            className="flex items-center font-bold py-2 px-4 bg-[#FBB03B] text-[#0015AA] rounded-lg hover:bg-[#E0A030] transition-colors"
                        >
                            Full Project
                            <ArrowRight className="ml-2" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Expanded Content for Active Project */}
            {isActive && (
                <div className="p-8 bg-gray-50 border-t border-gray-200 space-y-6">
                    {/* Design Process Overview */}
                    <div>
                        <h4 className="text-xl font-bold text-[#0015AA] mb-4">Design Process</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Eye className="w-6 h-6 text-blue-600" />
                                </div>
                                <h5 className="font-semibold text-gray-800">Research</h5>
                                <p className="text-xs text-gray-600">User research & analysis</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Figma className="w-6 h-6 text-green-600" />
                                </div>
                                <h5 className="font-semibold text-gray-800">Design</h5>
                                <p className="text-xs text-gray-600">Wireframes & prototypes</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Palette className="w-6 h-6 text-purple-600" />
                                </div>
                                <h5 className="font-semibold text-gray-800">Deliver</h5>
                                <p className="text-xs text-gray-600">Final designs & assets</p>
                            </div>
                        </div>
                    </div>

                    {/* Key Deliverables */}
                    <div>
                        <h4 className="text-xl font-bold text-[#0015AA] mb-4">Key Deliverables</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.deliverables?.map((deliverable, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                    <h5 className="font-semibold text-gray-800 mb-2">{deliverable.title}</h5>
                                    <p className="text-sm text-gray-600">{deliverable.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Design System Preview */}
                    {project.designSystem && (
                        <div>
                            <h4 className="text-xl font-bold text-[#0015AA] mb-4">Design System</h4>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {project.designSystem.colors?.slice(0, 4).map((color, index) => (
                                        <div key={index} className="text-center">
                                            <div
                                                className="w-12 h-12 rounded-lg mx-auto mb-2 shadow-sm"
                                                style={{ backgroundColor: color.hex }}
                                            ></div>
                                            <p className="text-xs text-gray-600">{color.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DesignProjectCard;