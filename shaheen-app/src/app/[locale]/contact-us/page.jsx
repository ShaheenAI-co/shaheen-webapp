"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const ContactUs = () => {
  const t = useTranslations("ContactUs");
  const [formData, setFormData] = useState({
    name: "",
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
        email: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t("contactInfo.email.title"),
      value: t("contactInfo.email.value"),
      description: t("contactInfo.email.description"),
    },
    {
      icon: Phone,
      title: t("contactInfo.phone.title"),
      value: t("contactInfo.phone.value"),
      description: t("contactInfo.phone.description"),
    },
    {
      icon: MapPin,
      title: t("contactInfo.office.title"),
      value: t("contactInfo.office.value"),
      description: t("contactInfo.office.description"),
    },
    {
      icon: Clock,
      title: t("contactInfo.support.title"),
      value: t("contactInfo.support.value"),
      description: t("contactInfo.support.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#06040D] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30"
            >
              {t("getInTouch")}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl">{t("sendMessage")}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t("formDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {t("messageSent")}
                    </h3>
                    <p className="text-gray-400">{t("thankYou")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          {t("fullName")}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          {t("emailAddress")}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-2"
                      >
                        {t("subject")}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                      >
                        {t("message")}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 resize-none"
                        placeholder="Tell us about your project, questions, or how we can help..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {t("sending")}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          {t("sendButton")}
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t("contactInfo.title")}
              </h2>
              <p className="text-gray-400 mb-8">
                {t("contactInfo.description")}
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/30 border-gray-800 hover:bg-gray-900/50 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <info.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {info.title}
                        </h3>
                        <p className="text-purple-400 font-medium mb-1">
                          {info.value}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <Card className="bg-gray-900/30 border-gray-800">
              <CardHeader>
                <CardTitle>{t("faq.title")}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t("faq.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b border-gray-800 pb-4">
                  <h4 className="font-semibold mb-2">
                    {t("faq.startup.question")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("faq.startup.answer")}
                  </p>
                </div>
                <div className="border-b border-gray-800 pb-4">
                  <h4 className="font-semibold mb-2">
                    {t("faq.custom.question")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("faq.custom.answer")}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("faq.platforms.question")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("faq.platforms.answer")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
