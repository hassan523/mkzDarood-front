// utils/url.ts
export function URLParams(base: string, params: Record<string, any>): string {
     const searchParams = new URLSearchParams();

     Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          // skip empty string as well
          if (typeof value === 'string' && value.trim() === '') return;

          // If value is an array, append each
          if (Array.isArray(value)) {
               value.forEach(v => searchParams.append(key, String(v)));
          } else {
               searchParams.append(key, String(value));
          }
     });

     const queryString = searchParams.toString();
     return queryString ? `${base}?${queryString}` : base;
}
