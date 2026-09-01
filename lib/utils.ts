export function formatDateToYYYYMMDD(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayYYYYMMDD(): string {
  return formatDateToYYYYMMDD(new Date());
}

export function formatDisplayDate(dateStr: string): { day: number; monthName: string; dayOfWeek: string } {
  // Parse date safely without timezone offset issues
  const parts = dateStr.split('-');
  if (parts.length < 3) {
    const d = new Date();
    return {
      day: d.getDate(),
      monthName: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      dayOfWeek: d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
    };
  }

  const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return {
    day: dateObj.getDate(),
    monthName: dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    dayOfWeek: dateObj.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
  };
}

export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

export function getPreviewText(content: string, maxLength: number = 120): string {
  const clean = stripHtmlTags(content);
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength) + '...';
}
