export type zeroXResponse = {
  data: string;
  allowanceTarget: string;
  to: string;
  value: string;
  buyAmount: string;
  sellAmount: string;
};

export type zeroXErrorResponse = {
  code: number;
  reason: string;
};

export const isErrorResponse = (
  r: zeroXResponse | zeroXErrorResponse
): r is zeroXErrorResponse => {
  return (r as zeroXErrorResponse).reason !== undefined;
};
