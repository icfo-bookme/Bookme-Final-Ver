const normalizeSortParams = (sortValue) => {
  if (sortValue === 'price_low' || sortValue === 'price_low_to_high') {
    return { sort_by: 'price', sort_order: 'asc' };
  }

  if (sortValue === 'price_high' || sortValue === 'price_high_to_low') {
    return { sort_by: 'price', sort_order: 'desc' };
  }

  return {};
};

const normalizeDurationParam = (value) => {
  const rawValue = String(value ?? '').toLowerCase().trim();
  if (!rawValue) return null;

  const match = rawValue.match(/(\d+)/);
  const numericValue = match ? Number(match[1]) : null;

  if (numericValue === null) return null;
  if (numericValue <= 1) return '1';
  if (numericValue === 2) return '2';
  if (numericValue === 3) return '3';
  if (numericValue === 4) return '4';
  if (numericValue === 5) return '5';
  return '6+';
};

export default async function getTourList({ id, searchParams = {} }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const url = new URL(`${baseUrl}/api/tourpackages/propertySummary/${id}`);

  const priceRanges = String(searchParams.price_ranges ?? searchParams.priceRanges ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const durations = String(searchParams.durations ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => normalizeDurationParam(item))
    .filter(Boolean);

  const { sort_by, sort_order } = normalizeSortParams(String(searchParams.sort_by ?? ''));

  if (sort_by) {
    url.searchParams.set('sort_by', sort_by);
    url.searchParams.set('sort_order', sort_order);
  }

  priceRanges.forEach((range, index) => {
    const [minRaw, maxRaw] = range.split('-');
    const min = Number(minRaw);
    const max = maxRaw === 'Infinity' ? Infinity : Number(maxRaw);

    if (!Number.isNaN(min) && Number.isFinite(min)) {
      url.searchParams.set(`price_ranges[${index}][min]`, String(min));
    }

    if (!Number.isNaN(max) && Number.isFinite(max)) {
      url.searchParams.set(`price_ranges[${index}][max]`, String(max));
    }
  });

  durations.forEach((duration, index) => {
    url.searchParams.set(`durations[${index}]`, duration);
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 43200 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tour packages: ${res.status}`);
  }

  return res.json();
}