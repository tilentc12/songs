export type Genre =
  | "pop"
  | "rock"
  | "hiphop"
  | "electronic"
  | "rnb"
  | "soundtrack"
  | "indie"
  | "latin";

export type Decade = "60s" | "70s" | "80s" | "90s" | "00s" | "10s" | "20s";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "impossible";

export interface CuratedTrackQuery {
  title: string;
  artist: string;
  genre: Genre;
  decade: Decade;
  difficulty: Difficulty;
  popularity: number; // 1 - 100
}

export const CURATED_LIST: CuratedTrackQuery[] = [
  // =========================================================================
  // 🌟 1. EASY (55 Tracks) - Mega-hits with 1B+ streams, modern chart monsters
  // =========================================================================
  { title: "Blinding Lights", artist: "The Weeknd", genre: "pop", decade: "10s", difficulty: "easy", popularity: 99 },
  { title: "Starboy", artist: "The Weeknd", genre: "pop", decade: "10s", difficulty: "easy", popularity: 98 },
  { title: "Can't Feel My Face", artist: "The Weeknd", genre: "pop", decade: "10s", difficulty: "easy", popularity: 95 },
  { title: "Save Your Tears", artist: "The Weeknd", genre: "pop", decade: "20s", difficulty: "easy", popularity: 97 },
  { title: "As It Was", artist: "Harry Styles", genre: "pop", decade: "20s", difficulty: "easy", popularity: 99 },
  { title: "Watermelon Sugar", artist: "Harry Styles", genre: "pop", decade: "20s", difficulty: "easy", popularity: 97 },
  { title: "Cruel Summer", artist: "Taylor Swift", genre: "pop", decade: "20s", difficulty: "easy", popularity: 99 },
  { title: "Blank Space", artist: "Taylor Swift", genre: "pop", decade: "10s", difficulty: "easy", popularity: 98 },
  { title: "Shake It Off", artist: "Taylor Swift", genre: "pop", decade: "10s", difficulty: "easy", popularity: 98 },
  { title: "Anti-Hero", artist: "Taylor Swift", genre: "pop", decade: "20s", difficulty: "easy", popularity: 97 },
  { title: "Love Story", artist: "Taylor Swift", genre: "pop", decade: "00s", difficulty: "easy", popularity: 96 },
  { title: "Bad Guy", artist: "Billie Eilish", genre: "pop", decade: "10s", difficulty: "easy", popularity: 98 },
  { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", genre: "pop", decade: "20s", difficulty: "easy", popularity: 99 },
  { title: "Lovely", artist: "Billie Eilish", genre: "pop", decade: "10s", difficulty: "easy", popularity: 97 },
  { title: "Espresso", artist: "Sabrina Carpenter", genre: "pop", decade: "20s", difficulty: "easy", popularity: 99 },
  { title: "Please Please Please", artist: "Sabrina Carpenter", genre: "pop", decade: "20s", difficulty: "easy", popularity: 97 },
  { title: "drivers license", artist: "Olivia Rodrigo", genre: "pop", decade: "20s", difficulty: "easy", popularity: 97 },
  { title: "good 4 u", artist: "Olivia Rodrigo", genre: "pop", decade: "20s", difficulty: "easy", popularity: 98 },
  { title: "vampire", artist: "Olivia Rodrigo", genre: "pop", decade: "20s", difficulty: "easy", popularity: 96 },
  { title: "Shape of You", artist: "Ed Sheeran", genre: "pop", decade: "10s", difficulty: "easy", popularity: 99 },
  { title: "Perfect", artist: "Ed Sheeran", genre: "pop", decade: "10s", difficulty: "easy", popularity: 98 },
  { title: "Thinking Out Loud", artist: "Ed Sheeran", genre: "pop", decade: "10s", difficulty: "easy", popularity: 97 },
  { title: "Bohemian Rhapsody", artist: "Queen", genre: "rock", decade: "70s", difficulty: "easy", popularity: 99 },
  { title: "We Will Rock You", artist: "Queen", genre: "rock", decade: "70s", difficulty: "easy", popularity: 98 },
  { title: "Another One Bites the Dust", artist: "Queen", genre: "rock", decade: "80s", difficulty: "easy", popularity: 97 },
  { title: "Billie Jean", artist: "Michael Jackson", genre: "pop", decade: "80s", difficulty: "easy", popularity: 99 },
  { title: "Beat It", artist: "Michael Jackson", genre: "pop", decade: "80s", difficulty: "easy", popularity: 97 },
  { title: "Thriller", artist: "Michael Jackson", genre: "pop", decade: "80s", difficulty: "easy", popularity: 98 },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "rock", decade: "90s", difficulty: "easy", popularity: 99 },
  { title: "In The End", artist: "Linkin Park", genre: "rock", decade: "00s", difficulty: "easy", popularity: 98 },
  { title: "Numb", artist: "Linkin Park", genre: "rock", decade: "00s", difficulty: "easy", popularity: 98 },
  { title: "Dancing Queen", artist: "ABBA", genre: "pop", decade: "70s", difficulty: "easy", popularity: 96 },
  { title: "Mamma Mia", artist: "ABBA", genre: "pop", decade: "70s", difficulty: "easy", popularity: 95 },
  { title: "Lose Yourself", artist: "Eminem", genre: "hiphop", decade: "00s", difficulty: "easy", popularity: 99 },
  { title: "Without Me", artist: "Eminem", genre: "hiphop", decade: "00s", difficulty: "easy", popularity: 97 },
  { title: "Sunflower", artist: "Post Malone", genre: "hiphop", decade: "10s", difficulty: "easy", popularity: 99 },
  { title: "Circles", artist: "Post Malone", genre: "pop", decade: "10s", difficulty: "easy", popularity: 98 },
  { title: "rockstar", artist: "Post Malone", genre: "hiphop", decade: "10s", difficulty: "easy", popularity: 97 },
  { title: "Levitating", artist: "Dua Lipa", genre: "pop", decade: "20s", difficulty: "easy", popularity: 98 },
  { title: "Don't Start Now", artist: "Dua Lipa", genre: "pop", decade: "10s", difficulty: "easy", popularity: 97 },
  { title: "Dance The Night", artist: "Dua Lipa", genre: "pop", decade: "20s", difficulty: "easy", popularity: 96 },
  { title: "Uptown Funk", artist: "Mark Ronson", genre: "pop", decade: "10s", difficulty: "easy", popularity: 98 },
  { title: "24K Magic", artist: "Bruno Mars", genre: "rnb", decade: "10s", difficulty: "easy", popularity: 96 },
  { title: "Locked Out of Heaven", artist: "Bruno Mars", genre: "pop", decade: "10s", difficulty: "easy", popularity: 97 },
  { title: "Just the Way You Are", artist: "Bruno Mars", genre: "pop", decade: "10s", difficulty: "easy", popularity: 97 },
  { title: "Rolling in the Deep", artist: "Adele", genre: "pop", decade: "10s", difficulty: "easy", popularity: 98 },
  { title: "Someone Like You", artist: "Adele", genre: "pop", decade: "10s", difficulty: "easy", popularity: 97 },
  { title: "Hello", artist: "Adele", genre: "pop", decade: "10s", difficulty: "easy", popularity: 97 },
  { title: "Flowers", artist: "Miley Cyrus", genre: "pop", decade: "20s", difficulty: "easy", popularity: 98 },
  { title: "Party in the U.S.A.", artist: "Miley Cyrus", genre: "pop", decade: "00s", difficulty: "easy", popularity: 97 },
  { title: "Wrecking Ball", artist: "Miley Cyrus", genre: "pop", decade: "10s", difficulty: "easy", popularity: 96 },
  { title: "Good Luck, Babe!", artist: "Chappell Roan", genre: "pop", decade: "20s", difficulty: "easy", popularity: 99 },
  { title: "Not Like Us", artist: "Kendrick Lamar", genre: "hiphop", decade: "20s", difficulty: "easy", popularity: 99 },
  { title: "HUMBLE.", artist: "Kendrick Lamar", genre: "hiphop", decade: "10s", difficulty: "easy", popularity: 98 },
  { title: "Mr. Brightside", artist: "The Killers", genre: "rock", decade: "00s", difficulty: "easy", popularity: 99 },

  // =========================================================================
  // 🔥 2. MEDIUM (55 Tracks) - Famous radio staples & 100M-500M streams
  // =========================================================================
  { title: "Viva La Vida", artist: "Coldplay", genre: "rock", decade: "00s", difficulty: "medium", popularity: 96 },
  { title: "The Scientist", artist: "Coldplay", genre: "rock", decade: "00s", difficulty: "medium", popularity: 95 },
  { title: "Yellow", artist: "Coldplay", genre: "rock", decade: "00s", difficulty: "medium", popularity: 96 },
  { title: "Fix You", artist: "Coldplay", genre: "rock", decade: "00s", difficulty: "medium", popularity: 94 },
  { title: "Clocks", artist: "Coldplay", genre: "rock", decade: "00s", difficulty: "medium", popularity: 93 },
  { title: "Poker Face", artist: "Lady Gaga", genre: "pop", decade: "00s", difficulty: "medium", popularity: 96 },
  { title: "Bad Romance", artist: "Lady Gaga", genre: "pop", decade: "00s", difficulty: "medium", popularity: 96 },
  { title: "Just Dance", artist: "Lady Gaga", genre: "pop", decade: "00s", difficulty: "medium", popularity: 94 },
  { title: "Shallow", artist: "Lady Gaga", genre: "pop", decade: "10s", difficulty: "medium", popularity: 96 },
  { title: "Born This Way", artist: "Lady Gaga", genre: "pop", decade: "10s", difficulty: "medium", popularity: 93 },
  { title: "...Baby One More Time", artist: "Britney Spears", genre: "pop", decade: "90s", difficulty: "medium", popularity: 95 },
  { title: "Toxic", artist: "Britney Spears", genre: "pop", decade: "00s", difficulty: "medium", popularity: 96 },
  { title: "Oops!... I Did It Again", artist: "Britney Spears", genre: "pop", decade: "00s", difficulty: "medium", popularity: 94 },
  { title: "Feel Good Inc.", artist: "Gorillaz", genre: "electronic", decade: "00s", difficulty: "medium", popularity: 96 },
  { title: "Clint Eastwood", artist: "Gorillaz", genre: "electronic", decade: "00s", difficulty: "medium", popularity: 93 },
  { title: "Hey Ya!", artist: "Outkast", genre: "hiphop", decade: "00s", difficulty: "medium", popularity: 96 },
  { title: "Ms. Jackson", artist: "Outkast", genre: "hiphop", decade: "00s", difficulty: "medium", popularity: 94 },
  { title: "Boulevard of Broken Dreams", artist: "Green Day", genre: "rock", decade: "00s", difficulty: "medium", popularity: 95 },
  { title: "Basket Case", artist: "Green Day", genre: "rock", decade: "90s", difficulty: "medium", popularity: 94 },
  { title: "American Idiot", artist: "Green Day", genre: "rock", decade: "00s", difficulty: "medium", popularity: 94 },
  { title: "Wake Me Up When September Ends", artist: "Green Day", genre: "rock", decade: "00s", difficulty: "medium", popularity: 93 },
  { title: "All The Small Things", artist: "Blink-182", genre: "rock", decade: "90s", difficulty: "medium", popularity: 94 },
  { title: "I Miss You", artist: "Blink-182", genre: "rock", decade: "00s", difficulty: "medium", popularity: 93 },
  { title: "What's My Age Again?", artist: "Blink-182", genre: "rock", decade: "90s", difficulty: "medium", popularity: 92 },
  { title: "Wake Me Up", artist: "Avicii", genre: "electronic", decade: "10s", difficulty: "medium", popularity: 97 },
  { title: "Levels", artist: "Avicii", genre: "electronic", decade: "10s", difficulty: "medium", popularity: 95 },
  { title: "The Nights", artist: "Avicii", genre: "electronic", decade: "10s", difficulty: "medium", popularity: 96 },
  { title: "Get Lucky", artist: "Daft Punk", genre: "electronic", decade: "10s", difficulty: "medium", popularity: 96 },
  { title: "One More Time", artist: "Daft Punk", genre: "electronic", decade: "00s", difficulty: "medium", popularity: 95 },
  { title: "Harder Better Faster Stronger", artist: "Daft Punk", genre: "electronic", decade: "00s", difficulty: "medium", popularity: 94 },
  { title: "Wonderwall", artist: "Oasis", genre: "rock", decade: "90s", difficulty: "medium", popularity: 96 },
  { title: "Don't Look Back in Anger", artist: "Oasis", genre: "rock", decade: "90s", difficulty: "medium", popularity: 95 },
  { title: "Kill Bill", artist: "SZA", genre: "rnb", decade: "20s", difficulty: "medium", popularity: 97 },
  { title: "Snooze", artist: "SZA", genre: "rnb", decade: "20s", difficulty: "medium", popularity: 96 },
  { title: "God's Plan", artist: "Drake", genre: "hiphop", decade: "10s", difficulty: "medium", popularity: 96 },
  { title: "Hotline Bling", artist: "Drake", genre: "hiphop", decade: "10s", difficulty: "medium", popularity: 95 },
  { title: "One Dance", artist: "Drake", genre: "hiphop", decade: "10s", difficulty: "medium", popularity: 97 },
  { title: "In My Feelings", artist: "Drake", genre: "hiphop", decade: "10s", difficulty: "medium", popularity: 94 },
  { title: "Paint The Town Red", artist: "Doja Cat", genre: "hiphop", decade: "20s", difficulty: "medium", popularity: 96 },
  { title: "Say So", artist: "Doja Cat", genre: "pop", decade: "20s", difficulty: "medium", popularity: 95 },
  { title: "Woman", artist: "Doja Cat", genre: "pop", decade: "20s", difficulty: "medium", popularity: 95 },
  { title: "Firework", artist: "Katy Perry", genre: "pop", decade: "10s", difficulty: "medium", popularity: 96 },
  { title: "Roar", artist: "Katy Perry", genre: "pop", decade: "10s", difficulty: "medium", popularity: 95 },
  { title: "California Gurls", artist: "Katy Perry", genre: "pop", decade: "10s", difficulty: "medium", popularity: 95 },
  { title: "Dark Horse", artist: "Katy Perry", genre: "pop", decade: "10s", difficulty: "medium", popularity: 95 },
  { title: "Hot N Cold", artist: "Katy Perry", genre: "pop", decade: "00s", difficulty: "medium", popularity: 94 },
  { title: "Umbrella", artist: "Rihanna", genre: "pop", decade: "00s", difficulty: "medium", popularity: 96 },
  { title: "Diamonds", artist: "Rihanna", genre: "pop", decade: "10s", difficulty: "medium", popularity: 96 },
  { title: "We Found Love", artist: "Rihanna", genre: "electronic", decade: "10s", difficulty: "medium", popularity: 96 },
  { title: "Stay", artist: "Rihanna", genre: "pop", decade: "10s", difficulty: "medium", popularity: 94 },
  { title: "Sugar", artist: "Maroon 5", genre: "pop", decade: "10s", difficulty: "medium", popularity: 96 },
  { title: "Moves Like Jagger", artist: "Maroon 5", genre: "pop", decade: "10s", difficulty: "medium", popularity: 95 },
  { title: "She Will Be Loved", artist: "Maroon 5", genre: "pop", decade: "00s", difficulty: "medium", popularity: 94 },
  { title: "Payphone", artist: "Maroon 5", genre: "pop", decade: "10s", difficulty: "medium", popularity: 94 },
  { title: "Seven Nation Army", artist: "The White Stripes", genre: "rock", decade: "00s", difficulty: "medium", popularity: 97 },

  // =========================================================================
  // ⚡ 3. HARD (55 Tracks) - 50M-150M streams, 70s/80s/90s classics
  // =========================================================================
  { title: "Everybody Wants to Rule the World", artist: "Tears for Fears", genre: "pop", decade: "80s", difficulty: "hard", popularity: 95 },
  { title: "Shout", artist: "Tears for Fears", genre: "pop", decade: "80s", difficulty: "hard", popularity: 90 },
  { title: "Head Over Heels", artist: "Tears for Fears", genre: "pop", decade: "80s", difficulty: "hard", popularity: 89 },
  { title: "Dreams", artist: "Fleetwood Mac", genre: "rock", decade: "70s", difficulty: "hard", popularity: 93 },
  { title: "Go Your Own Way", artist: "Fleetwood Mac", genre: "rock", decade: "70s", difficulty: "hard", popularity: 90 },
  { title: "The Chain", artist: "Fleetwood Mac", genre: "rock", decade: "70s", difficulty: "hard", popularity: 92 },
  { title: "Landslide", artist: "Fleetwood Mac", genre: "rock", decade: "70s", difficulty: "hard", popularity: 90 },
  { title: "Heroes", artist: "David Bowie", genre: "rock", decade: "70s", difficulty: "hard", popularity: 88 },
  { title: "Space Oddity", artist: "David Bowie", genre: "rock", decade: "60s", difficulty: "hard", popularity: 90 },
  { title: "Starman", artist: "David Bowie", genre: "rock", decade: "70s", difficulty: "hard", popularity: 91 },
  { title: "Let's Dance", artist: "David Bowie", genre: "pop", decade: "80s", difficulty: "hard", popularity: 89 },
  { title: "Every Breath You Take", artist: "The Police", genre: "rock", decade: "80s", difficulty: "hard", popularity: 95 },
  { title: "Roxanne", artist: "The Police", genre: "rock", decade: "70s", difficulty: "hard", popularity: 92 },
  { title: "Message in a Bottle", artist: "The Police", genre: "rock", decade: "70s", difficulty: "hard", popularity: 91 },
  { title: "Careless Whisper", artist: "George Michael", genre: "pop", decade: "80s", difficulty: "hard", popularity: 95 },
  { title: "Faith", artist: "George Michael", genre: "pop", decade: "80s", difficulty: "hard", popularity: 91 },
  { title: "Wake Me Up Before You Go-Go", artist: "Wham!", genre: "pop", decade: "80s", difficulty: "hard", popularity: 93 },
  { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", genre: "pop", decade: "80s", difficulty: "hard", popularity: 95 },
  { title: "I Will Always Love You", artist: "Whitney Houston", genre: "pop", decade: "90s", difficulty: "hard", popularity: 95 },
  { title: "How Will I Know", artist: "Whitney Houston", genre: "pop", decade: "80s", difficulty: "hard", popularity: 90 },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", genre: "rock", decade: "80s", difficulty: "hard", popularity: 95 },
  { title: "You Give Love a Bad Name", artist: "Bon Jovi", genre: "rock", decade: "80s", difficulty: "hard", popularity: 93 },
  { title: "It's My Life", artist: "Bon Jovi", genre: "rock", decade: "00s", difficulty: "hard", popularity: 94 },
  { title: "Don't Stop Believin'", artist: "Journey", genre: "rock", decade: "80s", difficulty: "hard", popularity: 95 },
  { title: "Separate Ways (Worlds Apart)", artist: "Journey", genre: "rock", decade: "80s", difficulty: "hard", popularity: 91 },
  { title: "Faithfully", artist: "Journey", genre: "rock", decade: "80s", difficulty: "hard", popularity: 89 },
  { title: "Highway to Hell", artist: "AC/DC", genre: "rock", decade: "70s", difficulty: "hard", popularity: 92 },
  { title: "Back in Black", artist: "AC/DC", genre: "rock", decade: "80s", difficulty: "hard", popularity: 94 },
  { title: "Thunderstruck", artist: "AC/DC", genre: "rock", decade: "90s", difficulty: "hard", popularity: 95 },
  { title: "You Shook Me All Night Long", artist: "AC/DC", genre: "rock", decade: "80s", difficulty: "hard", popularity: 92 },
  { title: "Creep", artist: "Radiohead", genre: "rock", decade: "90s", difficulty: "hard", popularity: 95 },
  { title: "Karma Police", artist: "Radiohead", genre: "rock", decade: "90s", difficulty: "hard", popularity: 91 },
  { title: "No Surprises", artist: "Radiohead", genre: "rock", decade: "90s", difficulty: "hard", popularity: 92 },
  { title: "Zombie", artist: "The Cranberries", genre: "rock", decade: "90s", difficulty: "hard", popularity: 94 },
  { title: "Linger", artist: "The Cranberries", genre: "rock", decade: "90s", difficulty: "hard", popularity: 93 },
  { title: "Californication", artist: "Red Hot Chili Peppers", genre: "rock", decade: "90s", difficulty: "hard", popularity: 94 },
  { title: "Under the Bridge", artist: "Red Hot Chili Peppers", genre: "rock", decade: "90s", difficulty: "hard", popularity: 92 },
  { title: "Can't Stop", artist: "Red Hot Chili Peppers", genre: "rock", decade: "00s", difficulty: "hard", popularity: 93 },
  { title: "Otherside", artist: "Red Hot Chili Peppers", genre: "rock", decade: "90s", difficulty: "hard", popularity: 92 },
  { title: "Take Me to Church", artist: "Hozier", genre: "rock", decade: "10s", difficulty: "hard", popularity: 96 },
  { title: "Too Sweet", artist: "Hozier", genre: "rock", decade: "20s", difficulty: "hard", popularity: 96 },
  { title: "No Scrubs", artist: "TLC", genre: "rnb", decade: "90s", difficulty: "hard", popularity: 94 },
  { title: "Waterfalls", artist: "TLC", genre: "rnb", decade: "90s", difficulty: "hard", popularity: 91 },
  { title: "Complicated", artist: "Avril Lavigne", genre: "pop", decade: "00s", difficulty: "hard", popularity: 93 },
  { title: "Sk8er Boi", artist: "Avril Lavigne", genre: "pop", decade: "00s", difficulty: "hard", popularity: 92 },
  { title: "I'm with You", artist: "Avril Lavigne", genre: "pop", decade: "00s", difficulty: "hard", popularity: 90 },
  { title: "Africa", artist: "TOTO", genre: "rock", decade: "80s", difficulty: "hard", popularity: 95 },
  { title: "Hotel California", artist: "Eagles", genre: "rock", decade: "70s", difficulty: "hard", popularity: 94 },
  { title: "Superstition", artist: "Stevie Wonder", genre: "rnb", decade: "70s", difficulty: "hard", popularity: 91 },
  { title: "Rocket Man", artist: "Elton John", genre: "pop", decade: "70s", difficulty: "hard", popularity: 92 },
  { title: "Tiny Dancer", artist: "Elton John", genre: "pop", decade: "70s", difficulty: "hard", popularity: 90 },
  { title: "Iris", artist: "Goo Goo Dolls", genre: "rock", decade: "90s", difficulty: "hard", popularity: 93 },
  { title: "Bitter Sweet Symphony", artist: "The Verve", genre: "rock", decade: "90s", difficulty: "hard", popularity: 91 },
  { title: "Welcome to the Black Parade", artist: "My Chemical Romance", genre: "rock", decade: "00s", difficulty: "hard", popularity: 93 },
  { title: "Riptide", artist: "Vance Joy", genre: "indie", decade: "10s", difficulty: "hard", popularity: 94 },

  // =========================================================================
  // 🎯 4. EXPERT (55 Tracks) - 10M-50M streams, deep cuts, cult rock/indie
  // =========================================================================
  { title: "Blue Monday", artist: "New Order", genre: "electronic", decade: "80s", difficulty: "expert", popularity: 88 },
  { title: "Bizarre Love Triangle", artist: "New Order", genre: "electronic", decade: "80s", difficulty: "expert", popularity: 85 },
  { title: "Age of Consent", artist: "New Order", genre: "rock", decade: "80s", difficulty: "expert", popularity: 86 },
  { title: "Sultans of Swing", artist: "Dire Straits", genre: "rock", decade: "70s", difficulty: "expert", popularity: 90 },
  { title: "Money for Nothing", artist: "Dire Straits", genre: "rock", decade: "80s", difficulty: "expert", popularity: 88 },
  { title: "More Than a Feeling", artist: "Boston", genre: "rock", decade: "70s", difficulty: "expert", popularity: 89 },
  { title: "Peace of Mind", artist: "Boston", genre: "rock", decade: "70s", difficulty: "expert", popularity: 83 },
  { title: "Carry on Wayward Son", artist: "Kansas", genre: "rock", decade: "70s", difficulty: "expert", popularity: 88 },
  { title: "Dust in the Wind", artist: "Kansas", genre: "rock", decade: "70s", difficulty: "expert", popularity: 86 },
  { title: "Smoke on the Water", artist: "Deep Purple", genre: "rock", decade: "70s", difficulty: "expert", popularity: 90 },
  { title: "Highway Star", artist: "Deep Purple", genre: "rock", decade: "70s", difficulty: "expert", popularity: 83 },
  { title: "September", artist: "Earth, Wind & Fire", genre: "rnb", decade: "70s", difficulty: "expert", popularity: 95 },
  { title: "Boogie Wonderland", artist: "Earth, Wind & Fire", genre: "rnb", decade: "70s", difficulty: "expert", popularity: 87 },
  { title: "Let's Groove", artist: "Earth, Wind & Fire", genre: "rnb", decade: "80s", difficulty: "expert", popularity: 90 },
  { title: "Stayin' Alive", artist: "Bee Gees", genre: "pop", decade: "70s", difficulty: "expert", popularity: 93 },
  { title: "Night Fever", artist: "Bee Gees", genre: "pop", decade: "70s", difficulty: "expert", popularity: 88 },
  { title: "How Deep Is Your Love", artist: "Bee Gees", genre: "pop", decade: "70s", difficulty: "expert", popularity: 90 },
  { title: "Chop Suey!", artist: "System of a Down", genre: "rock", decade: "00s", difficulty: "expert", popularity: 94 },
  { title: "Toxicity", artist: "System of a Down", genre: "rock", decade: "00s", difficulty: "expert", popularity: 93 },
  { title: "Aerials", artist: "System of a Down", genre: "rock", decade: "00s", difficulty: "expert", popularity: 89 },
  { title: "Bring Me To Life", artist: "Evanescence", genre: "rock", decade: "00s", difficulty: "expert", popularity: 94 },
  { title: "Going Under", artist: "Evanescence", genre: "rock", decade: "00s", difficulty: "expert", popularity: 88 },
  { title: "My Immortal", artist: "Evanescence", genre: "rock", decade: "00s", difficulty: "expert", popularity: 92 },
  { title: "Yeah!", artist: "Usher", genre: "rnb", decade: "00s", difficulty: "expert", popularity: 95 },
  { title: "Burn", artist: "Usher", genre: "rnb", decade: "00s", difficulty: "expert", popularity: 89 },
  { title: "Confessions Part II", artist: "Usher", genre: "rnb", decade: "00s", difficulty: "expert", popularity: 88 },
  { title: "In Da Club", artist: "50 Cent", genre: "hiphop", decade: "00s", difficulty: "expert", popularity: 95 },
  { title: "Candy Shop", artist: "50 Cent", genre: "hiphop", decade: "00s", difficulty: "expert", popularity: 93 },
  { title: "21 Questions", artist: "50 Cent", genre: "hiphop", decade: "00s", difficulty: "expert", popularity: 91 },
  { title: "Stressed Out", artist: "twenty one pilots", genre: "rock", decade: "10s", difficulty: "expert", popularity: 95 },
  { title: "Ride", artist: "twenty one pilots", genre: "rock", decade: "10s", difficulty: "expert", popularity: 93 },
  { title: "Heathens", artist: "twenty one pilots", genre: "rock", decade: "10s", difficulty: "expert", popularity: 93 },
  { title: "Car Radio", artist: "twenty one pilots", genre: "rock", decade: "10s", difficulty: "expert", popularity: 88 },
  { title: "Love Will Tear Us Apart", artist: "Joy Division", genre: "rock", decade: "80s", difficulty: "expert", popularity: 86 },
  { title: "Disorder", artist: "Joy Division", genre: "rock", decade: "70s", difficulty: "expert", popularity: 85 },
  { title: "Boys Don't Cry", artist: "The Cure", genre: "rock", decade: "70s", difficulty: "expert", popularity: 87 },
  { title: "Friday I'm in Love", artist: "The Cure", genre: "rock", decade: "90s", difficulty: "expert", popularity: 91 },
  { title: "Just Like Heaven", artist: "The Cure", genre: "rock", decade: "80s", difficulty: "expert", popularity: 90 },
  { title: "Enjoy the Silence", artist: "Depeche Mode", genre: "electronic", decade: "90s", difficulty: "expert", popularity: 89 },
  { title: "Personal Jesus", artist: "Depeche Mode", genre: "electronic", decade: "80s", difficulty: "expert", popularity: 90 },
  { title: "Just Can't Get Enough", artist: "Depeche Mode", genre: "electronic", decade: "80s", difficulty: "expert", popularity: 88 },
  { title: "This Charming Man", artist: "The Smiths", genre: "rock", decade: "80s", difficulty: "expert", popularity: 87 },
  { title: "There Is a Light That Never Goes Out", artist: "The Smiths", genre: "rock", decade: "80s", difficulty: "expert", popularity: 91 },
  { title: "Heart of Glass", artist: "Blondie", genre: "pop", decade: "70s", difficulty: "expert", popularity: 88 },
  { title: "Call Me", artist: "Blondie", genre: "rock", decade: "80s", difficulty: "expert", popularity: 89 },
  { title: "Last Nite", artist: "The Strokes", genre: "indie", decade: "00s", difficulty: "expert", popularity: 90 },
  { title: "Reptilia", artist: "The Strokes", genre: "indie", decade: "00s", difficulty: "expert", popularity: 91 },
  { title: "505", artist: "Arctic Monkeys", genre: "indie", decade: "00s", difficulty: "expert", popularity: 94 },
  { title: "R U Mine?", artist: "Arctic Monkeys", genre: "rock", decade: "10s", difficulty: "expert", popularity: 93 },
  { title: "Where Is My Mind?", artist: "Pixies", genre: "indie", decade: "80s", difficulty: "expert", popularity: 92 },
  { title: "Kids", artist: "MGMT", genre: "electronic", decade: "00s", difficulty: "expert", popularity: 91 },
  { title: "Electric Feel", artist: "MGMT", genre: "electronic", decade: "00s", difficulty: "expert", popularity: 92 },
  { title: "Pink Pony Club", artist: "Chappell Roan", genre: "pop", decade: "20s", difficulty: "expert", popularity: 94 },
  { title: "A Bar Song (Tipsy)", artist: "Shaboozey", genre: "pop", decade: "20s", difficulty: "expert", popularity: 97 },
  { title: "My Name Is", artist: "Eminem", genre: "hiphop", decade: "90s", difficulty: "expert", popularity: 93 },

  // =========================================================================
  // 💀 5. IMPOSSIBLE (55 Tracks) - Obscure intros, vintage 60s/70s, soundtracks
  // =========================================================================
  { title: "Megalovania", artist: "Toby Fox", genre: "soundtrack", decade: "10s", difficulty: "impossible", popularity: 95 },
  { title: "Time", artist: "Hans Zimmer", genre: "soundtrack", decade: "10s", difficulty: "impossible", popularity: 93 },
  { title: "Cornfield Chase", artist: "Hans Zimmer", genre: "soundtrack", decade: "10s", difficulty: "impossible", popularity: 94 },
  { title: "He's a Pirate", artist: "Hans Zimmer", genre: "soundtrack", decade: "00s", difficulty: "impossible", popularity: 95 },
  { title: "Sweden", artist: "C418", genre: "soundtrack", decade: "10s", difficulty: "impossible", popularity: 94 },
  { title: "Wet Hands", artist: "C418", genre: "soundtrack", decade: "10s", difficulty: "impossible", popularity: 92 },
  { title: "Subwoofer Lullaby", artist: "C418", genre: "soundtrack", decade: "10s", difficulty: "impossible", popularity: 90 },
  { title: "Super Mario Bros Theme", artist: "Koji Kondo", genre: "soundtrack", decade: "80s", difficulty: "impossible", popularity: 96 },
  { title: "The Legend of Zelda Main Theme", artist: "Koji Kondo", genre: "soundtrack", decade: "80s", difficulty: "impossible", popularity: 95 },
  { title: "Gerudo Valley", artist: "Koji Kondo", genre: "soundtrack", decade: "90s", difficulty: "impossible", popularity: 91 },
  { title: "Tetris Theme (Korobeiniki)", artist: "Hirokazu Tanaka", genre: "soundtrack", decade: "80s", difficulty: "impossible", popularity: 95 },
  { title: "The Imperial March", artist: "John Williams", genre: "soundtrack", decade: "80s", difficulty: "impossible", popularity: 97 },
  { title: "Star Wars Main Title", artist: "John Williams", genre: "soundtrack", decade: "70s", difficulty: "impossible", popularity: 96 },
  { title: "Hedwig's Theme", artist: "John Williams", genre: "soundtrack", decade: "00s", difficulty: "impossible", popularity: 96 },
  { title: "Jurassic Park Theme", artist: "John Williams", genre: "soundtrack", decade: "90s", difficulty: "impossible", popularity: 94 },
  { title: "Concerning Hobbits", artist: "Howard Shore", genre: "soundtrack", decade: "00s", difficulty: "impossible", popularity: 93 },
  { title: "Do It Again", artist: "Steely Dan", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 84 },
  { title: "Reelin' in the Years", artist: "Steely Dan", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 85 },
  { title: "Rikki Don't Lose That Number", artist: "Steely Dan", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 82 },
  { title: "Peg", artist: "Steely Dan", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 83 },
  { title: "Psycho Killer", artist: "Talking Heads", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 88 },
  { title: "Once in a Lifetime", artist: "Talking Heads", genre: "rock", decade: "80s", difficulty: "impossible", popularity: 89 },
  { title: "Burning Down the House", artist: "Talking Heads", genre: "rock", decade: "80s", difficulty: "impossible", popularity: 87 },
  { title: "This Must Be the Place", artist: "Talking Heads", genre: "rock", decade: "80s", difficulty: "impossible", popularity: 91 },
  { title: "(Don't Fear) The Reaper", artist: "Blue Öyster Cult", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 89 },
  { title: "Burnin' for You", artist: "Blue Öyster Cult", genre: "rock", decade: "80s", difficulty: "impossible", popularity: 84 },
  { title: "Godzilla", artist: "Blue Öyster Cult", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 82 },
  { title: "Fortunate Son", artist: "Creedence Clearwater Revival", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 92 },
  { title: "Bad Moon Rising", artist: "Creedence Clearwater Revival", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 91 },
  { title: "Have You Ever Seen the Rain", artist: "Creedence Clearwater Revival", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 93 },
  { title: "Proud Mary", artist: "Creedence Clearwater Revival", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 89 },
  { title: "Purple Haze", artist: "Jimi Hendrix", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 90 },
  { title: "All Along the Watchtower", artist: "Jimi Hendrix", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 92 },
  { title: "Voodoo Child (Slight Return)", artist: "Jimi Hendrix", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 88 },
  { title: "Hey Joe", artist: "Jimi Hendrix", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 89 },
  { title: "Riders on the Storm", artist: "The Doors", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 88 },
  { title: "Light My Fire", artist: "The Doors", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 89 },
  { title: "Break On Through (To the Other Side)", artist: "The Doors", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 86 },
  { title: "Sunday Morning", artist: "The Velvet Underground", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 84 },
  { title: "Venus in Furs", artist: "The Velvet Underground", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 82 },
  { title: "21st Century Schizoid Man", artist: "King Crimson", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 83 },
  { title: "In the Court of the Crimson King", artist: "King Crimson", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 81 },
  { title: "Time", artist: "Pink Floyd", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 91 },
  { title: "Comfortably Numb", artist: "Pink Floyd", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 93 },
  { title: "Money", artist: "Pink Floyd", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 90 },
  { title: "Wish You Were Here", artist: "Pink Floyd", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 92 },
  { title: "The Good, the Bad and the Ugly", artist: "Ennio Morricone", genre: "soundtrack", decade: "60s", difficulty: "impossible", popularity: 92 },
  { title: "The Ecstasy of Gold", artist: "Ennio Morricone", genre: "soundtrack", decade: "60s", difficulty: "impossible", popularity: 91 },
  { title: "Chariots of Fire", artist: "Vangelis", genre: "soundtrack", decade: "80s", difficulty: "impossible", popularity: 89 },
  { title: "Married Life", artist: "Michael Giacchino", genre: "soundtrack", decade: "00s", difficulty: "impossible", popularity: 93 },
  { title: "The Last of Us Theme", artist: "Gustavo Santaolalla", genre: "soundtrack", decade: "10s", difficulty: "impossible", popularity: 90 },
  { title: "Halo Theme Mjolnir Mix", artist: "Martin O'Donnell & Michael Salvatori", genre: "soundtrack", decade: "00s", difficulty: "impossible", popularity: 89 },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 94 },
  { title: "Kashmir", artist: "Led Zeppelin", genre: "rock", decade: "70s", difficulty: "impossible", popularity: 89 },
  { title: "House of the Rising Sun", artist: "The Animals", genre: "rock", decade: "60s", difficulty: "impossible", popularity: 91 },
];

