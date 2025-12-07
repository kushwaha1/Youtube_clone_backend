import { connectDB } from "../config/db.js";
import User from "../models/User.model.js";
import Channel from "../models/Channel.model.js";
import Video from "../models/Video.model.js";
import Comment from "../models/Comment.model.js";
import bcrypt from "bcryptjs";

// Sample users data with plain passwords (will be hashed before insertion)
const usersData = [
  {
    name: "Code Hub",
    userName: "codehub",
    email: "codehub@example.com",
    password: "CodeHub@123",
    avatar: {
      url: "https://i.pravatar.cc/150?img=1",
      public_id: "avatars/codehub"
    }
  },
  {
    name: "Interview Prep",
    userName: "interviewprep",
    email: "interviewprep@example.com",
    password: "Interview@123",
    avatar: {
      url: "https://i.pravatar.cc/150?img=2",
      public_id: "avatars/interviewprep"
    }
  },
  {
    name: "React Academy",
    userName: "reactacademy",
    email: "reactacademy@example.com",
    password: "React@2024",
    avatar: {
      url: "https://i.pravatar.cc/150?img=3",
      public_id: "avatars/reactacademy"
    }
  },
  {
    name: "CSS Pro",
    userName: "csspro",
    email: "csspro@example.com",
    password: "CssPro@123",
    avatar: {
      url: "https://i.pravatar.cc/150?img=4",
      public_id: "avatars/csspro"
    }
  },
  {
    name: "Backend Zone",
    userName: "backendzone",
    email: "backendzone@example.com",
    password: "Backend@123",
    avatar: {
      url: "https://i.pravatar.cc/150?img=5",
      public_id: "avatars/backendzone"
    }
  },
  {
    name: "TS Master",
    userName: "tsmaster",
    email: "tsmaster@example.com",
    password: "TypeScript@1",
    avatar: {
      url: "https://i.pravatar.cc/150?img=6",
      public_id: "avatars/tsmaster"
    }
  },
  {
    name: "Dev Mentor",
    userName: "devmentor",
    email: "devmentor@example.com",
    password: "DevMentor@1",
    avatar: {
      url: "https://i.pravatar.cc/150?img=7",
      public_id: "avatars/devmentor"
    }
  },
  {
    name: "API School",
    userName: "apischool",
    email: "apischool@example.com",
    password: "ApiSchool@1",
    avatar: {
      url: "https://i.pravatar.cc/150?img=8",
      public_id: "avatars/apischool"
    }
  },
  {
    name: "Live Coders",
    userName: "livecoders",
    email: "livecoders@example.com",
    password: "LiveCode@123",
    avatar: {
      url: "https://i.pravatar.cc/150?img=9",
      public_id: "avatars/livecoders"
    }
  },
  {
    name: "Chill Beats",
    userName: "chillbeats",
    email: "chillbeats@example.com",
    password: "ChillBeats@1",
    avatar: {
      url: "https://i.pravatar.cc/150?img=10",
      public_id: "avatars/chillbeats"
    }
  },
  {
    name: "Game Arena",
    userName: "gamearena",
    email: "gamearena@example.com",
    password: "GameArena@1",
    avatar: {
      url: "https://i.pravatar.cc/150?img=11",
      public_id: "avatars/gamearena"
    }
  },
  {
    name: "Tech News",
    userName: "technews",
    email: "technews@example.com",
    password: "TechNews@123",
    avatar: {
      url: "https://i.pravatar.cc/150?img=12",
      public_id: "avatars/technews"
    }
  },
  {
    name: "Dev Talks",
    userName: "devtalks",
    email: "devtalks@example.com",
    password: "DevTalks@123",
    avatar: {
      url: "https://i.pravatar.cc/150?img=13",
      public_id: "avatars/devtalks"
    }
  },
  {
    name: "Frontend Focus",
    userName: "frontendfocus",
    email: "frontendfocus@example.com",
    password: "Frontend@123",
    avatar: {
      url: "https://i.pravatar.cc/150?img=14",
      public_id: "avatars/frontendfocus"
    }
  },
  {
    name: "Design Lab",
    userName: "designlab",
    email: "designlab@example.com",
    password: "DesignLab@1",
    avatar: {
      url: "https://i.pravatar.cc/150?img=15",
      public_id: "avatars/designlab"
    }
  },
  {
    name: "Server Side",
    userName: "serverside",
    email: "serverside@example.com",
    password: "ServerSide@1",
    avatar: {
      url: "https://i.pravatar.cc/150?img=16",
      public_id: "avatars/serverside"
    }
  }
];

