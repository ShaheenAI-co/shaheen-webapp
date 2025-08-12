import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Supabase client
const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function POST(request) {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { input_image_url, size, post_id } = await request.json();

    // Validate required fields
    if (!input_image_url || !size || !post_id) {
      return Response.json(
        { error: 'Missing required fields: input_image_url, size, post_id' },
        { status: 400 }
      );
    }

    // Parse size into width and height
    const [width, height] = size.split('x').map(Number);
    if (!width || !height) {
      return Response.json(
        { error: 'Invalid size format. Expected format: "widthxheight" (e.g., "1024x1024")' },
        { status: 400 }
      );
    }

    // Generate 2 different prompts using Google Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const promptGenerationText = `Analyze this image and create 2 different detailed image generation prompts for image customization. 
    
    Image URL: ${input_image_url}
    Target Size: ${size}
    
    Create 2 distinct prompts that each describe:
    1. The original image content and style
    2. How to enhance and customize the image
    3. Maintain the same composition and style
    4. Ensure the output is suitable for ${size} dimensions
    
    Return the response in this exact JSON format:
    {
      "prompt1": "First detailed prompt description",
      "prompt2": "Second detailed prompt description"
    }`;

    const geminiResult = await model.generateContent(promptGenerationText);
    const promptsJson = geminiResult.response.text();
    
    // Parse the JSON response
    let prompts;
    try {
      prompts = JSON.parse(promptsJson);
    } catch (error) {
      console.error('Failed to parse Gemini response:', promptsJson);
      throw new Error('Failed to generate prompts');
    }

    const generatedAssets = [];

    // Process each prompt to generate 2 images
    for (const [promptKey, prompt] of Object.entries(prompts)) {
      console.log(`Processing ${promptKey}: ${prompt}`);
      
      // Generate 2 images for each prompt
      for (let i = 1; i <= 2; i++) {
        try {
          // Send to VM for image generation
          const vmResponse = await fetch('http://vm.local:3000/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: prompt,
              width: width,
              height: height,
              image_url: input_image_url,
            }),
          });

          if (!vmResponse.ok) {
            throw new Error(`VM API error: ${vmResponse.status}`);
          }

          // VM returns a .txt file, read the content to get the asset URL
          const txtContent = await vmResponse.text();
          const assetUrl = txtContent.trim(); // Remove any whitespace/newlines

          if (!assetUrl) {
            throw new Error('VM returned empty text file');
          }

          // Add record to generated_assets table
          const { data: asset, error: insertError } = await supabase
            .from('generated_assets')
            .insert({
              post_id: post_id,
              image_url: assetUrl,
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating asset record:', insertError);
            throw new Error('Failed to create asset record');
          }

          generatedAssets.push({
            asset_id: asset.asset_id,
            image_url: assetUrl,
            prompt: promptKey,
            iteration: i
          });

          console.log(`Generated image ${i} for ${promptKey}: ${assetUrl}`);
          
        } catch (error) {
          console.error(`Error generating image ${i} for ${promptKey}:`, error);
          // Continue with other images even if one fails
        }
      }
    }

    return Response.json({
      success: true,
      message: `Successfully generated ${generatedAssets.length} images`,
      assets: generatedAssets,
      total_generated: generatedAssets.length
    });

  } catch (error) {
    console.error('Error in generate API:', error);

    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 