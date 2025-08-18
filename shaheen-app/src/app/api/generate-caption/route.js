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
    console.log('=== GENERATE ARABIC CAPTION API START ===');
    
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
      productInfo,
      language = 'ar' // Default to Arabic
    } = requestBody;

    // Validate required fields
    if (!imageUrl) {
      console.log('Missing required field: imageUrl');
      return Response.json(
        { error: 'Missing required field: imageUrl' },
        { status: 400 }
      );
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    
    // Create focused prompt for Arabic caption generation
    const prompt = `You are an expert Arabic social media copywriter specializing in Instagram captions. Generate a compelling Instagram caption for a product image.

${productInfo ? `Product Information:
- Title: ${productInfo.title || 'Not specified'}
- Description: ${productInfo.description || 'Not specified'}
- Category: ${productInfo.category || 'Not specified'}` : 'No specific product information provided.'}

Requirements:
- Generate a SHORT, engaging Instagram caption in Arabic (20-40 words max)
- Make it compelling and conversion-focused
- Use modern Arabic that resonates with Arabic Instagram audiences
- Include relevant hashtags in Arabic (3-5 hashtags)
- Make it feel authentic and not overly promotional
- Use emojis sparingly but effectively

Return ONLY this JSON (no other text):
{
  "caption": "نص تعليق جذاب باللغة العربية مع الهاشتاجات المناسبة",
  "hashtags": ["#هاشتاج1", "#هاشتاج2", "#هاشتاج3"]
}

**Important Notes:**
- The caption must be in Arabic script
- Keep it concise and impactful
- Ensure it's appropriate for Instagram
- Make it feel natural and engaging
- Include relevant Arabic hashtags for better discoverability`;

    console.log('Sending prompt to Gemini:', prompt);

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    console.log('Gemini response:', generatedText);

    // Parse the JSON response from Gemini
    let captionData;
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
        captionData = JSON.parse(jsonString);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', generatedText);
      
      // Fallback to default Arabic caption
      captionData = {
        caption: "منتج جديد ومميز! 🎉✨ اكتشف الجودة والأناقة في كل تفصيل. #منتج_مميز #جودة_عالية #أناقة_مطلقة",
        hashtags: ["#منتج_مميز", "#جودة_عالية", "#أناقة_مطلقة"]
      };
    }

    // Validate and ensure all required fields are present
    const requiredFields = ['caption', 'hashtags'];
    
    // Check for missing fields and provide defaults if needed
    const missingFields = [];
    requiredFields.forEach(field => {
      if (captionData[field] === undefined || captionData[field] === null) {
        missingFields.push(field);
        // Provide sensible defaults for missing fields
        switch(field) {
          case 'caption':
            captionData.caption = 'منتج جديد ومميز! 🎉✨ اكتشف الجودة والأناقة في كل تفصيل. #منتج_مميز #جودة_عالية #أناقة_مطلقة';
            break;
          case 'hashtags':
            captionData.hashtags = ['#منتج_مميز', '#جودة_عالية', '#أناقة_مطلقة'];
            break;
        }
      }
    });
    
    if (missingFields.length > 0) {
      console.log(`Provided defaults for missing fields: ${missingFields.join(', ')}`);
    }

    console.log('Final caption data with defaults:', captionData);
    console.log('All required fields present:', requiredFields.every(field => captionData[field] !== undefined && captionData[field] !== null));

    return Response.json({
      success: true,
      caption: captionData.caption,
      hashtags: captionData.hashtags
    });

  } catch (error) {
    console.error('Generate caption error:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate caption' 
      },
      { status: 500 }
    );
  }
}
