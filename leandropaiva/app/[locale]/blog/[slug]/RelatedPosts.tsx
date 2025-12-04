import Link from 'next/link';
import { getTranslations, type Locale } from '../../../../lib/translations';

async function getRelatedPosts(currentPostId: number) {
  try {
    const response = await fetch(
      'https://public-api.wordpress.com/wp/v2/sites/leandropaivavercel.wordpress.com/posts?per_page=4',
      {
        next: { revalidate: 3600 },
        cache: 'force-cache'
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.filter((p: any) => p.id !== currentPostId).slice(0, 3);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export default async function RelatedPosts({ locale, currentPostId }: { locale: Locale; currentPostId: number }) {
  const relatedPosts = await getRelatedPosts(currentPostId);
  const translations = getTranslations(locale);
  const blogT = translations.blog;

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-black py-16 px-4 md:px-8 border-t border-white/10">
      <div className="w-full lg:w-10/12 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
          {locale === 'pt' ? 'Leia também' : locale === 'es' ? 'Lee también' : 'Read also'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {relatedPosts.map((relatedPost: any) => (
            <Link
              key={relatedPost.id}
              href={`/${locale}/blog/${relatedPost.slug}`}
              className="group bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex flex-col h-full"
              prefetch={true}
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
          ))}
        </div>
      </div>
    </section>
  );
}
