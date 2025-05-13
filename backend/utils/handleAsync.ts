import { Request, Response, NextFunction } from "express";

const handleAsync = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
};

export default handleAsync;
