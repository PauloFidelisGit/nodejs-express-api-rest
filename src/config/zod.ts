import zod from 'zod';

const customErrorMap: zod.ZodErrorMap = (issue, ctx) => {
  if (issue.code === zod.ZodIssueCode.invalid_type) {
    if (issue.received === "undefined") {
      return { message: "Preenchimento obrigatório." };
    }
  }

  if (issue.code === zod.ZodIssueCode.too_small) {
    return {
      message: `O campo deve possuir no mínimo ${issue.minimum} caracteres.`,
    };
  }

  return { message: ctx.defaultError };
};

zod.setErrorMap(customErrorMap);

export { zod };
