import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.cookies.get('authToken')?.value;
    const user = await fetch(`${process.env.BASE_URL}/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const userData = await user.json();
    return NextResponse.json({ role: userData.role });
}
