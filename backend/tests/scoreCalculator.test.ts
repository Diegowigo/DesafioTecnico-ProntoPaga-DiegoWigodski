import { describe, it, expect } from '@jest/globals';
import { calculateDeterministicScore } from '../src/utils/scoreCalculator';

describe('Score Calculator - Algoritmo Determinista (0 - 100)', () => {
  it('debe retornar exactamente el mismo score en múltiples llamadas para el mismo RUT (Determinismo)', () => {
    const rut = '11.111.111-1';
    const initialScore = calculateDeterministicScore(rut);

    // Repetir 500 veces para asegurar 100% consistencia
    for (let i = 0; i < 500; i++) {
      expect(calculateDeterministicScore(rut)).toBe(initialScore);
    }
  });

  it('debe retornar el mismo score sin importar variaciones de formato o espacios', () => {
    const score1 = calculateDeterministicScore('11.111.111-1');
    const score2 = calculateDeterministicScore('11111111-1');
    const score3 = calculateDeterministicScore(' 111111111 ');
    const score4 = calculateDeterministicScore('11.111.111-1');

    expect(score1).toBe(score2);
    expect(score2).toBe(score3);
    expect(score3).toBe(score4);
  });

  it('debe devolver siempre un número entero entre 0 y 100 inclusive', () => {
    const ruts = [
      '11.111.111-1',
      '22.222.222-2',
      '12.345.678-5',
      '11.111.112-K',
      '99.999.999-9',
      '18.456.789-0',
      '7.654.321-K',
      '15.987.654-3'
    ];

    ruts.forEach((rut) => {
      const score = calculateDeterministicScore(rut);
      expect(Number.isInteger(score)).toBe(true);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it('debe generar variación de scores entre RUTs distintos', () => {
    const scores = new Set<number>();
    const ruts = [
      '11.111.111-1',
      '22.222.222-2',
      '12.345.678-5',
      '11.111.112-K',
      '99.999.999-9',
      '18.456.789-0',
      '7.654.321-K',
      '15.987.654-3',
      '10.234.567-8',
      '13.456.789-1'
    ];

    ruts.forEach((rut) => {
      scores.add(calculateDeterministicScore(rut));
    });

    // Debe haber múltiples valores diferentes, no todos el mismo valor constante
    expect(scores.size).toBeGreaterThan(1);
  });
});
