"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  MoreHorizontal,
  Plus,
  Image as ImageIcon,
  Video,
  FileText,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  TrendingUp,
  Heart,
  MessageCircle,
  Share,
} from "lucide-react";
import Topbar from "../components/Topbar";
import { cn } from "@/lib/utils";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Sample posts data
  useEffect(() => {
    const samplePosts = [
      {
        id: 1,
        title: "New Product Launch Campaign",
        content:
          "Excited to announce our latest product! 🚀 This revolutionary new design combines style and functionality like never before. #newproduct #launch #innovation",
        image: "/images/product.png",
        platform: "instagram",
        status: "published",
        publishedAt: "2024-01-15T10:00:00Z",
        createdAt: "2024-01-10T14:30:00Z",
        engagement: {
          likes: 1247,
          comments: 89,
          shares: 156,
          views: 15420,
        },
        tags: ["product", "launch", "innovation"],
        category: "Product Marketing",
      },
      {
        id: 2,
        title: "Behind the Scenes - Creative Process",
        content:
          "A sneak peek into our creative process ✨ From concept to final design, here's how we bring ideas to life. #behindthescenes #creative #design",
        image: "/images/bg.jpg",
        platform: "instagram",
        status: "published",
        publishedAt: "2024-01-16T14:30:00Z",
        createdAt: "2024-01-11T09:15:00Z",
        engagement: {
          likes: 892,
          comments: 45,
          shares: 78,
          views: 8920,
        },
        tags: ["behindthescenes", "creative", "design"],
        category: "Behind the Scenes",
      },
      {
        id: 3,
        title: "Customer Success Story",
        content:
          "Amazing feedback from our customers! 💫 Sarah's transformation journey with our product. #customerspotlight #feedback #success",
        image: "/images/perfume.png",
        platform: "facebook",
        status: "scheduled",
        scheduledFor: "2024-01-17T09:00:00Z",
        createdAt: "2024-01-12T16:45:00Z",
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
        },
        tags: ["customerspotlight", "feedback", "success"],
        category: "Customer Stories",
      },
      {
        id: 4,
        title: "Industry Trends Report",
        content:
          "The latest trends in digital marketing for 2024. AI-powered solutions are revolutionizing how we approach content creation. #trends #marketing #AI",
        platform: "linkedin",
        status: "draft",
        createdAt: "2024-01-13T11:20:00Z",
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
        },
        tags: ["trends", "marketing", "AI"],
        category: "Industry Insights",
      },
      {
        id: 5,
        title: "Team Building Event",
        content:
          "Great team building event today! Building stronger connections and fostering creativity. #teambuilding #culture #teamwork",
        image: "/images/bag.png",
        platform: "twitter",
        status: "published",
        publishedAt: "2024-01-14T12:00:00Z",
        createdAt: "2024-01-13T15:30:00Z",
        engagement: {
          likes: 567,
          comments: 23,
          shares: 34,
          views: 4560,
        },
        tags: ["teambuilding", "culture", "teamwork"],
        category: "Company Culture",
      },
      {
        id: 6,
        title: "Product Tutorial Video",
        content:
          "Learn how to get the most out of our product with this comprehensive tutorial! #tutorial #howto #productguide",
        platform: "instagram",
        status: "published",
        publishedAt: "2024-01-13T16:00:00Z",
        createdAt: "2024-01-12T10:00:00Z",
        engagement: {
          likes: 2341,
          comments: 156,
          shares: 289,
          views: 23400,
        },
        tags: ["tutorial", "howto", "productguide"],
        category: "Educational",
      },
    ];
    setPosts(samplePosts);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400";
      case "scheduled":
        return "bg-blue-500/20 text-blue-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      default:
        return <Share2 className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "instagram":
        return "text-pink-500";
      case "facebook":
        return "text-blue-500";
      case "twitter":
        return "text-sky-500";
      case "linkedin":
        return "text-blue-600";
      default:
        return "text-gray-500";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatEngagement = (number) => {
    if (number >= 1000000) return (number / 1000000).toFixed(1) + "M";
    if (number >= 1000) return (number / 1000).toFixed(1) + "K";
    return number.toString();
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    const matchesPlatform =
      filterPlatform === "all" || post.platform === filterPlatform;

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "engagement":
        return (
          b.engagement.likes +
          b.engagement.comments +
          b.engagement.shares -
          (a.engagement.likes + a.engagement.comments + a.engagement.shares)
        );
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleEditPost = (post) => {
    // Navigate to edit page or open edit modal
    console.log("Edit post:", post);
  };

  const handleViewPost = (post) => {
    // Navigate to post view page
    console.log("View post:", post);
  };

  return (
    <div className="px-12 pt-6 bg-[#0f0f0f] min-h-screen">
      <Topbar icon="/icons/Paper_File.svg" title="Posts" />

      <div className="mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white capitalize satoshi-bold">
              My Posts
            </h2>
            <p className="text-white/60 mt-1">
              Manage and view all your created posts
            </p>
          </div>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Post
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>

          {/* Platform Filter */}
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="date">Sort by Date</option>
            <option value="engagement">Sort by Engagement</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">
              {sortedPosts.length} posts found
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "border-white/20",
                viewMode === "grid"
                  ? "bg-purple-500/20 border-purple-500/30 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "border-white/20",
                viewMode === "list"
                  ? "bg-purple-500/20 border-purple-500/30 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Posts Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/15 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "p-1 rounded",
                          getPlatformColor(post.platform)
                        )}
                      >
                        {getPlatformIcon(post.platform)}
                      </div>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-white text-lg line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image */}
                  {post.image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <p className="text-white/80 text-sm line-clamp-3">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-white/40">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Engagement Stats */}
                  {post.status === "published" && (
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {formatEngagement(post.engagement.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {formatEngagement(post.engagement.comments)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share className="w-3 h-3" />
                          {formatEngagement(post.engagement.shares)}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatEngagement(post.engagement.views)}
                      </span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Calendar className="w-3 h-3" />
                    {post.status === "published"
                      ? formatDate(post.publishedAt)
                      : post.status === "scheduled"
                        ? `Scheduled for ${formatDate(post.scheduledFor)}`
                        : formatDate(post.createdAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPost(post)}
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditPost(post)}
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePost(post.id)}
                      className="border-white/20 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-white/10 border border-white/20 backdrop-blur-md"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    {post.image && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "p-1 rounded",
                              getPlatformColor(post.platform)
                            )}
                          >
                            {getPlatformIcon(post.platform)}
                          </div>
                          <h3 className="text-white font-semibold truncate">
                            {post.title}
                          </h3>
                        </div>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>

                      <p className="text-white/80 text-sm mb-3 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-white/60">
                          <span>{post.category}</span>
                          <span>•</span>
                          <span>
                            {post.status === "published"
                              ? formatDate(post.publishedAt)
                              : post.status === "scheduled"
                                ? `Scheduled for ${formatDate(post.scheduledFor)}`
                                : formatDate(post.createdAt)}
                          </span>
                          {post.status === "published" && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {formatEngagement(post.engagement.likes)}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPost(post)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPost(post)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePost(post.id)}
                            className="border-white/20 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No posts found
            </h3>
            <p className="text-white/60 mb-4">
              {searchTerm || filterStatus !== "all" || filterPlatform !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first post to get started"}
            </p>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