// Function to create channels data (will use user IDs)
const createChannelsData = (users) => {
  return [
    {
      channelName: "Code Hub",
      owner: users[0]._id,
      description: "Learn programming from scratch with easy tutorials",
      channelBanner: {
        url: "https://picsum.photos/seed/channel1/1920/400",
        public_id: "banners/codehub"
      },
      subscribers: 125000
    },
    {
      channelName: "Interview Prep",
      owner: users[1]._id,
      description: "Get ready for technical interviews with expert guidance",
      channelBanner: {
        url: "https://picsum.photos/seed/channel2/1920/400",
        public_id: "banners/interviewprep"
      },
      subscribers: 89000
    },
    {
      channelName: "React Academy",
      owner: users[2]._id,
      description: "Master React.js and modern frontend development",
      channelBanner: {
        url: "https://picsum.photos/seed/channel3/1920/400",
        public_id: "banners/reactacademy"
      },
      subscribers: 156000
    },
    {
      channelName: "CSS Pro",
      owner: users[3]._id,
      description: "Advanced CSS techniques and design patterns",
      channelBanner: {
        url: "https://picsum.photos/seed/channel4/1920/400",
        public_id: "banners/csspro"
      },
      subscribers: 98000
    },
    {
      channelName: "Backend Zone",
      owner: users[4]._id,
      description: "Backend development, APIs, and server-side programming",
      channelBanner: {
        url: "https://picsum.photos/seed/channel5/1920/400",
        public_id: "banners/backendzone"
      },
      subscribers: 142000
    },
    {
      channelName: "TS Master",
      owner: users[5]._id,
      description: "TypeScript tutorials and best practices",
      channelBanner: {
        url: "https://picsum.photos/seed/channel6/1920/400",
        public_id: "banners/tsmaster"
      },
      subscribers: 67000
    },
    {
      channelName: "Dev Mentor",
      owner: users[6]._id,
      description: "Complete web development roadmaps and career guidance",
      channelBanner: {
        url: "https://picsum.photos/seed/channel7/1920/400",
        public_id: "banners/devmentor"
      },
      subscribers: 234000
    },
    {
      channelName: "API School",
      owner: users[7]._id,
      description: "RESTful APIs, GraphQL, and backend tutorials",
      channelBanner: {
        url: "https://picsum.photos/seed/channel8/1920/400",
        public_id: "banners/apischool"
      },
      subscribers: 78000
    },
    {
      channelName: "Live Coders",
      owner: users[8]._id,
      description: "Live coding sessions and real-time problem solving",
      channelBanner: {
        url: "https://picsum.photos/seed/channel9/1920/400",
        public_id: "banners/livecoders"
      },
      subscribers: 45000
    },
    {
      channelName: "Chill Beats",
      owner: users[9]._id,
      description: "Lo-fi and focus music for coding and studying",
      channelBanner: {
        url: "https://picsum.photos/seed/channel10/1920/400",
        public_id: "banners/chillbeats"
      },
      subscribers: 567000
    },
    {
      channelName: "Game Arena",
      owner: users[10]._id,
      description: "Gaming highlights, reviews, and entertainment",
      channelBanner: {
        url: "https://picsum.photos/seed/channel11/1920/400",
        public_id: "banners/gamearena"
      },
      subscribers: 389000
    },
    {
      channelName: "Tech News",
      owner: users[11]._id,
      description: "Latest tech news, updates, and industry insights",
      channelBanner: {
        url: "https://picsum.photos/seed/channel12/1920/400",
        public_id: "banners/technews"
      },
      subscribers: 198000
    },
    {
      channelName: "Dev Talks",
      owner: users[12]._id,
      description: "Developer discussions and technology trends",
      channelBanner: {
        url: "https://picsum.photos/seed/channel13/1920/400",
        public_id: "banners/devtalks"
      },
      subscribers: 54000
    },
    {
      channelName: "Frontend Focus",
      owner: users[13]._id,
      description: "Modern frontend frameworks and UI/UX development",
      channelBanner: {
        url: "https://picsum.photos/seed/channel14/1920/400",
        public_id: "banners/frontendfocus"
      },
      subscribers: 112000
    },
    {
      channelName: "Design Lab",
      owner: users[14]._id,
      description: "Web design principles and responsive layouts",
      channelBanner: {
        url: "https://picsum.photos/seed/channel15/1920/400",
        public_id: "banners/designlab"
      },
      subscribers: 87000
    },
    {
      channelName: "Server Side",
      owner: users[15]._id,
      description: "Server-side programming and system architecture",
      channelBanner: {
        url: "https://picsum.photos/seed/channel16/1920/400",
        public_id: "banners/serverside"
      },
      subscribers: 63000
    }
  ];
};

