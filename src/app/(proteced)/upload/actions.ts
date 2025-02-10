// app/actions.ts
"use server";

import cloudinary from "@/lib/actions/cloudinary"; // Pastikan path impor benar
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function uploadImage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tags = formData.get("tags") as string; // Simpan tags sebagai string
  const file = formData.get("file") as File;

  // Konversi file ke buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Upload gambar ke Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "naturescape",
          tags: ["nextjs-server-actions-upload"], // Tambahkan tag jika diperlukan
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });

  // Simpan data gambar ke database
  await prisma.image.create({
    data: {
      title,
      description,
      tags,
      imageUrl: uploadResult.sss,
      progress: 100, // Progress 100% setelah upload selesai
      userId: session.user.id, // ID user yang mengupload
    },
  });

  // Refresh halaman untuk menampilkan gambar baru
  revalidatePath("/");
}