/**
 * Validates a Chilean RUT using Module 11 algorithm.
 */
export function validateRut(rut: string): boolean {
  if (!rut || typeof rut !== 'string') return false;
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();

  if (!/^\d+$/.test(body)) return false;

  const calculatedDv = calculateDv(body);
  return calculatedDv === dv;
}

function calculateDv(body: string): string {
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return remainder.toString();
}

/**
 * Removes formatting (dots, dashes, spaces) and uppercases the DV.
 */
export function cleanRut(rut: string): string {
  return rut.replace(/[\.\-\s]/g, '').toUpperCase();
}

/**
 * Formats a clean RUT to canonical XX.XXX.XXX-Y format.
 */
export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return rut;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}

/**
 * Formats input as user types: auto-inserts dash before last char.
 */
export function formatRutInput(value: string): string {
  const cleaned = value.replace(/[\.\-\s]/g, '').toUpperCase();
  if (cleaned.length <= 1) return cleaned;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}
