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
- [ ] Basic UI Exists
- [ ] Can Create Events and Add Games
- [ ] Can Create Fixtures (need to check for existing somehow)

#### What does this flow look like?

- User creates a Set (Event)
- User Adds existing fixtures to event
    - Needs UI / Form
        - Event Name : String
        - Event Description : String
        - Games : Array[Game]
    - Needs Search
    - Needs Edit Mode
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

#### iOS

- [ ] Fire Confetti on % 5 making it more special.
- [ ] Timer can go negative if skips the 0 second mark?