import React from "react";
import Link from "next/link";
import SignupForm from "./Components/SignupForm";
import LeftPanel from "../../../components/LeftPanel";

const page = () => {
  return (
    <div className="min-h-screen bg-black md:p-4 p-2 flex flex-col md:flex-row">
      <LeftPanel phrase={"Get started with us "}/>
      <SignupForm />
    </div>
  );
};

export default page;
