"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTranslations, type Locale } from '../../../../lib/translations';
import { LanguageSwitcher } from '../../../../components/ui/language-switcher';
import Link from 'next/link';

export default function BlogPost() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'pt';
  const slug = params.slug as string;
  const translations = getTranslations(locale);
  const navT = translations.nav;
  const blogT = translations.blog;

  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Buscar o post pelo slug
        const response = await fetch(`https://public-api.wordpress.com/wp/v2/sites/leandropaivavercel.wordpress.com/posts?slug=${slug}`);
        const data = await response.json();

        if (data && data.length > 0) {
          setPost(data[0]);

          // Buscar posts relacionados
          const relatedResponse = await fetch('https://public-api.wordpress.com/wp/v2/sites/leandropaivavercel.wordpress.com/posts?per_page=3');
          const relatedData = await relatedResponse.json();
          setRelatedPosts(relatedData.filter((p: any) => p.id !== data[0].id).slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
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
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <div className="pt-24 pb-16 px-4 md:px-8">
        <article className="w-full lg:w-10/12 mx-auto max-w-4xl">
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
      {relatedPosts.length > 0 && (
        <section className="w-full bg-black py-16 px-4 md:px-8 border-t border-white/10">
          <div className="w-full lg:w-10/12 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              {locale === 'pt' ? 'Leia também' : locale === 'es' ? 'Lee también' : 'Read also'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.map((relatedPost: any) => {
                const postSlug = relatedPost.slug;

                return (
                  <Link
                    key={relatedPost.id}
                    href={`/${locale}/blog/${postSlug}`}
                    className="group bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex flex-col h-full"
                  >
                    {(relatedPost.jetpack_featured_media_url || relatedPost.featured_image) && (
                      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
                        <img
                          src={relatedPost.jetpack_featured_media_url || relatedPost.featured_image}
                          alt={relatedPost.title?.rendered || relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
                        {new Date(relatedPost.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>

                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {relatedPost.title?.rendered || relatedPost.title}
                      </h3>

                      <span className="text-sm text-purple-400 font-medium group-hover:text-purple-300 transition-colors mt-auto">
                        {blogT.readMore} →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full bg-black border-t border-white/10 py-8 px-4 md:px-8">
        <div className="w-full lg:w-10/12 mx-auto text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Leandro Paiva. {locale === 'pt' ? 'Todos os direitos reservados.' : locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
