import React, { useState, useRef, useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Webcam from 'react-webcam';
import Header from '../components/Header';
import { FaCamera, FaFileUpload, FaCheckCircle, FaUser, FaBuilding } from 'react-icons/fa';

// Validation Schemas for steps
const Step1Schema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    contact: Yup.string().required('Contact number is required'),
    plotNumber: Yup.string().required('Plot Number is required'),
});

const AccountCreation = () => {
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState('consumer');
    const [idImage, setIdImage] = useState(null);
    const [selfie, setSelfie] = useState(null);
    const webcamRef = useRef(null);

    const captureSelfie = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setSelfie(imageSrc);
    }, [webcamRef]);

    const handleIdUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setIdImage(URL.createObjectURL(file));
        }
    };

    const submitForm = (values) => {
        const finalData = { ...values, accountType, idImage, selfie };
        console.log('Submitting Account Data:', finalData);
        alert('Account Application Submitted for Verification!');
        // TODO: Send to Go Backend
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Header />

            <div className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                        <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">1</span>
                        <span>Details</span>
                    </div>
                    <div className="h-1 flex-1 mx-4 bg-gray-300">
                        <div className={`h-full bg-green-500 transition-all ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
                    </div>
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                        <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">2</span>
                        <span>Type</span>
                    </div>
                    <div className="h-1 flex-1 mx-4 bg-gray-300">
                        <div className={`h-full bg-green-500 transition-all ${step === 3 ? 'w-full' : 'w-0'}`}></div>
                    </div>
                    <div className={`flex items-center gap-2 ${step >= 3 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                        <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">3</span>
                        <span>KYC</span>
                    </div>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-purple-700 mb-6 uppercase">
                        {step === 1 && "Personal Information"}
                        {step === 2 && "Account Classification"}
                        {step === 3 && "Identity Verification (KYC)"}
                    </h2>

                    <Formik
                        initialValues={{ fullName: '', contact: '', plotNumber: '', area: '', city: 'Lusaka' }}
                        validationSchema={Step1Schema}
                        onSubmit={() => setStep(step + 1)}
                    >
                        {({ errors, touched, handleSubmit, values }) => (
                            <Form>
                                {/* STEP 1: Personal Details */}
                                {step === 1 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name / Company Name</label>
                                            <Field name="fullName" className="w-full p-2 border-2 border-blue-400 rounded focus:border-blue-600 outline-none" placeholder="e.g. John Doe" />
                                            {errors.fullName && touched.fullName && <div className="text-red-500 text-xs">{errors.fullName}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                                            <Field name="contact" className="w-full p-2 border-2 border-blue-400 rounded focus:border-blue-600 outline-none" placeholder="+260..." />
                                            {errors.contact && touched.contact && <div className="text-red-500 text-xs">{errors.contact}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Plot Number</label>
                                            <Field name="plotNumber" className="w-full p-2 border-2 border-blue-400 rounded focus:border-blue-600 outline-none" />
                                            {errors.plotNumber && touched.plotNumber && <div className="text-red-500 text-xs">{errors.plotNumber}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Area / Layout</label>
                                            <Field name="area" className="w-full p-2 border-2 border-blue-400 rounded focus:border-blue-600 outline-none" />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: Account Type */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <p className="text-gray-600">Please select the category that best describes this account.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Consumer Option */}
                                            <div
                                                onClick={() => setAccountType('consumer')}
                                                className={`cursor-pointer p-6 rounded-lg border-2 flex flex-col items-center justify-center gap-3 transition-all ${accountType === 'consumer' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}
                                            >
                                                <FaUser size={40} className={accountType === 'consumer' ? 'text-green-600' : 'text-gray-400'} />
                                                <span className="font-bold text-lg">Consumer</span>
                                                <p className="text-xs text-center text-gray-500">Household, Small Office, or Institution generating waste.</p>
                                            </div>

                                            {/* Business Option */}
                                            <div
                                                onClick={() => setAccountType('business')}
                                                className={`cursor-pointer p-6 rounded-lg border-2 flex flex-col items-center justify-center gap-3 transition-all ${accountType === 'business' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}
                                            >
                                                <FaBuilding size={40} className={accountType === 'business' ? 'text-purple-600' : 'text-gray-400'} />
                                                <span className="font-bold text-lg">Business</span>
                                                <p className="text-xs text-center text-gray-500">Manufacturer, Wholesaler, or Retailer supplying goods.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: KYC */}
                                {step === 3 && (
                                    <div className="space-y-8">
                                        {/* ID Upload Section */}
                                        <div className="border border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center text-center bg-gray-50">
                                            <FaFileUpload className="text-gray-400 text-4xl mb-3" />
                                            <h3 className="font-bold text-gray-700">Upload ID Document</h3>
                                            <p className="text-xs text-gray-500 mb-4">Passport, NRC, or Driver's License</p>

                                            {idImage ? (
                                                <div className="relative">
                                                    <img src={idImage} alt="ID Preview" className="h-32 object-contain rounded border" />
                                                    <button type="button" onClick={() => setIdImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
                                                </div>
                                            ) : (
                                                <input type="file" onChange={handleIdUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                            )}
                                        </div>

                                        {/* Selfie Section */}
                                        <div className="border border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center text-center bg-gray-50">
                                            <FaCamera className="text-gray-400 text-4xl mb-3" />
                                            <h3 className="font-bold text-gray-700">Liveness Check (Selfie)</h3>
                                            <p className="text-xs text-gray-500 mb-4">Please position your face in the frame.</p>

                                            {selfie ? (
                                                <div className="relative">
                                                    <img src={selfie} alt="Selfie" className="h-48 rounded border shadow-sm" />
                                                    <button type="button" onClick={() => setSelfie(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="h-48 w-64 bg-black rounded overflow-hidden">
                                                        <Webcam
                                                            audio={false}
                                                            ref={webcamRef}
                                                            screenshotFormat="image/jpeg"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <button type="button" onClick={captureSelfie} className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors">Capture Photo</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="mt-8 flex justify-between">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            className="text-gray-600 font-bold px-6 py-2 hover:bg-gray-100 rounded"
                                        >
                                            Back
                                        </button>
                                    )}

                                    {step < 3 ? (
                                        <button
                                            type="button" // Use button type to prevent form submission in step 1/2 handled by Formik manually if needed, but here Formik handles submit
                                            onClick={() => {
                                                // Manually trigger validation for Step 1 before moving
                                                if (step === 1) {
                                                    handleSubmit(); // This will trigger onSubmit if valid
                                                } else {
                                                    setStep(step + 1);
                                                }
                                            }}
                                            className="bg-green-600 text-white font-bold px-8 py-2 rounded hover:bg-green-700 ml-auto"
                                        >
                                            Next Step
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => submitForm(values)}
                                            disabled={!idImage || !selfie}
                                            className={`ml-auto font-bold px-8 py-2 rounded transition-colors ${(!idImage || !selfie) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                                        >
                                            Verify & Create Account
                                        </button>
                                    )}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default AccountCreation;
