import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { scoreService } from '../services/score.service';

export class ScoreController {
  public getScore(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      const { rut } = req.params;
      const result = scoreService.getScore(rut);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const scoreController = new ScoreController();
