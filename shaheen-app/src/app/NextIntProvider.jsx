import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

export default async function LocaleLayout({ children, params }) {
  const resolvedParams = await params;
  let messages;
  try {
    messages = (await import(`../../messages/${resolvedParams.locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={resolvedParams.locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
