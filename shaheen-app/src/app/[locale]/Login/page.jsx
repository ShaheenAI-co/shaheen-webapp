import React from "react";
import Link from "next/link";
import LeftPanel from "../../../components/LeftPanel";
import LoginForm from "./components/LoginForm";

const page = () => {
  return (
    <div className="min-h-screen bg-black md:p-4 p-2 flex flex-col md:flex-row">
      <LeftPanel phrase={"Fuel Your Brand with AI Power"}/>
      <LoginForm />
    </div>
  );
};

export default page;
