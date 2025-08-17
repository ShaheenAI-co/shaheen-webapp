import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Supabase client
console.log('API Route Environment Variables:', {
  PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
  PUBLIC_SUPABASE_SERVICE_ROLE_KEY: process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY ? 'SET' : 'NOT SET'
});

// Try to get the correct environment variables
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.SUPABASE_URL;

const supabaseKey = process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 
                   process.env.SUPABASE_SERVICE_ROLE_KEY || 
                   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Selected Supabase config:', {
  supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
  supabaseKey: supabaseKey ? 'SET' : 'NOT SET'
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client created in API route');

// Initialize Google Gemini AI
console.log('Initializing Google Gemini...');
console.log('GOOGLE_GEMINI_API_KEY available:', process.env.GOOGLE_GEMINI_API_KEY ? 'YES' : 'NO');

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.error('Missing GOOGLE_GEMINI_API_KEY environment variable');
  throw new Error('Missing Google Gemini API key');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Test the Gemini API connection
async function testGeminiConnection() {
  try {
    console.log('Testing Gemini API connection...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hello, test message');
    console.log('Gemini API connection successful');
    return true;
  } catch (error) {
    console.error('Gemini API connection failed:', error);
    return false;
  }
}

export async function POST(request) {
  try {
    console.log('=== GENERATE API START ===');
    
    // Authenticate user with Clerk
    const { userId } = await auth();
    console.log('Clerk userId:', userId);
    
    if (!userId) {
      console.log('Unauthorized - no userId');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const requestBody = await request.json();
    console.log('Request body received:', requestBody);
    
    const { input_image_url, size, post_id } = requestBody;

    // Validate required fields
    console.log('Validating fields:', { input_image_url, size, post_id });
    
    if (!input_image_url || !size || !post_id) {
      console.log('Missing required fields:', { input_image_url, size, post_id });
      return Response.json(
        { error: 'Missing required fields: input_image_url, size, post_id' },
        { status: 400 }
      );
    }

    // Test database connectivity and verify post exists
    console.log('Testing database connectivity...');
    try {
      const { data: postCheck, error: postCheckError } = await supabase
        .from('posts')
        .select('post_id, clerk_id')
        .eq('post_id', post_id)
        .single();
      
      if (postCheckError) {
        console.error('Error checking post existence:', postCheckError);
        throw new Error(`Post not found or database error: ${postCheckError.message}`);
      }
      
      if (!postCheck) {
        console.error('Post not found in database');
        throw new Error('Post not found in database');
      }
      
      console.log('Post verified in database:', postCheck);
    } catch (error) {
      console.error('Database connectivity test failed:', error);
      throw error;
    }

    // Parse size into width and height
    const [width, height] = size.split('x').map(Number);
    console.log('Parsed dimensions:', { width, height, originalSize: size });
    
    if (!width || !height) {
      console.log('Invalid size format:', size);
      return Response.json(
        { error: 'Invalid size format. Expected format: "widthxheight" (e.g., "1024x1024")' },
        { status: 400 }
      );
    }

    // Generate 2 different prompts using Google Gemini
    console.log('Initializing Google Gemini...');
    
    // Test Gemini connection first
    const geminiConnected = await testGeminiConnection();
    if (!geminiConnected) {
      throw new Error('Failed to connect to Google Gemini API');
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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

    console.log('Sending prompt to Gemini:', promptGenerationText);
    
    let prompts; // Declare prompts variable outside try-catch
    
    try {
      const geminiResult = await model.generateContent(promptGenerationText);
      console.log('Gemini API call successful');
      console.log('Gemini result object:', geminiResult);
      
      const promptsJson = geminiResult.response.text();
      console.log('Gemini response text:', promptsJson);
      console.log('Response type:', typeof promptsJson);
      console.log('Response length:', promptsJson.length);
      
      // Clean the response by removing markdown code blocks if present
      let cleanedResponse = promptsJson;
      if (promptsJson.includes('```json')) {
        console.log('Detected markdown code blocks, cleaning response...');
        cleanedResponse = promptsJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        console.log('Cleaned response:', cleanedResponse);
      }
      
      // Parse the JSON response
      try {
        prompts = JSON.parse(cleanedResponse);
        console.log('Parsed prompts successfully:', prompts);
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        console.error('Raw response that failed to parse:', promptsJson);
        console.error('Cleaned response that failed to parse:', cleanedResponse);
        console.error('Response contains valid JSON?', cleanedResponse.includes('{') && cleanedResponse.includes('}'));
        throw new Error(`Failed to parse Gemini response: ${parseError.message}. Raw response: ${promptsJson}. Cleaned response: ${cleanedResponse}`);
      }
    } catch (geminiError) {
      console.error('Gemini API call failed:', geminiError);
      console.error('Error details:', {
        message: geminiError.message,
        stack: geminiError.stack,
        name: geminiError.name
      });
      throw new Error(`Gemini API failed: ${geminiError.message}`);
    }

    // Ensure prompts is defined for the rest of the function
    if (!prompts) {
      throw new Error('Prompts not generated successfully');
    }

    const generatedAssets = [];

    // Process each prompt to generate 2 images
    console.log('Starting image generation process...');
    console.log('Number of prompts to process:', Object.keys(prompts).length);
    
    for (const [promptKey, prompt] of Object.entries(prompts)) {
      console.log(`Processing ${promptKey}: ${prompt}`);
      
      // Generate 2 images for each prompt
      for (let i = 1; i <= 2; i++) {
        try {
          console.log(`=== Generating image ${i} for ${promptKey} ===`);
          
          // Send to VM for image generation
          const vmRequestPayload = {
            prompt: prompt,
            width: width,
            height: height,
            image_url: input_image_url,
          };
          console.log('VM request payload:', vmRequestPayload);
          
          console.log('Sending request to VM API...');
          
          // Create AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
          
          try {
            const vmResponse = await fetch('https://j44wd3e9cud0z6-5151.proxy.runpod.net/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(vmRequestPayload),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId); // Clear timeout on successful response

            console.log('VM response received:', {
              status: vmResponse.status,
              statusText: vmResponse.statusText,
              ok: vmResponse.ok
            });

            if (!vmResponse.ok) {
              const errorText = await vmResponse.text();
              console.error('VM API error response:', errorText);
              throw new Error(`VM API error: ${vmResponse.status} - ${errorText}`);
            }

            // VM returns a .txt file, read the content to get the asset URL
            const txtContent = await vmResponse.text();
            console.log('VM response text content:', txtContent);
            console.log('VM response content type:', typeof txtContent);
            console.log('VM response content length:', txtContent.length);
            console.log('VM response starts with HTML?', txtContent.trim().startsWith('<'));
            
            // Check if response is HTML (error page) instead of expected text
            if (txtContent.trim().startsWith('<') || txtContent.includes('<!DOCTYPE') || txtContent.includes('<html')) {
              console.error('VM API returned HTML instead of expected text file');
              console.error('HTML content:', txtContent);
              throw new Error('VM API returned HTML error page instead of image URL');
            }
            
            const assetUrl = txtContent.trim(); // Remove any whitespace/newlines

            if (!assetUrl) {
              throw new Error('VM returned empty text file');
            }

            console.log('Asset URL received:', assetUrl);

            // Add record to generated_assets table
            console.log('Inserting asset record with post_id:', post_id);
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

            console.log('Asset record created successfully:', asset);

            generatedAssets.push({
              asset_id: asset.asset_id,
              image_url: assetUrl,
              prompt: promptKey,
              iteration: i
            });

            console.log(`=== Successfully generated image ${i} for ${promptKey}: ${assetUrl} ===`);
            
          } catch (fetchError) {
            clearTimeout(timeoutId); // Clear timeout on error
            
            if (fetchError.name === 'AbortError') {
              console.error('VM API request timed out after 30 seconds');
              throw new Error('VM API request timed out');
            }
            
            console.error('VM API fetch error:', fetchError);
            throw fetchError;
          }
          
        } catch (error) {
          console.error(`=== Error generating image ${i} for ${promptKey} ===`);
          console.error('Error details:', error);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          // Continue with other images even if one fails
        }
      }
    }

    console.log('=== GENERATE API SUCCESS ===');
    console.log('Total assets generated:', generatedAssets.length);
    console.log('Assets:', generatedAssets);
    console.log('Final result summary:', {
      promptsProcessed: Object.keys(prompts).length,
      expectedImages: Object.keys(prompts).length * 2,
      actualImagesGenerated: generatedAssets.length,
      success: generatedAssets.length > 0
    });

    return Response.json({
      success: true,
      message: `Successfully generated ${generatedAssets.length} images`,
      assets: generatedAssets,
      total_generated: generatedAssets.length
    });

  } catch (error) {
    console.error('=== GENERATE API ERROR ===');
    console.error('Error in generate API:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);

    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 