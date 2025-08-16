from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from twitter_service import TwitterService
from config import get_config

# Get configuration
config = get_config()

app = Flask(__name__)
app.secret_key = config.SECRET_KEY

# Initialize Twitter service
twitter_service = TwitterService()

@app.route('/')
def index():
    """Home page with authorization and posting options"""
    return render_template('index.html')

@app.route('/auth/twitter')
def twitter_auth():
    """Start Twitter OAuth flow"""
    try:
        # Get authorization URL
        auth_url = twitter_service.get_authorization_url()
        
        # Store the request token in session for callback
        # Note: In a real app, you'd store this in a database
        session['twitter_auth_started'] = True
        
        return redirect(auth_url)
    except Exception as e:
        flash(f'Failed to start Twitter authorization: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.route('/oauth/callback/twitter')
def twitter_callback():
    """Handle Twitter OAuth callback"""
    oauth_token = request.args.get('oauth_token')
    oauth_verifier = request.args.get('oauth_verifier')
    
    if not oauth_token or not oauth_verifier:
        flash('Missing OAuth parameters', 'error')
        return redirect(url_for('index'))
    
    try:
        # Exchange OAuth tokens for access tokens
        access_tokens = twitter_service.get_access_token(oauth_token, oauth_verifier)
        
        # Store tokens in session (in a real app, store in database)
        session['twitter_oauth_token'] = access_tokens['oauth_token']
        session['twitter_oauth_token_secret'] = access_tokens['oauth_token_secret']
        session['twitter_user_id'] = access_tokens['user_id']
        session['twitter_screen_name'] = access_tokens['screen_name']
        
        # Set tokens in Twitter service
        twitter_service.set_tokens(
            access_tokens['oauth_token'],
            access_tokens['oauth_token_secret']
        )
        
        # Get user info to confirm authorization
        user_info = twitter_service.get_user_info()
        session['twitter_user_info'] = user_info
        
        flash('Twitter account connected successfully!', 'success')
        return redirect(url_for('dashboard'))
        
    except Exception as e:
        flash(f'Failed to connect Twitter account: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    """Dashboard showing connected account and posting options"""
    if 'twitter_oauth_token' not in session:
        flash('Please authorize Twitter first', 'error')
        return redirect(url_for('index'))
    
    # Try to get user info from session first
    user_info = session.get('twitter_user_info', {})
    
    # If no user info in session, fetch it from Twitter
    if not user_info or not user_info.get('data'):
        try:
            # Set tokens in Twitter service
            twitter_service.set_tokens(
                session['twitter_oauth_token'],
                session['twitter_oauth_token_secret']
            )
            
            # Fetch fresh user info
            user_info = twitter_service.get_user_info()
            session['twitter_user_info'] = user_info
            
            print(f"✅ Fetched fresh user info: {user_info}")
        except Exception as e:
            print(f"⚠️ Failed to fetch user info: {e}")
            # Keep existing user_info (might be empty)
    
    return render_template('dashboard.html', user_info=user_info)

@app.route('/post-tweet', methods=['POST'])
def post_tweet():
    """Post a tweet with optional image"""
    if 'twitter_oauth_token' not in session:
        return jsonify({'success': False, 'error': 'Not authorized'}), 401
    
    tweet_text = request.form.get('tweet_text', '').strip()
    
    if not tweet_text:
        return jsonify({'success': False, 'error': 'Tweet text is required'}), 400
    
    if len(tweet_text) > 280:
        return jsonify({'success': False, 'error': 'Tweet text must be 280 characters or less'}), 400
    
    try:
        print(f"🚀 Starting tweet posting process...")
        print(f"📝 Tweet text: {tweet_text[:50]}...")
        
        # Set tokens in service
        twitter_service.set_tokens(
            session['twitter_oauth_token'],
            session['twitter_oauth_token_secret']
        )
        print("✅ Tokens set in Twitter service")
        
        media_ids = []
        
        # Handle image upload if present
        if 'image' in request.files:
            image_file = request.files['image']
            print(f"📸 Image file found: {image_file.filename}")
            
            if image_file and image_file.filename:
                # Save uploaded file temporarily
                import tempfile
                import os
                from werkzeug.utils import secure_filename
                
                # Get file extension from original filename
                filename = secure_filename(image_file.filename)
                file_ext = os.path.splitext(filename)[1] or '.jpg'
                print(f"📁 File extension: {file_ext}")
                
                # Create temp file with proper extension
                temp_fd, temp_path = tempfile.mkstemp(suffix=file_ext)
                os.close(temp_fd)
                
                try:
                    # Save uploaded file
                    image_file.save(temp_path)
                    print(f"📁 Saved image to: {temp_path}")
                    
                    # Upload to Twitter
                    print(f"🔄 Uploading image to Twitter...")
                    media_id = twitter_service.upload_media(temp_path)
                    if media_id:
                        print(f"✅ Image uploaded successfully, Media ID: {media_id}")
                        media_ids.append(media_id)
                    else:
                        print("⚠️ No media ID returned from Twitter")
                    
                except Exception as upload_error:
                    print(f"❌ Image upload failed: {str(upload_error)}")
                    raise upload_error
                finally:
                    # Clean up temp file
                    if os.path.exists(temp_path):
                        os.unlink(temp_path)
                        print(f"🗑️ Cleaned up temp file: {temp_path}")
        else:
            print("📸 No image file in request")
        
        print(f"📊 Media IDs to include: {media_ids}")
        
        # Post tweet with media if available
        print("📤 Posting tweet...")
        result = twitter_service.post_tweet(tweet_text, media_ids if media_ids else None)
        
        flash('Tweet posted successfully!', 'success')
        return jsonify({
            'success': True, 
            'message': 'Tweet posted successfully!',
            'tweet_id': result.get('data', {}).get('id'),
            'media_count': len(media_ids)
        })
        
    except Exception as e:
        error_msg = f'Failed to post tweet: {str(e)}'
        flash(error_msg, 'error')
        return jsonify({'success': False, 'error': error_msg}), 500

@app.route('/test-upload')
def test_upload():
    """Test endpoint to verify media upload functionality"""
    if 'twitter_oauth_token' not in session:
        return jsonify({'success': False, 'error': 'Not authorized'}), 401
    
    try:
        # Set tokens in service
        twitter_service.set_tokens(
            session['twitter_oauth_token'],
            session['twitter_oauth_token_secret']
        )
        
        # Test with a simple text tweet first
        result = twitter_service.post_tweet("Test tweet from Python app - no media")
        
        return jsonify({
            'success': True,
            'message': 'Test tweet posted successfully',
            'tweet_id': result.get('data', {}).get('id')
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Test failed: {str(e)}'
        }), 500

@app.route('/logout')
def logout():
    """Clear session and logout"""
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('index'))

if __name__ == '__main__':
    try:
        # Validate configuration
        config.validate_twitter_credentials()
        print("✅ Configuration validated successfully")
        print(f"🚀 Starting Twitter Post Scheduler Test App on {config.APP_URL}")
        
        app.run(
            debug=config.DEBUG, 
            host='0.0.0.0', 
            port=5000
        )
    except Exception as e:
        print(f"❌ Failed to start app: {str(e)}")
        print("Please check your .env file and Twitter API credentials")
