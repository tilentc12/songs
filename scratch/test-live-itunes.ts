async function testLiveITunesSearch() {
  const query = "Queen Bohemian Rhapsody";
  const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=3`);
  const data = await res.json();
  const track = data.results[0];
  console.log("Found:", track.trackName, "by", track.artistName);
  console.log("Live Preview URL:", track.previewUrl);

  const audioRes = await fetch(track.previewUrl);
  console.log("Live Audio Fetch Status:", audioRes.status, audioRes.statusText);
  console.log("Content-Type:", audioRes.headers.get("content-type"));
  console.log("Content-Length:", audioRes.headers.get("content-length"));
}

testLiveITunesSearch();
