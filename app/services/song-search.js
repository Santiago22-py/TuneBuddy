//Function to search a song by title or artist using the itunes API
export async function searchSongs(query) {
  //If query is empty, return empty array
  if (!query || query.trim() === "") {
    return []; //Return empty array for empty query
  }

  //Construct the iTunes Search API URL (limit to 35 results)
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
    query
  )}&entity=song&limit=35`;

  //Fetch the data from the API
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch songs from iTunes API");
  }

  //If response is ok, parse the JSON data
  const data = await response.json();

  return data.results.map((item) => ({
    //Return the array of song results with relevant info
    id: item.trackId,
    title: item.trackName,
    artist: item.artistName,
    album: item.collectionName,
    artwork: item.artworkUrl100.replace("100x100bb", "300x300bb"), //Get higher res artwork
    previewUrl: item.previewUrl,
  }));
}
