'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
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
