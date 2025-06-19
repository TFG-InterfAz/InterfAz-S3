"use client";
import { useEffect, useState } from "react";
import api from '../../lib/api';
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import Image from "next/image";
import { Logout } from "../logout/page";

const PrivatePage = () => {
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const [showContent, setShowContent] = useState(true);

    useEffect(() => {
        const fetchPrivateData = async () => {
            try {
                const response = await api.get("/private/");
                setMessage(response.data.message);
            } catch (error) {
                console.error("Access denied:", error);
                setShowContent(false)
                toast.error("You must be logged in to view this page.");
                setTimeout(function () { router.push("/authentication/login"); }, 5000);
            }
        };

        fetchPrivateData();
    }, []);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <ToastContainer />
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Image
                    className="dark:invert"
                    src="/logo-interfaz.svg"
                    alt="interfaz.js logo"
                    width={380}
                    height={78}
                    priority
                />
                <h2 className="text-3xl font-bold mb-4">Private Area</h2>
                {message ? (
                    <p>{message}</p>
                ) : (
                    <p>Loading secure content...</p>
                )}
                {showContent && (<>
                    <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                        <li className="mb-2 tracking-[-.01em]">
                            <a
                                className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold"
                                href={`/authentication/logout`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Log out
                            </a>
                        </li>
                        <li className="mb-2 tracking-[-.01em]">
                            <a
                                className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold"
                                href={`/renderizer/`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Show all records

                            </a>
                        </li>
                        <li className="tracking-[-.01em]">
                            Ask ChatGPT.
                        </li>
                    </ol>
                    <div className="flex gap-4 items-center flex-col sm:flex-row">
                        <a
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                            href={`/renderizer/create`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                className="dark:invert"
                                src="/vercel.svg"
                                alt="Vercel logomark"
                                width={20}
                                height={20}
                            />
                            Renderize now
                        </a>
                        <a
                            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                            href="https://github.com/TFG-InterfAz"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>

                    </div>
                </>)}
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            </footer>
        </div>
    );
};

export default PrivatePage;
