import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { MENU_MAP } from '@/lib/menuMap';
import { toSlug } from '@/lib/slug';
import { Navbar } from '@/components/Navbar';
import { uploadMenuItemImage, deleteMenuItemImage } from '../actions';

async function ImagesContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase());
  if (!user || !adminEmails.includes(user.email?.toLowerCase() ?? '')) {
    redirect('/');
  }

  const admin = createAdminClient();
  const { data: imageRows } = await admin.from('menu_item_images').select('slug, storage_path');
  const imageMap = new Map((imageRows ?? []).map((r) => [r.slug, r.storage_path]));

  // Deduplicate menu items by slug
  const uniqueItems = new Map<string, string>();
  for (const item of Object.values(MENU_MAP)) {
    const slug = toSlug(item.displayName);
    if (!uniqueItems.has(slug)) uniqueItems.set(slug, item.displayName);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Menu Item Images</h1>
          <p className="text-gray-500 text-sm mt-1">
            {imageMap.size} of {uniqueItems.size} items have photos
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-monarch-gold transition-colors"
        >
          ← Reviews
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from(uniqueItems.entries()).map(([slug, displayName]) => {
          const storagePath = imageMap.get(slug);
          const imageUrl = storagePath
            ? `${supabaseUrl}/storage/v1/object/public/menu-images/${storagePath}`
            : null;

          return (
            <div
              key={slug}
              className="rounded-xl border border-monarch-border bg-monarch-surface p-4 flex flex-col gap-3"
            >
              {/* Item name */}
              <p className="text-white font-semibold text-sm">{displayName}</p>

              {/* Image preview */}
              {imageUrl ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-[#111]">
                  <Image
                    src={imageUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="w-full h-40 rounded-lg bg-[#111] border border-monarch-border flex items-center justify-center">
                  <span className="text-gray-600 text-sm">No image</span>
                </div>
              )}

              {/* Upload form */}
              <form action={uploadMenuItemImage} className="flex flex-col gap-2">
                <input type="hidden" name="slug" value={slug} />
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">
                    {imageUrl ? 'Replace image' : 'Upload image'}
                  </span>
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required
                    className="text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-monarch-gold/20 file:text-monarch-gold hover:file:bg-monarch-gold/30 cursor-pointer"
                  />
                </label>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-monarch-gold text-monarch-black text-xs font-semibold hover:bg-monarch-gold-light transition-colors"
                >
                  {imageUrl ? 'Replace' : 'Upload'}
                </button>
              </form>

              {/* Delete form */}
              {imageUrl && (
                <form
                  action={async () => {
                    'use server';
                    await deleteMenuItemImage(slug);
                  }}
                >
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-red-900 hover:bg-red-800 text-white text-xs font-semibold transition-colors w-full"
                  >
                    Remove image
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function ImagesSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="h-9 w-64 bg-monarch-surface rounded mb-2" />
      <div className="h-4 w-40 bg-monarch-surface rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-xl bg-monarch-surface border border-monarch-border" />
        ))}
      </div>
    </main>
  );
}

export default function AdminImagesPage() {
  return (
    <div className="min-h-screen bg-monarch-black">
      <Navbar />
      <Suspense fallback={<ImagesSkeleton />}>
        <ImagesContent />
      </Suspense>
    </div>
  );
}
