"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

const SignupForm = () => {
  const t = useTranslations("Signup");
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";

  const { signUp, isLoaded, setActive } = useSignUp();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      // Create the user
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // Check if email verification is required
      if (result.status === "missing_requirements") {
        // Start email verification process
        await signUp.prepareEmailAddressVerification({ 
          strategy: "email_code" 
        });
        
        // Redirect to verification page or show verification UI
        router.push(`/${locale}/verify-email`);
      } else if (result.status === "complete") {
        // If no verification needed, set the session as active
        await setActive({ session: result.createdSessionId });
        
        // Redirect to dashboard or wherever you want
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      
      // Better error handling
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-4 md:space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t("Heading")}</h2>
          <p className="text-gray-400 text-sm md:text-base">{t("Subheading")}</p>
        </div>

        <form className="space-y-3 md:space-y-4" onSubmit={handleSignup}>
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* First & Last Name */}
          <div dir={isArabic ? "rtl" : "ltr"} className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white text-sm md:text-base">{t("FName")}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("FNamePlaceholder")}
                className={`bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-base md:text-base${isArabic ? " text-right" : ""}`}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white text-sm md:text-base">{t("LName")}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t("LNamePlaceholder")}
                className={`bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-base md:text-base${isArabic ? " text-right" : ""}`}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 mt-6" dir={isArabic ? "rtl" : "ltr"}>
            <Label htmlFor="email" className="text-white text-sm md:text-base">{t("Email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("EmailPlaceholder")}
              className="bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-base md:text-base"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2 mb-6" dir={isArabic ? "rtl" : "ltr"}>
            <Label htmlFor="password" className="text-white text-sm md:text-base">{t("Password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("PasswordPlaceholder")}
              className="bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-base md:text-base"
              required
            />
          </div>

          <div id="clerk-captcha"></div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isLoaded || isLoading}
            className="w-full bg-white text-black cursor-pointer hover:bg-white h-10 md:h-12 font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : t("SignupBtn")}
          </Button>

          {/* Already have account? */}
          <p className="text-center text-gray-400 text-sm md:text-base">
            {t("ExtraText")}{" "}
            <Link href={`/${locale}/Login`} className="text-blue-500 hover:underline">{t("ExternalLink")}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;