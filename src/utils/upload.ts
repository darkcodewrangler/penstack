import { MediaType } from "../types";

export function determineFileType(format: string): MediaType {
  const imageFormats = ["jpg", "jpeg", "png", "gif", "webp"];
  const videoFormats = ["mp4", "webm", "mov"];
  const audioFormats = ["mp3", "wav", "ogg"];
  const docFormats = ["doc", "docx"];
  const _format = format.toLowerCase();
  if (imageFormats.includes(_format)) return "image";
  if (videoFormats.includes(_format)) return "video";
  if (audioFormats.includes(_format)) return "audio";
  if (docFormats.includes(_format)) return "doc";
  if (_format === "pdf") return "pdf";

  return "image";
}
