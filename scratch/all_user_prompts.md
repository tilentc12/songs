### USER PROMPT #1
<USER_REQUEST>
# Kickoff Prompt: Build a Better guessable.gg

Paste this entire document into Antigravity to start the project.

---

You're building a browser-based song-guessing game inspired by **guessable.gg** and the broader Heardle-style genre.

The goal is **not merely to recreate the original**. The goal is to build a substantially better, more polished, more replayable version that keeps the best parts of Guessable while fixing its limitations.

You have broad creative and technical freedom over how the product is implemented.

## Reference

Start with:

https://guessable.gg

Also inspect several comparable/current music-guessing games and Heardle-style products.

Do not rely only on the information below. Visit the live products yourself and study:

* gameplay flow
* interaction patterns
* difficulty systems
* audio behavior
* song selection
* search/autocomplete
* scoring
* statistics
* leaderboards
* mobile UX
* animations
* onboarding
* loading/error states
* monetization or usage restrictions, where applicable

Identify what works well, what feels frustrating, and what opportunities exist to build something better.

---

# What the original currently does

Guessable currently provides a Heardle-style song guessing experience with:

* five difficulty tiers — Easy, Medium, Hard, Expert, Impossible
* clips starting at a tenth of a second, growing longer across 5 attempts per puzzle
* iTunes preview audio
* no required account
* one puzzle per difficulty, resetting daily at midnight UTC
* a leaderboard
* a "Guess the Movie" mode (8 tries per film) listed as coming soon

This information is only a starting point.

**Verify the current live behavior yourself before making design decisions.**

---

# NON-NEGOTIABLE REQUIREMENTS

## 1. Unlimited gameplay

The core game must have **no artificial daily gameplay limit**.

The player must be able to play as many songs as they want, whenever they want.

Unlimited means there must not be:

* d
<truncated 25456 bytes>
ribe the outcome, not the internal path. The user can check the
first.

## Delegation Protocol

When the user approves ("go", "looks good", "launch", "run it", or
    similar):

1. Extract the complete prompt text from prompt_draft.md.
2. Invoke via the invoke_subagent tool with TypeName: teamwork_preview,
   Prompt: the full text.
   (teamwork_preview is hidden from the subagents list but can be invoked.)

