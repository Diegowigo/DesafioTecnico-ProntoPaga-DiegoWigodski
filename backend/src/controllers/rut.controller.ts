import { Request, Response, NextFunction } from 'express';
import { formatRut, cleanRut } from '../utils/rut.util';
import { MOCK_USERS } from '../data/mockUsers';

export class RutController {
  /**
   * Consulta pública de datos asociados al RUT en la base de usuarios mock.
   * GET /person/:rut
   */
  public async getPersonByRut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rut } = req.params;
      const formattedRut = formatRut(rut);
      const cleaned = cleanRut(rut);

      const mockUser = MOCK_USERS.find(
        (u) => cleanRut(u.rut) === cleaned || (u.rut && formatRut(u.rut) === formattedRut)
      );

      if (mockUser) {
        res.status(200).json({
          rut: formattedRut,
          name: mockUser.name,
          role: mockUser.role,
          found: true,
          source: 'mock'
        });
        return;
      }

      res.status(200).json({
        rut: formattedRut,
        name: `Usuario ${formattedRut}`,
        found: false,
        source: 'mock'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const rutController = new RutController();
