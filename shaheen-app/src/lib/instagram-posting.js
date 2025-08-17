// Instagram posting service for publishing content to Instagram Business accounts
export class InstagramPostingService {
  constructor() {
    this.apiVersion = 'v19.0';
    this.baseUrl = 'https://graph.instagram.com';
  }

  // Create a media container for single image/video
  async createMediaContainer(instagramId, accessToken, mediaData) {
    try {
      const { imageUrl, videoUrl, caption, mediaType = 'IMAGE' } = mediaData;
      
      if (!imageUrl && !videoUrl) {
        throw new Error('Either imageUrl or videoUrl is required');
      }

      const payload = {
        access_token: accessToken,
        media_type: mediaType,
        is_carousel_item: false
      };

      // Add media URL based on type
      if (imageUrl) {
        payload.image_url = imageUrl;
      } else if (videoUrl) {
        payload.video_url = videoUrl;
      }

      // Add caption if provided
      if (caption) {
        payload.caption = caption;
      }

      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/${instagramId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create media container: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message || data.error.type}`);
      }

      return data.id; // Return the container ID
    } catch (error) {
      console.error('Error creating media container:', error);
      throw error;
    }
  }

  // Create a carousel container for multiple media items
  async createCarouselContainer(instagramId, accessToken, mediaItems, caption) {
    try {
      if (!mediaItems || mediaItems.length === 0) {
        throw new Error('Media items are required for carousel');
      }

      if (mediaItems.length > 10) {
        throw new Error('Carousel can contain maximum 10 media items');
      }

      // First create individual media containers for each item
      const containerIds = [];
      for (const item of mediaItems) {
        const containerId = await this.createMediaContainer(instagramId, accessToken, {
          ...item,
          isCarouselItem: true
        });
        containerIds.push(containerId);
      }

      // Now create the carousel container
      const payload = {
        access_token: accessToken,
        media_type: 'CAROUSEL',
        children: containerIds.join(',')
      };

      if (caption) {
        payload.caption = caption;
      }

      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/${instagramId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create carousel container: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message || data.error.type}`);
      }

      return data.id; // Return the carousel container ID
    } catch (error) {
      console.error('Error creating carousel container:', error);
      throw error;
    }
  }

  // Publish media container
  async publishMedia(instagramId, accessToken, containerId) {
    try {
      const payload = {
        access_token: accessToken,
        creation_id: containerId
      };

      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/${instagramId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to publish media: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message || data.error.type}`);
      }

      return data.id; // Return the published media ID
    } catch (error) {
      console.error('Error publishing media:', error);
      throw error;
    }
  }

  // Check media container status
  async checkContainerStatus(containerId, accessToken) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/${containerId}?fields=status_code&access_token=${accessToken}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to check container status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message || data.error.type}`);
      }

      return data.status_code;
    } catch (error) {
      console.error('Error checking container status:', error);
      throw error;
    }
  }

  // Check publishing rate limit
  async checkPublishingLimit(instagramId, accessToken) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/${instagramId}/content_publishing_limit?access_token=${accessToken}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to check publishing limit: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message || data.error.type}`);
      }

      return data.data[0]; // Return rate limit info
    } catch (error) {
      console.error('Error checking publishing limit:', error);
      throw error;
    }
  }

  // Upload file to S3 and get public URL
  async uploadToS3(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/s3-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`S3 upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`S3 upload failed: ${data.error || 'Unknown error'}`);
      }

      return data.url; // Return the public S3 URL
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  }

  // Main method to post content immediately
  async postNow(instagramId, accessToken, postData) {
    try {
      console.log('Starting Instagram post process...', { instagramId, postData });
      
      const { files, caption, mediaType = 'IMAGE' } = postData;

      if (!files || files.length === 0) {
        throw new Error('At least one file is required');
      }

      console.log(`Uploading ${files.length} file(s) to S3...`);

      // Upload files to S3 first
      const mediaUrls = [];
      for (const file of files) {
        console.log(`Uploading file: ${file.name} (${file.type})`);
        const url = await this.uploadToS3(file);
        console.log(`File uploaded successfully: ${url}`);
        mediaUrls.push({
          url,
          type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO'
        });
      }

      console.log('All files uploaded, creating media container...');

      let containerId;

      if (mediaUrls.length === 1) {
        // Single media post
        console.log('Creating single media container...');
        containerId = await this.createMediaContainer(instagramId, accessToken, {
          imageUrl: mediaUrls[0].type === 'IMAGE' ? mediaUrls[0].url : undefined,
          videoUrl: mediaUrls[0].type === 'VIDEO' ? mediaUrls[0].url : undefined,
          caption,
          mediaType: mediaUrls[0].type
        });
        console.log('Single media container created:', containerId);
      } else {
        // Carousel post
        console.log('Creating carousel container...');
        const mediaItems = mediaUrls.map(item => ({
          imageUrl: item.type === 'IMAGE' ? item.url : undefined,
          videoUrl: item.type === 'VIDEO' ? item.url : undefined,
          mediaType: item.type
        }));

        containerId = await this.createCarouselContainer(instagramId, accessToken, mediaItems, caption);
        console.log('Carousel container created:', containerId);
      }

      console.log('Waiting for container to be ready...');

      // Wait a moment for container to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check container status
      const status = await this.checkContainerStatus(containerId, accessToken);
      console.log('Container status:', status);
      
      if (status === 'FINISHED') {
        // Publish the media
        console.log('Container ready, publishing media...');
        const mediaId = await this.publishMedia(instagramId, accessToken, containerId);
        console.log('Media published successfully:', mediaId);
        return { success: true, mediaId, containerId };
      } else if (status === 'IN_PROGRESS') {
        // Wait a bit more and check again
        console.log('Container still processing, waiting...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const finalStatus = await this.checkContainerStatus(containerId, accessToken);
        console.log('Final container status:', finalStatus);
        
        if (finalStatus === 'FINISHED') {
          const mediaId = await this.publishMedia(instagramId, accessToken, containerId);
          console.log('Media published successfully:', mediaId);
          return { success: true, mediaId, containerId };
        } else {
          throw new Error(`Container not ready. Status: ${finalStatus}`);
        }
      } else {
        throw new Error(`Container not ready. Status: ${status}`);
      }
    } catch (error) {
      console.error('Error posting to Instagram:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const instagramPosting = new InstagramPostingService();
