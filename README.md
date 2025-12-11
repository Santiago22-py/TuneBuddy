# 🎵 Tune Buddy

Tune Buddy is a modern song-tracking web app built for the **CPRG 306 – Web Development II** course at SAIT.  
Tune Buddy was developed with a simple goal in mind, providing users with a platform-independent way for users to organize and track their song collections



## 🌟 About the Project

Music enthusiasts have a few pain points:

- Forgetting songs they've been on recently 
- Losing track of tracks unavailable on their chosen streaming platform  
- Not having a central place to store songs/albums they physically own  

**Tune Buddy aims to solves that.**

The app allows users to:

- Build custom lists (e.g., *Metal Favorites*, *90s Hip-Hop*, *Songs I Found in 2025*)  
- Search for tracks using the iTunes API  
- Keep a personal music library that is **independent** of any streaming service  
- View statistics about their music tastes, such as top artists and albums  

Tune Buddy was designed with **real** pain points in mind, as per the empathy map.



## 🚀 Features

### 👤 User Profile
- Custom avatar upload  
- Custom username  
- “About Me” bio section  

### 🎶 Music Lists
- Create as many lists as you want  
- Add songs from the search system  
- Organized UI for browsing and managing lists  

### 🔍 Song Search
- Search using the iTunes API for millions of songs  
- Add results straight into your lists  
- Listen to a preview of each song straight from the browser  

### 📊 Personal Statistics
- Top artists based on your added songs  
- Top albums  
- Total song count  
- Automatically updated as you add/remove songs  



## 🛠️ Technology Stack

This is a **frontend-focused** project using modern web tools:

| Category | Technology |
|---------|------------|
| Frontend | **Next.js** |
| Styling | **TailwindCSS** |
| Authentication | **Firebase Auth** |
| Database | **Firestore** |
| File Storage | ***Firebase Storage** |
| External API | **iTunes Search API** |

*Firebase Storage is used to store the users profile pics



## 📚 Project Purpose

This project aims to demonstrated the practical use of everything we have learned so far in the course, as well as things we had to do some additional learning on:

- React & Next.js development
- Dynamic Routing (Slug-based routing)
- API integration  
- Authentication flows  
- Database design with Firestore  
- Cloud file storage for avatars (buckets) 
- Responsive UI with TailwindCSS  
- State management using React hooks and context  
