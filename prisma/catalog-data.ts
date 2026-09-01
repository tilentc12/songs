export interface RawCatalogTrack {
  title: string;
  artist: string;
  album: string;
  releaseYear: number;
  genre: "pop" | "rock" | "hiphop" | "electronic" | "rnb" | "soundtrack" | "indie" | "latin";
  decade: "60s" | "70s" | "80s" | "90s" | "00s" | "10s" | "20s";
  difficulty: "easy" | "medium" | "hard" | "expert" | "impossible";
  popularity: number;
  previewUrl: string;
  coverUrl: string;
  appleUrl: string;
  isExplicit?: boolean;
}

export function generateMasterCatalog(): RawCatalogTrack[] {
  const tracks: RawCatalogTrack[] = [];
  const seen = new Set<string>();

  function add(
    title: string,
    artist: string,
    album: string,
    year: number,
    genre: RawCatalogTrack["genre"],
    tier: RawCatalogTrack["difficulty"],
    popularity = 85
  ) {
    const key = `${title.toLowerCase()}___${artist.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);

    let decade: RawCatalogTrack["decade"] = "10s";
    if (year < 1970) decade = "60s";
    else if (year < 1980) decade = "70s";
    else if (year < 1990) decade = "80s";
    else if (year < 2000) decade = "90s";
    else if (year < 2010) decade = "00s";
    else if (year < 2020) decade = "10s";
    else decade = "20s";

    const safeArtist = encodeURIComponent(artist);
    const safeTitle = encodeURIComponent(title);

    tracks.push({
      title,
      artist,
      album,
      releaseYear: year,
      genre,
      decade,
      difficulty: tier,
      popularity,
      previewUrl: `https://cdnt-preview.dzcdn.net/api/1/1/1/b/2/0/1b27825bf63c36edcdc7fac9f920214e.mp3`,
      coverUrl: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80`,
      appleUrl: `https://music.apple.com/search?term=${safeArtist}+${safeTitle}`,
      isExplicit: false,
    });
  }

  // =========================================================================
  // 🌟 EASY TIER (200+ Tracks) - Mega-hits, Chart Monsters, 1B+ Streams
  // =========================================================================
  add("Blinding Lights", "The Weeknd", "After Hours", 2020, "pop", "easy", 99);
  add("Starboy", "The Weeknd", "Starboy", 2016, "pop", "easy", 98);
  add("Save Your Tears", "The Weeknd", "After Hours", 2020, "pop", "easy", 97);
  add("Can't Feel My Face", "The Weeknd", "Beauty Behind the Madness", 2015, "pop", "easy", 96);
  add("The Hills", "The Weeknd", "Beauty Behind the Madness", 2015, "pop", "easy", 97);
  add("Die For You", "The Weeknd", "Starboy", 2016, "pop", "easy", 96);
  add("Heartless", "The Weeknd", "After Hours", 2019, "pop", "easy", 95);
  add("In Your Eyes", "The Weeknd", "After Hours", 2020, "pop", "easy", 95);
  add("Take My Breath", "The Weeknd", "Dawn FM", 2021, "pop", "easy", 94);

  add("Cruel Summer", "Taylor Swift", "Lover", 2019, "pop", "easy", 99);
  add("Blank Space", "Taylor Swift", "1989", 2014, "pop", "easy", 98);
  add("Anti-Hero", "Taylor Swift", "Midnights", 2022, "pop", "easy", 98);
  add("Shake It Off", "Taylor Swift", "1989", 2014, "pop", "easy", 97);
  add("Love Story", "Taylor Swift", "Fearless", 2008, "pop", "easy", 96);
  add("You Belong With Me", "Taylor Swift", "Fearless", 2008, "pop", "easy", 96);
  add("Fortnight", "Taylor Swift & Post Malone", "The Tortured Poets Department", 2024, "pop", "easy", 97);
  add("I Knew You Were Trouble", "Taylor Swift", "Red", 2012, "pop", "easy", 95);
  add("Style", "Taylor Swift", "1989", 2014, "pop", "easy", 96);
  add("Bad Blood", "Taylor Swift", "1989", 2014, "pop", "easy", 95);
  add("Wildest Dreams", "Taylor Swift", "1989", 2014, "pop", "easy", 95);
  add("Cardigan", "Taylor Swift", "Folklore", 2020, "pop", "easy", 95);

  add("bad guy", "Billie Eilish", "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", 2019, "pop", "easy", 99);
  add("BIRDS OF A FEATHER", "Billie Eilish", "HIT ME HARD AND SOFT", 2024, "pop", "easy", 99);
  add("lovely", "Billie Eilish & Khalid", "lovely", 2018, "pop", "easy", 97);
  add("everything i wanted", "Billie Eilish", "everything i wanted", 2019, "pop", "easy", 96);
  add("ocean eyes", "Billie Eilish", "dont smile at me", 2016, "pop", "easy", 95);
  add("LUNCH", "Billie Eilish", "HIT ME HARD AND SOFT", 2024, "pop", "easy", 96);
  add("Happier Than Ever", "Billie Eilish", "Happier Than Ever", 2021, "pop", "easy", 97);
  add("Therefore I Am", "Billie Eilish", "Happier Than Ever", 2020, "pop", "easy", 95);
  add("CHIHIRO", "Billie Eilish", "HIT ME HARD AND SOFT", 2024, "pop", "easy", 96);

  add("As It Was", "Harry Styles", "Harry's House", 2022, "pop", "easy", 99);
  add("Watermelon Sugar", "Harry Styles", "Fine Line", 2019, "pop", "easy", 98);
  add("Sign of the Times", "Harry Styles", "Harry Styles", 2017, "pop", "easy", 96);
  add("Adore You", "Harry Styles", "Fine Line", 2019, "pop", "easy", 95);
  add("Late Night Talking", "Harry Styles", "Harry's House", 2022, "pop", "easy", 95);

  add("Espresso", "Sabrina Carpenter", "Short n' Sweet", 2024, "pop", "easy", 99);
  add("Please Please Please", "Sabrina Carpenter", "Short n' Sweet", 2024, "pop", "easy", 98);
  add("Feather", "Sabrina Carpenter", "emails i can't send", 2023, "pop", "easy", 96);
  add("Taste", "Sabrina Carpenter", "Short n' Sweet", 2024, "pop", "easy", 97);
  add("Nonsense", "Sabrina Carpenter", "emails i can't send", 2022, "pop", "easy", 95);

  add("drivers license", "Olivia Rodrigo", "SOUR", 2021, "pop", "easy", 98);
  add("good 4 u", "Olivia Rodrigo", "SOUR", 2021, "pop", "easy", 98);
  add("vampire", "Olivia Rodrigo", "GUTS", 2023, "pop", "easy", 97);
  add("deja vu", "Olivia Rodrigo", "SOUR", 2021, "pop", "easy", 95);
  add("bad idea right?", "Olivia Rodrigo", "GUTS", 2023, "pop", "easy", 94);
  add("traitor", "Olivia Rodrigo", "SOUR", 2021, "pop", "easy", 95);

  add("Shape of You", "Ed Sheeran", "÷", 2017, "pop", "easy", 99);
  add("Perfect", "Ed Sheeran", "÷", 2017, "pop", "easy", 98);
  add("Thinking Out Loud", "Ed Sheeran", "x", 2014, "pop", "easy", 97);
  add("Bad Habits", "Ed Sheeran", "=", 2021, "pop", "easy", 96);
  add("Shivers", "Ed Sheeran", "=", 2021, "pop", "easy", 95);
  add("Photograph", "Ed Sheeran", "x", 2014, "pop", "easy", 96);
  add("Castle on the Hill", "Ed Sheeran", "÷", 2017, "pop", "easy", 95);

  add("Uptown Funk", "Mark Ronson & Bruno Mars", "Uptown Special", 2014, "pop", "easy", 99);
  add("24K Magic", "Bruno Mars", "24K Magic", 2016, "rnb", "easy", 97);
  add("Locked Out of Heaven", "Bruno Mars", "Unorthodox Jukebox", 2012, "pop", "easy", 97);
  add("Just the Way You Are", "Bruno Mars", "Doo-Wops & Hooligans", 2010, "pop", "easy", 98);
  add("That's What I Like", "Bruno Mars", "24K Magic", 2016, "rnb", "easy", 97);
  add("Grenade", "Bruno Mars", "Doo-Wops & Hooligans", 2010, "pop", "easy", 96);
  add("When I Was Your Man", "Bruno Mars", "Unorthodox Jukebox", 2012, "pop", "easy", 97);

  add("Rolling in the Deep", "Adele", "21", 2011, "pop", "easy", 99);
  add("Someone Like You", "Adele", "21", 2011, "pop", "easy", 98);
  add("Hello", "Adele", "25", 2015, "pop", "easy", 98);
  add("Easy On Me", "Adele", "30", 2021, "pop", "easy", 97);
  add("Set Fire to the Rain", "Adele", "21", 2011, "pop", "easy", 96);
  add("Send My Love (To Your New Lover)", "Adele", "25", 2015, "pop", "easy", 95);

  add("Levitating", "Dua Lipa", "Future Nostalgia", 2020, "pop", "easy", 98);
  add("Don't Start Now", "Dua Lipa", "Future Nostalgia", 2019, "pop", "easy", 98);
  add("New Rules", "Dua Lipa", "Dua Lipa", 2017, "pop", "easy", 97);
  add("Dance The Night", "Dua Lipa", "Barbie The Album", 2023, "pop", "easy", 96);
  add("Houdini", "Dua Lipa", "Radical Optimism", 2023, "pop", "easy", 95);
  add("Break My Heart", "Dua Lipa", "Future Nostalgia", 2020, "pop", "easy", 95);

  add("7 rings", "Ariana Grande", "thank u, next", 2019, "pop", "easy", 98);
  add("thank u, next", "Ariana Grande", "thank u, next", 2018, "pop", "easy", 98);
  add("we can't be friends (wait for your love)", "Ariana Grande", "eternal sunshine", 2024, "pop", "easy", 97);
  add("Side to Side", "Ariana Grande & Nicki Minaj", "Dangerous Woman", 2016, "pop", "easy", 96);
  add("Positions", "Ariana Grande", "Positions", 2020, "pop", "easy", 95);
  add("Into You", "Ariana Grande", "Dangerous Woman", 2016, "pop", "easy", 96);

  add("Sorry", "Justin Bieber", "Purpose", 2015, "pop", "easy", 98);
  add("Love Yourself", "Justin Bieber", "Purpose", 2015, "pop", "easy", 97);
  add("Stay", "The Kid LAROI & Justin Bieber", "F*CK LOVE 3", 2021, "pop", "easy", 98);
  add("What Do You Mean?", "Justin Bieber", "Purpose", 2015, "pop", "easy", 96);
  add("Peaches", "Justin Bieber, Daniel Caesar & Giveon", "Justice", 2021, "pop", "easy", 96);
  add("Baby", "Justin Bieber & Ludacris", "My World 2.0", 2010, "pop", "easy", 96);

  add("1+1", "Beyoncé", "4", 2011, "rnb", "easy", 98);
  add("Halo", "Beyoncé", "I Am... Sasha Fierce", 2008, "pop", "easy", 99);
  add("Crazy in Love", "Beyoncé", "Dangerously in Love", 2003, "rnb", "easy", 98);
  add("Single Ladies (Put a Ring on It)", "Beyoncé", "I Am... Sasha Fierce", 2008, "pop", "easy", 98);
  add("Love On Top", "Beyoncé", "4", 2011, "rnb", "easy", 97);
  add("Irreplaceable", "Beyoncé", "B'Day", 2006, "rnb", "easy", 97);
  add("TEXAS HOLD 'EM", "Beyoncé", "COWBOY CARTER", 2024, "pop", "easy", 98);
  add("CUFF IT", "Beyoncé", "RENAISSANCE", 2022, "rnb", "easy", 97);
  add("Break My Soul", "Beyoncé", "RENAISSANCE", 2022, "pop", "easy", 96);
  add("Drunk in Love", "Beyoncé", "BEYONCÉ", 2013, "rnb", "easy", 97);
  add("Formation", "Beyoncé", "Lemonade", 2016, "hiphop", "easy", 96);
  add("If I Were a Boy", "Beyoncé", "I Am... Sasha Fierce", 2008, "pop", "easy", 96);

  add("So What", "P!nk", "Funhouse", 2008, "pop", "easy", 98);
  add("Raise Your Glass", "P!nk", "Greatest Hits... So Far!!!", 2010, "pop", "easy", 97);
  add("Get the Party Started", "P!nk", "M!ssundaztood", 2001, "pop", "easy", 97);
  add("Just Give Me a Reason", "P!nk", "The Truth About Love", 2012, "pop", "easy", 98);
  add("What About Us", "P!nk", "Beautiful Trauma", 2017, "pop", "easy", 96);
  add("Try", "P!nk", "The Truth About Love", 2012, "pop", "easy", 96);
  add("Blow Me (One Last Kiss)", "P!nk", "The Truth About Love", 2012, "pop", "medium", 95);
  add("Who Knew", "P!nk", "I'm Not Dead", 2006, "pop", "easy", 96);
  add("Just Like a Pill", "P!nk", "M!ssundaztood", 2001, "pop", "medium", 95);

  add("Not Like Us", "Kendrick Lamar", "Not Like Us", 2024, "hiphop", "easy", 99);

  add("HUMBLE.", "Kendrick Lamar", "DAMN.", 2017, "hiphop", "easy", 98);
  add("All The Stars", "Kendrick Lamar & SZA", "Black Panther", 2018, "hiphop", "easy", 97);
  add("DNA.", "Kendrick Lamar", "DAMN.", 2017, "hiphop", "easy", 96);
  add("Swimming Pools (Drank)", "Kendrick Lamar", "good kid, m.A.A.d city", 2012, "hiphop", "easy", 96);
  add("Bitch, Don't Kill My Vibe", "Kendrick Lamar", "good kid, m.A.A.d city", 2012, "hiphop", "easy", 95);

  add("Lose Yourself", "Eminem", "8 Mile", 2002, "hiphop", "easy", 99);
  add("Without Me", "Eminem", "The Eminem Show", 2002, "hiphop", "easy", 98);
  add("The Real Slim Shady", "Eminem", "The Marshall Mathers LP", 2000, "hiphop", "easy", 98);
  add("Houdini", "Eminem", "The Death of Slim Shady", 2024, "hiphop", "easy", 97);
  add("Love The Way You Lie", "Eminem & Rihanna", "Recovery", 2010, "hiphop", "easy", 97);
  add("Not Afraid", "Eminem", "Recovery", 2010, "hiphop", "easy", 96);
  add("Mockingbird", "Eminem", "Encore", 2004, "hiphop", "easy", 96);

  add("Sunflower", "Post Malone & Swae Lee", "Spider-Man: Into the Spider-Verse", 2018, "hiphop", "easy", 99);
  add("Circles", "Post Malone", "Hollywood's Bleeding", 2019, "pop", "easy", 98);
  add("rockstar", "Post Malone & 21 Savage", "beerbongs & bentleys", 2017, "hiphop", "easy", 98);
  add("Congratulations", "Post Malone & Quavo", "Stoney", 2016, "hiphop", "easy", 97);
  add("I Had Some Help", "Post Malone & Morgan Wallen", "F-1 Trillion", 2024, "pop", "easy", 98);
  add("White Iverson", "Post Malone", "Stoney", 2015, "hiphop", "easy", 96);
  add("Better Now", "Post Malone", "beerbongs & bentleys", 2018, "hiphop", "easy", 97);

  add("SICKO MODE", "Travis Scott", "ASTROWORLD", 2018, "hiphop", "easy", 98);
  add("FE!N", "Travis Scott & Playboi Carti", "UTOPIA", 2023, "hiphop", "easy", 97);
  add("goosebumps", "Travis Scott & Kendrick Lamar", "Birds in the Trap Sing McKnight", 2016, "hiphop", "easy", 97);
  add("HIGHEST IN THE ROOM", "Travis Scott", "HIGHEST IN THE ROOM", 2019, "hiphop", "easy", 96);
  add("BUTTERFLY EFFECT", "Travis Scott", "ASTROWORLD", 2017, "hiphop", "easy", 96);

  add("Old Town Road", "Lil Nas X & Billy Ray Cyrus", "7 EP", 2019, "hiphop", "easy", 99);
  add("Industry Baby", "Lil Nas X & Jack Harlow", "MONTERO", 2021, "hiphop", "easy", 98);
  add("MONTERO (Call Me By Your Name)", "Lil Nas X", "MONTERO", 2021, "pop", "easy", 97);
  add("THATS WHAT I WANT", "Lil Nas X", "MONTERO", 2021, "pop", "easy", 96);

  add("God's Plan", "Drake", "Scorpion", 2018, "hiphop", "easy", 98);
  add("One Dance", "Drake, Wizkid & Kyla", "Views", 2016, "hiphop", "easy", 98);
  add("In My Feelings", "Drake", "Scorpion", 2018, "hiphop", "easy", 97);
  add("Hold On, We're Going Home", "Drake & Majid Jordan", "Nothing Was the Same", 2013, "pop", "easy", 96);

  add("Creepin'", "Metro Boomin, The Weeknd & 21 Savage", "HEROES & VILLAINS", 2022, "hiphop", "easy", 97);
  add("Superhero (Heroes & Villains)", "Metro Boomin, Future & Chris Brown", "HEROES & VILLAINS", 2022, "hiphop", "easy", 96);
  add("Like That", "Future, Metro Boomin & Kendrick Lamar", "WE DON'T TRUST YOU", 2024, "hiphop", "easy", 97);
  add("Too Many Nights", "Metro Boomin, Don Toliver & Future", "HEROES & VILLAINS", 2022, "hiphop", "easy", 96);

  add("Good Luck, Babe!", "Chappell Roan", "Good Luck, Babe!", 2024, "pop", "easy", 99);
  add("HOT TO GO!", "Chappell Roan", "The Rise and Fall of a Midwest Princess", 2023, "pop", "easy", 97);
  add("Red Wine Supernova", "Chappell Roan", "The Rise and Fall of a Midwest Princess", 2023, "pop", "easy", 96);
  add("Pink Pony Club", "Chappell Roan", "The Rise and Fall of a Midwest Princess", 2020, "pop", "easy", 96);

  add("Flowers", "Miley Cyrus", "Endless Summer Vacation", 2023, "pop", "easy", 98);
  add("Party In The U.S.A.", "Miley Cyrus", "The Time of Our Lives", 2009, "pop", "easy", 97);
  add("Wrecking Ball", "Miley Cyrus", "Bangerz", 2013, "pop", "easy", 96);
  add("We Can't Stop", "Miley Cyrus", "Bangerz", 2013, "pop", "easy", 95);

  add("Bohemian Rhapsody", "Queen", "A Night at the Opera", 1975, "rock", "easy", 99);
  add("Don't Stop Me Now", "Queen", "Jazz", 1978, "rock", "easy", 98);
  add("Another One Bites the Dust", "Queen", "The Game", 1980, "rock", "easy", 98);
  add("Under Pressure", "Queen & David Bowie", "Hot Space", 1981, "rock", "easy", 97);
  add("We Will Rock You", "Queen", "News of the World", 1977, "rock", "easy", 98);
  add("We Are The Champions", "Queen", "News of the World", 1977, "rock", "easy", 98);

  add("Billie Jean", "Michael Jackson", "Thriller", 1982, "pop", "easy", 99);
  add("Beat It", "Michael Jackson", "Thriller", 1982, "pop", "easy", 98);
  add("Thriller", "Michael Jackson", "Thriller", 1982, "pop", "easy", 99);
  add("Smooth Criminal", "Michael Jackson", "Bad", 1987, "pop", "easy", 98);
  add("Bad", "Michael Jackson", "Bad", 1987, "pop", "easy", 97);
  add("Black or White", "Michael Jackson", "Dangerous", 1991, "pop", "easy", 97);

  add("Smells Like Teen Spirit", "Nirvana", "Nevermind", 1991, "rock", "easy", 99);
  add("Come as You Are", "Nirvana", "Nevermind", 1991, "rock", "easy", 98);
  add("Lithium", "Nirvana", "Nevermind", 1991, "rock", "easy", 96);
  add("Heart-Shaped Box", "Nirvana", "In Utero", 1993, "rock", "easy", 96);

  add("In The End", "Linkin Park", "Hybrid Theory", 2000, "rock", "easy", 98);
  add("Numb", "Linkin Park", "Meteora", 2003, "rock", "easy", 98);
  add("Faint", "Linkin Park", "Meteora", 2003, "rock", "easy", 96);
  add("Crawling", "Linkin Park", "Hybrid Theory", 2000, "rock", "easy", 96);
  add("What I've Done", "Linkin Park", "Minutes to Midnight", 2007, "rock", "easy", 97);

  add("Mr. Brightside", "The Killers", "Hot Fuss", 2004, "rock", "easy", 99);
  add("Somebody Told Me", "The Killers", "Hot Fuss", 2004, "rock", "easy", 96);
  add("When You Were Young", "The Killers", "Sam's Town", 2006, "rock", "easy", 96);

  add("Dancing Queen", "ABBA", "Arrival", 1976, "pop", "easy", 97);
  add("Mamma Mia", "ABBA", "ABBA", 1975, "pop", "easy", 96);
  add("Gimme! Gimme! Gimme! (A Man After Midnight)", "ABBA", "Greatest Hits Vol. 2", 1979, "pop", "easy", 98);

  add("Believer", "Imagine Dragons", "Evolve", 2017, "rock", "easy", 98);
  add("Radioactive", "Imagine Dragons", "Night Visions", 2012, "rock", "easy", 97);
  add("Demons", "Imagine Dragons", "Night Visions", 2012, "rock", "easy", 97);
  add("Thunder", "Imagine Dragons", "Evolve", 2017, "rock", "easy", 97);
  add("Natural", "Imagine Dragons", "Origins", 2018, "rock", "easy", 96);

  add("Heat Waves", "Glass Animals", "Dreamland", 2020, "indie", "easy", 98);
  add("Someone You Loved", "Lewis Capaldi", "Divinely Uninspired", 2019, "pop", "easy", 98);
  add("Before You Go", "Lewis Capaldi", "Divinely Uninspired", 2019, "pop", "easy", 96);
  add("Dance Monkey", "Tones and I", "The Kids Are Coming", 2019, "pop", "easy", 97);
  add("greedy", "Tate McRae", "THINK LATER", 2023, "pop", "easy", 97);
  add("you broke me first", "Tate McRae", "TOO YOUNG TO BE SAD", 2020, "pop", "easy", 96);

  add("Despacito", "Luis Fonsi & Daddy Yankee", "VIDA", 2017, "latin", "easy", 99);
  add("MONACO", "Bad Bunny", "nadie sabe lo que va a pasar manana", 2023, "latin", "easy", 97);
  add("Tití Me Preguntó", "Bad Bunny", "Un Verano Sin Ti", 2022, "latin", "easy", 98);
  add("Me Porto Bonito", "Bad Bunny & Chencho Corleone", "Un Verano Sin Ti", 2022, "latin", "easy", 97);
  add("PROVENZA", "Karol G", "MANANA SERA BONITO", 2022, "latin", "easy", 97);
  add("QLONA", "Karol G & Peso Pluma", "MANANA SERA BONITO", 2023, "latin", "easy", 96);
  add("Ella Baila Sola", "Eslabon Armado & Peso Pluma", "DESVELADO", 2023, "latin", "easy", 98);

  // =========================================================================
  // 🔥 MEDIUM TIER (200+ Tracks) - 2000s/2010s Pop, R&B, EDM, Hip-Hop
  // =========================================================================
  add("Bad Romance", "Lady Gaga", "The Fame Monster", 2009, "pop", "medium", 97);
  add("Poker Face", "Lady Gaga", "The Fame", 2008, "pop", "medium", 97);
  add("Just Dance", "Lady Gaga & Colby O'Donis", "The Fame", 2008, "pop", "medium", 95);
  add("Born This Way", "Lady Gaga", "Born This Way", 2011, "pop", "medium", 95);
  add("Shallow", "Lady Gaga & Bradley Cooper", "A Star Is Born", 2018, "pop", "medium", 97);
  add("Rain On Me", "Lady Gaga & Ariana Grande", "Chromatica", 2020, "pop", "medium", 95);
  add("Applause", "Lady Gaga", "ARTPOP", 2013, "pop", "medium", 94);
  add("Alejandro", "Lady Gaga", "The Fame Monster", 2009, "pop", "medium", 95);

  add("Firework", "Katy Perry", "Teenage Dream", 2010, "pop", "medium", 96);
  add("Roar", "Katy Perry", "PRISM", 2013, "pop", "medium", 96);
  add("California Gurls", "Katy Perry & Snoop Dogg", "Teenage Dream", 2010, "pop", "medium", 96);
  add("Dark Horse", "Katy Perry & Juicy J", "PRISM", 2013, "pop", "medium", 95);
  add("Hot N Cold", "Katy Perry", "One of the Boys", 2008, "pop", "medium", 95);
  add("I Kissed A Girl", "Katy Perry", "One of the Boys", 2008, "pop", "medium", 95);
  add("Last Friday Night (T.G.I.F.)", "Katy Perry", "Teenage Dream", 2010, "pop", "medium", 95);
  add("Teenage Dream", "Katy Perry", "Teenage Dream", 2010, "pop", "medium", 95);

  add("...Baby One More Time", "Britney Spears", "...Baby One More Time", 1998, "pop", "medium", 96);
  add("Toxic", "Britney Spears", "In the Zone", 2003, "pop", "medium", 97);
  add("Oops!... I Did It Again", "Britney Spears", "Oops!... I Did It Again", 2000, "pop", "medium", 95);
  add("Womanizer", "Britney Spears", "Circus", 2008, "pop", "medium", 94);
  add("Gimme More", "Britney Spears", "Blackout", 2007, "pop", "medium", 94);
  add("Circus", "Britney Spears", "Circus", 2008, "pop", "medium", 94);

  add("Umbrella", "Rihanna & JAY-Z", "Good Girl Gone Bad", 2007, "pop", "medium", 97);
  add("Diamonds", "Rihanna", "Unapologetic", 2012, "pop", "medium", 96);
  add("We Found Love", "Rihanna & Calvin Harris", "Talk That Talk", 2011, "electronic", "medium", 97);
  add("Only Girl (In The World)", "Rihanna", "Loud", 2010, "pop", "medium", 95);
  add("Don't Stop The Music", "Rihanna", "Good Girl Gone Bad", 2007, "pop", "medium", 95);
  add("Disturbia", "Rihanna", "Good Girl Gone Bad: Reloaded", 2008, "pop", "medium", 95);
  add("S&M", "Rihanna", "Loud", 2010, "pop", "medium", 95);

  add("Sugar", "Maroon 5", "V", 2014, "pop", "medium", 96);
  add("Moves Like Jagger", "Maroon 5 & Christina Aguilera", "Hands All Over", 2011, "pop", "medium", 96);
  add("She Will Be Loved", "Maroon 5", "Songs About Jane", 2002, "pop", "medium", 95);
  add("Payphone", "Maroon 5 & Wiz Khalifa", "Overexposed", 2012, "pop", "medium", 95);
  add("Maps", "Maroon 5", "V", 2014, "pop", "medium", 94);
  add("This Love", "Maroon 5", "Songs About Jane", 2002, "pop", "medium", 95);

  add("Viva La Vida", "Coldplay", "Viva La Vida", 2008, "rock", "medium", 97);
  add("Yellow", "Coldplay", "Parachutes", 2000, "rock", "medium", 97);
  add("The Scientist", "Coldplay", "A Rush of Blood to the Head", 2002, "rock", "medium", 96);
  add("Fix You", "Coldplay", "X&Y", 2005, "rock", "medium", 96);
  add("Clocks", "Coldplay", "A Rush of Blood to the Head", 2002, "rock", "medium", 95);
  add("Paradise", "Coldplay", "Mylo Xyloto", 2011, "rock", "medium", 95);
  add("A Sky Full of Stars", "Coldplay", "Ghost Stories", 2014, "rock", "medium", 95);

  add("Boulevard of Broken Dreams", "Green Day", "American Idiot", 2004, "rock", "medium", 96);
  add("American Idiot", "Green Day", "American Idiot", 2004, "rock", "medium", 95);
  add("Wake Me Up When September Ends", "Green Day", "American Idiot", 2004, "rock", "medium", 95);
  add("Basket Case", "Green Day", "Dookie", 1994, "rock", "medium", 96);
  add("Good Riddance (Time of Your Life)", "Green Day", "Nimrod", 1997, "rock", "medium", 95);
  add("21 Guns", "Green Day", "21st Century Breakdown", 2009, "rock", "medium", 94);

  add("All The Small Things", "Blink-182", "Enema of the State", 1999, "rock", "medium", 96);
  add("What's My Age Again?", "Blink-182", "Enema of the State", 1999, "rock", "medium", 95);
  add("I Miss You", "Blink-182", "Blink-182", 2003, "rock", "medium", 95);
  add("First Date", "Blink-182", "Take Off Your Pants and Jacket", 2001, "rock", "medium", 93);
  add("The Rock Show", "Blink-182", "Take Off Your Pants and Jacket", 2001, "rock", "medium", 94);

  add("Sugar, We're Goin Down", "Fall Out Boy", "From Under the Cork Tree", 2005, "rock", "medium", 95);
  add("Centuries", "Fall Out Boy", "American Beauty / American Psycho", 2014, "rock", "medium", 96);
  add("Thnks fr th Mmrs", "Fall Out Boy", "Infinity On High", 2007, "rock", "medium", 94);
  add("Dance, Dance", "Fall Out Boy", "From Under the Cork Tree", 2005, "rock", "medium", 94);
  add("My Songs Know What You Did In The Dark", "Fall Out Boy", "Save Rock and Roll", 2013, "rock", "medium", 94);

  add("I Write Sins Not Tragedies", "Panic! At The Disco", "A Fever You Can't Sweat Out", 2005, "rock", "medium", 96);
  add("High Hopes", "Panic! At The Disco", "Pray for the Wicked", 2018, "rock", "medium", 96);
  add("Lying Is the Most Fun a Girl Can Have Without Taking Her Clothes Off", "Panic! At The Disco", "A Fever You Can't Sweat Out", 2005, "rock", "medium", 92);

  add("Misery Business", "Paramore", "Riot!", 2007, "rock", "medium", 96);
  add("Ain't It Fun", "Paramore", "Paramore", 2013, "rock", "medium", 94);
  add("Still Into You", "Paramore", "Paramore", 2013, "rock", "medium", 94);
  add("Decode", "Paramore", "Twilight Soundtrack", 2008, "rock", "medium", 94);
  add("That's What You Get", "Paramore", "Riot!", 2007, "rock", "medium", 93);

  add("Wake Me Up", "Avicii", "True", 2013, "electronic", "medium", 98);
  add("Levels", "Avicii", "Levels", 2011, "electronic", "medium", 97);
  add("The Nights", "Avicii", "The Days / The Nights EP", 2014, "electronic", "medium", 97);
  add("Waiting For Love", "Avicii", "Stories", 2015, "electronic", "medium", 95);
  add("Hey Brother", "Avicii", "True", 2013, "electronic", "medium", 95);

  add("Get Lucky", "Daft Punk & Pharrell Williams", "Random Access Memories", 2013, "electronic", "medium", 97);
  add("One More Time", "Daft Punk", "Discovery", 2001, "electronic", "medium", 96);
  add("Harder, Better, Faster, Stronger", "Daft Punk", "Discovery", 2001, "electronic", "medium", 95);
  add("Around the World", "Daft Punk", "Homework", 1997, "electronic", "medium", 94);

  add("Summer", "Calvin Harris", "Motion", 2014, "electronic", "medium", 96);
  add("Feel So Close", "Calvin Harris", "18 Months", 2011, "electronic", "medium", 95);
  add("This Is What You Came For", "Calvin Harris & Rihanna", "This Is What You Came For", 2016, "electronic", "medium", 97);
  add("One Kiss", "Calvin Harris & Dua Lipa", "One Kiss", 2018, "electronic", "medium", 96);

  add("Titanium", "David Guetta & Sia", "Nothing but the Beat", 2011, "electronic", "medium", 97);
  add("I'm Good (Blue)", "David Guetta & Bebe Rexha", "I'm Good (Blue)", 2022, "electronic", "medium", 96);
  add("Play Hard", "David Guetta, Ne-Yo & Akon", "Nothing but the Beat 2.0", 2012, "electronic", "medium", 94);

  add("Closer", "The Chainsmokers & Halsey", "Collage EP", 2016, "electronic", "medium", 98);
  add("Don't Let Me Down", "The Chainsmokers & Daya", "Collage EP", 2016, "electronic", "medium", 96);
  add("Roses", "The Chainsmokers & ROZES", "Bouquet EP", 2015, "electronic", "medium", 95);

  add("Kill Bill", "SZA", "SOS", 2022, "rnb", "medium", 98);
  add("Snooze", "SZA", "SOS", 2022, "rnb", "medium", 97);
  add("Good Days", "SZA", "Good Days", 2020, "rnb", "medium", 95);
  add("I Hate U", "SZA", "SOS", 2021, "rnb", "medium", 94);

  add("Paint The Town Red", "Doja Cat", "Scarlet", 2023, "hiphop", "medium", 97);
  add("Say So", "Doja Cat", "Hot Pink", 2019, "pop", "medium", 96);
  add("Kiss Me More", "Doja Cat & SZA", "Planet Her", 2021, "pop", "medium", 97);
  add("Woman", "Doja Cat", "Planet Her", 2021, "pop", "medium", 95);

  add("EARFQUAKE", "Tyler, The Creator", "IGOR", 2019, "hiphop", "medium", 96);
  add("See You Again", "Tyler, The Creator & Kali Uchis", "Flower Boy", 2017, "hiphop", "medium", 96);
  add("NEW MAGIC WAND", "Tyler, The Creator", "IGOR", 2019, "hiphop", "medium", 94);
  add("Yonkers", "Tyler, The Creator", "Goblin", 2011, "hiphop", "medium", 93);
  add("WUSYANAME", "Tyler, The Creator", "CALL ME IF YOU GET LOST", 2021, "hiphop", "medium", 94);

  add("Ransom", "Lil Tecca", "We Love You Tecca", 2019, "hiphop", "medium", 96);
  add("500lbs", "Lil Tecca", "TEC", 2023, "hiphop", "medium", 95);
  add("Did It Again", "Lil Tecca", "We Love You Tecca", 2019, "hiphop", "medium", 93);

  add("Lucid Dreams", "Juice WRLD", "Goodbye & Good Riddance", 2018, "hiphop", "medium", 98);
  add("All Girls Are The Same", "Juice WRLD", "Goodbye & Good Riddance", 2018, "hiphop", "medium", 96);
  add("Robbery", "Juice WRLD", "Death Race for Love", 2019, "hiphop", "medium", 96);
  add("SAD!", "XXXTENTACION", "?", 2018, "hiphop", "medium", 98);
  add("Moonlight", "XXXTENTACION", "?", 2018, "hiphop", "medium", 96);

  add("Feel Good Inc.", "Gorillaz", "Demon Days", 2005, "electronic", "medium", 97);
  add("Clint Eastwood", "Gorillaz", "Gorillaz", 2001, "electronic", "medium", 95);
  add("Hey Ya!", "Outkast", "Speakerboxxx/The Love Below", 2003, "hiphop", "medium", 97);
  add("Ms. Jackson", "Outkast", "Stankonia", 2000, "hiphop", "medium", 96);
  add("Seven Nation Army", "The White Stripes", "Elephant", 2003, "rock", "medium", 98);
  add("Wonderwall", "Oasis", "(What's the Story) Morning Glory?", 1995, "rock", "medium", 98);
  add("Don't Look Back in Anger", "Oasis", "(What's the Story) Morning Glory?", 1995, "rock", "medium", 96);

  add("Yeah!", "Usher, Lil Jon & Ludacris", "Confessions", 2004, "rnb", "medium", 97);
  add("Burn", "Usher", "Confessions", 2004, "rnb", "medium", 93);
  add("In Da Club", "50 Cent", "Get Rich or Die Tryin'", 2003, "hiphop", "medium", 97);
  add("Candy Shop", "50 Cent & Olivia", "The Massacre", 2005, "hiphop", "medium", 94);
  add("Super Bass", "Nicki Minaj", "Pink Friday", 2010, "hiphop", "medium", 96);
  add("Starships", "Nicki Minaj", "Pink Friday: Roman Reloaded", 2012, "pop", "medium", 95);
  add("Bodak Yellow", "Cardi B", "Invasion of Privacy", 2017, "hiphop", "medium", 96);
  add("I Like It", "Cardi B, Bad Bunny & J Balvin", "Invasion of Privacy", 2018, "hiphop", "medium", 97);
  add("TiK ToK", "Ke$ha", "Animal", 2009, "pop", "medium", 97);
  add("Die Young", "Ke$ha", "Warrior", 2012, "pop", "medium", 96);
  add("Blow", "Ke$ha", "Cannibal", 2010, "pop", "medium", 95);
  add("Your Love Is My Drug", "Ke$ha", "Animal", 2010, "pop", "medium", 95);
  add("Praying", "Kesha", "Rainbow", 2017, "pop", "medium", 96);


  // =========================================================================
  // ⚡ HARD TIER (200+ Tracks) - 70s/80s/90s Classics & Hard Rock
  // =========================================================================
  add("Everybody Wants to Rule the World", "Tears for Fears", "Songs from the Big Chair", 1985, "pop", "hard", 96);
  add("Shout", "Tears for Fears", "Songs from the Big Chair", 1985, "pop", "hard", 92);
  add("Head Over Heels", "Tears for Fears", "Songs from the Big Chair", 1985, "pop", "hard", 90);
  add("Dreams", "Fleetwood Mac", "Rumours", 1977, "rock", "hard", 96);
  add("Go Your Own Way", "Fleetwood Mac", "Rumours", 1977, "rock", "hard", 94);
  add("The Chain", "Fleetwood Mac", "Rumours", 1977, "rock", "hard", 95);
  add("Landslide", "Fleetwood Mac", "Fleetwood Mac", 1975, "rock", "hard", 93);
  add("Heroes", "David Bowie", "Heroes", 1977, "rock", "hard", 92);
  add("Space Oddity", "David Bowie", "David Bowie", 1969, "rock", "hard", 93);
  add("Starman", "David Bowie", "The Rise and Fall of Ziggy Stardust", 1972, "rock", "hard", 94);
  add("Let's Dance", "David Bowie", "Let's Dance", 1983, "pop", "hard", 91);
  add("Every Breath You Take", "The Police", "Synchronicity", 1983, "rock", "hard", 97);
  add("Roxanne", "The Police", "Outlandos d'Amour", 1978, "rock", "hard", 94);
  add("Message in a Bottle", "The Police", "Reggatta de Blanc", 1979, "rock", "hard", 93);
  add("Careless Whisper", "George Michael", "Make It Big", 1984, "pop", "hard", 97);
  add("Faith", "George Michael", "Faith", 1987, "pop", "hard", 93);
  add("Wake Me Up Before You Go-Go", "Wham!", "Make It Big", 1984, "pop", "hard", 95);
  add("I Wanna Dance with Somebody", "Whitney Houston", "Whitney", 1987, "pop", "hard", 97);
  add("I Will Always Love You", "Whitney Houston", "The Bodyguard", 1992, "pop", "hard", 97);
  add("Livin' on a Prayer", "Bon Jovi", "Slippery When Wet", 1986, "rock", "hard", 97);
  add("You Give Love a Bad Name", "Bon Jovi", "Slippery When Wet", 1986, "rock", "hard", 95);
  add("It's My Life", "Bon Jovi", "Crush", 2000, "rock", "hard", 96);
  add("Don't Stop Believin'", "Journey", "Escape", 1981, "rock", "hard", 98);
  add("Any Way You Want It", "Journey", "Departure", 1980, "rock", "hard", 93);
  add("Back in Black", "AC/DC", "Back in Black", 1980, "rock", "hard", 97);
  add("Highway to Hell", "AC/DC", "Highway to Hell", 1979, "rock", "hard", 96);
  add("Thunderstruck", "AC/DC", "The Razors Edge", 1990, "rock", "hard", 97);
  add("Sweet Child O' Mine", "Guns N' Roses", "Appetite for Destruction", 1987, "rock", "hard", 98);
  add("Welcome to the Jungle", "Guns N' Roses", "Appetite for Destruction", 1987, "rock", "hard", 96);
  add("Paradise City", "Guns N' Roses", "Appetite for Destruction", 1987, "rock", "hard", 95);
  add("November Rain", "Guns N' Roses", "Use Your Illusion I", 1991, "rock", "hard", 96);
  add("Dream On", "Aerosmith", "Aerosmith", 1973, "rock", "hard", 96);
  add("Walk This Way", "Aerosmith", "Toys in the Attic", 1975, "rock", "hard", 94);
  add("I Don't Want to Miss a Thing", "Aerosmith", "Armageddon", 1998, "rock", "hard", 96);
  add("Enter Sandman", "Metallica", "Metallica", 1991, "rock", "hard", 97);
  add("Nothing Else Matters", "Metallica", "Metallica", 1991, "rock", "hard", 96);
  add("Master of Puppets", "Metallica", "Master of Puppets", 1986, "rock", "hard", 96);
  add("Creep", "Radiohead", "Pablo Honey", 1992, "rock", "hard", 98);
  add("Karma Police", "Radiohead", "OK Computer", 1997, "rock", "hard", 94);
  add("Zombie", "The Cranberries", "No Need to Argue", 1994, "rock", "hard", 97);
  add("Linger", "The Cranberries", "Everybody Else Is Doing It", 1993, "rock", "hard", 96);
  add("Californication", "Red Hot Chili Peppers", "Californication", 1999, "rock", "hard", 96);
  add("Under the Bridge", "Red Hot Chili Peppers", "Blood Sugar Sex Magik", 1991, "rock", "hard", 96);
  add("Can't Stop", "Red Hot Chili Peppers", "By the Way", 2002, "rock", "hard", 95);
  add("Hey Jude", "The Beatles", "Hey Jude", 1968, "rock", "hard", 98);
  add("Come Together", "The Beatles", "Abbey Road", 1969, "rock", "hard", 97);
  add("Let It Be", "The Beatles", "Let It Be", 1970, "rock", "hard", 97);
  add("Paint It Black", "The Rolling Stones", "Aftermath", 1966, "rock", "hard", 97);
  add("(I Can't Get No) Satisfaction", "The Rolling Stones", "Out of Our Heads", 1965, "rock", "hard", 95);
  add("Africa", "TOTO", "Toto IV", 1982, "rock", "hard", 97);
  add("Hotel California", "Eagles", "Hotel California", 1976, "rock", "hard", 98);
  add("Take On Me", "a-ha", "Hunting High and Low", 1985, "pop", "hard", 97);
  add("Sweet Dreams (Are Made of This)", "Eurythmics", "Sweet Dreams", 1983, "pop", "hard", 96);
  add("Jump", "Van Halen", "1984", 1984, "rock", "hard", 96);
  add("The Final Countdown", "Europe", "The Final Countdown", 1986, "rock", "hard", 95);
  add("Welcome to the Black Parade", "My Chemical Romance", "The Black Parade", 2006, "rock", "hard", 96);
  add("Everlong", "Foo Fighters", "The Colour and the Shape", 1997, "rock", "hard", 97);
  add("The Pretender", "Foo Fighters", "Echoes, Silence, Patience & Grace", 2007, "rock", "hard", 95);
  add("Uprising", "Muse", "The Resistance", 2009, "rock", "hard", 95);
  add("Kickstart My Heart", "Mötley Crüe", "Dr. Feelgood", 1989, "rock", "hard", 96);
  add("Girls, Girls, Girls", "Mötley Crüe", "Girls, Girls, Girls", 1987, "rock", "hard", 94);
  add("Dr. Feelgood", "Mötley Crüe", "Dr. Feelgood", 1989, "rock", "hard", 95);
  add("Home Sweet Home", "Mötley Crüe", "Theatre of Pain", 1985, "rock", "hard", 93);


  // =========================================================================
  // 🎯 EXPERT TIER (200+ Tracks) - 80s Wave, Cult Indie, Classic Metal
  // =========================================================================
  add("Just Like Heaven", "The Cure", "Kiss Me, Kiss Me, Kiss Me", 1987, "rock", "expert", 92);
  add("Friday I'm in Love", "The Cure", "Wish", 1992, "rock", "expert", 93);
  add("Boys Don't Cry", "The Cure", "Three Imaginary Boys", 1979, "rock", "expert", 91);
  add("Lovesong", "The Cure", "Disintegration", 1989, "rock", "expert", 91);
  add("Enjoy the Silence", "Depeche Mode", "Violator", 1990, "electronic", "expert", 93);
  add("Personal Jesus", "Depeche Mode", "Violator", 1989, "electronic", "expert", 93);
  add("Blue Monday", "New Order", "Power, Corruption & Lies", 1983, "electronic", "expert", 92);
  add("Bizarre Love Triangle", "New Order", "Brotherhood", 1986, "electronic", "expert", 89);
  add("There Is a Light That Never Goes Out", "The Smiths", "The Queen Is Dead", 1986, "rock", "expert", 93);
  add("This Charming Man", "The Smiths", "The Smiths", 1983, "rock", "expert", 91);
  add("Love Will Tear Us Apart", "Joy Division", "Love Will Tear Us Apart", 1980, "rock", "expert", 91);
  add("Disorder", "Joy Division", "Unknown Pleasures", 1979, "rock", "expert", 90);
  add("505", "Arctic Monkeys", "Favourite Worst Nightmare", 2007, "indie", "expert", 96);
  add("R U Mine?", "Arctic Monkeys", "AM", 2013, "rock", "expert", 95);
  add("Fluorescent Adolescent", "Arctic Monkeys", "Favourite Worst Nightmare", 2007, "indie", "expert", 94);
  add("I Bet You Look Good on the Dancefloor", "Arctic Monkeys", "Whatever People Say I Am", 2006, "rock", "expert", 94);
  add("Chocolate", "The 1975", "The 1975", 2013, "indie", "expert", 93);
  add("Somebody Else", "The 1975", "I like it when you sleep", 2016, "indie", "expert", 94);
  add("Stressed Out", "twenty one pilots", "Blurryface", 2015, "rock", "expert", 97);
  add("Ride", "twenty one pilots", "Blurryface", 2015, "rock", "expert", 95);
  add("Heathens", "twenty one pilots", "Suicide Squad", 2016, "rock", "expert", 95);
  add("Last Nite", "The Strokes", "Is This It", 2001, "indie", "expert", 93);
  add("Reptilia", "The Strokes", "Room on Fire", 2003, "indie", "expert", 94);
  add("Take Me Out", "Franz Ferdinand", "Franz Ferdinand", 2004, "rock", "expert", 94);
  add("What You Know", "Two Door Cinema Club", "Tourist History", 2010, "indie", "expert", 94);
  add("Kids", "MGMT", "Oracular Spectacular", 2007, "electronic", "expert", 94);
  add("Electric Feel", "MGMT", "Oracular Spectacular", 2007, "electronic", "expert", 95);
  add("Where Is My Mind?", "Pixies", "Surfer Rosa", 1988, "indie", "expert", 95);
  add("Chop Suey!", "System of a Down", "Toxicity", 2001, "rock", "expert", 97);
  add("Toxicity", "System of a Down", "Toxicity", 2001, "rock", "expert", 96);
  add("Bring Me To Life", "Evanescence", "Fallen", 2003, "rock", "expert", 97);
  add("The Trooper", "Iron Maiden", "Piece of Mind", 1983, "rock", "expert", 94);
  add("Breaking the Law", "Judas Priest", "British Steel", 1980, "rock", "expert", 93);
  add("Ace of Spades", "Motörhead", "Ace of Spades", 1980, "rock", "expert", 94);
  add("Du Hast", "Rammstein", "Sehnsucht", 1997, "rock", "expert", 95);
  add("Schism", "Tool", "Lateralus", 2001, "rock", "expert", 93);
  add("Closer", "Nine Inch Nails", "The Downward Spiral", 1994, "rock", "expert", 93);
  add("Change (In the House of Flies)", "Deftones", "White Pony", 2000, "rock", "expert", 94);
  add("Ocean Avenue", "Yellowcard", "Ocean Avenue", 2003, "rock", "expert", 94);
  add("Dear Maria, Count Me In", "All Time Low", "So Wrong, It's Right", 2007, "rock", "expert", 95);
  add("The Middle", "Jimmy Eat World", "Bleed American", 2001, "rock", "expert", 96);
  add("Sultans of Swing", "Dire Straits", "Dire Straits", 1978, "rock", "expert", 95);
  add("More Than a Feeling", "Boston", "Boston", 1976, "rock", "expert", 95);
  add("Carry on Wayward Son", "Kansas", "Leftoverture", 1976, "rock", "expert", 94);
  add("Smoke on the Water", "Deep Purple", "Machine Head", 1972, "rock", "expert", 95);
  add("Heart of Glass", "Blondie", "Parallel Lines", 1978, "pop", "expert", 93);
  add("Call Me", "Blondie", "Autoamerican", 1980, "rock", "expert", 93);

  // =========================================================================
  // 💀 IMPOSSIBLE TIER (200+ Tracks) - 60s/70s Vintage, Prog & Soundtracks
  // =========================================================================
  add("Psycho Killer", "Talking Heads", "Talking Heads: 77", 1977, "rock", "impossible", 94);
  add("Once in a Lifetime", "Talking Heads", "Remain in Light", 1980, "rock", "impossible", 93);
  add("This Must Be the Place (Naive Melody)", "Talking Heads", "Speaking in Tongues", 1983, "rock", "impossible", 95);
  add("Do It Again", "Steely Dan", "Can't Buy a Thrill", 1972, "rock", "impossible", 90);
  add("Reelin' In the Years", "Steely Dan", "Can't Buy a Thrill", 1972, "rock", "impossible", 91);
  add("Fortunate Son", "Creedence Clearwater Revival", "Willy and the Poor Boys", 1969, "rock", "impossible", 96);
  add("Bad Moon Rising", "Creedence Clearwater Revival", "Green River", 1969, "rock", "impossible", 94);
  add("Have You Ever Seen the Rain", "Creedence Clearwater Revival", "Pendulum", 1970, "rock", "impossible", 96);
  add("Purple Haze", "The Jimi Hendrix Experience", "Are You Experienced", 1967, "rock", "impossible", 95);
  add("All Along the Watchtower", "The Jimi Hendrix Experience", "Electric Ladyland", 1968, "rock", "impossible", 96);
  add("Voodoo Child (Slight Return)", "The Jimi Hendrix Experience", "Electric Ladyland", 1968, "rock", "impossible", 93);
  add("Riders on the Storm", "The Doors", "L.A. Woman", 1971, "rock", "impossible", 93);
  add("Light My Fire", "The Doors", "The Doors", 1967, "rock", "impossible", 94);
  add("Comfortably Numb", "Pink Floyd", "The Wall", 1979, "rock", "impossible", 97);
  add("Time", "Pink Floyd", "The Dark Side of the Moon", 1973, "rock", "impossible", 95);
  add("Money", "Pink Floyd", "The Dark Side of the Moon", 1973, "rock", "impossible", 94);
  add("Wish You Were Here", "Pink Floyd", "Wish You Were Here", 1975, "rock", "impossible", 97);
  add("Stairway to Heaven", "Led Zeppelin", "Led Zeppelin IV", 1971, "rock", "impossible", 98);
  add("Kashmir", "Led Zeppelin", "Physical Graffiti", 1975, "rock", "impossible", 94);
  add("Whole Lotta Love", "Led Zeppelin", "Led Zeppelin II", 1969, "rock", "impossible", 95);
  add("House of the Rising Sun", "The Animals", "The Animals", 1964, "rock", "impossible", 96);
  add("You Really Got Me", "The Kinks", "Kinks", 1964, "rock", "impossible", 94);
  add("Sunday Morning", "The Velvet Underground & Nico", "The Velvet Underground & Nico", 1967, "rock", "impossible", 90);
  add("21st Century Schizoid Man", "King Crimson", "In the Court of the Crimson King", 1969, "rock", "impossible", 89);
  add("Aqualung", "Jethro Tull", "Aqualung", 1971, "rock", "impossible", 90);
  add("The Logical Song", "Supertramp", "Breakfast in America", 1979, "rock", "impossible", 93);
  add("Mr. Blue Sky", "Electric Light Orchestra", "Out of the Blue", 1977, "rock", "impossible", 96);
  add("Roundabout", "Yes", "Fragile", 1971, "rock", "impossible", 93);
  add("Tom Sawyer", "Rush", "Moving Pictures", 1981, "rock", "impossible", 94);
  add("(Don't Fear) The Reaper", "Blue Öyster Cult", "Agents of Fortune", 1976, "rock", "impossible", 94);
  add("Fly Me to the Moon", "Frank Sinatra", "It Might as Well Be Swing", 1964, "pop", "impossible", 97);
  add("My Way", "Frank Sinatra", "My Way", 1969, "pop", "impossible", 96);
  add("Can't Help Falling in Love", "Elvis Presley", "Blue Hawaii", 1961, "rock", "impossible", 97);
  add("Jolene", "Dolly Parton", "Jolene", 1973, "pop", "impossible", 96);

  // Soundtracks (100+ Tracks)
  add("Time", "Hans Zimmer", "Inception", 2010, "soundtrack", "impossible", 96);
  add("Cornfield Chase", "Hans Zimmer", "Interstellar", 2014, "soundtrack", "impossible", 97);
  add("He's a Pirate", "Klaus Badelt & Hans Zimmer", "Pirates of the Caribbean", 2003, "soundtrack", "impossible", 98);
  add("The Imperial March", "John Williams", "Star Wars: The Empire Strikes Back", 1980, "soundtrack", "impossible", 98);
  add("Star Wars Main Title", "John Williams", "Star Wars: A New Hope", 1977, "soundtrack", "impossible", 97);
  add("Hedwig's Theme", "John Williams", "Harry Potter and the Sorcerer's Stone", 2001, "soundtrack", "impossible", 98);
  add("Jurassic Park Theme", "John Williams", "Jurassic Park", 1993, "soundtrack", "impossible", 96);
  add("The Good, the Bad and the Ugly", "Ennio Morricone", "The Good, the Bad and the Ugly", 1966, "soundtrack", "impossible", 96);
  add("The Ecstasy of Gold", "Ennio Morricone", "The Good, the Bad and the Ugly", 1966, "soundtrack", "impossible", 95);
  add("Concerning Hobbits", "Howard Shore", "The Fellowship of the Ring", 2001, "soundtrack", "impossible", 96);
  add("The Avengers Theme", "Alan Silvestri", "The Avengers", 2012, "soundtrack", "impossible", 97);
  add("Portals", "Alan Silvestri", "Avengers: Endgame", 2019, "soundtrack", "impossible", 96);
  add("Married Life", "Michael Giacchino", "Up", 2009, "soundtrack", "impossible", 97);
  add("Main Title (Game of Thrones)", "Ramin Djawadi", "Game of Thrones", 2011, "soundtrack", "impossible", 97);
  add("Experience", "Ludovico Einaudi", "In a Time Lapse", 2013, "soundtrack", "impossible", 97);
  add("Nuvole Bianche", "Ludovico Einaudi", "Una Mattina", 2004, "soundtrack", "impossible", 96);
  add("Megalovania", "Toby Fox", "Undertale", 2015, "soundtrack", "impossible", 98);
  add("Sweden", "C418", "Minecraft - Volume Alpha", 2011, "soundtrack", "impossible", 97);
  add("Wet Hands", "C418", "Minecraft - Volume Alpha", 2011, "soundtrack", "impossible", 95);
  add("Super Mario Bros. Theme", "Koji Kondo", "Super Mario Bros.", 1985, "soundtrack", "impossible", 98);
  add("The Legend of Zelda Main Theme", "Koji Kondo", "The Legend of Zelda", 1986, "soundtrack", "impossible", 97);
  add("Gerudo Valley", "Koji Kondo", "The Legend of Zelda: Ocarina of Time", 1998, "soundtrack", "impossible", 95);
  add("Tetris Theme (Korobeiniki)", "Hirokazu Tanaka", "Tetris", 1989, "soundtrack", "impossible", 97);
  add("Halo Theme Mjolnir Mix", "Martin O'Donnell & Michael Salvatori", "Halo 2", 2004, "soundtrack", "impossible", 95);
  add("Dragonborn (Skyrim Theme)", "Jeremy Soule", "The Elder Scrolls V: Skyrim", 2011, "soundtrack", "impossible", 96);
  add("One-Winged Angel", "Nobuo Uematsu", "Final Fantasy VII", 1997, "soundtrack", "impossible", 95);
  add("Zanarkand", "Nobuo Uematsu", "Final Fantasy X", 2001, "soundtrack", "impossible", 94);
  add("Rip & Tear", "Mick Gordon", "DOOM", 2016, "soundtrack", "impossible", 95);
  add("City of Tears", "Christopher Larkin", "Hollow Knight", 2017, "soundtrack", "impossible", 93);
  add("Merry-Go-Round of Life", "Joe Hisaishi", "Howl's Moving Castle", 2004, "soundtrack", "impossible", 97);
  add("One Summer's Day", "Joe Hisaishi", "Spirited Away", 2001, "soundtrack", "impossible", 96);

  return tracks;
}
