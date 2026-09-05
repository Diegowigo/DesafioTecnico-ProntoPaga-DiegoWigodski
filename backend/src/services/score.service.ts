import { ScoreResponse } from '../types';
import { calculateDeterministicScore } from '../utils/scoreCalculator';
import { formatRut } from '../utils/rut.util';

export class ScoreService {
  /**
   * Obtiene el score financiero determinista para un RUT.
   * Retorna el objeto con formato exacto: { rut, score, fecha }
   */
  public getScore(rut: string): ScoreResponse {
    const score = calculateDeterministicScore(rut);
    const formattedRut = formatRut(rut);
    const fecha = new Date().toISOString();

    return {
      rut: formattedRut,
      score,
      fecha
    };
  }
}

export const scoreService = new ScoreService();
