import { object, string } from "zod";

export const createReferralSchema = object({
    body: object({
        firstName: string({
            required_error: "First Name is Required",
        }),
        lastName: string({
            required_error: "Last Name is Required",
        }),
        email: string({
            required_error: "eMail is Required",
        }).email("Not a valid email"),
        mobile: string({
            required_error: "Mobile Number is Required",
        }),
        addressLine1: string({
            required_error: "Address Line 1 is Required",
        }),
        addressLine2: string({
            required_error: "Address Line 2 is Required",
        }),
        suburb: string({
            required_error: "Suburb is Required",
        }),
        state: string({
            required_error: "State is Required",
        }),
        postCode: string({
            required_error: "Postal Code is Required",
        }),
        country: string({
            required_error: "Country is Required",
        }),
    }),
});
