"use server"

import { auth } from "@/auth";

export async function getuser(){
    const session = await auth();
    if(session)

    return session
}