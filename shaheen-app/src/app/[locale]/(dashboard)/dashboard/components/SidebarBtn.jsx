import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";

const SidebarBtn = ({
  activePage,
  handleActivePage,
  href,
  icon,
  name,
  onClick,
  onClose,
  comingSoon = false,
  isArabic = false,
}) => {
  const t = useTranslations("Sidebar");

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`w-full hover:bg-white/10  rounded-sm  transition-all  duration-300 cursor-pointer  relative ${activePage === `${name}` ? "bg-white/10 after:content-['']  after:absolute  after:inset-0  after:rounded-sm  after:z-[2]  after:shadow-[inset_-40px_0px_15px_-15px_#D8CEE4]  after:mix-blend-lighten  after:pointer-events-none before:content-[''] before:absolute before:inset-0 before:rounded-sm before:shadow-[inset_-44px_0px_10px_-6px_#3A19F2] before:mix-blend-lighten before:pointer-events-none rounded-sm " : ""} `}
    >
      {comingSoon ? (
        <div
          className={`flex gap-2 px-4 text-[#8F8F8F] cursor-not-allowed opacity-50 hover:bg-transparent  py-3 items-center relative `}
          disabled
        >
          <Image src={icon} alt="dashboard" width={20} height={20} />
          <p
            className={`font-medium capitalize ${isArabic ? "alexandria-font" : ""}`}
          >
            {name}
          </p>
          <Lock size={16} className="text-gray-400" />
          {/* <span
            className={`absolute top-1/2 transform -translate-y-1/2  text-xs text-purple-500 px-2 py-1 rounded-full font-medium ${isArabic ? "left-2" : "right-2"}`}
          >
            {t("comingSoon")}
          </span> */}
        </div>
      ) : (
        <Link href={href} onClick={handleClick}>
          <button
            className={`flex  gap-2 px-4 text-[#8F8F8F] hover:text-white cursor-pointer py-3 items-center `}
          >
            <Image src={icon} alt="dashboard" width={20} height={20} />{" "}
            <p
              className={`${activePage === `${name}` ? "text-white" : "text-[#8F8F8F]"} font-medium capitalize ${isArabic ? "alexandria-font" : ""}`}
            >
              {name}
            </p>
          </button>
        </Link>
      )}
    </div>
  );
};

export default SidebarBtn;
