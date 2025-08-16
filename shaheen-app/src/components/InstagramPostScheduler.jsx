"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Image as ImageIcon, Send, Instagram } from 'lucide-react';
import { useInstagramAuth } from '@/Hooks/useInstagramAuth';

const InstagramPostScheduler = () => {
  const { isConnected, userData, supabaseAccounts, user } = useInstagramAuth();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Set default selected account when accounts are loaded
  React.useEffect(() => {
    if (supabaseAccounts.length > 0 && !selectedAccount) {
      setSelectedAccount(supabaseAccounts[0].instagram_id.toString());
    }
  }, [supabaseAccounts, selectedAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAccount || !caption.trim() || !scheduledDate || !scheduledTime) {
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

          {/* Media Upload Placeholder */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Media (Coming Soon)
            </Label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Media upload feature coming soon</p>
              <p className="text-sm text-gray-400">
                You'll be able to upload images and videos here
              </p>
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

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !selectedAccount || !caption.trim() || !scheduledDate || !scheduledTime}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Scheduling Post...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Schedule Post
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InstagramPostScheduler;
