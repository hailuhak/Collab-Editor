"use server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { registerSchema, updateNameSchema } from "@/lib/validations/auth";
import { rateLimit } from "@/lib/rate-limit";
import { authOptions } from "@/auth";

const RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000, blockMs: 60 * 60 * 1000 };

async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export async function updateProfileName(name: string) {
    const parsed = updateNameSchema.safeParse({ name });
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid name" };
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    await prisma.user.update({
        where: { email: session.user.email },
        data: { name: parsed.data.name },
    });

    return { success: true };
}


export async function registerUser(
    data:{
        name:string;
        email:string;
        password:string;
        confirmPassword:string;
    }
){

    const ip = await getClientIp();
    const limited = rateLimit(`register:${ip}`, RATE_LIMIT);
    if (limited.blocked) {
        return { error: "Too many registration attempts. Please try again later." };
    }

    const validated =
        registerSchema.safeParse(data);


    if(!validated.success){

        return {
            error: validated.error.issues[0]?.message ?? "Invalid input"
        };

    }


    const {
        name,
        email,
        password
    } = validated.data;



    const existingUser =
        await prisma.user.findFirst({
            where:{
                email: { equals: email, mode: "insensitive" }
            }
        });



    if(existingUser){

        return {
            error:"Email already exists"
        };

    }



    const hashedPassword =
        await bcrypt.hash(
            password,
            12
        );



    try {

        await prisma.user.create({

            data:{
                name,
                email,
                password:hashedPassword
            }

        });

    } catch (err) {

        if (
            typeof err === "object" &&
            err !== null &&
            "code" in err &&
            err.code === "P2002"
        ) {
            return { error: "Email already exists" };
        }

        throw err;

    }



    return {
        success:true
    };

}
