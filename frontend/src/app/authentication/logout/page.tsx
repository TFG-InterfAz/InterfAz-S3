"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../../../components/BackButton";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const access = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      await fetch("http://localhost:8000/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access}`,
        },
        body: JSON.stringify({ refresh_token: refresh }),
        credentials: "include",
      });

      toast.success("Session closed successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error closing session");
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center">
      <h1 className="text-4xl font-bold text-white mb-8">
        Are you sure you want to log out?
      </h1>

      <button
        onClick={handleLogout}
        className="px-10 py-4 text-2xl font-bold text-white rounded-lg shadow-lg 
                   bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
                   animate-pulse hover:scale-105 transform transition-all duration-200"
      >
        Log Out
      </button>

      {/* Para volver a la página anterior */}
      <BackButton />
    </div>
  );
}