// Function to create videos data (will use user and channel IDs)
const createVideosData = (users, channels) => {
  return [
    {
      title: "JavaScript Basics for Beginners",
      category: "JavaScript",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=640&h=360&fit=crop",
        public_id: "thumbnails/js-basics"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        public_id: "videos/js-basics"
      },
      description: "Learn JavaScript fundamentals from scratch. Perfect for beginners starting their coding journey.",
      uploader: users[0]._id,
      channel: channels[0]._id,
      views: 12500,
      likes: 980,
      dislikes: 22,
      createdAt: new Date("2024-01-10")
    },
    {
      title: "Advanced JavaScript Interview Questions",
      category: "JavaScript",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=640&h=360&fit=crop",
        public_id: "thumbnails/js-interview"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        public_id: "videos/js-interview"
      },
      description: "Most asked JavaScript interview questions with detailed explanations and solutions.",
      uploader: users[1]._id,
      channel: channels[1]._id,
      views: 23800,
      likes: 2100,
      dislikes: 54,
      createdAt: new Date("2024-02-15")
    },
    {
      title: "React Crash Course",
      category: "React",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop",
        public_id: "thumbnails/react-crash"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        public_id: "videos/react-crash"
      },
      description: "Build your first React app from scratch. Complete crash course for beginners.",
      uploader: users[2]._id,
      channel: channels[2]._id,
      views: 30500,
      likes: 2600,
      dislikes: 61,
      createdAt: new Date("2024-03-02")
    },
    {
      title: "React useEffect Explained",
      category: "React",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=640&h=360&fit=crop",
        public_id: "thumbnails/react-useeffect"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        public_id: "videos/react-useeffect"
      },
      description: "Deep dive into useEffect hook with practical examples and best practices.",
      uploader: users[2]._id,
      channel: channels[2]._id,
      views: 19800,
      likes: 1750,
      dislikes: 33,
      createdAt: new Date("2024-03-14")
    },
    {
      title: "Complete CSS Flexbox Guide",
      category: "CSS",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=640&h=360&fit=crop",
        public_id: "thumbnails/css-flexbox"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        public_id: "videos/css-flexbox"
      },
      description: "Master Flexbox layout system with real-world examples and projects.",
      uploader: users[3]._id,
      channel: channels[3]._id,
      views: 22100,
      likes: 1900,
      dislikes: 29,
      createdAt: new Date("2024-01-22")
    },
    {
      title: "CSS Grid in One Video",
      category: "CSS",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=640&h=360&fit=crop",
        public_id: "thumbnails/css-grid"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        public_id: "videos/css-grid"
      },
      description: "Learn CSS Grid visually with interactive examples and layouts.",
      uploader: users[3]._id,
      channel: channels[3]._id,
      views: 17450,
      likes: 1500,
      dislikes: 26,
      createdAt: new Date("2024-02-05")
    },
    {
      title: "Node.js Full Course",
      category: "Node.js",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=360&fit=crop",
        public_id: "thumbnails/nodejs-full"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        public_id: "videos/nodejs-full"
      },
      description: "Node.js from beginner to advanced. Complete backend development tutorial.",
      uploader: users[4]._id,
      channel: channels[4]._id,
      views: 34200,
      likes: 2950,
      dislikes: 88,
      createdAt: new Date("2024-03-20")
    },
    {
      title: "JWT Authentication in Node.js",
      category: "Node.js",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=640&h=360&fit=crop",
        public_id: "thumbnails/jwt-auth"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        public_id: "videos/jwt-auth"
      },
      description: "Secure authentication with JWT tokens. Build production-ready auth systems.",
      uploader: users[4]._id,
      channel: channels[4]._id,
      views: 18700,
      likes: 1620,
      dislikes: 41,
      createdAt: new Date("2024-04-01")
    },
    {
      title: "TypeScript Basics",
      category: "TypeScript",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=640&h=360&fit=crop",
        public_id: "thumbnails/ts-basics"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        public_id: "videos/ts-basics"
      },
      description: "Why and how to use TypeScript. Get started with static typing in JavaScript.",
      uploader: users[5]._id,
      channel: channels[5]._id,
      views: 14300,
      likes: 1100,
      dislikes: 24,
      createdAt: new Date("2024-02-28")
    },
    {
      title: "TypeScript for React Developers",
      category: "TypeScript",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1592609931095-54a2168ae893?w=640&h=360&fit=crop",
        public_id: "thumbnails/ts-react"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        public_id: "videos/ts-react"
      },
      description: "Improve React apps using TypeScript. Type-safe components and hooks.",
      uploader: users[5]._id,
      channel: channels[5]._id,
      views: 16500,
      likes: 1350,
      dislikes: 31,
      createdAt: new Date("2024-03-18")
    },
    {
      title: "Web Development Roadmap 2024",
      category: "Web Development",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=640&h=360&fit=crop",
        public_id: "thumbnails/webdev-roadmap"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
        public_id: "videos/webdev-roadmap"
      },
      description: "Complete guide to become a web developer in 2024. Frontend, backend, and full-stack paths.",
      uploader: users[6]._id,
      channel: channels[6]._id,
      views: 49500,
      likes: 5200,
      dislikes: 120,
      createdAt: new Date("2024-01-05")
    },
    {
      title: "HTML, CSS, JS Project",
      category: "Web Development",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=640&h=360&fit=crop",
        public_id: "thumbnails/html-css-js"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        public_id: "videos/html-css-js"
      },
      description: "Build real-world project using HTML, CSS, and JavaScript. Portfolio-ready project.",
      uploader: users[6]._id,
      channel: channels[6]._id,
      views: 27600,
      likes: 2100,
      dislikes: 56,
      createdAt: new Date("2024-02-12")
    },
    {
      title: "Build REST API with Express",
      category: "Tutorial",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=360&fit=crop",
        public_id: "thumbnails/rest-api"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
        public_id: "videos/rest-api"
      },
      description: "Create REST APIs using Express.js. Complete CRUD operations tutorial.",
      uploader: users[7]._id,
      channel: channels[7]._id,
      views: 18900,
      likes: 1550,
      dislikes: 39,
      createdAt: new Date("2024-03-08")
    },
    {
      title: "MongoDB Crash Course",
      category: "Tutorial",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=640&h=360&fit=crop",
        public_id: "thumbnails/mongodb"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        public_id: "videos/mongodb"
      },
      description: "Learn MongoDB fundamentals. Database design and queries for beginners.",
      uploader: users[7]._id,
      channel: channels[7]._id,
      views: 16800,
      likes: 1420,
      dislikes: 28,
      createdAt: new Date("2024-03-28")
    },
    {
      title: "Live MERN Project Build",
      category: "Live",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=640&h=360&fit=crop",
        public_id: "thumbnails/mern-live"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
        public_id: "videos/mern-live"
      },
      description: "Building a MERN stack app live with real-time coding and explanations.",
      uploader: users[8]._id,
      channel: channels[8]._id,
      views: 8200,
      likes: 690,
      dislikes: 18,
      createdAt: new Date("2024-04-10")
    },
    {
      title: "Live React Interview Q&A",
      category: "Live",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=640&h=360&fit=crop",
        public_id: "thumbnails/react-qa"
      },
      videoUrl: {
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        public_id: "videos/react-qa"
      },
      description: "Ask React doubts live. Interactive Q&A session with community.",
      uploader: users[8]._id,
      channel: channels[8]._id,
      views: 9100,
      likes: 770,
      dislikes: 21,
      createdAt: new Date("2024-04-22")
    },
    {
      title: "Lo-fi Music for Coding",
      category: "Music",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop",
        public_id: "thumbnails/lofi"
      },
      videoUrl: {
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        public_id: "videos/lofi"
      },
      description: "Relaxing coding music to boost productivity. 24/7 lo-fi beats.",
      uploader: users[9]._id,
      channel: channels[9]._id,
      views: 85200,
      likes: 7400,
      dislikes: 95,
      createdAt: new Date("2024-01-18")
    },
    {
      title: "Focus Music for Developers",
      category: "Music",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=640&h=360&fit=crop",
        public_id: "thumbnails/focus-music"
      },
      videoUrl: {
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        public_id: "videos/focus-music"
      },
      description: "Music to stay focused while coding. Deep work sessions soundtrack.",
      uploader: users[9]._id,
      channel: channels[9]._id,
      views: 67100,
      likes: 5800,
      dislikes: 83,
      createdAt: new Date("2024-02-08")
    },
    {
      title: "Top Gaming Moments 2024",
      category: "Gaming",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=360&fit=crop",
        public_id: "thumbnails/gaming-2024"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        public_id: "videos/gaming-2024"
      },
      description: "Best gaming highlights and epic moments from 2024.",
      uploader: users[10]._id,
      channel: channels[10]._id,
      views: 45200,
      likes: 3900,
      dislikes: 210,
      createdAt: new Date("2024-03-03")
    },
    {
      title: "GTA 5 Funny Clips",
      category: "Gaming",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&h=360&fit=crop",
        public_id: "thumbnails/gta5"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        public_id: "videos/gta5"
      },
      description: "Hilarious GTA moments and funny gameplay compilation.",
      uploader: users[10]._id,
      channel: channels[10]._id,
      views: 51000,
      likes: 4600,
      dislikes: 240,
      createdAt: new Date("2024-03-25")
    },
    {
      title: "Latest Tech News Today",
      category: "News",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=640&h=360&fit=crop",
        public_id: "thumbnails/tech-news"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        public_id: "videos/tech-news"
      },
      description: "Daily tech updates and breaking technology news.",
      uploader: users[11]._id,
      channel: channels[11]._id,
      views: 13200,
      likes: 980,
      dislikes: 19,
      createdAt: new Date("2024-04-05")
    },
    {
      title: "AI and Web Development News",
      category: "News",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop",
        public_id: "thumbnails/ai-web"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        public_id: "videos/ai-web"
      },
      description: "How AI is transforming web development. Latest trends and tools.",
      uploader: users[11]._id,
      channel: channels[11]._id,
      views: 15000,
      likes: 1200,
      dislikes: 27,
      createdAt: new Date("2024-04-18")
    },
    {
      title: "Async JS Patterns",
      category: "JavaScript",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop",
        public_id: "thumbnails/async-js"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        public_id: "videos/async-js"
      },
      description: "Practical async patterns: callbacks, promises, async/await explained.",
      uploader: users[0]._id,
      channel: channels[0]._id,
      views: 9800,
      likes: 820,
      dislikes: 14,
      createdAt: new Date("2024-05-02")
    },
    {
      title: "Modern JavaScript Tooling",
      category: "JavaScript",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&h=360&fit=crop",
        public_id: "thumbnails/js-tooling"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        public_id: "videos/js-tooling"
      },
      description: "Bundlers, linters and dev tools for modern JavaScript apps.",
      uploader: users[12]._id,
      channel: channels[12]._id,
      views: 7600,
      likes: 610,
      dislikes: 12,
      createdAt: new Date("2024-05-14")
    },
    {
      title: "React State Management with Redux",
      category: "React",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop",
        public_id: "thumbnails/redux"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        public_id: "videos/redux"
      },
      description: "Manage complex state in large React applications using Redux.",
      uploader: users[2]._id,
      channel: channels[2]._id,
      views: 21800,
      likes: 1800,
      dislikes: 45,
      createdAt: new Date("2024-05-20")
    },
    {
      title: "React Performance Optimization",
      category: "React",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=640&h=360&fit=crop",
        public_id: "thumbnails/react-perf"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        public_id: "videos/react-perf"
      },
      description: "Tips and techniques to make React apps faster and more efficient.",
      uploader: users[13]._id,
      channel: channels[13]._id,
      views: 12100,
      likes: 980,
      dislikes: 20,
      createdAt: new Date("2024-05-28")
    },
    {
      title: "Advanced CSS Animations",
      category: "CSS",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&h=360&fit=crop",
        public_id: "thumbnails/css-animations"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        public_id: "videos/css-animations"
      },
      description: "Create smooth, performant CSS animations and transitions.",
      uploader: users[3]._id,
      channel: channels[3]._id,
      views: 9400,
      likes: 770,
      dislikes: 11,
      createdAt: new Date("2024-06-03")
    },
    {
      title: "Responsive Design Best Practices",
      category: "CSS",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&h=360&fit=crop",
        public_id: "thumbnails/responsive"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        public_id: "videos/responsive"
      },
      description: "Design responsive layouts that scale beautifully across all devices.",
      uploader: users[14]._id,
      channel: channels[14]._id,
      views: 6800,
      likes: 520,
      dislikes: 9,
      createdAt: new Date("2024-06-11")
    },
    {
      title: "Scaling Node.js Applications",
      category: "Node.js",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=640&h=360&fit=crop",
        public_id: "thumbnails/nodejs-scaling"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
        public_id: "videos/nodejs-scaling"
      },
      description: "Strategies and patterns for scaling Node.js services in production.",
      uploader: users[4]._id,
      channel: channels[4]._id,
      views: 14200,
      likes: 1240,
      dislikes: 32,
      createdAt: new Date("2024-06-20")
    },
    {
      title: "Node.js Streams Explained",
      category: "Node.js",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=640&h=360&fit=crop",
        public_id: "thumbnails/nodejs-streams"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        public_id: "videos/nodejs-streams"
      },
      description: "Understanding Node.js streams for efficient file and data IO operations.",
      uploader: users[15]._id,
      channel: channels[15]._id,
      views: 5400,
      likes: 420,
      dislikes: 7,
      createdAt: new Date("2024-06-25")
    },
    {
      title: "TypeScript Generics Deep Dive",
      category: "TypeScript",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=640&h=360&fit=crop",
        public_id: "thumbnails/ts-generics"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
        public_id: "videos/ts-generics"
      },
      description: "Master TypeScript generics for writing type-safe, reusable code.",
      uploader: users[5]._id,
      channel: channels[5]._id,
      views: 6300,
      likes: 540,
      dislikes: 10,
      createdAt: new Date("2024-07-02")
    },
    {
      title: "Migrate JS to TypeScript",
      category: "TypeScript",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1593642532400-2682810df593?w=640&h=360&fit=crop",
        public_id: "thumbnails/js-to-ts"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        public_id: "videos/js-to-ts"
      },
      description: "Step-by-step guide to migrate a JavaScript/React codebase to TypeScript.",
      uploader: users[5]._id,
      channel: channels[5]._id,
      views: 7100,
      likes: 610,
      dislikes: 13,
      createdAt: new Date("2024-07-10")
    },
    {
      title: "Full-Stack Project: Frontend Focus",
      category: "Web Development",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&h=360&fit=crop",
        public_id: "thumbnails/fullstack-frontend"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
        public_id: "videos/fullstack-frontend"
      },
      description: "Integrating modern frontend features with backend REST APIs.",
      uploader: users[6]._id,
      channel: channels[6]._id,
      views: 12900,
      likes: 1120,
      dislikes: 28,
      createdAt: new Date("2024-07-18")
    },
    {
      title: "Progressive Web Apps Tutorial",
      category: "Web Development",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=640&h=360&fit=crop",
        public_id: "thumbnails/pwa"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        public_id: "videos/pwa"
      },
      description: "Make your web app installable and offline-ready with PWA features.",
      uploader: users[6]._id,
      channel: channels[6]._id,
      views: 8800,
      likes: 740,
      dislikes: 16,
      createdAt: new Date("2024-07-25")
    },
    {
      title: "Testing REST APIs (Tutorial)",
      category: "Tutorial",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=640&h=360&fit=crop",
        public_id: "thumbnails/api-testing"
      },
      videoUrl: {
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        public_id: "videos/api-testing"
      },
      description: "Automated testing strategies for your API endpoints using Jest and Supertest.",
      uploader: users[7]._id,
      channel: channels[7]._id,
      views: 5200,
      likes: 430,
      dislikes: 8,
      createdAt: new Date("2024-08-02")
    },
    {
      title: "Dockerizing Node Apps (Tutorial)",
      category: "Tutorial",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=640&h=360&fit=crop",
        public_id: "thumbnails/docker"
      },
      videoUrl: {
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        public_id: "videos/docker"
      },
      description: "Containerize and deploy Node.js applications with Docker and Docker Compose.",
      uploader: users[7]._id,
      channel: channels[7]._id,
      views: 7600,
      likes: 620,
      dislikes: 15,
      createdAt: new Date("2024-08-08")
    },
    {
      title: "Live Coding: Build Chat App",
      category: "Live",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&h=360&fit=crop",
        public_id: "thumbnails/chat-app"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        public_id: "videos/chat-app"
      },
      description: "Real-time chat application built live with Socket.io and React.",
      uploader: users[8]._id,
      channel: channels[8]._id,
      views: 10800,
      likes: 930,
      dislikes: 26,
      createdAt: new Date("2024-08-15")
    },
    {
      title: "Live Debugging Session",
      category: "Live",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=640&h=360&fit=crop",
        public_id: "thumbnails/debugging"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        public_id: "videos/debugging"
      },
      description: "Find and fix bugs live in a production web application.",
      uploader: users[8]._id,
      channel: channels[8]._id,
      views: 4700,
      likes: 380,
      dislikes: 6,
      createdAt: new Date("2024-08-22")
    },
    {
      title: "Synthwave Beats for Coding",
      category: "Music",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=640&h=360&fit=crop",
        public_id: "thumbnails/synthwave"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        public_id: "videos/synthwave"
      },
      description: "Upbeat synthwave music for focused and productive coding sessions.",
      uploader: users[9]._id,
      channel: channels[9]._id,
      views: 23400,
      likes: 2100,
      dislikes: 34,
      createdAt: new Date("2024-09-01")
    },
    {
      title: "Esports Tournament Highlights",
      category: "Gaming",
      thumbnailUrl: {
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop",
        public_id: "thumbnails/esports"
      },
      videoUrl: {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        public_id: "videos/esports"
      },
      description: "Top plays and highlights from recent esports tournaments and championships.",
      uploader: users[10]._id,
      channel: channels[10]._id,
      views: 19800,
      likes: 1600,
      dislikes: 75,
      createdAt: new Date("2024-09-10")
    }
  ];
};

