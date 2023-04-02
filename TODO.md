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
- [ ] List of events and associated Games
- User Adds existing fixtures to event
    - Needs UI / Form √
        - Event Name : String 
        - Event Description : String
        - Games : Array[Game]
    - Needs Search √
    - Needs a Filter by Sport Type? √
    - Needs Edit Mode ! 
        - Remove Game from Event: "[Remove]" button
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

----

##### UI Changes

- [ ] Fix React App
- [ ] Import MLS and other Logos
- [ ] Look into a CDN for logos?

- [ ] WTF was happening with the game rules the other day?

#### iOS

- [ ] Fire Confetti on % 5 making it more special.
- [ ] Timer can go negative if skips the 0 second mark?