import React from "react";
import Link from "next/link";
import Image from "next/image";

const SidebarBtn = ({
  activePage,
  handleActivePage,
  href,
  icon,
  name,
  onClick,
}) => {
  return (
    <div
      className={`w-full hover:bg-white/10  rounded-sm  transition-all  duration-300 cursor-pointer  relative ${activePage === `${name}` ? "bg-white/10 after:content-['']  after:absolute  after:inset-0  after:rounded-sm  after:z-[2]  after:shadow-[inset_-40px_0px_15px_-15px_#D8CEE4]  after:mix-blend-lighten  after:pointer-events-none before:content-[''] before:absolute before:inset-0 before:rounded-sm before:shadow-[inset_-44px_0px_10px_-6px_#3A19F2] before:mix-blend-lighten before:pointer-events-none rounded-sm " : ""} `}
    >
      <Link href={href} onClick={onClick}>
        <button className="flex  gap-2 px-4 text-[#8F8F8F] hover:text-white cursor-pointer py-3 items-center">
          <Image src={icon} alt="dashboard" width={20} height={20} />{" "}
          <p
            className={`${activePage === `${name}` ? "text-white" : "text-[#8F8F8F]"} font-medium capitalize`}
          >
            {name}
          </p>
        </button>
      </Link>
    </div>
  );
};

export default SidebarBtn;
