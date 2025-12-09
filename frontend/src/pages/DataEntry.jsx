import React, { useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import Header from '../components/Header';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';

const DataEntry = () => {
    const [activeTab, setActiveTab] = useState('business'); // business | consumer

    const initialValues = {
        packageLevels: [{ series: 0, level: 4, value: 0 }, { series: 0, level: 6, value: 0 }],
        wasteLevels: [{ series: 0, level: 4, value: 0 }, { series: 0, level: 6, value: 0 }],
    };

    const handleSubmit = (values) => {
        console.log('Data Entry Submission:', { type: activeTab, ...values });
        alert('Waste Data Recorded Successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Header />

            <main className="max-w-6xl mx-auto mt-6 px-4">
                <h2 className="text-2xl font-bold text-center text-purple-700 mb-6 uppercase">
                    Waste Data Capture Process
                </h2>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
                        <button
                            onClick={() => setActiveTab('business')}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'business' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Business (Manufacturer)
                        </button>
                        <button
                            onClick={() => setActiveTab('consumer')}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'consumer' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Consumer (Household)
                        </button>
                    </div>
                </div>

                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values }) => (
                        <Form className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* LEFT COLUMN: Package / Supply Levels */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-blue-500">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                                    <span>Package / Supply Levels</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Inputs</span>
                                </h3>

                                <FieldArray name="packageLevels">
                                    {({ push, remove }) => (
                                        <div className="space-y-4">
                                            {values.packageLevels.map((item, index) => (
                                                <div key={index} className="flex items-end gap-2 p-3 bg-gray-50 rounded border border-gray-100">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 mb-1">Series</label>
                                                        <input
                                                            name={`packageLevels.${index}.series`}
                                                            type="number"
                                                            className="w-16 p-2 border border-gray-300 rounded text-center"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-gray-500 mb-1">Level (Size/Type)</label>
                                                        <input
                                                            name={`packageLevels.${index}.level`}
                                                            type="number"
                                                            className="w-full p-2 border-2 border-blue-200 rounded focus:border-blue-500 outline-none"
                                                            placeholder="e.g. 4"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-gray-500 mb-1">Quantity</label>
                                                        <input
                                                            name={`packageLevels.${index}.value`}
                                                            type="number"
                                                            className="w-full p-2 border-2 border-blue-400 rounded focus:border-blue-600 outline-none font-bold text-blue-900"
                                                        />
                                                    </div>
                                                    <button type="button" onClick={() => remove(index)} className="p-2 text-red-400 hover:text-red-600">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => push({ series: 0, level: 0, value: 0 })}
                                                className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaPlus size={12} /> Add new Package Level
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                            {/* RIGHT COLUMN: Waste Disposal Levels */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-red-500">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                                    <span>Waste Disposal Levels</span>
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Outputs</span>
                                </h3>

                                <FieldArray name="wasteLevels">
                                    {({ push, remove }) => (
                                        <div className="space-y-4">
                                            {values.wasteLevels.map((item, index) => (
                                                <div key={index} className="flex items-end gap-2 p-3 bg-gray-50 rounded border border-gray-100">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 mb-1">Series</label>
                                                        <input
                                                            name={`wasteLevels.${index}.series`}
                                                            type="number"
                                                            className="w-16 p-2 border border-gray-300 rounded text-center"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-gray-500 mb-1">Level (Size/Type)</label>
                                                        <input
                                                            name={`wasteLevels.${index}.level`}
                                                            type="number"
                                                            className="w-full p-2 border-2 border-red-200 rounded focus:border-red-500 outline-none"
                                                            placeholder="e.g. 4"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-gray-500 mb-1">Disposed</label>
                                                        <input
                                                            name={`wasteLevels.${index}.value`}
                                                            type="number"
                                                            className="w-full p-2 border-2 border-red-400 rounded focus:border-red-600 outline-none font-bold text-red-900"
                                                        />
                                                    </div>
                                                    <button type="button" onClick={() => remove(index)} className="p-2 text-red-400 hover:text-red-600">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => push({ series: 0, level: 0, value: 0 })}
                                                className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded hover:border-red-400 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaPlus size={12} /> Add new Disposal Level
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                            {/* Submit Action */}
                            <div className="lg:col-span-2 flex justify-center mt-6">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white font-bold text-lg py-3 px-10 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-3"
                                >
                                    <FaSave /> SAVE DATA RECORDS
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </main>
        </div>
    );
};

export default DataEntry;
