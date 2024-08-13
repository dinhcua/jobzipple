import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'ResponseMessageKey';

export const ResponseMessage = (message: string) => {
  return SetMetadata(RESPONSE_MESSAGE_KEY, message);
};
