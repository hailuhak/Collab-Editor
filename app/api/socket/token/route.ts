import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";

import { authOptions } from "@/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret) {
    return Response.json(
      { error: "Server misconfigured: missing AUTH_SECRET" },
      { status: 500 }
    );
  }

  const token = jwt.sign(
    {
      sub: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    },
    secret,
    { expiresIn: "1h" }
  );

  return Response.json({ token });
}
