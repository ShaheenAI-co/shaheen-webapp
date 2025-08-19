"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function AccordionComponent() {
  const t = useTranslations("Faq");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  const items = [
    {
      id: "1",
      title: t("Q-1"),
      content: t("A-1"),
    },
    {
      id: "2",
      title: t("Q-2"),
      content: t("A-2"),
    },
    {
      id: "3",
      title: t("Q-3"),
      content: t("A-3"),
    },
    {
      id: "4",
      title: t("Q-4"),
      content: t("A-4"),
    },
    {
      id: "5",
      title: t("Q-5"),
      content: t("A-5"),
    },
  ];
  return (
    <div className="space-y-4 px-5  lg:w-[1200px] flex flex-col gap-6 lg:mx-auto my-40">
      <div className="flex flex-col items-center text-center  gap-4">
        <h2
          className={`text-2xl lg:text-5xl font-bold  leading-tight ${isArabic ? "alexandria-font " : "satoshi-bold"} max-sm:w-[300px]  max-w-[500px]  capitalize `}
        >
          {t("Heading")}
        </h2>
        <p className=" max-w-[500px] max-sm:w-[300px] text-base md:text-lg font-normal text-muted-foreground ">
          {t("Subheading")}
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        defaultValue="3"
      >
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className=" lg:p-2 px-3 py-2 outline-none border-b-1"
          >
            <AccordionTrigger className="py-2 lg:text-lg text-base leading-6 hover:no-underline ">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-normal text-sm lg:text-base pb-2">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
