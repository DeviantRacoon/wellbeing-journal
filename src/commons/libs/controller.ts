import type { NextApiRequest, NextApiResponse } from "next";

export function customErrorHandler(
  message: string,
  statusCode: number = 400,
): never {
  throw { message, statusCode };
}

const nonResponseFields = ["password", "refreshTokenHash"];
const sanitizeWithNonResponseFields = (data: any): void => {
  if (Array.isArray(data)) {
    data.forEach((item: any) => {
      sanitizeWithNonResponseFields(item);
    });
    return;
  }

  if (typeof data === "object" && data !== null) {
    nonResponseFields.forEach((field) => {
      delete data[field];
    });
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "object") {
        sanitizeWithNonResponseFields(data[key]);
      }
    });
  }
};

export function RequestHandler(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const fn = descriptor.value;

  descriptor.value = async function (
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    try {
      const data = await fn.apply(this, [req, res]);

      if (data !== undefined) {
        const response: {
          ok: boolean;
          data?: any;
          message?: string;
          total?: number;
        } = { ok: true };

        if (data.data !== undefined && data.message !== undefined) {
          response.data = data.data;
          response.message = data.message;
          response.total = data.total;
        } else {
          response.data = data;
        }

        sanitizeWithNonResponseFields(response.data);

        res.status(200).json(response);
      } else {
        res.status(204).end();
      }
    } catch (error: any) {
      if (error.message && error.statusCode) {
        res.status(error.statusCode).json({
          ok: false,
          message: error.message,
          total: error.total,
        });
      } else {
        console.error("[ERROR] Error capturado:", error.message);
        res.status(500).json({
          ok: false,
          message:
            "Lo sentimos, ha ocurrido un error, nuestro equipo lo está trabajando. Por favor, intente más tarde.",
        });
      }
    }
  };

  return descriptor;
}
