import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/books_api";
import * as NotesApi from "../network/books_api";
import { useState } from 'react';
import { ConflictError } from "../errors/http_errors";
import Swal from "sweetalert2";

interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void,
}

const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onDismiss();
        }
    };

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const user = await NotesApi.logIn(credentials);
            onLoginSuccessful(user);
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center" onClick={(e) => { handleBackdropClick(e); onDismiss();} }>
            <div className="bg-gray-800 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl mb-4 text-white">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                <label className="block mb-1 text-gray-300">Username</label>
                <input type="text" {...register("username", { required: "Username is required" })} className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white" />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>
                <div>
                <label className="block mb-1 text-gray-300">Password</label>
                <input type="password" {...register("password", { required: "Password is required" })} className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white" />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                {errorText && <p className="text-red-500 text-sm">{errorText}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50">Login</button>
            </form>
            </div>
        </div>
    );
}

export default LoginModal;