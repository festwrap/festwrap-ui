import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodSchema } from 'zod';

export type BaseResponseData = {
  message: string;
  [key: string]: unknown;
};

export type BaseHandlerParams<
  TRequestData,
  TResponseData extends BaseResponseData,
> = {
  validationSchema: ZodSchema;
  handleRequest: (
    _requestData: TRequestData,
    _response: NextApiResponse<TResponseData>
  ) => Promise<void>;
  extractRequestData: (_req: NextApiRequest) => unknown;
};

export function createBaseHandler<
  TRequestData,
  TResponseData extends BaseResponseData,
>({
  validationSchema,
  handleRequest,
  extractRequestData,
}: BaseHandlerParams<TRequestData, TResponseData>) {
  return async function handler(
    request: NextApiRequest,
    response: NextApiResponse<TResponseData>
  ): Promise<void> {
    const requestData = extractRequestData(request);
    const parsedArgs = validationSchema.safeParse(requestData);

    if (!parsedArgs.success) {
      response.status(400).json({
        message: parsedArgs.error.errors[0].message,
      } as TResponseData);
      return;
    }

    try {
      await handleRequest(parsedArgs.data, response);
    } catch (error) {
      response.status(500).json({
        message:
          'Unexpected error occurred: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      } as TResponseData);
    }
  };
}
