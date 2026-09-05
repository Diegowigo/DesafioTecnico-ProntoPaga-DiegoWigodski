import crypto from 'crypto';
import { cleanRut } from './rut.util';

/**
 * Calcula un score financiero determinista entre 0 y 100 para un RUT dado.
 * 
 * Reglas:
 * 1. Para un mismo RUT, siempre retorna exactamente el mismo score.
 * 2. Varía uniformemente entre diferentes RUTs gracias al efecto avalancha del hash SHA-256.
 * 3. Es insensible al formato (puntos, espacios o mayúsculas/minúsculas).
 *
 * @param rut - RUT de la persona o empresa
 * @returns Número entero entre 0 y 100
 */
export function calculateDeterministicScore(rut: string): number {
  const normalized = cleanRut(rut);
  if (!normalized) {
    throw new Error('RUT inválido para cálculo de score');
  }

  // Generamos un hash SHA-256 del RUT normalizado
  const hash = crypto.createHash('sha256').update(normalized).digest();

  // Tomamos los primeros 4 bytes como entero sin signo de 32 bits
  const uint32 = hash.readUInt32BE(0);

  // Mapeamos a rango [0, 100] usando módulo 101
  const score = uint32 % 101;

  return score;
}
