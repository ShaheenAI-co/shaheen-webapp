"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, ChevronDown } from "lucide-react";
import LeftPanel from "@/components/LeftPanel";
import { usePathname } from "next/navigation";

const ContactUs = () => {
  const t = useTranslations("ContactUs");
  const t2 = useTranslations("LoginBanner");
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        company: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Grey Background */}
      <div className="w-full lg:w-1/2 flex justify-center relative p-6 lg:p-12">
        <LeftPanel phrase={t2("Text")} />
      </div>

      {/* Right Column - Black Background */}
      <div className="w-full lg:w-1/2 bg-black relative flex flex-col justify-center items-center p-6 lg:p-12">
        {/* Contact Form Section */}
        <div className="w-full max-w-md mx-auto mt-8 lg:mt-16 px-4 lg:px-0">
          <h2
            className={`text-white text-2xl lg:text-4xl font-bold mb-4 ${isArabic ? "alexandria-font" : "satoshi-bold"}`}
          >
            {t("contactForm.title")}
          </h2>
          <p className="text-white text-base lg:text-lg mb-6 lg:mb-8">
            {t("contactForm.subtitle")}
          </p>

          {isSubmitted ? (
            <div className="text-center py-6 lg:py-8">
              <div className="text-green-600 text-4xl lg:text-6xl mb-4">✓</div>
              <h3 className="text-white text-lg lg:text-xl font-semibold mb-2">
                {t("messageSent")}
              </h3>
              <p className="text-white text-sm lg:text-base">{t("thankYou")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              {/* Name and Company Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white font-medium mb-2 text-sm lg:text-base"
                  >
                    {t("contactForm.name")}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-sm lg:text-base"
                    placeholder={t("contactForm.namePlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="block text-white font-medium mb-2 text-sm lg:text-base"
                  >
                    {t("contactForm.company")}
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-sm lg:text-base"
                    placeholder={t("contactForm.companyPlaceholder")}
                  />
                </div>
              </div>

              {/* Email and Subject Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-white font-medium mb-2 text-sm lg:text-base"
                  >
                    {t("contactForm.email")}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-sm lg:text-base"
                    placeholder={t("contactForm.emailPlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-white font-medium mb-2 text-sm lg:text-base"
                  >
                    {t("contactForm.subject")}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-sm lg:text-base"
                    placeholder={t("contactForm.subjectPlaceholder")}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-white font-medium mb-2 text-sm lg:text-base"
                >
                  {t("contactForm.message")}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] text-sm lg:text-base resize-none"
                  placeholder={t("contactForm.messagePlaceholder")}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black cursor-pointer hover:bg-white h-10 md:h-12 font-semibold text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("sending")}
                  </div>
                ) : (
                  t("contactForm.submit")
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
