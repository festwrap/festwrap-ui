import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { ZodSchema } from 'zod';

export type BaseResponseData = {
  message: string;
  [key: string]: any;
};

export type BaseHandlerParams<
  TRequestData,
  TResponseData extends BaseResponseData,
> = {
  validationSchema: ZodSchema;
  handleRequest: (
    _requestData: TRequestData,
    _accessToken: string,
    _response: NextApiResponse<TResponseData>
  ) => Promise<void>;
  extractRequestData: (_req: NextApiRequest) => any;
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

    const token = await getToken({ req: request });

    if (!token) {
      response.status(401).json({ message: 'Unauthorized' } as TResponseData);
      return;
    }

    try {
      await handleRequest(parsedArgs.data, token.accessToken, response);
    } catch (error) {
      response.status(500).json({
        message: 'Unexpected error occurred',
      } as TResponseData);
    }
  };
}
