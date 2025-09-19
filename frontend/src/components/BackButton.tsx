"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ fallback = "/authentication/confirmation" }: { fallback?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        padding: "10px 20px",
        backgroundColor: "#222",
        color: "#fff",
        border: "none",
        borderRadius: "9999px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        cursor: "pointer",
        transition: "background-color 0.2s ease-in-out",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "#444")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "#222")
      }
    >
      ⬅ Back
    </button>
  );
}
