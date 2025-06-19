"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

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
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow hover:shadow-md"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
          clipRule="evenodd"
        />
      </svg>
      Close session
    </button>
  );
}
