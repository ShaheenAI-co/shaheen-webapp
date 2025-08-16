# Post Scheduler System - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Twitter Authorization Flow](#twitter-authorization-flow)
4. [Post Scheduling Process](#post-scheduling-process)
5. [Automated Publishing System](#automated-publishing-system)
6. [Twitter Publishing Service](#twitter-publishing-service)
7. [Frontend Implementation](#frontend-implementation)
8. [Cron Jobs & Task Scheduling](#cron-jobs--task-scheduling)
9. [Error Handling & Monitoring](#error-handling--monitoring)
10. [Configuration Files](#configuration-files)
11. [API Endpoints](#api-endpoints)
12. [Complete Code Examples](#complete-code-examples)

---

## System Overview

The Post Scheduler System is a comprehensive solution that allows users to schedule social media posts across multiple platforms. It implements OAuth 2.0 authorization, stores user credentials securely, and automatically publishes scheduled posts using Laravel's task scheduler.

**Key Features:**
- OAuth 2.0 authorization for social media platforms
- Timezone-aware scheduling
- Automated publishing via cron jobs
- Multi-platform support (Facebook, Twitter, Instagram, LinkedIn, TikTok)
- Real-time status tracking
- Token refresh management

---

## Database Schema

### 1. User Platforms Table
Stores authorized social media accounts and their access tokens.

```sql
CREATE TABLE `user_platforms` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `platform_id` varchar(191) NOT NULL,
  `platform` enum('facebook','twitter','instagram','linkedin','tiktok') NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `username` varchar(191) DEFAULT NULL,
  `picture` text,
  `access_token` text NOT NULL,
  `access_token_expire_at` datetime DEFAULT NULL,
  `refresh_token` text,
  `refresh_token_expire_at` datetime DEFAULT NULL,
  `oauth1_token` text,
  `oauth1_token_secret` text,
  `failed_mail_send_at` datetime DEFAULT NULL,
  `type` enum('user','page') NOT NULL DEFAULT 'user',
  `meta` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_platforms_user_id_foreign` (`user_id`),
  CONSTRAINT `user_platforms_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Migration File:**
```php
// database/migrations/2023_11_22_060506_create_user_platforms_table.php
<?php

use App\Models\UserPlatform;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_platforms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('platform_id');
            $table->enum('platform', UserPlatform::PLATFORMS);

            $table->string('name')->nullable();
            $table->string('username')->nullable();
            $table->text('picture')->nullable();

            $table->text('access_token');
            $table->dateTime('access_token_expire_at')->nullable();

            $table->text('refresh_token')->nullable();
            $table->dateTime('refresh_token_expire_at')->nullable();

            $table->text('oauth1_token')->nullable();
            $table->text('oauth1_token_secret')->nullable();

            $table->dateTime('failed_mail_send_at')->nullable();
            
            $table->enum('type', ['user', 'page'])->default('user');
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_platforms');
    }
};
```

### 2. Brand Posts Table
Stores the main post content and metadata.

```sql
CREATE TABLE `brand_posts` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `brand_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `input` longtext NOT NULL,
  `title` varchar(191) NOT NULL,
  `slogan` varchar(191) DEFAULT NULL,
  `status` enum('draft','publishing','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brand_posts_uuid_unique` (`uuid`),
  KEY `brand_posts_brand_id_foreign` (`brand_id`),
  KEY `brand_posts_user_id_foreign` (`user_id`),
  CONSTRAINT `brand_posts_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE,
  CONSTRAINT `brand_posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Brand Post Platforms Table
Stores platform-specific post data and scheduling information.

```sql
CREATE TABLE `brand_post_platforms` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `brand_post_id` bigint(20) UNSIGNED NOT NULL,
  `user_platform_id` bigint(20) UNSIGNED DEFAULT NULL,
  `platform` varchar(191) DEFAULT NULL,
  `content` text,
  `media_type` enum('image','video') DEFAULT NULL,
  `media` longtext,
  `thumbnail` varchar(191) DEFAULT NULL,
  `post_id` varchar(191) DEFAULT NULL,
  `reactions` int(11) NOT NULL DEFAULT '0',
  `comments` int(11) NOT NULL DEFAULT '0',
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `status` enum('draft','scheduled','publishing','published','failed') NOT NULL DEFAULT 'draft',
  `data` longtext,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `brand_post_platforms_brand_post_id_foreign` (`brand_post_id`),
  KEY `brand_post_platforms_user_platform_id_foreign` (`user_platform_id`),
  CONSTRAINT `brand_post_platforms_brand_post_id_foreign` FOREIGN KEY (`brand_post_id`) REFERENCES `brand_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `brand_post_platforms_user_platform_id_foreign` FOREIGN KEY (`user_platform_id`) REFERENCES `user_platforms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Migration File:**
```php
// database/migrations/2023_11_22_060507_create_brand_post_platform_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('brand_post_platforms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_platform_id')->nullable()->constrained()->nullOnDelete();

            // contents
            $table->string('platform')->nullable();
            $table->text('content')->nullable();

            $table->enum('media_type', ['image', 'video'])->nullable();
            $table->longText('media')->nullable();

            // analytics  status => published 
            $table->string('thumbnail')->nullable();
            $table->string('post_id')->nullable();
            $table->integer('reactions')->default(0);
            $table->integer('comments')->default(0);

            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->enum('status', ['draft', 'scheduled', 'publishing', 'published', 'failed'])->default('draft');
            $table->longText('data')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_post_platforms');
    }
};
```

---

## Twitter Authorization Flow

### 1. Twitter Service Class
The core Twitter API integration service.

```php
// app/Services/Twitter.php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class Twitter
{
    protected array $config = [];
    protected ?string $oauthToken = null;
    protected ?string $oauthTokenSecret = null;

    public function __construct(array $config = null)
    {
        $this->config = $config ?? config('platform.twitter');
    }

    /**
     * Generate OAuth 1.0a authorization URL
     */
    public function authRedirect(): \Illuminate\Http\RedirectResponse
    {
        $oauthToken = $this->getRequestToken();
        
        if (!$oauthToken) {
            throw new \Exception('Failed to get OAuth request token');
        }

        $authUrl = $this->config['base_url'] . '/oauth/authorize?' . http_build_query([
            'oauth_token' => $oauthToken
        ]);

        return redirect($authUrl);
    }

    /**
     * Get OAuth request token
     */
    protected function getRequestToken(): ?string
    {
        $response = Http::withHeaders([
            'Authorization' => $this->generateOAuthHeader('POST', $this->config['request_token_url'])
        ])->post($this->config['request_token_url'], [
            'oauth_callback' => $this->config['redirect_uri']
        ]);

        if ($response->successful()) {
            parse_str($response->body(), $params);
            return $params['oauth_token'] ?? null;
        }

        return null;
    }

    /**
     * Exchange OAuth tokens for access tokens
     */
    public function getAccessToken(string $oauthToken, string $oauthVerifier): array
    {
        $response = Http::withHeaders([
            'Authorization' => $this->generateOAuthHeader('POST', $this->config['access_token_url'], [
                'oauth_token' => $oauthToken,
                'oauth_verifier' => $oauthVerifier
            ])
        ])->post($this->config['access_token_url'], [
            'oauth_token' => $oauthToken,
            'oauth_verifier' => $oauthVerifier
        ]);

        if ($response->successful()) {
            parse_str($response->body(), $params);
            return [
                'oauth_token' => $params['oauth_token'] ?? '',
                'oauth_token_secret' => $params['oauth_token_secret'] ?? '',
                'user_id' => $params['user_id'] ?? '',
                'screen_name' => $params['screen_name'] ?? ''
            ];
        }

        throw new \Exception('Failed to get access token');
    }

    /**
     * Set OAuth tokens for API calls
     */
    public function setToken(string $oauthToken, string $oauthTokenSecret): self
    {
        $this->oauthToken = $oauthToken;
        $this->oauthTokenSecret = $oauthTokenSecret;
        return $this;
    }

    /**
     * Get user information
     */
    public function getUserInfo(): \Illuminate\Http\Client\Response
    {
        $url = $this->config['api_url'] . '/2/users/me';
        
        $response = Http::withHeaders([
            'Authorization' => $this->generateOAuthHeader('GET', $url)
        ])->get($url);

        return $response;
    }

    /**
     * Post a tweet
     */
    public function postTweet(string $text): \Illuminate\Http\Client\Response
    {
        $url = $this->config['api_url'] . '/2/tweets';
        
        $response = Http::withHeaders([
            'Authorization' => $this->generateOAuthHeader('POST', $url),
            'Content-Type' => 'application/json'
        ])->post($url, [
            'text' => $text
        ]);

        return $response;
    }

    /**
     * Post a tweet with media
     */
    public function postTweetWithMedia(string $text, array $mediaIds): \Illuminate\Http\Client\Response
    {
        $url = $this->config['api_url'] . '/2/tweets';
        
        $response = Http::withHeaders([
            'Authorization' => $this->generateOAuthHeader('POST', $url),
            'Content-Type' => 'application/json'
        ])->post($url, [
            'text' => $text,
            'media' => [
                'media_ids' => $mediaIds
            ]
        ]);

        return $response;
    }

    /**
     * Upload media file
     */
    public function uploadMedia(string $filePath): ?string
    {
        $url = $this->config['api_url'] . '/1.1/media/upload.json';
        
        $response = Http::withHeaders([
            'Authorization' => $this->generateOAuthHeader('POST', $url)
        ])->attach('media', file_get_contents($filePath), basename($filePath))
          ->post($url);

        if ($response->successful()) {
            $data = $response->json();
            return $data['media_id_string'] ?? null;
        }

        return null;
    }

    /**
     * Generate OAuth 1.0a signature
     */
    protected function generateOAuthHeader(string $method, string $url, array $extraParams = []): string
    {
        $params = array_merge([
            'oauth_consumer_key' => $this->config['api_key'],
            'oauth_nonce' => $this->generateNonce(),
            'oauth_signature_method' => 'HMAC-SHA1',
            'oauth_timestamp' => time(),
            'oauth_version' => '1.0'
        ], $extraParams);

        if ($this->oauthToken) {
            $params['oauth_token'] = $this->oauthToken;
        }

        $signature = $this->generateSignature($method, $url, $params);
        $params['oauth_signature'] = $signature;

        $header = 'OAuth ';
        $header .= implode(', ', array_map(function($key, $value) {
            return sprintf('%s="%s"', $key, rawurlencode($value));
        }, array_keys($params), $params));

        return $header;
    }

    /**
     * Generate OAuth signature
     */
    protected function generateSignature(string $method, string $url, array $params): string
    {
        ksort($params);
        
        $baseString = strtoupper($method) . '&' . rawurlencode($url) . '&';
        $baseString .= rawurlencode(http_build_query($params, '', '&', PHP_QUERY_RFC3986));

        $signingKey = rawurlencode($this->config['api_secret']) . '&';
        if ($this->oauthTokenSecret) {
            $signingKey .= rawurlencode($this->oauthTokenSecret);
        }

        return base64_encode(hash_hmac('sha1', $baseString, $signingKey, true));
    }

    /**
     * Generate random nonce
     */
    protected function generateNonce(): string
    {
        return md5(uniqid(rand(), true));
    }

    /**
     * Refresh access token
     */
    public function refreshAccessToken(string $refreshToken): \Illuminate\Http\Client\Response
    {
        $url = $this->config['token_url'];
        
        $response = Http::withBasicAuth($this->config['client_id'], $this->config['client_secret'])
            ->post($url, [
                'grant_type' => 'refresh_token',
                'refresh_token' => $refreshToken
            ]);

        return $response;
    }
}
```

### 2. Twitter Controller
Handles the OAuth flow and callback processing.

```php
// app/Http/Controllers/Api/TwitterController.php
<?php

namespace App\Http\Controllers\Api;

use App\Services\Toastr;
use App\Services\Twitter;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TwitterController extends Controller
{
    public function redirect()
    {
        $twitter = new Twitter();
        return $twitter->authRedirect();
    }

    public function callback(Request $request)
    {
        $twitter = new Twitter();
        $oauthToken = $request->get('oauth_token');
        $oauthVerifier = $request->get('oauth_verifier');
        
        if (!$oauthToken || !$oauthVerifier) {
            Toastr::error('Something went wrong, please try again.');
            return redirect()->route('user.platforms.index');
        }

        try {
            $accessToken = $twitter->getAccessToken($oauthToken, $oauthVerifier);
            $this->setPlatformInfo($accessToken);
            Toastr::success('Twitter account connected successfully!');
        } catch (\Exception $e) {
            Toastr::error('Failed to connect Twitter account: ' . $e->getMessage());
        }

        return redirect()->route('user.platforms.index');
    }

    protected function setPlatformInfo($accessToken)
    {
        $twitter = new Twitter();
        $twitter->setToken($accessToken['oauth_token'], $accessToken['oauth_token_secret']);
        
        try {
            $response = $twitter->getUserInfo();
            
            if ($response->successful()) {
                $userData = $response->json('data');
                
                $user = auth()->user();
                $user->platforms()->updateOrCreate([
                    'platform' => 'twitter',
                    'platform_id' => $userData['id'],
                    'type' => 'user',
                ], [
                    'name' => $userData['name'] ?? '',
                    'picture' => $userData['profile_image_url'] ?? '',
                    'username' => $userData['username'] ?? '',
                    'oauth1_token' => $accessToken['oauth_token'],
                    'oauth1_token_secret' => $accessToken['oauth_token_secret'],
                    'access_token' => '',
                    'access_token_expire_at' => null,
                    'refresh_token' => '',
                    'refresh_token_expire_at' => null,
                    'meta' => [
                        'user_id' => $accessToken['user_id'] ?? '',
                        'screen_name' => $accessToken['screen_name'] ?? ''
                    ]
                ]);
            } else {
                throw new \Exception('Failed to get user info');
            }
        } catch (\Exception $e) {
            throw new \Exception('Failed to get user info: ' . $e->getMessage());
        }
    }
}
```

### 3. Platform Configuration
Twitter API configuration settings.

```php
// config/platform.php
'twitter' => [
    'api_key' => env('TWITTER_API_KEY'),
    'api_secret' => env('TWITTER_API_SECRET'),
    'client_id' => env('TWITTER_CLIENT_ID'),
    'client_secret' => env('TWITTER_CLIENT_SECRET'),
    
    'base_url' => 'https://twitter.com',
    'api_url' => 'https://api.twitter.com',
    'request_token_url' => 'https://api.twitter.com/oauth/request_token',
    'access_token_url' => 'https://api.twitter.com/oauth/access_token',
    'token_url' => 'https://api.twitter.com/2/oauth2/token',
    'redirect_uri' => env('APP_URL') . '/oauth/callback/twitter',
    
    'scopes' => ['tweet.read', 'tweet.write', 'users.read'],
    
    'requirements' => [
        'text' => [
            'limit' => 280
        ],
        'images' => [
            'limit' => 4,
            'width' => 1200,
            'height' => 1200,
            'size' => 5120 // 5MB in KB
        ],
        'videos' => [
            'limit' => 1,
            'width' => 1920,
            'height' => 1080,
            'size' => 512000 // 500MB in KB
        ],
    ]
],
```

---

## Post Scheduling Process

### 1. Brand Post Controller
Handles post creation, scheduling, and publishing.

```php
// app/Http/Controllers/User/BrandPostController.php
<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandPost;
use App\Models\BrandPostPlatform;
use App\Models\Asset;
use App\Services\BrandAi;
use App\Services\Toastr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class BrandPostController extends Controller
{
    /**
     * Store a new brand post
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (env('DEMO_MODE') && $user->id == 3) {
            return back()->with('danger', __('Permission disabled for demo mode..! Create new account to use this feature.'));
        }
        
        $user->validatePlan('posts');

        $data = $request->validate([
            'title' => 'required|string',
            'input' => 'required|string',
            'brand_id' => 'required|exists:brands,id',
            'image' => 'nullable|image',
        ], [
            'brand_id.required' => 'Select Brand',
        ]);

        $brand = Brand::query()
            ->where('id', $data['brand_id'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Handle image upload or AI generation
        if ($request->hasFile('image') && !env('DEMO_MODE', false)) {
            $uploadedFile = $this->uploadFile('image');
            $data['image'] = [$uploadedFile];
           
            Asset::create([
                'user_id' => Auth::id(),
                'path' => $data['image'][0],
                'type' => 'uploaded',
                'mime_type' => 'image',
                'file_size' => $this->fileSizeInMB($uploadedFile),
            ]);
        } else {
            $brandAi = new BrandAi($brand->categories->pluck('name')->toArray(), $data['input'], $brand);
            $image = $brandAi->image();
            $data['image'] = is_array($image) ? $image : [$image];
        }

        DB::beginTransaction();
        
        try {
            // Create brand post
            $brandPost = $user->brandPosts()->create([
                'title' => $data['title'],
                'input' => $data['input'],
                'brand_id' => $data['brand_id'],
            ]);

            // Get active platforms
            $appPlatforms = activePlatforms()->filter()->keys();

            // Generate platform-specific content
            $platformContent = $brandAi->posts($appPlatforms[0], $brandPost->id);
            
            foreach ($appPlatforms as $platform) {
                if (env('AI_MOCK_DATA', false)) {
                    $content = $this->generateMockContent($platform);
                } else {
                    $content = $brandAi->posts($platform, $brandPost->id);
                }

                // Create platform-specific post
                $brandPost->platforms()->create([
                    'platform' => $platform,
                    'content' => $content['content'] ?? '',
                    'media_type' => $content['media_type'] ?? null,
                    'media' => $content['media'] ?? [],
                    'status' => 'draft'
                ]);
            }

            DB::commit();
            Toastr::success(__('Post created successfully!'));
            
        } catch (\Exception $e) {
            DB::rollBack();
            Toastr::error(__('Failed to create post: ') . $e->getMessage());
        }

        return back();
    }

    /**
     * Update brand post (including scheduling)
     */
    public function update(Request $request, BrandPost $brandPost)
    {
        $user = Auth::user();
        
        if (env('DEMO_MODE') && $user->id == 3) {
            return back()->with('danger', __('Permission disabled for demo mode..! Create new account to use this feature.'));
        }

        $newBrandPost = (object) $request->get('newBrandPost');
        $status = $request->get('status');
        $isSchedule = $request->get('is_schedule', false);

        if ($isSchedule) {
            return $this->scheduleBrandPost($brandPost, $newBrandPost);
        }

        if ($status === 'publish') {
            return $this->publishNow($brandPost, $newBrandPost);
        }

        return back();
    }

    /**
     * Schedule a brand post for later publishing
     */
    private function scheduleBrandPost(BrandPost $brandPost, object $newBrandPost): \Illuminate\Http\RedirectResponse
    {
        request()->validate([
            'newBrandPost.scheduled_at' => ['required', 'after:today'],
            'user_platforms' => ['required', 'array'],
            'timezone' => ['required'],
        ], [], [
            'newBrandPost.scheduled_at' => 'schedule date'
        ]);

        $timeZone = request()->get('timezone', config('app.timezone'));
        $scheduleDate = date('Y-m-d H:i:s', strtotime($newBrandPost->scheduled_at));
        $systemScheduleTime = Carbon::createFromFormat('Y-m-d H:i:s', $scheduleDate, $timeZone);
        $systemScheduleTime = $systemScheduleTime->copy()->tz(config('app.timezone'));

        DB::transaction(function () use ($brandPost, $newBrandPost, $systemScheduleTime) {
            // Update brand post
            $brandPost->update([
                'input' => $newBrandPost->input,
                'title' => $newBrandPost->title,
                'slogan' => $newBrandPost->slogan,
                'status' => 'published',
            ]);

            $userPlatforms = request()->collect('user_platforms');
            $selectedPlatforms = $brandPost->platforms()
                ->whereIn('platform', $userPlatforms->pluck('platform')->toArray())
                ->whereIn('status', ['draft', 'failed'])
                ->get();

            if ($selectedPlatforms->isEmpty()) {
                Toastr::info('Selected platforms aren\'t able to be scheduled');
                return back();
            }

            foreach ($selectedPlatforms as $platform) {
                $updatedPlatform = collect($newBrandPost->platforms)->where('platform', $platform->platform);
                
                $newPlatformData = [
                    'user_platform_id' => $userPlatforms->where('platform', $platform->platform)->value('id'),
                    'content' => $updatedPlatform->value('content'),
                    'media_type' => $updatedPlatform->value('media_type'),
                    'media' => $updatedPlatform->value('media'),
                    'scheduled_at' => $systemScheduleTime,
                    'status' => 'scheduled',
                    // Reset publishing data
                    'post_id' => null,
                    'reactions' => 0,
                    'comments' => 0,
                    'published_at' => null,
                    'data' => [
                        'message' => 'Scheduled at ' . $systemScheduleTime->format('d-M-Y H:i:s'),
                        'timezone' => request()->get('timezone'),
                        'original_scheduled_time' => $newBrandPost->scheduled_at
                    ],
                ];

                $platform->update($newPlatformData);
            }

            Toastr::success(__('Scheduled successfully'));
        });

        return back();
    }

    /**
     * Publish a brand post immediately
     */
    private function publishNow(BrandPost $brandPost, object $newBrandPost): array
    {
        request()->validate([
            'user_platforms' => ['required', 'array'],
        ]);

        $userPlatforms = request()->collect('user_platforms');
        $selectedPlatforms = $brandPost->platforms()
            ->whereIn('platform', $userPlatforms->pluck('platform')->toArray())
            ->whereIn('status', ['draft', 'failed'])
            ->get();

        if ($selectedPlatforms->isEmpty()) {
            Toastr::info('Selected platforms aren\'t able to be published');
            return back();
        }

        $publishResults = [];

        foreach ($selectedPlatforms as $platform) {
            $updatedPlatform = collect($newBrandPost->platforms)->where('platform', $platform->platform);
            
            $platform->update([
                'user_platform_id' => $userPlatforms->where('platform', $platform->platform)->value('id'),
                'content' => $updatedPlatform->value('content'),
                'media_type' => $updatedPlatform->value('media_type'),
                'media' => $updatedPlatform->value('media'),
                'status' => 'publishing'
            ]);

            try {
                $postPublisher = new PostPublisherService(
                    $brandPost,
                    $platform,
                    $platform->userPlatform
                );
                
                $result = $postPublisher->publish();
                $publishResults[] = $result;
                
            } catch (\Exception $e) {
                $platform->update([
                    'status' => 'failed',
                    'data' => [
                        'failed_at' => now()->toDateTimeLocalString(),
                        'message' => $e->getMessage()
                    ]
                ]);
                
                $publishResults[] = [
                    'status' => 'failed',
                    'message' => $e->getMessage()
                ];
            }
        }

        $brandPost->update(['status' => 'published']);
        
        $successCount = collect($publishResults)->where('status', 'published')->count();
        $failedCount = collect($publishResults)->where('status', 'failed')->count();
        
        if ($successCount > 0) {
            Toastr::success("Published to {$successCount} platform(s) successfully!");
        }
        
        if ($failedCount > 0) {
            Toastr::warning("Failed to publish to {$failedCount} platform(s)");
        }

        return back();
    }

    /**
     * Remove scheduled post
     */
    public function removeSchedule(BrandPostPlatform $brandPostPlatform)
    {
        $brandPostPlatform->update([
            'status' => 'draft',
            'post_id' => null,
            'published_at' => null,
            'scheduled_at' => null,
            'data' => [
                'removed_at' => now()->toDayDateTimeString(),
                'message' => 'Schedule Removed successfully',
            ]
        ]);

        Toastr::success('Schedule Removed successfully');
        return back();
    }

    // Helper methods...
    private function uploadFile($field)
    {
        // File upload logic
    }

    private function fileSizeInMB($filePath)
    {
        // File size calculation
    }

    private function generateMockContent($platform)
    {
        // Mock content generation for demo mode
    }
}
```

### 2. Brand Post Model
Eloquent model for brand posts with relationships.

```php
// app/Models/BrandPost.php
<?php

namespace App\Models;

use App\Models\User;
use App\Traits\UUID;
use App\Models\Brand;
use App\Traits\HasFilter;
use App\Models\AiGenerate;
use App\Models\UserPlatform;
use App\Models\CreditHistory;
use App\Models\BrandPostPlatform;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BrandPost extends Model
{
    use HasFactory, UUID, HasFilter;

    protected $fillable = [
        "uuid",
        "brand_id",
        "user_id",
        "input",
        "title",
        "slogan",
        "status",
    ];

    protected $appends = ['created_at_diff', 'media', 'ai_generated_image'];

    protected $casts = [];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Get created at difference for humans
     */
    public function getCreatedAtDiffAttribute($value)
    {
        return now()->make($this->attributes['created_at'])->diffForHumans([
            'short' => true
        ]);
    }

    /**
     * Get media attribute
     */
    public function media(): Attribute
    {
        return new Attribute(
            get: function () {
                $platforms = $this->platforms;
                if ($platforms->isEmpty()) {
                    return [];
                }
                
                $firstPlatform = $platforms->first();
                return $firstPlatform->media ?? [];
            }
        );
    }

    /**
     * Get AI generated image
     */
    public function aiGeneratedImage(): Attribute
    {
        return new Attribute(
            get: function () {
                $aiGenerate = $this->aiGenerates()->latest()->first();
                return $aiGenerate?->image ?? null;
            }
        );
    }

    /**
     * Get the brand that owns the post
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get the user that owns the post
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the platforms for this post
     */
    public function platforms(): HasMany
    {
        return $this->hasMany(BrandPostPlatform::class);
    }

    /**
     * Get AI generated content
     */
    public function aiGenerates(): HasMany
    {
        return $this->hasMany(AiGenerate::class);
    }

    /**
     * Get credit history
     */
    public function creditHistory(): HasMany
    {
        return $this->hasMany(CreditHistory::class);
    }

    /**
     * Scope for published posts
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope for draft posts
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope for posts with scheduled content
     */
    public function scopeWithScheduledContent($query)
    {
        return $query->whereHas('platforms', function ($q) {
            $q->where('status', 'scheduled');
        });
    }
}
```

### 3. Brand Post Platform Model
Eloquent model for platform-specific post data.

```php
// app/Models/BrandPostPlatform.php
<?php

namespace App\Models;

use App\Traits\HasFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BrandPostPlatform extends Model
{
    use HasFactory, HasFilter;

    protected $fillable = [
        'brand_post_id',
        'user_platform_id',
        'platform',
        'content',
        'media_type',
        'media',
        'thumbnail',
        'post_id',
        'reactions',
        'comments',
        'scheduled_at',
        'published_at',
        'status',
        'data',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'media' => 'array',
        'data' => 'array',
    ];

    protected $appends = ['requirements'];

    /**
     * Get the requirements for the specific platform
     */
    protected function requirements(): Attribute
    {
        return Attribute::make(
            get: fn() => config("platform.{$this->platform}.requirements"),
        );
    }

    /**
     * Get the brand post that owns this platform
     */
    public function brandPost(): BelongsTo
    {
        return $this->belongsTo(BrandPost::class);
    }

    /**
     * Get the user platform that owns this platform
     */
    public function userPlatform(): BelongsTo
    {
        return $this->belongsTo(UserPlatform::class, 'user_platform_id');
    }

    /**
     * Scope for scheduled items
     */
    public function scopeScheduled($query)
    {
        return $query->whereNotNull('scheduled_at');
    }

    /**
     * Scope for items ready to publish
     */
    public function scopeReadyToPublish($query)
    {
        return $query->where('status', 'scheduled')
                    ->whereNotNull('scheduled_at')
                    ->where('scheduled_at', '<=', now());
    }

    /**
     * Scope for published items
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope for failed items
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Check if post is ready to publish
     */
    public function isReadyToPublish(): bool
    {
        return $this->status === 'scheduled' 
            && $this->scheduled_at 
            && $this->scheduled_at->isPast();
    }

    /**
     * Mark as publishing
     */
    public function markAsPublishing(): bool
    {
        return $this->update(['status' => 'publishing']);
    }

    /**
     * Mark as published
     */
    public function markAsPublished(string $postId = null): bool
    {
        return $this->update([
            'status' => 'published',
            'post_id' => $postId,
            'published_at' => now()
        ]);
    }

    /**
     * Mark as failed
     */
    public function markAsFailed(string $message = null): bool
    {
        $data = $this->data ?? [];
        $data['failed_at'] = now()->toDateTimeLocalString();
        $data['message'] = $message;

        return $this->update([
            'status' => 'failed',
            'data' => $data
        ]);
    }
}
```

---

## Automated Publishing System

### 1. Publish Scheduled Posts Command
Laravel Artisan command for processing scheduled posts.

```php
// app/Console/Commands/PublishScheduledPosts.php
<?php

namespace App\Console\Commands;

use App\Models\BrandPostPlatform;
use App\Services\PostPublisherService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class PublishScheduledPosts extends Command
{
    protected $signature = 'posts:publish-scheduled';
    protected $description = 'Publish scheduled posts that are due';

    public function handle()
    {
        $this->info('Starting to process scheduled posts...');
        $startTime = now();
        
        $processedCount = 0;
        $successCount = 0;
        $failedCount = 0;

        try {
            BrandPostPlatform::query()
                ->where('status', 'scheduled')
                ->where('scheduled_at', '<=', now())
                ->with(['brandPost', 'userPlatform'])
                ->chunk(10, function($platforms) use (&$processedCount, &$successCount, &$failedCount) {
                    foreach($platforms as $platform) {
                        $processedCount++;
                        
                        $this->info("Processing post {$platform->id} for platform {$platform->platform}...");
                        
                        if (!$platform->brandPost || !$platform->userPlatform) {
                            $this->error("Missing required relations for post {$platform->id}");
                            $this->markAsFailed($platform, 'Missing required relations');
                            $failedCount++;
                            continue;
                        }

                        try {
                            // Mark as publishing to prevent duplicate processing
                            $platform->markAsPublishing();
                            
                            $postPublisher = new PostPublisherService(
                                $platform->brandPost,
                                $platform,
                                $platform->userPlatform
                            );
                            
                            $result = $postPublisher->publish();
                            
                            if ($result->isSuccessful()) {
                                $platform->markAsPublished($result->getPostId());
                                $this->info("Successfully published post {$platform->id}");
                                $successCount++;
                            } else {
                                throw new \Exception($result->getErrorMessage());
                            }
                            
                        } catch (\Exception $e) {
                            $this->error("Failed to publish post {$platform->id}: {$e->getMessage()}");
                            
                            $platform->markAsFailed($e->getMessage());
                            $failedCount++;
                            
                            // Log error for debugging
                            Log::error('Post publishing failed', [
                                'post_id' => $platform->id,
                                'platform' => $platform->platform,
                                'error' => $e->getMessage(),
                                'trace' => $e->getTraceAsString()
                            ]);
                        }
                    }
                });

        } catch (\Exception $e) {
            $this->error("Critical error in scheduler: {$e->getMessage()}");
            Log::critical('Critical error in post scheduler', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        $endTime = now();
        $duration = $startTime->diffInSeconds($endTime);

        $this->info("Finished processing scheduled posts");
        $this->info("Total processed: {$processedCount}");
        $this->info("Successfully published: {$successCount}");
        $this->info("Failed: {$failedCount}");
        $this->info("Duration: {$duration} seconds");

        // Log summary
        Log::info('Post scheduler completed', [
            'processed' => $processedCount,
            'successful' => $successCount,
            'failed' => $failedCount,
            'duration_seconds' => $duration
        ]);
    }

    private function markAsFailed(BrandPostPlatform $platform, string $message): void
    {
        $platform->markAsFailed($message);
    }
}
```

### 2. Console Kernel
Registers the command and schedules it to run.

```php
// app/Console/Kernel.php
<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\FixDesignerFilePaths;
use App\Console\Commands\PublishScheduledPosts;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        FixDesignerFilePaths::class,
        PublishScheduledPosts::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        // Check and publish scheduled posts every minute
        $schedule->command('posts:publish-scheduled')
            ->everyMinute()
            ->appendOutputTo(storage_path('logs/scheduler.log'))
            ->before(function() {
                \Log::info("Scheduler started at: " . now());
            })
            ->after(function() {
                \Log::info("Scheduler completed at: " . now());
            })
            ->onFailure(function() {
                \Log::error("Scheduler failed at: " . now());
            });

        // Alternative: Run every 5 minutes for better performance
        // $schedule->command('posts:publish-scheduled')->everyFiveMinutes();
        
        // Alternative: Run at specific times
        // $schedule->command('posts:publish-scheduled')->hourly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
```

### 3. Cron Controller
Alternative web-based endpoint for manual triggering.

```php
// app/Http/Controllers/CronController.php
<?php

namespace App\Http\Controllers;

use App\Models\BrandPost;
use App\Models\BrandPostPlatform;
use App\Models\UserPlatform;
use App\Services\PostPublisherService;
use App\Services\Facebook;
use App\Services\Instagram;
use App\Services\Twitter;
use App\Services\Linkedin;
use App\Services\Tiktok;
use App\Mail\RefreshTokenFailMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;

class CronController extends Controller
{
    /**
     * Execute scheduled posts via web endpoint
     */
    public function dispatchSchedulePosts()
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', '512M');

        $startTime = now();