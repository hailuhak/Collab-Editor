"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";


export async function registerUser(
    data:{
        name:string;
        email:string;
        password:string;
    }
){

    const validated =
        registerSchema.safeParse(data);


    if(!validated.success){

        return {
            error:"Invalid input"
        };

    }


    const {
        name,
        email,
        password
    } = validated.data;



    const existingUser =
        await prisma.user.findUnique({
            where:{
                email
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



    await prisma.user.create({

        data:{
            name,
            email,
            password:hashedPassword
        }

    });



    return {
        success:true
    };

}