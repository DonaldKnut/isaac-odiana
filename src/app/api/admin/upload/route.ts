import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} from "@/lib/cloudinary";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadBufferToCloudinary(bytes);

  return NextResponse.json({
    url: uploaded.url,
    publicId: uploaded.publicId,
  });
}
