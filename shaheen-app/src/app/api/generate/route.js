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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
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
    
    const {
      input_image_url,
      size,
      post_id,
      post_title,
      product_name,
      product_description,
      product_category,
    } = requestBody;

    // Validate required fields
    console.log('Validating fields:', {
      input_image_url,
      size,
      post_id,
      post_title,
      product_name,
      product_description,
      product_category,
    });
    
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
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    
    const promptGenerationText = `

**Your Role:** You are an expert Visual Prompt Engineer. Your task is to analyze an input image and its associated context, then generate two **distinctly different** and highly detailed prompts for an image generation model. The goal is to provide the user with two unique creative directions for customizing their original image.

**Your Process:**

1.  **Analyze the Inputs:**

      * **Image (${input_image_url}):** Carefully examine the source image. Identify the primary subject, composition (framing, layout), color palette, lighting, and overall artistic style (e.g., photorealistic, illustration, minimalist).
      * **Context (${post_title}, ${product_name}, etc.):** Analyze the text context to understand the product's theme, intended mood, and key selling points. Extract keywords and concepts (e.g., "luxury," "natural," "tech," "comfort").

2.  **Strategize Two Different Creative Directions:**
    This is the most critical step. You must create two prompts that are conceptually different. Do not just change a few words.

      * **Prompt 1: The "Refined Reality" Prompt.** This prompt should aim to create a polished, idealized version of the original image. The goal is a subtle but significant enhancement.
          * **Focus on:** Photorealism, perfect lighting (e.g., "soft golden hour light," "clean studio lighting"), enhanced textures, rich colors, and adding subtle, context-appropriate background elements that improve the scene without changing it dramatically. The mood should be a more professional and high-quality version of the original.
      * **Prompt 2: The "Thematic & Artistic" Prompt.** This prompt should re-imagine the image with a strong artistic or narrative twist based on the product context. The goal is a creative, eye-catching interpretation.
          * **Focus on:** A specific artistic style (e.g., "cinematic," "vintage film," "ethereal fantasy," "dramatic chiaroscuro"), a completely different setting or mood (e.g., changing the time of day, location), and incorporating conceptual elements from the product description (e.g., if a perfume has "ocean notes," add "ethereal splashes of water suspended in the air").

3.  **Construct the Prompts:**
    For each prompt, follow this structure:

      * **Start with the Core:** Begin by describing the main subject and composition from the original image to ground the AI. Use keywords from the product name.
      * **Inject the Enhancement/Style:** Clearly describe the new lighting, atmosphere, colors, and specific style you chose for that creative direction. Use vivid, descriptive adjectives.
      * **Add Contextual Details:** Weave in elements derived from the product description and category to make the image more thematic and relevant.
      * **Technical Specifications:** Conclude with technical details like "hyper-detailed," "photorealistic," "4K," and ensure the prompt is tailored for the ${size} by mentioning aspect ratio or dimensions where appropriate.

4.  **Final Output:**

      * Return **only** the JSON object in the specified format.
      * Do not include any explanations, apologies, or text outside of the JSON structure.

### **Example of Your Thought Process (for your internal reasoning only):**

  * **Input Image:** A simple photo of a blue ceramic mug on a plain white table.
  * **Context:** product_name: "Oceanic Serenity Mug", product_description: "Hold the calm of the ocean in your hands. Perfect for your morning meditation."
  * **Strategy:**
      * **Prompt 1 (Refined Reality):** I'll make it a perfect product shot. Clean, bright, maybe add a hint of a cozy morning routine.
      * **Prompt 2 (Thematic & Artistic):** I'll lean into the "Oceanic Serenity" theme. I'll place the mug in a fantastical, ocean-inspired setting.
  * **Resulting Prompts:**
      * **Prompt 1 (Generated):** "A flawless, high-end product photograph of the 'Oceanic Serenity Mug' on a clean, white marble tabletop. Bathed in soft, natural morning light from a nearby window, highlighting the mug's deep blue glaze and subtle textures. In the soft-focus background, add a neatly folded linen napkin and a single, fresh green leaf. The image should feel calm, clean, and aspirational. Photorealistic, hyper-detailed, 4K, suitable for ${size}."
      * **Prompt 2 (Generated):** "A creative, cinematic shot of the 'Oceanic Serenity Mug' resting on a wet, dark rock by the ocean at sunrise. Gentle waves are blurred in motion in the background, and the rising sun casts a warm glow on the scene. Ethereal, magical wisps of steam rise from the mug, subtly forming the shape of a gentle wave. The mood is tranquil, magical, and deeply connected to nature. Dramatic lighting, anamorphic lens style, suitable for ${size}."

-----

***Final Output Command:*** Now, using the instructions above, analyze the provided variables and generate the JSON output.


{
  "prompt1": "First detailed prompt description",
  "prompt2": "Second detailed prompt description"
}
`;

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
            const vmResponse = await fetch('https://dwu9yzawgx36z6-5151.proxy.runpod.net/generate', {
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