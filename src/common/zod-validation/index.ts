import { t } from "i18next";
import { z } from "zod";

// 3. Zod 커스텀 에러 맵
export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === "string" && issue.received === "undefined") {
        return { message: String(t("validation.required")) };
      }
      return { message: String(t("validation.invalid_type")) };

    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        return { message: String(t("validation.invalid_email")) };
      }
      return { message: String(t("validation.invalid_string")) };

    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        const currentLength = typeof ctx.data === "string" ? ctx.data.length : 0;
        return {
          message: String(
            t("validation.too_small", {
              minimum: issue.minimum,
              current: currentLength,
            }),
          ),
        };
      }
      break;

    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        const currentLength = typeof ctx.data === "string" ? ctx.data.length : 0;
        return {
          message: String(
            t("validation.too_big", {
              maximum: issue.maximum,
              current: currentLength,
            }),
          ),
        };
      }
      break;

    case z.ZodIssueCode.custom:
      if (issue.params?.messageKey) {
        return { message: String(t(issue.params.messageKey, issue.params)) };
      }
      break;
  }

  return { message: ctx.defaultError };
};

// 4. Zod에 커스텀 에러 맵 설정
z.setErrorMap(customErrorMap);

// 5. 커스텀 validation 헬퍼 함수들
export const zodHelpers = {
  strongPassword: () =>
    z
      .string()
      .nonempty()
      .refine((val) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(val), {
        params: { messageKey: "password_weak" },
      }),

  koreanPhone: () =>
    z
      .string()
      .min(1, { message: t("validation.required") })
      .refine((val) => /^01[016789]-?\d{3,4}-?\d{4}$/.test(val.replace(/-/g, "")), { params: { messageKey: "phone_invalid" } }),

  age: () =>
    z
      .number()
      .min(1, { message: t("validation.age_invalid") })
      .max(120, { message: t("validation.age_invalid") }),
};

// 6. 사용 예시
export const createUserSchema = () => {
  return z.object({
    name: z.string().min(1).max(50),
    email: z.string().email(),
    password: zodHelpers.strongPassword(),
    phone: zodHelpers.koreanPhone(),
    age: zodHelpers.age(),
    bio: z.string().max(500).optional(),
  });
};

// 7. 에러 메시지 포맷팅 유틸리티
export const formatZodErrors = (errors: z.ZodError) => {
  return errors.errors.reduce(
    (acc, error) => {
      const path = error.path.join(".");
      acc[path] = error.message;
      return acc;
    },
    {} as Record<string, string>,
  );
};