// Main seed function
const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected Successfully");

    const SEED_TAG = 'SEED_DATA_2025';
    const seedEmails = usersData.map(u => u.email);

    // Check if seed data exists
    const existingSeedUsers = await User.find({ 
      $or: [
        { seedTag: SEED_TAG },
        { email: { $in: seedEmails } }
      ]
    });

    if (existingSeedUsers.length > 0) {
      console.log(`Found ${existingSeedUsers.length} seed users. Cleaning up...`);
      
      // Get seed user IDs FIRST (before deleting)
      const seedUserIds = existingSeedUsers.map(u => u._id);
      
      // Delete seed channels FIRST (before users are deleted)
      const deletedChannels = await Channel.deleteMany({ 
        $or: [
          { seedTag: SEED_TAG },
          { owner: { $in: seedUserIds } }
        ]
      });
      console.log(`Deleted ${deletedChannels.deletedCount} seed channels`);
      
      // Delete seed videos
      const deletedVideos = await Video.deleteMany({ 
        $or: [
          { seedTag: SEED_TAG },
          { uploader: { $in: seedUserIds } }
        ]
      });
      console.log(`Deleted ${deletedVideos.deletedCount} seed videos`);
      
      // Delete seed comments
      await Comment.deleteMany({ seedTag: SEED_TAG });
      console.log("Deleted seed comments");
      
      // Delete seed users LAST
      const deletedUsers = await User.deleteMany({ _id: { $in: seedUserIds } });
      console.log(`Deleted ${deletedUsers.deletedCount} seed users`);
      
      console.log("Cleanup completed! Now inserting fresh seed data...\n");
    }

    // 1. Hash passwords and Insert Users
    console.log("Hashing passwords and inserting users...");
    
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
          seedTag: SEED_TAG
        };
      })
    );
    
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`${users.length} users inserted with hashed passwords`);

    // 2. Create and Insert Channels
    console.log("Inserting channels...");
    const channelsData = createChannelsData(users).map(ch => ({
      ...ch,
      seedTag: SEED_TAG,
      subscriberList: []
    }));
    const channels = await Channel.insertMany(channelsData);
    console.log(`${channels.length} channels inserted`);

    // 3. Update users with their channel references
    console.log("Updating user-channel relationships...");
    for (let i = 0; i < users.length; i++) {
      users[i].channels.push(channels[i]._id);
      await users[i].save();
    }
    console.log("User-channel relationships updated");

    // 4. Create and Insert Videos
    console.log("Inserting videos...");
    const videosData = createVideosData(users, channels).map(v => ({
      ...v,
      seedTag: SEED_TAG
    }));
    const videos = await Video.insertMany(videosData);
    console.log(`${videos.length} videos inserted`);

    // 5. Update channels with their video references
    console.log("Updating channel-video relationships...");
    for (const video of videos) {
      const channel = channels.find(ch => ch._id.toString() === video.channel.toString());
      if (channel) {
        channel.videos.push(video._id);
        await channel.save();
      }
    }
    console.log("Channel-video relationships updated");

    console.log("\nDatabase seeded successfully!");
    console.log(`
        Summary:
        - Users: ${users.length}
        - Channels: ${channels.length}
        - Videos: ${videos.length}
    `);

  } catch (error) {
    console.error("Error seeding database:", error.message);
    console.error(error);
  } finally {
    process.exit();
  }
};

// Run the seed function
seedDatabase();