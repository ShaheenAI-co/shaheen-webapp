import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini AI
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.error('Missing GOOGLE_GEMINI_API_KEY environment variable');
  throw new Error('Missing Google Gemini API key');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function POST(request) {
  try {
    console.log('=== GENERATE TEXT OVERLAY API START ===');
    
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
      imageUrl,
      productInfo
    } = requestBody;

    // Validate required fields
    if (!imageUrl || !productInfo) {
      console.log('Missing required fields:', { imageUrl, productInfo });
      return Response.json(
        { error: 'Missing required fields: imageUrl, productInfo' },
        { status: 400 }
      );
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    
         // Create focused prompt for Arabic marketing text generation
     const prompt = `You are an expert Arabic copywriter. Generate marketing text for a product image overlay.

Product: ${productInfo.title || 'Not specified'}
Description: ${productInfo.description || 'Not specified'}
Category: ${productInfo.category || 'Not specified'}

Requirements:
- Generate SHORT Arabic marketing text (15-25 words max)
- Make it compelling and conversion-focused
- Use modern Arabic that resonates with Arabic audiences

Return ONLY this JSON (no other text):
{
  "text": "نص تسويقي باللغة العربية",
  "x": 0,
  "y": 100,
  "fontSize": 32,
  "fontFamily": "Arial, sans-serif",
  "color": "#ffffff",
  "fontWeight": "bold",
  "textAlign": "center"
}

Coordinate System:
- X: 0 = center, negative = left, positive = right (range: -200 to +200)
- Y: 0 = top, positive = down (range: 50 to 400)

**Important Notes:**
- The text must be in Arabic script
- Keep it concise and impactful
- Ensure the styling will be readable on the image
- Position should be strategic for maximum impact
- Color should provide good contrast against typical image backgrounds

Position Examples:
- Top-center: x: 0, y: 50
- Center: x: 0, y: 200  
- Bottom-center: x: 0, y: 350
- Top-left: x: -150, y: 50
- Top-right: x: 150, y: 50`;

    console.log('Sending prompt to Gemini:', prompt);

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    console.log('Gemini response:', generatedText);

         // Parse the JSON response from Gemini
     let textOverlay;
     try {
       // Clean the response text - remove any markdown, extra text, etc.
       let cleanText = generatedText.trim();
       
       // Remove markdown code blocks if present
       cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
       
       // Find the JSON object
       const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
       if (jsonMatch) {
         const jsonString = jsonMatch[0];
         console.log('Extracted JSON string:', jsonString);
         textOverlay = JSON.parse(jsonString);
       } else {
         throw new Error('No JSON found in response');
       }
     } catch (parseError) {
       console.error('Failed to parse Gemini response:', parseError);
       console.error('Raw response:', generatedText);
       
       // Fallback to default styling
       textOverlay = {
         text: "منتج جديد ومميز",
         x: 0,
         y: 100,
         fontSize: 32,
         fontFamily: "Arial, sans-serif",
         color: "#ffffff",
         fontWeight: "bold",
         textAlign: "center"
       };
     }

         // Validate and ensure all required fields are present
     const requiredFields = ['text', 'x', 'y', 'fontSize', 'fontFamily', 'color', 'fontWeight', 'textAlign'];
     
     // Check for missing fields and provide defaults if needed
     const missingFields = [];
     requiredFields.forEach(field => {
       if (textOverlay[field] === undefined || textOverlay[field] === null) {
         missingFields.push(field);
         // Provide sensible defaults for missing fields
         switch(field) {
           case 'x':
             textOverlay.x = 0;
             break;
           case 'y':
             textOverlay.y = 100;
             break;
           case 'fontSize':
             textOverlay.fontSize = 32;
             break;
           case 'fontFamily':
             textOverlay.fontFamily = 'Arial, sans-serif';
             break;
           case 'color':
             textOverlay.color = '#ffffff';
             break;
           case 'fontWeight':
             textOverlay.fontWeight = 'bold';
             break;
           case 'textAlign':
             textOverlay.textAlign = 'center';
             break;
           case 'text':
             textOverlay.text = 'منتج جديد ومميز';
             break;
         }
       }
     });
     
     if (missingFields.length > 0) {
       console.log(`Provided defaults for missing fields: ${missingFields.join(', ')}`);
     }

         console.log('Final text overlay with defaults:', textOverlay);
     console.log('All required fields present:', requiredFields.every(field => textOverlay[field] !== undefined && textOverlay[field] !== null));

     return Response.json({
       success: true,
       textOverlay: textOverlay
     });

  } catch (error) {
    console.error('Generate text overlay error:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate text overlay' 
      },
      { status: 500 }
    );
  }
}
