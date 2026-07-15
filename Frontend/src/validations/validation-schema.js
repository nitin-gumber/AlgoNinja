import { z } from "zod";

export const signUpFormSchema = z
  .object({
    firstName: z
      .string({ required_error: "First Name field is required" })
      .min(1, { message: "First Name must be 1 characters" }),
    lastName: z
      .string({ required_error: "Last Name field is required" })
      .min(1, { message: "Last Name must be 1 characters" }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const problemValidationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag is required"),
  examples: z
    .array(
      z.object({
        input: z.string().min(1, "Example input is required"),
        output: z.string().min(1, "Example output is required"),
        explanation: z.string().optional(),
      }),
    )
    .min(1, "At least one code example model is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Testcase input is required"),
        output: z.string().min(1, "Testcase output is required"),
      }),
    )
    .min(1, "At least one testcase is required"),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript snippet is required"),
    PYTHON: z.string().min(1, "Python snippet is required"),
    JAVA: z.string().min(1, "Java snippet is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});
