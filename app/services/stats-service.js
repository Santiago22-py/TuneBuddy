// Service to gather the statistics for the user activity

import { getLists } from "./list-service.js";
import { getAllSongs } from "./song-service";

//Function to get all songs from every list and gather the following statistics:
// -- Total number of songs
// -- Top Artists
// -- Top Albums

export async function getUserStats(userId) {
  //get all lists for the user
  const lists = await getLists(userId);

  //Initialize statistics variables
  let totalSongs = 0;
  const artistCount = {};
  const albumCount = {};

  //Loop through each list to gather song data
  for (const list of lists) {
    const songs = await getAllSongs(userId, list.id);
    totalSongs += songs.length;

    //get artist and album name
    songs.forEach((song) => {
      const artist = song.artist || "Unknown Artist"; //Handle missing artist names
      const album = song.album || "Unknown Album"; //Handle missing album names

      //Count occurrences of each artist
      artistCount[artist] = (artistCount[artist] || 0) + 1;

      //Count occurrences of each album
      const albumKey = `${album} by ${artist}`; //To differentiate albums with same name by different artists
      albumCount[albumKey] = (albumCount[albumKey] || 0) + 1;
    });
  }

  //Sort artists by count and get top 5
  //Convert artistCount object to array and sort
  const topArtists = Object.entries(artistCount)
    .map(([name, count]) => ({ name, count })) //Convert to array of objects
    .sort((a, b) => b.count - a.count) //Sort descending by count
    .slice(0, 5); //Get top 5 artists

  //Sort albums by count and get top 5
  //Also convert
  const topAlbums = Object.entries(albumCount)
    .sort((a, b) => b[1] - a[1]) //Sort descending by count
    .slice(0, 5) //Get top 5 albums
    .map(([key, count]) => {
      //Convert back to objects with album and artist separated
      const [album, artist] = key.split(" by ");
      return { album, artist, count }; //Return object with album, artist, and count
    });

  //Return the stats
  return {
    totalSongs,
    topArtists,
    topAlbums,
  };
}
