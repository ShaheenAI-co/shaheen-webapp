"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";

const SigninForm = () => {
  const t = useTranslations("Login");
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";

  const { signIn, isLoaded, setActive } = useSignIn();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Set the session as active
        await setActive({ session: result.createdSessionId });
        
        // Redirect to dashboard or wherever you want
        router.push(`/${locale}/dashboard`);
      } else if (result.status === "needs_verification") {
        // Handle verification if needed (e.g., 2FA)
        router.push(`/${locale}/verify`);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `/${locale}/sso-callback`,
        redirectUrlComplete: `/${locale}/dashboard`,
      });
    } catch (err) {
      console.error("Google sign in error:", err);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex items-start md:items-center justify-center p-4 pt-8 md:p-8">
      <div className="w-full max-w-md space-y-4 md:space-y-6">
        <div className="text-center space-y-2 max-sm:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {t("Heading")}
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            {t("Subheading")}
          </p>
        </div>

        <form className="space-y-3 md:space-y-4" onSubmit={handleEmailSignIn}>
       

          {/* Google Sign In Button */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={!isLoaded}
            variant="outline"
            className="w-full bg-white border-none cursor-pointer text-black h-10 md:h-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm md:text-base">Google</span>
          </Button>

          {/* Divider */}
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-black px-2 text-gray-400">{t("seperatorText")}</span>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2 mt-4 md:mt-8 mb-6" dir={isArabic ? "rtl" : "ltr"}>
            <Label htmlFor="email" className="text-white text-sm md:text-base">
              {t("Email")}
            </Label>
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

          {/* Password Field */}
          <div className="space-y-2 mb-8 md:mb-8" dir={isArabic ? "rtl" : "ltr"}>
            <Label htmlFor="password" className="text-white text-sm md:text-base">
              {t("Password")}
            </Label>
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

             {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Sign In Button */}
          <Button 
            type="submit"
            disabled={!isLoaded || isLoading}
            className="w-full bg-white text-black cursor-pointer hover:bg-white h-10 md:h-12 font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : t("LoginBtn")}
          </Button>

       

          {/* Signup Link */}
          <p className="text-center text-gray-400 text-sm md:text-base">
            {t("ExtraText")}{" "}
            <Link href={`/${locale}/Signup`} className="text-blue-500 hover:underline">
              {t("ExternalLink")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SigninForm;