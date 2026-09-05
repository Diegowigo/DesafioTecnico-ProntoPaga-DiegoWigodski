import { Request, Response, NextFunction } from 'express';
import { nombrerutyfirmaService } from '../services/nombrerutyfirma.service';
import { formatRut } from '../utils/rut.util';
import { AppError } from '../middlewares/error.middleware';

export class RutController {
  /**
   * Consulta pública de datos asociados al RUT en NombreRutYFirma.
   * GET /person/:rut
   */
  public async getPersonByRut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rut } = req.params;
      const data = await nombrerutyfirmaService.fetchPersonByRut(rut);

      if (!data) {
        res.status(200).json({
          rut: formatRut(rut),
          name: `Usuario ${formatRut(rut)}`,
          found: false,
          source: 'default'
        });
        return;
      }

      res.status(200).json({
        rut: data.rut,
        name: data.name,
        rawName: data.rawName,
        sex: data.sex,
        address: data.address,
        city: data.city,
        found: true,
        source: 'nombrerutyfirma.com'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const rutController = new RutController();
