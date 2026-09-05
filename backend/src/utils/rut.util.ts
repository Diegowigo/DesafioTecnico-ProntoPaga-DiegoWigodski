/**
 * Utilidades para validación, limpieza y formateo de RUT chileno.
 */

/**
 * Limpia un RUT eliminando puntos, guiones y espacios, y transformando el dígito verificador a mayúscula.
 * Ejemplo: " 12.345.678-k " -> "12345678K"
 */
export function cleanRut(rut: string): string {
  if (typeof rut !== 'string') return '';
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Calcula el dígito verificador para el cuerpo numérico de un RUT chileno usando Módulo 11.
 */
export function calculateCheckDigit(body: string | number): string {
  const cleanBody = String(body).replace(/\D/g, '');
  if (!cleanBody) return '';

  let sum = 0;
  let multiplier = 2;

  // Recorrer los dígitos de derecha a izquierda
  for (let i = cleanBody.length - 1; i >= 0; i--) {
    sum += parseInt(cleanBody.charAt(i), 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return String(remainder);
}

/**
 * Valida si un RUT es sintácticamente correcto y si su dígito verificador corresponde según Módulo 11.
 */
export function validateRut(rut: string): boolean {
  if (!rut || typeof rut !== 'string') return false;

  const cleaned = cleanRut(rut);
  if (cleaned.length < 2 || cleaned.length > 9) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  // El cuerpo debe contener solo dígitos numéricos
  if (!/^\d+$/.test(body)) return false;

  const expectedDv = calculateCheckDigit(body);
  return dv === expectedDv;
}

/**
 * Formatea un RUT al formato estándar chileno con puntos y guión: "XX.XXX.XXX-Y"
 * Si el RUT no es válido, retorna el RUT original limpio o formateado en lo posible.
 */
export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return cleaned;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  // Formatear cuerpo con separadores de miles
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${dv}`;
}
