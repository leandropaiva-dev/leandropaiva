import { getTranslations, type Locale } from '../../../../lib/translations';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ClientLanguageSwitcher from '../../../../components/ClientLanguageSwitcher';
import RelatedPosts from './RelatedPosts';

async function getPost(slug: string) {
  try {
    const response = await fetch(
      `https://public-api.wordpress.com/wp/v2/sites/leandropaivavercel.wordpress.com/posts?slug=${slug}`,
      {
        next: { revalidate: 3600 },
        cache: 'force-cache'
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const translations = getTranslations(locale as Locale);
  const navT = translations.nav;

  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex-shrink-0">
              <Link href={`/${locale}`} className="text-white font-bold text-lg">
                LP
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href={`/${locale}`} className="text-white/80 hover:text-white text-sm transition-colors">
                {navT.home}
              </Link>
              <Link href={`/${locale}#about`} className="text-white/80 hover:text-white text-sm transition-colors">
                {navT.about}
              </Link>
              <Link href={`/${locale}#work`} className="text-white/80 hover:text-white text-sm transition-colors">
                {navT.projects}
              </Link>
              <Link href={`/${locale}#experience`} className="text-white/80 hover:text-white text-sm transition-colors">
                {navT.experience}
              </Link>
              <Link href={`/${locale}#blog`} className="text-white/80 hover:text-white text-sm transition-colors">
                {navT.blog}
              </Link>
              <Link href={`/${locale}#contact`} className="text-white/80 hover:text-white text-sm transition-colors">
                {navT.contact}
              </Link>
            </div>

            <div className="flex-shrink-0">
              <ClientLanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <main className="min-h-screen bg-black">
        <div className="pt-24 pb-16 px-4 md:px-8">
          <article className="w-full lg:w-10/12 mx-auto">
            {/* Featured Image */}
            {(post.jetpack_featured_media_url || post.featured_image) && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.jetpack_featured_media_url || post.featured_image}
                  alt={post.title?.rendered || post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Meta */}
            <div className="mb-8">
              <p className="text-sm text-white/40 uppercase tracking-wider mb-4">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {post.title?.rendered || post.title}
              </h1>
            </div>

            {/* Content */}
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-white/70 prose-p:leading-relaxed
                prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-white/70 prose-ol:text-white/70
                prose-li:text-white/70
                prose-img:rounded-xl
                prose-code:text-purple-400 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
                prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10"
              dangerouslySetInnerHTML={{ __html: post.content?.rendered || post.content }}
            />
          </article>
        </div>

        {/* Related Posts */}
        <RelatedPosts locale={locale as Locale} currentPostId={post.id} />

        {/* Footer */}
        <footer className="w-full bg-black border-t border-white/10 py-8 px-4 md:px-8">
          <div className="w-full lg:w-10/12 mx-auto text-center">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Leandro Paiva. {locale === 'pt' ? 'Todos os direitos reservados.' : locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
