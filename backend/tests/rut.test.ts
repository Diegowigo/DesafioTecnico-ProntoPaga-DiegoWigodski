import { describe, it, expect } from '@jest/globals';
import { cleanRut, formatRut, validateRut, calculateCheckDigit } from '../src/utils/rut.util';

describe('RUT Utilities - Validación y Formateo Chileno (Módulo 11)', () => {
  describe('calculateCheckDigit', () => {
    it('debe calcular correctamente el dígito verificador para números conocidos', () => {
      expect(calculateCheckDigit('11111111')).toBe('1');
      expect(calculateCheckDigit('22222222')).toBe('2');
      expect(calculateCheckDigit('12345678')).toBe('5');
      expect(calculateCheckDigit('11111112')).toBe('K');
      expect(calculateCheckDigit('99999999')).toBe('9');
    });
  });

  describe('validateRut', () => {
    it('debe retornar true para RUTs chilenos válidos con y sin formato', () => {
      expect(validateRut('11.111.111-1')).toBe(true);
      expect(validateRut('11111111-1')).toBe(true);
      expect(validateRut('111111111')).toBe(true);
      expect(validateRut('22.222.222-2')).toBe(true);
      expect(validateRut('12.345.678-5')).toBe(true);
      expect(validateRut('11.111.112-k')).toBe(true);
      expect(validateRut('11.111.112-K')).toBe(true);
      expect(validateRut('99.999.999-9')).toBe(true);
    });

    it('debe retornar false para RUTs con dígito verificador erróneo', () => {
      expect(validateRut('11.111.111-2')).toBe(false);
      expect(validateRut('12.345.678-9')).toBe(false);
      expect(validateRut('22.222.222-0')).toBe(false);
      expect(validateRut('11.111.112-5')).toBe(false);
    });

    it('debe retornar false para strings vacíos o formatos completamente inválidos', () => {
      expect(validateRut('')).toBe(false);
      expect(validateRut('abc')).toBe(false);
      expect(validateRut('123')).toBe(false);
      expect(validateRut('12.34A.678-5')).toBe(false);
    });
  });

  describe('cleanRut', () => {
    it('debe eliminar puntos, guiones y espacios y pasar DV a mayúscula', () => {
      expect(cleanRut(' 11.111.111-1 ')).toBe('111111111');
      expect(cleanRut('11.111.112-k')).toBe('11111112K');
      expect(cleanRut('12-345-678-5')).toBe('123456785');
    });
  });

  describe('formatRut', () => {
    it('debe formatear un RUT limpio al formato canónico XX.XXX.XXX-Y', () => {
      expect(formatRut('111111111')).toBe('11.111.111-1');
      expect(formatRut('11111112K')).toBe('11.111.112-K');
      expect(formatRut('123456785')).toBe('12.345.678-5');
    });
  });
});
