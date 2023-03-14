import { Request, Response, NextFunction } from 'express';
import { useFormatResponse } from '../hooks';

export function NotFound(req: Request, res: Response, next: NextFunction) {
  const { formatResponse, setMessage } = useFormatResponse();

  setMessage('Rota não encontrada.');

  return res.status(404).json(formatResponse);
}
