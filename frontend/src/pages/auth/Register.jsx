// src/pages/auth/Register.jsx
import RegisterForm from '../../components/auth/RegisterForm';
import RegisterHero from '../../components/auth/RegisterHero';

export default function Register() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 lg:p-12 bg-white">
                <RegisterForm />
            </div>

            {/* Right Side - Hero */}
            <div className="hidden lg:block">
                <RegisterHero />
            </div>
        </div>
    );
}