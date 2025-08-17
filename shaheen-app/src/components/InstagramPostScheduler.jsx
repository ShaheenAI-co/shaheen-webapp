"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Image as ImageIcon, Send, Instagram, Upload, X, Play } from 'lucide-react';
import { useInstagramAuth } from '@/Hooks/useInstagramAuth';
import { instagramPosting } from '@/lib/instagram-posting';

const InstagramPostScheduler = () => {
  const { isConnected, userData, supabaseAccounts, user } = useInstagramAuth();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const fileInputRef = useRef(null);

  // Set default selected account when accounts are loaded
  React.useEffect(() => {
    if (supabaseAccounts.length > 0 && !selectedAccount) {
      setSelectedAccount(supabaseAccounts[0].instagram_id.toString());
    }
  }, [supabaseAccounts, selectedAccount]);

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      mediaPreview.forEach(preview => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [mediaPreview]);

  // Handle file selection
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      setMessage('Please select valid image or video files (max 100MB each)');
      return;
    }

    if (validFiles.length > 10) {
      setMessage('Maximum 10 files allowed for carousel posts');
      return;
    }

    setSelectedFiles(validFiles);
    setMessage('');

    // Create previews
    const previews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      name: file.name
    }));
    setMediaPreview(previews);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-500/10');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10');
    handleFileSelect(e.dataTransfer.files);
  };

  // Remove file from selection
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = mediaPreview.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setMediaPreview(newPreviews);
    
    // Clean up preview URLs
    URL.revokeObjectURL(mediaPreview[index].url);
  };

  // Clear all files
  const clearFiles = () => {
    selectedFiles.forEach((_, index) => {
      URL.revokeObjectURL(mediaPreview[index].url);
    });
    setSelectedFiles([]);
    setMediaPreview([]);
  };

  // Handle immediate posting
  const handlePostNow = async () => {
    if (!selectedAccount || selectedFiles.length === 0) {
      setMessage('Please select an account and at least one media file');
      return;
    }

    setIsPosting(true);
    setMessage('');

    try {
      const selectedAccountData = supabaseAccounts.find(
        acc => acc.instagram_id.toString() === selectedAccount
      );

      if (!selectedAccountData) {
        throw new Error('Selected account not found');
      }

      const result = await instagramPosting.postNow(
        selectedAccountData.instagram_id,
        selectedAccountData.page_access_token,
        {
          files: selectedFiles,
          caption: caption.trim() || undefined
        }
      );

      setMessage(`Post published successfully! 🎉 Media ID: ${result.mediaId}`);
      
      // Clear form
      setCaption('');
      clearFiles();
      
    } catch (error) {
      setMessage(`Error posting to Instagram: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAccount || !scheduledDate || !scheduledTime) {
      setMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Here you would implement the actual Instagram posting logic
      // For now, we'll just simulate a successful post
      
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      // Validate that the scheduled time is in the future
      if (scheduledDateTime <= new Date()) {
        setMessage('Scheduled time must be in the future');
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage('Post scheduled successfully! 🎉');
      
      // Clear form
      setCaption('');
      setScheduledDate('');
      setScheduledTime('');
      
      // TODO: Update last_posted_at in Supabase
      // await supabaseInstagram.updateLastPosted(selectedAccount, user.id);
      
    } catch (error) {
      setMessage(`Error scheduling post: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected || supabaseAccounts.length === 0) {
    return (
      <Card className="w-full bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Instagram className="w-5 h-5" />
            Instagram Post Scheduler
          </CardTitle>
          <CardDescription className="text-gray-300">
            Schedule posts for your Instagram accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Instagram className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">No Instagram accounts connected</p>
            <p className="text-sm text-gray-400">
              Connect your Instagram account first to start scheduling posts
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedAccountData = supabaseAccounts.find(
    acc => acc.instagram_id.toString() === selectedAccount
  );

  return (
    <Card className="w-full bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Instagram className="w-5 h-5" />
          Instagram Post Scheduler
        </CardTitle>
        <CardDescription className="text-gray-300">
          Schedule posts for your Instagram accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="account" className="text-white">
              Select Instagram Account
            </Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Choose an account" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {supabaseAccounts.map((account) => {
                  const expiresAt = new Date(account.expires_at);
                  const now = new Date();
                  const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isExpired = expiresAt <= now;
                  
                  return (
                    <SelectItem 
                      key={account.instagram_id} 
                      value={account.instagram_id.toString()}
                      className="text-white hover:bg-gray-700"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{account.username}</span>
                        <span className={`text-xs ${
                          isExpired ? 'text-red-400' : 
                          daysRemaining <= 7 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {isExpired ? 'Expired' : `${daysRemaining}d left`}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {selectedAccountData && (
              <div className="text-xs text-gray-400 bg-white/5 p-2 rounded">
                <div>Account: {selectedAccountData.username}</div>
                <div>Instagram ID: {selectedAccountData.instagram_id}</div>
                {selectedAccountData.last_posted_at && (
                  <div>Last Posted: {new Date(selectedAccountData.last_posted_at).toLocaleDateString()}</div>
                )}
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-white">
              Post Caption
            </Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your Instagram post caption..."
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none"
              rows={4}
              maxLength={2200}
            />
            <div className="text-xs text-gray-400 text-right">
              {caption.length}/2200 characters
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Media Files
            </Label>
            
            {/* File Input */}
            <div 
              className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center transition-colors duration-200"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {mediaPreview.length === 0 ? (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">Upload images or videos</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Drag & drop files here or click to browse
                  </p>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {mediaPreview.length} file{mediaPreview.length > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      type="button"
                      onClick={clearFiles}
                      variant="outline"
                      size="sm"
                      className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                  
                  {/* Media Previews */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mediaPreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 border border-white/20">
                          {preview.type === 'image' ? (
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                              <Play className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        {/* File name */}
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {preview.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add more files button */}
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Add More Files
                  </Button>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400">
              Supported: Images (JPEG) and Videos (MP4, MOV). Max 10 files, 100MB each.
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-md ${
              message.includes('Error') || message.includes('required') 
                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                : 'bg-green-500/10 border border-green-500/20 text-green-400'
            }`}>
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Post Now Button */}
            <Button
              type="button"
              onClick={handlePostNow}
              disabled={isPosting || !selectedAccount || selectedFiles.length === 0}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Instagram className="w-4 h-4 mr-2" />
                  Post Now
                </>
              )}
            </Button>

            {/* Schedule Post Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !selectedAccount || !caption.trim() || !scheduledDate || !scheduledTime}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Schedule Post
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InstagramPostScheduler;
