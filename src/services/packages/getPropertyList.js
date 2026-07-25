import { fetchJson } from '@/api/fetchData';

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
  const params = {};

  const { sort_by, sort_order } = normalizeSortParams(String(searchParams.sort_by ?? ''));
  if (sort_by) {
    params.sort_by = sort_by;
    params.sort_order = sort_order;
  }

  const priceRanges = String(searchParams.price_ranges ?? searchParams.priceRanges ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  priceRanges.forEach((range, index) => {
    const [minRaw, maxRaw] = range.split('-');
    const min = Number(minRaw);
    const max = maxRaw === 'Infinity' ? Infinity : Number(maxRaw);

    if (!Number.isNaN(min) && Number.isFinite(min)) {
      params[`price_ranges[${index}][min]`] = String(min);
    }

    if (!Number.isNaN(max) && Number.isFinite(max)) {
      params[`price_ranges[${index}][max]`] = String(max);
    }
  });

  const durations = String(searchParams.durations ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => normalizeDurationParam(item))
    .filter(Boolean);

  durations.forEach((duration, index) => {
    params[`durations[${index}]`] = duration;
  });

  return fetchJson(`/api/tourpackages/propertySummary/${id}`, {
    params,
    throwOnError: true,
  });
}