interface ITunesTrackResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  previewUrl: string;
  artworkUrl100: string;
  releaseDate: string;
  primaryGenreName?: string;
  trackExplicitness?: string;
}

export async function fetchTrackFromITunes(query: CuratedTrackQuery): Promise<any | null> {
  const searchTerm = encodeURIComponent(`${query.artist} ${query.title}`);
  const url = `https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=5`;

  try {
    const res = await fetch(url, { headers: { "User-Agent": "BetterGuessableCatalog/1.0" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const match = data.results.find((t: ITunesTrackResult) => t.previewUrl && t.artworkUrl100);
    if (!match) return null;

    const highResArtwork = match.artworkUrl100.replace("100x100bb.jpg", "600x600bb.jpg");
    const year = match.releaseDate ? new Date(match.releaseDate).getFullYear() : 2000;

    return {
      title: query.title,
      artist: query.artist,
      album: match.collectionName || query.title,
      releaseYear: isNaN(year) ? 2000 : year,
      genre: query.genre,
      decade: query.decade,
      difficulty: query.difficulty,
      popularity: query.popularity,
      previewUrl: match.previewUrl,
      coverUrl: highResArtwork,
      appleUrl: `https://music.apple.com/song/${match.trackId}`,
      isExplicit: match.trackExplicitness === "explicit",
    };
  } catch (err) {
    console.warn(`Failed to fetch iTunes for ${query.title} - ${query.artist}:`, err);
    return null;
  }
}
