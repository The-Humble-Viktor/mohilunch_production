'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function submitReview(formData: {
  slug: string;
  rating: number;
  body: string | null;
  anonymous: boolean;
  displayName: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { slug, rating, body, anonymous, displayName } = formData;

  if (rating < 1 || rating > 5) throw new Error('Invalid rating');
  if (body && body.length > 1000) throw new Error('Review too long');

  const { error } = await supabase.from('reviews').insert({
    food_slug: slug,
    user_id: user.id,
    rating,
    body: body || null,
    anonymous,
    display_name: anonymous ? null : displayName,
  });

  if (error) throw new Error('Failed to submit review');
  revalidatePath(`/food/${slug}`);
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase());

  if (!user || !adminEmails.includes(user.email?.toLowerCase() ?? '')) {
    redirect('/');
  }
}

export async function approveReview(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('reviews').update({ status: 'approved' }).eq('id', id);
  revalidatePath('/admin');
}

export async function rejectReview(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('reviews').update({ status: 'rejected' }).eq('id', id);
  revalidatePath('/admin');
}

export async function uploadMenuItemImage(formData: FormData) {
  await requireAdmin();

  const slug = formData.get('slug') as string;
  const file = formData.get('image') as File;

  if (!slug || !file || file.size === 0) return;

  // Validate slug format to prevent path traversal
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid slug');

  // Validate file extension and MIME type against allowlist
  const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
  const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXTENSIONS.has(ext)) throw new Error('Invalid file type');
  if (!ALLOWED_MIME_TYPES.has(file.type)) throw new Error('Invalid MIME type');

  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) throw new Error('File too large');

  const admin = createAdminClient();

  // Delete existing image for this slug (enforces 1 image per item)
  const { data: existing } = await admin
    .from('menu_item_images')
    .select('storage_path')
    .eq('slug', slug)
    .single();

  if (existing?.storage_path) {
    await admin.storage.from('menu-images').remove([existing.storage_path]);
  }

  // Upload new image
  const path = `${slug}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage
    .from('menu-images')
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) throw new Error(error.message);

  // Record the path in the DB
  await admin.from('menu_item_images').upsert({
    slug,
    storage_path: path,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(`/food/${slug}`);
  revalidatePath('/admin/images');
  revalidatePath('/');
}

export async function deleteMenuItemImage(slug: string) {
  await requireAdmin();

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('menu_item_images')
    .select('storage_path')
    .eq('slug', slug)
    .single();

  if (existing?.storage_path) {
    await admin.storage.from('menu-images').remove([existing.storage_path]);
    await admin.from('menu_item_images').delete().eq('slug', slug);
  }

  revalidatePath(`/food/${slug}`);
  revalidatePath('/admin/images');
  revalidatePath('/');
}
