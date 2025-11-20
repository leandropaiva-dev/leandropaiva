import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['pt', 'en', 'es'] as const;

export default getRequestConfig(async ({locale}) => {
  // Validate locale
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  const validatedLocale = locale as string;

  return {
    locale: validatedLocale,
    messages: (await import(`../messages/${validatedLocale}.json`)).default
  };
});