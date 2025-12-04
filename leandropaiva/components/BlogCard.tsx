"use client";

interface BlogCardProps {
  post: any;
  locale: string;
  blogT: any;
}

export default function BlogCard({ post, locale, blogT }: BlogCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Force full page reload to avoid hydration issues
    window.location.href = `/${locale}/blog/${post.slug}`;
  };

  return (
    <a
      href={`/${locale}/blog/${post.slug}`}
      onClick={handleClick}
      className="group bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex flex-col h-full"
    >
      {/* Featured Image - 16:9 aspect ratio */}
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
        {(post.jetpack_featured_media_url || post.featured_image) ? (
          <img
            src={post.jetpack_featured_media_url || post.featured_image}
            alt={post.title?.rendered || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Date */}
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
          {post.title?.rendered || post.title}
        </h3>

        {/* Excerpt */}
        <div className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-4 flex-grow">
          {post.excerpt && typeof post.excerpt === 'string'
            ? post.excerpt.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
            : 'Read more about this article...'}
        </div>

        {/* Read More */}
        <span className="text-sm text-purple-400 font-medium group-hover:text-purple-300 transition-colors mt-auto">
          {blogT.readMore} →
        </span>
      </div>
    </a>
  );
}
