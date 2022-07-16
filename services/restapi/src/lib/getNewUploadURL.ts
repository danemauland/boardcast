import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Bucket, s3 } from "./config"

export const getNewUploadURL = async (Key: string) => {
  return getSignedUrl(
    s3,
    new PutObjectCommand({Key, Bucket}),
    { expiresIn: 60 * 60 * 5}
  )
}