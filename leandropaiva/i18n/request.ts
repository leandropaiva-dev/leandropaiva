import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['pt', 'en', 'es'];

// @ts-ignore
export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});