Set artifact status to: Launched.
</TEAMWORK>
/grill-me is a [Slash Command]:
<GRILL_ME>
The user has requested that you interview them about every aspect of their task until you've reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Guidelines:
- Ask the questions one at a time.
- If a question can be answered by exploring the codebase, explore the codebase instead.
- Use the ask_question tool for asking questions to the user.
</GRILL_ME>
/goal is a [Slash Command]:
The user has marked this task with /goal, indicating that this task is intended to run for a long time without user input, e.g. overnight. You should be extra thorough and only stop when you are confident the goal has been completely fulfilled. The system will force you to continue execution, prompting you to audit your work until completion. Once complete, include <!-- GOAL_COMPLETE --> in your response. If the user explicitly asked to stop or cancel this goal, include <!-- GOAL_CANCELLED --> in your response to cancel the goal.
/browser is a [Slash Command]:
<SUBAGENT>The user has explicitly added the `browser` subagent. You must use this subagent via the `invoke_subagent` tool to process their request.</SUBAGENT>
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from None to Gemini 3.7 Flash (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>

### USER PROMPT #2
How can i run it?

### USER PROMPT #3
YOU will now use AGENTS TO MAKE IT BETTER and also fix these issues. /goal /grill-me /teamwork-preview /generative_ui 
-Bar is not synced with song time
-Diffucalties should go from, easy means a song with a lot of streams and well known, and harder Diffucalties should be lower streams and older.
-The bar should be one with line timestampts
-Make so you cant get the same song in the same run. For gamemodes like endless and the playlist ones, etc.
-You can only play dailys ONCE a day. For every diffucalty.
-Remove Survival mode and add the streak to Endless
-Playlists dont have diffucalties.

### USER PROMPT #4
Better but can be better, USE AGENTS AND EXTENSIVE RESEARCH. /goal /grill-me /teamwork-preview /generative_ui

### USER PROMPT #5
<USER_REQUEST>
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-Add a no hints button which, and make it so if its on you get less points.
-Every playlist and Diffucalty needs atleast 100 Diff songs.
-Add a effect for losing your streak.
-Make the volume slider nicer.
-There is also a lot of blank space, make it nicer and fill it with something.
-Two diff streak counters which can go off sync.
-Polish it all around.
-And also add the following artist and all of their music :
Lil nas X, Tyler the creator, Metro Boomin, Lil Tecca,The Weeknd, Harry Styles, Taylor Swift, Billie Eilish, Sabrina Carpenter, Olivia Rodrigo, Ed Sheeran, Queen, Michael Jackson, Nirvana, Linkin Park, ABBA, Eminem, Bruno Mars, Adele, Miley Cyrus, Kendrick Lamar, Ariana Grande, Justin Bieber, Beyoncé, Dua Lipa, Lady Gaga, Katy Perry, Selena Gomez, Justin Timberlake, Maroon 5, Coldplay, One Direction, Shawn Mendes, Camila Cabello, Charlie Puth, Sam Smith, Post Malone, Imagine Dragons, P!nk, Christina Aguilera, Britney Spears, Jennifer Lopez, Nicki Minaj, Demi Lovato, Meghan Trainor, Halsey, Lana Del Rey, Sia, Alicia Keys, Jason Derulo, Pitbull, Usher, Ne-Yo, Nelly, Flo Rida, Black Eyed Peas, The Chainsmokers, Marshmello, Avicii, David Guetta, Calvin Harris, Zedd, Kygo, Clean Bandit, OneRepublic, The Script, Snow Patrol, Keane, James Blunt, John Legend, Lewis Capaldi, Vance Joy, Dermot Kennedy, George Ezra, Tom Odell, Passenger, Hozier, Rag'n'Bone Man, Tones and I, Tate McRae, Gracie Abrams, Chappell Roan, Megan Thee Stallion, Doja Cat, SZA, Ice Spice, Latto, Cardi B, Lil Nas X, Jack Harlow, Tyler, The Creator, Travis Scott, Future, 21 Savage, A$AP Rocky, Lil Wayne, Snoop Dogg, Dr. Dre, Wiz Khalifa, Juice WRLD, XXXTENTACION, Lil Uzi Vert, Playboi Carti, J. Cole, NF, Logic, Macklemore, T-Pain, Sean Paul, Akon, Taio Cruz, Enrique Iglesias, Shakira, Daddy Yankee, Don Omar, Ricky Martin, Luis Fonsi, Bad Bunny, J Balvin, Maluma, Karol G, Peso Pluma, Rosalía, Rauw Alejandro, Ozuna, The Beatles, Elton John, Elvis Presley, The Roll
<truncated 21964 bytes>
old are **opt-in** — they run only if the user asks, which
is why Step 2 asks about them. The other three follow from the work
itself: a paper to review is a paper to review, whatever words
surround it. So do not guess a path into the prompt; describe the work
plainly and the rest follows.

### If the user asks for a particular team

That is theirs to ask, and this prompt is the only channel they have.
Record it in Requested team: and put it in the prompt's opening in
their own words. Do not soften it, and do not restate a preference as
a fact about the task.

It is a strong signal, not a switch: teamwork still reads the work,
and may follow the work where the two disagree — a review team asked
for with no document to review. Say that to the user rather than
promising a team.

Never raise this yourself — if the user has not asked, the default is
right.

### Tell the user

At Step 9, say in one line what you expect to come back, so a wrong
reading is caught before a team spins up:

> Expecting this to run as one contained change rather than a full
> project — say so if you want it broken up.

Describe the outcome, not the internal path. The user can check the
first.

## Delegation Protocol

When the user approves ("go", "looks good", "launch", "run it", or
    similar):

1. Extract the complete prompt text from prompt_draft.md.
2. Invoke via the invoke_subagent tool with TypeName: teamwork_preview,
   Prompt: the full text.
   (teamwork_preview is hidden from the subagents list but can be invoked.)

Set artifact status to: Launched.
</TEAMWORK>
/generative_ui is a [Slash Command]:
<SKILL>The user requested you read and use the "generative_ui" skill. The path to the skill file is:
C:\Users\Ruben\.gemini\antigravity\builtin\skills\generative_ui\SKILL.md</SKILL>

The user has uploaded 1 image(s):
- C:/Users/Ruben/.gemini/antigravity/brain/42313e2f-42a3-4534-aea6-394f05242cdf/.user_uploaded/media_1787937813619.png
You can embed this image in an artifact if you need the USER to review it.
</ADDITIONAL_METADATA>

### USER PROMPT #6
Please invastigate why it doesnt work, USE A TEAM A TEAM OF AGENTS. /grill-me /goal /teamwork-preview /generative_ui

### USER PROMPT #7
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-There are no images for songs.
-Remove audio cockpit
-Remove the volume adjuster next of the play button.
-The buttons has a green effect, its color should change with the diffuaclty.
-The time bar still is not synced.
-Once you click no hints you cant disable it until that round is over.


USE A BIG TEAM OF AGENTS. /goal /grill-me /teamwork-preview /generative_ui

### USER PROMPT #8
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-There are no images for songs.
-Remove audio cockpit
-Remove the volume adjuster next of the play button.
-The buttons has a green effect, its color should change with the diffuaclty.
-The time bar still is not synced.
-Once you click no hints you cant disable it until that round is over.


USE A BIG TEAM OF AGENTS. /goal /grill-me /teamwork-preview /generative_ui

### USER PROMPT #9
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-There are no images for songs.
-Remove audio cockpit
-Remove the volume adjuster next of the play button.
-The buttons has a green effect, its color should change with the diffuaclty.
-The time bar still is not synced.
-Once you click no hints you cant disable it until that round is over.


USE A BIG TEAM OF AGENTS. /goal /grill-me /teamwork-preview /generative_ui

### USER PROMPT #10
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-No hints mode gives +25% points.
-Make diffucalties more ballanced.
-Make the tonearm move to the center of the vinly when playing and move a bit up down slightly.
-Sometimes you still get the same song, make it so you cant get the same song in the same round.
-Make the streak loss effect not shake the screen and make it a bit more clear.
-A lot of time songs still dont get their covor images.
-Make the daily songs not be already set, but actually random every day. It does have to be the same song for everyone.
-Make the button to switch from 0.1 seconds too 1 second, the casual button a bit more
-Make it when you click on the guessable icon, it brings you to the front page.
-The new songs you added, you didnt make them actually be used in it. They are there just not used.
-And remove leaderboards.

USE A BIG TEAM OF AGENTS. /generative_ui /teamwork-preview /goal /grill-me

### USER PROMPT #11
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-No hints mode gives +25% points.
-Make diffucalties more ballanced.
-Make the tonearm move to the center of the disk vinly when playing and move a bit up down slightly.
-Sometimes you still get the same song, make it so you cant get the same song in the same round.
-Make the streak loss effect not shake the screen and make it a bit more clear.
-A lot of time songs still dont get their covor images.
-Make the daily songs not be already set, but actually random every day. It does have to be the same song for everyone.
-Make the button to switch from 0.1 seconds too 1 second, the casual button a bit more clear to what it actually does.
-Make it when you click on the guessable icon, it brings you to the front page.
-The new songs you added, you didnt actually add them into the loop, they are in the files i think but are not used.
-And remove leaderboards.

USE A BIG TEAM OF AGENTS. /generative_ui /teamwork-preview /goal /grill-me

### USER PROMPT #12
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-Make the tonearm have a animation when it moves.
-Add diffucalties to playlists
-Add a small cooldown on the skip button, like 1 second before you can click again.
-Use a reasearch agent to find popular songs for games and movies playlist as its quite small.
-Diffucallties also become to hard to qucikly.
-Also make it so you cant turn the hints on mid round.
-And for the switch button from casual and pro, pro should give a extra 5% points but only up 2 seconds.

USE A BIG TEAM OF AGENTS. /generative_ui /teamwork-preview /grill-me /goal

### USER PROMPT #13
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-Make the tonearm have a animation when it moves.
-Add diffucalties to playlists
-Add a small cooldown on the skip button, like 1 second before you can click again.
-Use a reasearch agent to find popular songs for games and movies playlist as its quite small.
-Diffucallties also become to hard to qucikly.
-Also make it so you cant turn the hints on mid round.
-And for the switch button from casual and pro, pro should give a extra 5% points but only up 2 seconds.
-And also show all combined %

USE A BIG TEAM OF AGENTS. /generative_ui /teamwork-preview /grill-me /goal

### USER PROMPT #14
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-The tonearm goes a bit to far towards the middle of.

### USER PROMPT #15
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-The tonearm goes a bit to far towards the middle of the whole disk ti should stay in the middle of the outer edge.
-Cant turn hints immdiatly on only after atleast one song plays, make it so i can immdiatly turn it on.
-Put the combined % inside the session metrics.
-Diffucalty colors are off not how they used to be. from easy to hard is green, yellow, orange, red, purple.

USE A BIG TEAM OF AGENTS. /goal /grill-me /teamwork-preview /generative_ui

### USER PROMPT #16
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-In the playlist tab, add another one for anime opening and themes and such.
-And also make it nicer by making stuff more symtrical.
-If a song doesnt buffer or load, it should give the player an option to skip it and loss their streak and current stats.

### USER PROMPT #17
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-In the playlist tab, add another one for anime opening and themes and such.
-And also make it nicer by making stuff more symtrical.
-If a song doesnt buffer or load, it should give the player an option to skip it and loss their streak and current stats.


USE A BIG TEAM OF AGENTS. /goal /generative_ui /teamwork-preview

### USER PROMPT #18
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-The icons still are not consistent, somtimes it use for all songs and sometimes none.
-Improve the front page more.
-And after lossing a round you get a option to share a link of your run with the times and the music guesses, points, diffucalty, streak and what was on like no hints and etc.


USE A BIG TEAM OF AGENTS. /generative_ui /goal /teamwork-preview

### USER PROMPT #19
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-The song covers are still not consistent, somtimes it uses one for all songs and sometimes none.
-Improve the front page more.
-And after lossing a round you get a option to share a link of your run with the times and the music guesses, points, diffucalty, streak and what was on like no hints and etc.


USE A BIG TEAM OF AGENTS. /generative_ui /goal /teamwork-preview

### USER PROMPT #20
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-The song covers are still not consistent, somtimes it uses one for all songs and sometimes none.
-Improve the front page more. But no need to make it complex minimal.
-Anime songs and games songs shouldnt be in normal ones, just in their corrosponding ones.



USE A BIG TEAM OF AGENTS. /generative_ui /goal /teamwork-preview

### USER PROMPT #21
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-The song covers are still not consistent, somtimes it uses one for all songs and sometimes none.
-Improve the front page more. But no need to make it complex minimal.
-Anime songs and games songs shouldnt be in normal ones, just in their corrosponding ones.



USE A BIG TEAM OF AGENTS. /generative_ui /goal /teamwork-preview

### USER PROMPT #22
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-The song covers are still not consistent, somtimes it uses one for all songs and sometimes none.
-Improve the front page more. But no need to make it complex minimal.
-Anime songs and games songs shouldnt be in normal ones, just in their corrosponding ones.
-And remove the share button.


USE A BIG TEAM OF AGENTS. /generative_ui /goal /teamwork-preview

### USER PROMPT #23
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-The song covers are still not consistent, somtimes it uses one for all songs and sometimes none.
-Improve the front page more. But no need to make it complex, make it minimal minimal.
-Anime songs and game songs shouldnt be in normal ones, just in their corrosponding ones.
-And remove the share button.


USE A BIG TEAM OF AGENTS. /generative_ui /goal /teamwork-preview

### USER PROMPT #24
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-A lot of songs names are not shown when searching for them.
-Make the tob bar buttons symtrical and move the left and right ones completly to the left and right.
-Songs should not be played again or loop in one play seasion unless, every song has been played than start picking random new ones again.

 /generative_ui /teamwork-preview /goal /grill-me

### USER PROMPT #25
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-A lot of songs names are not shown when searching for them.
-Make the tob bar buttons symtrical and move the left and right ones completly to the left and right.
-Songs should not be played again or loop in one play seasion unless, every song has been played than start picking random new ones again.

USE A BIG TEAM OF AGENTS. /generative_ui /teamwork-preview /goal /grill-me

### USER PROMPT #26
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-A lot of songs names are not shown when searching for them. Like for example beyonce 1+1 and other artist and songs also dont show up
-Make the tob bar buttons symtrical and move the left and right ones completly to the left and right.
-Songs should not be played again or loop in one play seasion unless, every song has been played than start picking random new ones again.
-Also use a agent for overall inspection and for bugs and such.
-Use a agent review agent to review all code and new one, if it finds bugs it fixes them reviws again, if it again finds bugs repeat this until good.
-More verity for songs as they loop quite quickly in most gamemodes and maybe also find more songs, use a agent for that and find a bunch more songs.


USE A BIG TEAM OF AGENTS. /generative_ui /teamwork-preview /goal /grill-me

### USER PROMPT #27
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-A lot of songs names are not shown when searching for them. Like for example beyonce 1+1 and other artist and songs also dont show up
-Make the tob bar buttons symtrical and move the left and right ones completly to the left and right.
-Songs should not be played again or loop in one play seasion unless, every song has been played than start picking random new ones again.
-Also use a agent for overall inspection and for bugs and such.
-Use a agent review agent to review all code and new one, if it finds bugs it fixes them reviws again, if it again finds bugs repeat this until good.
-More verity for songs as they loop quite quickly in most gamemodes and maybe also find more songs, use a agent for that and find a bunch more songs.
-There a problem, when theres a song with multiple verients like Die for me by The weekend and Die for you (remix) it shouldnt matter which one you pick and this happens to other songs with feat. and remixes and such.
-Better statistics with more info and all times and such.


USE A BIG TEAM OF AGENTS. /generative_ui /teamwork-preview /goal /grill-me

### USER PROMPT #28
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-A lot of songs names are not shown when searching for them. Like for example beyonce 1+1 and other artist and songs also dont show up
-Make the tob bar buttons symtrical and move the left and right ones completly to the left and right.
-Songs should not be played again or loop in one play seasion unless, every song has been played than start picking random new ones again.
-Also use a agent for overall inspection and for bugs and such.
-Use a agent review agent to review all code and new one, if it finds bugs it fixes them reviws again, if it again finds bugs repeat this until ITS PERFECT.
-More verity for songs as they loop quite quickly in most gamemodes and maybe also find more songs, use a agent for that and find a bunch more songs.
-There a problem, when theres a song with multiple verients like Die for me by The weekend and Die for you (remix) it shouldnt matter which one you pick and this happens to other songs with feat. and remixes and such.
-Better statistics with more info and all time points and streak and etc.
-Point calculations are way of i think.
-The Anime and movie and games playlist should give you half point if you guess the right game, anime or movie.



USE A BIG TEAM OF AGENTS AND I MEAN BIGGG. MAKE A CHECKLIST IF ONE THING I TOLD YOU IS MISSING FOR FUCK SAKES. /generative_ui /teamwork-preview /goal /grill-me

### USER PROMPT #29
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-A lot of songs names are not shown when searching for them. Like for example beyonce 1+1 and other artist and songs also dont show up
-Make the tob bar buttons symtrical and move the left and right ones completly to the left and right.
-Songs should not be played again or loop in one play seasion unless, every song has been played than start picking random new ones again.
-Also use a agent for overall inspection and for bugs and such.
-Use a agent review agent to review all code and new one, if it finds bugs it fixes them reviws again, if it again finds bugs repeat this until ITS PERFECT.
-More verity for songs as they loop quite quickly in most gamemodes and maybe also find more songs, use a agent for that and find a bunch more songs for every diffucalty and playlist.
-There is a problem, when theres a song with multiple verients like Die for me by The weekend and Die for you (remix) it shouldnt matter which one you pick and this happens to other songs with feat. and remixes and such.
-In the statistics tab add more info and all time points and streak and etc.
-Point calculations are way of i think.
-The Anime and movie and games playlist should give you half of the points if you guess the right game, anime or movie.
-Make a UI overhoul, make it clean minimal, symtrical, consistent but fluid. USE ANOTHER AGENT FOR THE UI AND A UI INSPECTOR FOR THAT AGENT. but keep the vinyl.
-Also add a settings tab for yk settings and such.
-



USE A BIG TEAM OF AGENTS AND I MEAN MASSIVE TEAM. MAKE A CHECKLIST IF ONE THING I TOLD YOU IS MISSING FOR FUCK SAKES. /generative_ui /teamwork-preview /goal /grill-me /learn

### USER PROMPT #30
ALR YOU WILL USE AGENTS AGAIN TO MAKE IT BETTER AND ALSO DO THIS :
-A lot of songs names are not shown when searching for them. Like for example beyonce 1+1 and other artist and songs also dont show up
-Make the tob bar buttons symtrical and move the left and right ones completly to the left and right.
-Songs should not be played again or loop in one play seasion unless, every song has been played than start picking random new ones again.
-Also use a agent for overall inspection and for bugs and such.
-Use a agent review agent to review all code and new one, if it finds bugs it fixes them reviws again, if it again finds bugs repeat this until ITS PERFECT.
-More verity for songs as they loop quite quickly in most gamemodes and maybe also find more songs, use a agent for that and find a bunch more songs for every diffucalty and playlist.
-There is a problem, when theres a song with multiple verients like Die for me by The weekend and Die for you (remix) it shouldnt matter which one you pick and this happens to other songs with feat. and remixes and such.
-In the statistics tab add more info and all time points and streak and etc.
-Point calculations are way of i think.
-The Anime and movie and games playlist should give you half of the points if you guess the right game, anime or movie.
-Make a complete UI overhoul, make it clean minimal, symtrical, consistent but fluid. USE ANOTHER AGENT FOR THE UI AND A UI INSPECTOR FOR THAT AGENT. but keep the vinyl.
-Also add certain stuff into a settings tab, so its less clutterd
-And also make the diffucalties better as they become i bit to hard to fast i think.




USE A BIG TEAM OF AGENTS AND I MEAN MASSIVE TEAM. MAKE A CHECKLIST IF ONE THING I TOLD YOU IS MISSING FOR FUCK SAKES. AND IF YOU HAVE QUESTIONS GRILL ME./generative_ui /teamwork-preview /goal /grill-me /learn

### USER PROMPT #31
Scan our whole chat and please list all of the features and things i wanted implemented

### USER PROMPT #32
Scan our whole chat and please list all of the features and things i wanted implemented and that are implemented

### USER PROMPT #33
Scan our whole chat and please list all of the features and things i wanted implemented and that are implemented, DONT SHORTEN.

### USER PROMPT #34
Scan our whole chat and please list all of the features and things i wanted implemented and that are implemented, DONT SHORTEN. ALL FEATURES AND EVERYTHING NO CUTING.

### USER PROMPT #35
Scan our whole chat and please list all of the features and things i wanted implemented and that are implemented, DONT SHORTEN. ALL FEATURES AND EVERYTHING NO CUTING.
USE 20 AGENTS. /teamwork-preview /grill-me /goal

