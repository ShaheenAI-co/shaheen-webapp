"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  CalendarDays,
  Filter,
} from "lucide-react";
import Topbar from "../components/Topbar";
import { cn } from "@/lib/utils";

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Form state for creating/editing posts
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    image: null,
    scheduledDate: "",
    scheduledTime: "",
    platform: "instagram",
    status: "scheduled",
  });

  // Sample scheduled posts data
  useEffect(() => {
    const samplePosts = [
      {
        id: 1,
        title: "New Product Launch",
        content:
          "Excited to announce our latest product! 🚀 #newproduct #launch",
        image: "/images/product.png",
        scheduledDate: "2024-01-15",
        scheduledTime: "10:00",
        platform: "instagram",
        status: "scheduled",
        createdAt: "2024-01-10",
      },
      {
        id: 2,
        title: "Behind the Scenes",
        content:
          "A sneak peek into our creative process ✨ #behindthescenes #creative",
        image: "/images/bg.jpg",
        scheduledDate: "2024-01-16",
        scheduledTime: "14:30",
        platform: "instagram",
        status: "published",
        createdAt: "2024-01-11",
      },
      {
        id: 3,
        title: "Customer Spotlight",
        content:
          "Amazing feedback from our customers! 💫 #customerspotlight #feedback",
        image: "/images/perfume.png",
        scheduledDate: "2024-01-17",
        scheduledTime: "09:00",
        platform: "instagram",
        status: "draft",
        createdAt: "2024-01-12",
      },
    ];
    setScheduledPosts(samplePosts);
  }, []);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getPostsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return scheduledPosts.filter((post) => post.scheduledDate === dateStr);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleCreatePost = () => {
    const newPost = {
      id: Date.now(),
      ...postForm,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setScheduledPosts([...scheduledPosts, newPost]);
    setShowCreateModal(false);
    setPostForm({
      title: "",
      content: "",
      image: null,
      scheduledDate: "",
      scheduledTime: "",
      platform: "instagram",
      status: "scheduled",
    });
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      image: post.image,
      scheduledDate: post.scheduledDate,
      scheduledTime: post.scheduledTime,
      platform: post.platform,
      status: post.status,
    });
    setShowCreateModal(true);
  };

  const handleDeletePost = (postId) => {
    setScheduledPosts(scheduledPosts.filter((post) => post.id !== postId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-400";
      case "published":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredPosts = scheduledPosts.filter((post) => {
    if (filterStatus === "all") return true;
    return post.status === filterStatus;
  });

  const days = getDaysInMonth(selectedDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="px-12 pt-6 bg-[#0f0f0f] min-h-screen">
      <Topbar icon="/icons/Calendar.svg" title="Schedule Posts" />

      <div className="mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white capitalize satoshi-bold">
              Post Scheduler
            </h2>
            <p className="text-white/60 mt-1">Plan and schedule your content</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    {monthNames[selectedDate.getMonth()]}{" "}
                    {selectedDate.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedDate(
                          new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth() - 1
                          )
                        )
                      }
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      ←
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedDate(
                          new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth() + 1
                          )
                        )
                      }
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-white/60"
                      >
                        {day}
                      </div>
                    )
                  )}

                  {/* Calendar days */}
                  {days.map((day, index) => {
                    const postsForDay = getPostsForDate(day);
                    const isToday =
                      day && day.toDateString() === new Date().toDateString();
                    const isSelected =
                      day && day.toDateString() === selectedDate.toDateString();

                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-2 min-h-[80px] border border-white/5 cursor-pointer transition-colors",
                          day ? "hover:bg-white/5" : "",
                          isToday
                            ? "bg-purple-500/20 border-purple-500/30"
                            : "",
                          isSelected ? "bg-white/10 border-white/20" : ""
                        )}
                        onClick={() => day && handleDateSelect(day)}
                      >
                        {day && (
                          <>
                            <div className="text-sm font-medium text-white mb-1">
                              {day.getDate()}
                            </div>
                            {postsForDay.length > 0 && (
                              <div className="space-y-1">
                                {postsForDay.slice(0, 2).map((post) => (
                                  <div
                                    key={post.id}
                                    className="text-xs p-1 rounded bg-white/10 text-white truncate"
                                    title={post.title}
                                  >
                                    {post.title}
                                  </div>
                                ))}
                                {postsForDay.length > 2 && (
                                  <div className="text-xs text-white/60 text-center">
                                    +{postsForDay.length - 2} more
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {/* Filter */}
            <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Posts for selected date */}
            <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">
                  Posts for {selectedDate.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getPostsForDate(selectedDate).length === 0 ? (
                  <p className="text-white/60 text-center py-4">
                    No posts scheduled for this date
                  </p>
                ) : (
                  getPostsForDate(selectedDate).map((post) => (
                    <div
                      key={post.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white truncate">
                          {post.title}
                        </h4>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60 mb-2 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                        <Clock className="w-3 h-3" />
                        {post.scheduledTime}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditPost(post)}
                          className="text-white hover:bg-white/10"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Posts Table */}
        <div className="mt-8">
          <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">All Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 text-white/60 font-medium">
                        Title
                      </th>
                      <th className="text-left p-3 text-white/60 font-medium">
                        Platform
                      </th>
                      <th className="text-left p-3 text-white/60 font-medium">
                        Scheduled
                      </th>
                      <th className="text-left p-3 text-white/60 font-medium">
                        Status
                      </th>
                      <th className="text-left p-3 text-white/60 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => (
                      <tr
                        key={post.id}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="p-3 text-white">{post.title}</td>
                        <td className="p-3 text-white/80 capitalize">
                          {post.platform}
                        </td>
                        <td className="p-3 text-white/80">
                          {post.scheduledDate} at {post.scheduledTime}
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditPost(post)}
                              className="text-white hover:bg-white/10"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] border border-white/20 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              {selectedPost ? "Edit Post" : "Create New Post"}
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">
                  Title
                </Label>
                <Input
                  id="title"
                  value={postForm.title}
                  onChange={(e) =>
                    setPostForm({ ...postForm, title: e.target.value })
                  }
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Post title"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={postForm.content}
                  onChange={(e) =>
                    setPostForm({ ...postForm, content: e.target.value })
                  }
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Write your post content..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-white">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={postForm.scheduledDate}
                    onChange={(e) =>
                      setPostForm({
                        ...postForm,
                        scheduledDate: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-white">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={postForm.scheduledTime}
                    onChange={(e) =>
                      setPostForm({
                        ...postForm,
                        scheduledTime: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="platform" className="text-white">
                  Platform
                </Label>
                <Select
                  value={postForm.platform}
                  onValueChange={(value) =>
                    setPostForm({ ...postForm, platform: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreatePost}
                  className="bg-purple-500 hover:bg-purple-600 text-white flex-1"
                >
                  {selectedPost ? "Update Post" : "Create Post"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedPost(null);
                    setPostForm({
                      title: "",
                      content: "",
                      image: null,
                      scheduledDate: "",
                      scheduledTime: "",
                      platform: "instagram",
                      status: "scheduled",
                    });
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
