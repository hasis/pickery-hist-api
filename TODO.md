#### Pickery 3.0

- [ ] Create New Game / Pack (Needs UI)
- [X] Create new Leaderboard Entry
- [X] Return Random Fixtures (currently returning in order)
- [-] Import from Football Data
- [ ] Import NBA 
    https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4387&s=2021-2022
- [X] Import NFL
- [ ] Import MLB
- [ ] Import Tennis
- [X] Swagger

#### Create Sets:

- [X] Database Connection Created
    - Can associate the two
    - A function exists to return games associated with a specific Event
- [X] Basic UI Exists
- [X] Can Create Events and Add Games
- [X] Can Create Fixtures (need to check for existing somehow)
- [ ] Can Edit

#### What does this flow look like?

- User creates a Set (Event) if it does not exist
- [X] List of events and associated Games
- User Adds existing fixtures to event √
    - Needs UI / Form √
        - Event Name : String 
        - Event Description : String
        - Games : Array[Game]
    - Needs Search √
    - Needs a Filter by Sport Type? √
    - Needs Edit Mode √ 
        - Remove Game from Event: "[Remove]" button √
        - Edit Mode availableGames list should also filter out existing!
    - Can Submit √

- User can create new fixture to event (Phase 2?)
    - Needs UI / Form
        - Home Team
            - Name
            - ShortName
            - Score
        - Away Team
            - Name
            - ShortName
            - Score
        - Date
        - Winner

#### Newsfeed: Funny or historical news ticker.

These exist in the database and are returned one by one from the API. 

- [ ] Display in iOS UI
- [ ] Return in React App
- [ ] API Endpoint
- [ ] API Endpoint to grab a random string row from database
- [ ] Admin Portal has a place to add a string

----

##### UI Changes

- [X] Fix React App
- [ ] Import MLS and other Logos
- [ ] Look into a CDN for logos?
- [ ] WTF was happening with the game rules the other day?

#### iOS

- [ ] Fire Confetti on % 5 making it more special.
- [ ] Timer can go negative if skips the 0 second mark?
- [X] Main Page
    - Access to Infinity Mode or Events Mode.
    - Inifinity Mode opens the existing game.
- [X] Events Mode
    - Events Mode opens a selection of existing events.
    - Events Mode games have a timer but have an X/X scoreboard instead of point system. 
    - There is no leaderboard for this mode yet (replaying a pre-set mode would allow for cheating; and we can't disallow replays without creating accounts).
        Though it's possible to only allow to add to this leaderboard only on the first playthrough (currently possible)
        - [X] Modify existing Leaderboard form to also have a param for the gameType.
        - [x] This would require the Database to expand to discern between different Game Types on a Leaderboard
        - [X] Added a database association of a leaderboard entry to an event.
        - [X] This would require the APIs to be rewritten (for POST) (FALSE)
        - [ ] Rewrite GET endpoint to accept an optional parameter for gameType and only return those Leaderboard entries. Currently returns all. 
        - [X] Any current implementations of Leaderboard would break (FALSE)