import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Header from '../components/Header';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (values) => {
        console.log('Login values:', values);
        // TODO: Integrate actual auth
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="max-w-md mx-auto mt-20 p-8 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center uppercase">System Login</h2>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={handleLogin}
                >
                    {({ errors, touched }) => (
                        <Form className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <Field
                                    name="email"
                                    type="email"
                                    className="w-full p-2 border-2 border-blue-400 rounded focus:outline-none focus:border-blue-600"
                                />
                                {errors.email && touched.email ? (
                                    <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                                ) : null}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <Field
                                    name="password"
                                    type="password"
                                    className="w-full p-2 border-2 border-blue-400 rounded focus:outline-none focus:border-blue-600"
                                />
                                {errors.password && touched.password ? (
                                    <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                                ) : null}
                            </div>

                            <button
                                type="submit"
                                className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors uppercase"
                            >
                                Enter System
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
