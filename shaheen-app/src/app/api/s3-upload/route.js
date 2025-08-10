import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});


async function uploadFileToS3(buffer, fileName) {

    const fileBuffer = buffer;
    const timestamp = Date.now();
    const key = "uploads/" + fileName + "-" + timestamp;
    
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: "image/jpeg"
    }

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Return both the fileName and the full S3 URL
    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return { fileName, s3Url };
}

export async function POST(request) {
	try {

		const formData = await request.formData();
		const file = formData.get("file");

		if(!file) {
			return NextResponse.json( { error: "File is required."}, { status: 400 } );
		} 

		const buffer = Buffer.from(await file.arrayBuffer());
		const { fileName, s3Url } = await uploadFileToS3(buffer, file.name);

		return NextResponse.json({ success: true, fileName, s3Url });
    } catch (error) {
		console.error('Upload error:', error);
		return NextResponse.json({ 
			error: error.message || 'An error occurred during upload' 
		}, { status: 500 });
	}
}