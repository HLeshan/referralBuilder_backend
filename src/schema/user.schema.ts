import { object, string } from "zod";

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: "Name is Required",
        }),
        password: string({
            required_error: "Password is Required",
        }),
        firstName: string({
            required_error: "First Name is Required",
        }),
    }),
});

export const loginUserSchema = object({
    body: object({
        username: string({
            required_error: "Name is Required",
        }),
        password: string({
            required_error: "Password is Required",
        }),
    }),
});
