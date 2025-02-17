// app/api/syncCalendar/route.js
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";
import { NextRequest } from "next/server";


const prisma = new PrismaClient()
const calendar = google.calendar("v3");

export async function POST(req:NextRequest) {
  const session = await auth()

  const prismasession = await prisma.session.findFirst({
    where: {
        userId: session?.user?.id
    }
  })

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const { user } = session;
  const { text, description, date } = await req.json();

  try {
    // Buat event baru di Google Calendar
    const auth = new google.auth.OAuth2(
"699266931106-a1vgin48u1toksuttt931fq8ehh2uu13.apps.googleusercontent.com",
"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",
"http://localhost:3000/api/auth/callback/google"
);

    auth.setCredentials({
      refresh_token: prismasession?.sessionToken, // Pastikan Anda menyimpan refresh token saat login
    });

    const event = {
      summary: text,
      description: description,
      start: {
        dateTime: new Date(date).toISOString(),
        timeZone: "Asia/Jakarta", // Sesuaikan dengan zona waktu Anda
      },
      end: {
        dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(), // Durasi 1 jam
        timeZone: "Asia/Jakarta",
      },
    };

    const response = await calendar.events.insert({
      auth,
      calendarId: "primary",
      requestBody: event,
    });

    // Simpan tugas ke database menggunakan Prisma
    const task = await prisma.task.create({
      data: {
        text,
        description,
        date: new Date(date),
        user_id: user?.id!,
        status: "COMPLETED", // Atur status sesuai kebutuhan
        priority: "MEDIUM", // Atur prioritas sesuai kebutuhan
      },
    });

    return new Response(JSON.stringify({ message: "Task synced successfully", task }), { status: 200 });
  } catch (error) {
    console.error("Error syncing to Google Calendar:", error);
    return new Response(JSON.stringify({ message: "Error syncing to Google Calendar", error }), { status: 500 });
  }
}