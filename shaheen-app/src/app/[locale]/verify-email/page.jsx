"use client";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export default function VerifyEmailPage() {
  const t = useTranslations("Signup");
  const { signUp, isLoaded, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const isArabic = locale === "ar";

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(`/${locale}/dashboard`);
      } else {
        setError(isArabic ? "رمز التحقق غير صحيح أو انتهت صلاحيته." : "Invalid or expired verification code.");
      }
    } catch (err) {
      setError(isArabic ? "رمز التحقق غير صحيح أو انتهت صلاحيته." : "Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex h-screen items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-4 md:space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {isArabic ? "تحقق من بريدك الإلكتروني" : "Verify Your Email"}
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            {isArabic
              ? "أدخل رمز التحقق الذي أرسلناه إلى بريدك الإلكتروني لإكمال التسجيل."
              : "Enter the verification code sent to your email to complete signup."}
          </p>
        </div>
        <form className="space-y-3 md:space-y-4" onSubmit={handleVerify}>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          <div className="flex flex-col gap-2" dir={isArabic ? "rtl" : "ltr"}>
            <label htmlFor="code" className="text-white text-sm md:text-base">
              {isArabic ? "رمز التحقق" : "Verification Code"}
            </label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={isArabic ? "أدخل رمز التحقق" : "Enter verification code"}
              className="bg-[#1A1A1A] text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-base md:text-base"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={!isLoaded || isLoading}
            className="w-full bg-white text-black cursor-pointer hover:bg-white h-10 md:h-12 font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? isArabic
                ? "جاري التحقق..."
                : "Verifying..."
              : isArabic
              ? "تحقق"
              : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
}
