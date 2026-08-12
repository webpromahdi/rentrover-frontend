import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const cookieStore = await cookies();
  
  // Set cookies on the frontend domain
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  // Decode token to redirect to the correct dashboard
  const decoded = jwt.decode(accessToken) as JwtPayload | null;
  
  let redirectUrl = "/";
  if (decoded?.role === "CUSTOMER") redirectUrl = "/dashboard/customer";
  else if (decoded?.role === "PROVIDER") redirectUrl = "/dashboard/provider";
  else if (decoded?.role === "ADMIN") redirectUrl = "/dashboard/admin";

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
