import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize Supabase client
const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { input_image_url, size, brand } = await request.json();

    // Validate required fields
    if (!input_image_url || !size || !brand) {
      return Response.json(
        { error: 'Missing required fields: input_image_url, size, brand' },
        { status: 400 }
      );
    }

    // Create initial record in Supabase with pending status
    const { data: generation, error: insertError } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        input_image_url,
        generated_image_url: null,
        prompt: null,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating generation record:', insertError);
      return Response.json(
        { error: 'Failed to create generation record' },
        { status: 500 }
      );
    }

    // Update status to processing
    await supabase
      .from('generations')
      .update({ status: 'processing' })
      .eq('id', generation.id);

    // Generate prompt using Google Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const promptText = `Analyze this image and create a detailed image generation prompt for a brand customization service. 
    
    Image URL: ${input_image_url}
    Brand Name: ${brand.name}
    Brand Theme Color: ${brand.theme_color}
    Target Size: ${size}
    
    Create a comprehensive prompt that describes:
    1. The original image content and style
    2. How to adapt it for the brand ${brand.name}
    3. Incorporate the theme color ${brand.theme_color}
    4. Maintain the same composition and style
    5. Ensure the output is suitable for ${size} dimensions
    
    Return only the prompt text, no additional formatting.`;

    const geminiResult = await model.generateContent(promptText);
    const generatedPrompt = geminiResult.response.text();

    // Update the prompt in the database
    await supabase
      .from('generations')
      .update({ prompt: generatedPrompt })
      .eq('id', generation.id);

    // Send to VM for image generation
    const vmResponse = await fetch('http://vm.local:3000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_image_url,
        prompt: generatedPrompt,
        size,
        brand,
      }),
    });

    if (!vmResponse.ok) {
      throw new Error(`VM API error: ${vmResponse.status}`);
    }

    const vmResult = await vmResponse.json();
    const generatedImageUrl = vmResult.image_url;

    // Download the generated image
    const imageResponse = await fetch(generatedImageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageKey = `generated/${userId}/${Date.now()}.jpg`;

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
      Body: Buffer.from(imageBuffer),
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    });

    await s3Client.send(uploadCommand);

    // Construct the S3 URL
    const s3ImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;

    // Update the database with final results
    await supabase
      .from('generations')
      .update({
        generated_image_url: s3ImageUrl,
        status: 'completed',
      })
      .eq('id', generation.id);

    return Response.json({
      success: true,
      image_url: s3ImageUrl,
    });

  } catch (error) {
    console.error('Error in generate API:', error);

    // Update status to error if we have a generation ID
    if (error.generationId) {
      await supabase
        .from('generations')
        .update({ status: 'error' })
        .eq('id', error.generationId);
    }

    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 