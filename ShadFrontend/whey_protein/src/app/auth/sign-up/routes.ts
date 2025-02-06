import { NextResponse } from "next/server";
import dbConfig from '../../dbConfig';
import bcrypt from 'bcryptjs'; 


export async function POST(req: Request) {
    const { email, password } = await req.json();


    try{
        const existingUser= await prisma.user.findUnique({where : {email}});
        if(existingUser){
            return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
            },
          });

    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
      }
}
