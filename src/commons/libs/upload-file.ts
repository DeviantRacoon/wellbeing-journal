// "use server";

// import { minioClient } from "@/config/minio";
// import { PutObjectCommand } from "@aws-sdk/client-s3";

// const MAX_FILE_SIZE = 5 * 1024 * 1024;

// export async function uploadFile(file: File) {
//   try {
//     if (!file || file.size === 0) {
//       return { ok: false, message: "Archivo inválido o vacío" };
//     }

//     if (file.size > MAX_FILE_SIZE) {
//       return {
//         ok: false,
//         message: `El archivo excede el límite de ${
//           MAX_FILE_SIZE / 1024 / 1024
//         }MB`,
//       };
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const extension = file.name.split(".").pop();

//     const uniqueFileName = `${crypto.randomUUID()}.${extension}`;

//     const bucketName = process.env.MINIO_BUCKET_NAME || "media";

//     const command = new PutObjectCommand({
//       Bucket: bucketName,
//       Key: uniqueFileName,
//       Body: buffer,
//       ContentType: file.type,
//       CacheControl: "max-age=31536000",
//     });

//     await minioClient.send(command);

//     const fileUrl = `${
//       process.env.MINIO_ENDPOINT || "http://localhost:9000"
//     }/${bucketName}/${uniqueFileName}`;

//     return { ok: true, message: "Archivo subido correctamente", url: fileUrl };
//   } catch (error) {
//     console.error("Error en uploadFile:", error);
//     return { ok: false, message: "Error interno al subir el archivo" };
//   }
// }
