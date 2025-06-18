"use client";
import Image from "next/image";
import axios from 'axios';
import {useState,useEffect} from "react";
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;




export default function Home() {
  const [value, setValue] = useState("")
  useEffect(() => {
    axios.get(`${API_ENDPOINT}Renderizer/`)
      .then(res => console.log(res.data))
      .catch(err => console.error("Error:", err));
  }, []);


  console.log(value)
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo-interfaz.svg"
          alt="interfaz.js logo"
          width={380}
          height={78}
          priority
        />
        <h2 className="text-3xl font-bold mb-4">Welcome to InterfAz</h2>
        <p style={{ width: 580 }} className="text-lg text-gray-700">
          InterfAz is a modern interface builder designed to streamline HTML generation using AI-powered tools.
          Start by exploring our editor, select your preferred model, and generate semantic, accessible HTML code in seconds.
        </p>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Renderize Components{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <a
              className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold"
              href = {`/renderizer/`}
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
            href= {`/renderizer/create`}
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
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
