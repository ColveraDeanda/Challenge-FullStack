import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/books_api";
import * as NotesApi from "../network/books_api";
import { useState } from 'react';
import { ConflictError } from "../errors/http_errors";
import Swal from "sweetalert2";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onDismiss();
        }
    };

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>();

    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await NotesApi.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            if (error instanceof ConflictError) {
                setErrorText(error.message);
            } else {
                Swal.fire({
                    title: "" + error,
                    icon: "error",
                });
            }
            console.error(error);
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center" onClick={(e) => { handleBackdropClick(e); onDismiss(); }} >
            <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-300">Username</label>
                <input type="text" {...register("username", { required: "Username is required" })} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white" />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input type="email" {...register("email", { required: "Email is required" })} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <input type="password" {...register("password", { required: "Password is required" })} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white" />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
                {errorText && <p className="text-red-500 text-sm mt-1">{errorText}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">Sign Up</button>
            </form>
            </div>
        </div>
    );
}

export default SignUpModal;