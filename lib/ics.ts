import { MENU_MAP, MenuItem } from './menuMap';
import { toSlug } from './slug';

const ICS_FEEDS = [
  'https://moh.bvsd.org/calendar/calendar_429.ics',
  'https://moh.bvsd.org/calendar/calendar_440.ics',
  'https://moh.bvsd.org/calendar/calendar_427.ics',
  'https://moh.bvsd.org/calendar/calendar_432.ics',
  'https://moh.bvsd.org/calendar/calendar_430.ics',
  'https://moh.bvsd.org/calendar/calendar_428.ics',
];

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

interface VEvent {
  dtstart: string;
  summary: string;
}

function parseICS(text: string): VEvent[] {
  const events: VEvent[] = [];

  // Split into VEVENT blocks
  const veventBlocks = text.split(/BEGIN:VEVENT/g).slice(1);

  for (const block of veventBlocks) {
    const endIndex = block.indexOf('END:VEVENT');
    const content = endIndex !== -1 ? block.slice(0, endIndex) : block;

    // Unfold continuation lines (lines starting with space or tab are continuations)
    const unfolded = content.replace(/\r?\n[ \t]/g, '');

    const lines = unfolded.split(/\r?\n/);

    let dtstart = '';
    let summary = '';

    for (const line of lines) {
      if (/^DTSTART[^:]*:/.test(line)) {
        dtstart = line.replace(/^DTSTART[^:]*:/, '').trim();
      } else if (/^SUMMARY[^:]*:/.test(line)) {
        summary = line.replace(/^SUMMARY[^:]*:/, '').trim();
        // Unescape \, → ,
        summary = summary.replace(/\\,/g, ',');
      }
    }

    if (dtstart && summary) {
      events.push({ dtstart, summary });
    }
  }

  return events;
}

export async function getTodaysMenu(dateString?: string): Promise<
  Array<{ rawKey: string; item: MenuItem; slug: string }>
> {
  const today = dateString ?? getTodayDateString();

  const results = await Promise.allSettled(
    ICS_FEEDS.map((url) =>
      fetch(url, {
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'MohiLunch/1.0' },
      }).then((r) => r.text()),
    ),
  );

  const allEvents: VEvent[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allEvents.push(...parseICS(result.value));
    }
  }

  // Filter to today's events
  const todayEvents = allEvents.filter((e) => e.dtstart === today);

  // Map to menu items, deduplicate by displayName
  const seen = new Set<string>();
  const menuItems: Array<{ rawKey: string; item: MenuItem; slug: string }> = [];

  for (const event of todayEvents) {
    const item = MENU_MAP[event.summary];
    if (!item) continue;

    const key = item.displayName;
    if (seen.has(key)) continue;
    seen.add(key);

    menuItems.push({
      rawKey: event.summary,
      item,
      slug: toSlug(item.displayName),
    });
  }

  return menuItems;
}
