"use strict";

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/games",
    handler: async (request, reply) => {
      const { eventType } = request.query;
      const { supabase } = fastify;
      try {
        const { data, error } = await supabase.rpc("get_games_by_event_type", {
          event_type: eventType,
        });

        if (error) {
          console.log(error);
          throw new Error(error.message);
        }

        reply.status(200).send({ data });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Internal server error" });
      }
    },
  }),
    fastify.route(
      {
        url: "/feed",
        method: ["GET"],
        schema: {
          summary: "Get Feed",
          description: "Returns a feed",
          tags: ["Feed"],
        },
        handler: async (request, reply) => {
          const { supabase } = fastify;
          const { data, error } = await supabase.rpc("randomfeed");

          console.log(data)

          if (error) {
            return error;
          } else {
            return data;
          }
        },
      },
fastify.route({
  method: "POST",
  url: "/events",
  schema: {
    body: {
      type: "object",
      required: ["name", "description", "games", "editMode"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        games: {
          type: "array",
          items: {
            type: "string",
            format: "uuid",
          },
        },
        editMode: { type: "boolean" },
        id: { type: "string", format: "uuid" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
    },
  },
  handler: async (request, reply) => {
    const { name, description, games, editMode, eventID, isActive } = request.body;
    const { supabase } = fastify;

    try {
      let event;
      let eventGames;

      console.log(request.body)

      if (editMode) {
        // Update existing event
        event = await supabase
          .from("events")
          .upsert({
            id: eventID,
            name,
            description,
            isActive
          })
          .single();

        console.log({message: "UPDATED", id: event})
        // Delete existing event_games records
        await supabase.from("event_games").delete().eq("event_id", eventID);

        // Insert new event_games records
        eventGames = await supabase
          .from("event_games")
          .insert(
            games.map((game) => ({
              event_id: event.data.id,
              game_id: game,
            })
            )
          );
      } else {
        // Create new event
        event = await supabase
          .from("events")
          .insert({
            name,
            description,
            isActive
          })
          .single();

          console.log({ message: "CREATED", event: event });

        // Insert new event_games records
        eventGames = await supabase
          .from("event_games")
          .insert(
            games.map((game) => ({
              event_id: event.data.id,
              game_id: game,
            }))
          );
      }

      if (!event || !eventGames) {
        throw new Error("Failed to create or update event");
      }

      const message = editMode ? "Event updated!" : "Event created!";
      const responseBody = {
        success: true,
        message,
      };
      reply.status(200).header("Content-Type", "application/json").send(responseBody);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ success: false, message: "Server error" });
    }
  },
}),
      fastify.route({
        url: "/event",
        method: ["GET"],
        schema: {
          summary: "Get Event",
          description: "Returns an event and it's fixtures",
          tags: ["Feed"],
          querystring: {
            type: "object",
            properties: {
              event_id: { type: "integer" },
            },
          },
        },
        handler: async (request, reply) => {
          const { supabase } = fastify;

          const event_id = request.query.event_id
            ? parseInt(request.query.event_id)
            : null;

          const { data, error } = await supabase.rpc("get_games_by_event", {
            event_id,
          });

          if (error) {
            return error;
          } else if (!data || data.length === 0) {
            return reply
              .status(404)
              .send("No games found for the specified event ID");
          } else {
            return { data, event_id, error };
          }
        },
      }),
      fastify.route({
        url: "/news",
        method: ["GET"],
        schema: {
          summary: "Get News",
          description: "Returns a news feed",
          tags: ["News"],
        },
        handler: async (request, reply) => {
          return "HELLO FROM THE ETHERNET. THE YEAR IS 2000 AND PICKERY IS LAZILY RELAUNCHING. NO LONGER MUST YOU PREDICT THE FUTURE. WE NOW JUST GOTTA GUESS WHAT ALREADY HAPPENED.";
        },
      }),
      fastify.route({
        url: "/leaderboard",
        method: ["GET"],
        schema: {
          summary: "Get Leaderboards",
          description: "Returns the leaderboard",
          tags: ["Leaderboard"],
        },
        handler: async (request, reply) => {
          const { supabase } = fastify;
          const { data, error } = await supabase
            .from("leaderboard")
            .select()
            .gt("score", 0)
            .order("score", { ascending: false });

          if (error) {
            return error;
          } else {
            return data;
          }
        },
      }),
      fastify.route({
        url: "/leaderboard",
        method: ["POST"],
        schema: {
          body: PostLeaderboardBody,
          summary: "New Leaderboard Entry",
          description: "Adds to the leaderboard",
          tags: ["Leaderboard"],
        },
        handler: async (request, reply) => {
          const { supabase } = fastify;
          const { data, error } = await supabase
            .from("leaderboard")
            .insert(request.body)
            .select();

          if (error) {
            return error;
          } else {
            return data;
          }
        },
      }),
      fastify.route({
        url: "/getMatches",
        method: ["GET"],
        schema: {
          summary: "Get More Matches",
          description: "Fetches more matches from the ether",
          tags: ["Feed"],
        },
        handler: async (request, reply) => {
          try {
            const response = await fetch(
              "https://api.football-data.org/v4/competitions/2021/matches?season=2020",
              {
                headers: {
                  "X-Auth-Token": "7457c0bb6b7f4c08aff02df8d60d6b72",
                },
              }
            );
            const apiResponse = await response.json();
            const matches = apiResponse.matches.map((match) => {
              return {
                originMatchID: match.id,
                homeTeamName: match.homeTeam.name,
                homeTeamShortName: match.homeTeam.shortName,
                awayTeamName: match.awayTeam.name,
                awayTeamShortName: match.awayTeam.shortName,
                winner: match.score.winner,
                homeTeamScore: match.score.fullTime.home,
                awayTeamScore: match.score.fullTime.away,
                gameDate: match.utcDate,
              };
            });

            const { supabase } = fastify;
            const { data, error } = await supabase
              .from("games")
              .insert(matches)
              .select();

            if (error) {
              return error;
            } else {
              return data;
            }
            return matches;
          } catch (err) {
            console.error(err);
            reply.status(500).send("Error fetching matches");
          }
        },
      }),
      fastify.route({
        url: "/getNFLMatches",
        method: ["GET"],
        schema: {
          summary: "Get More Matches",
          description: "Fetches more matches from the ether",
          tags: ["Feed"],
        },
        handler: async (request, reply) => {
          try {
            const response = await fetch(
              "https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4391&s=2006"
            );
            const apiResponse = await response.json();

            const matches = apiResponse.events.map((match) => {
              return {
                originMatchID: match.idEvent,
                homeTeamName: match.strHomeTeam,
                homeTeamShortName: match.strHomeTeam.split(" ").pop(),
                awayTeamName: match.strAwayTeam,
                awayTeamShortName: match.strAwayTeam.split(" ").pop(),
                winner:
                  match.intHomeScore > match.intAwayScore
                    ? "HOME_TEAM"
                    : "AWAY_TEAM",
                homeTeamScore: match.intHomeScore,
                awayTeamScore: match.intAwayScore,
                gameDate: match.dateEvent,
                eventType: "football",
              };
            });

            const { supabase } = fastify;
            const { data, error } = await supabase
              .from("games")
              .insert(matches)
              .select();

            if (error) {
              return error;
            } else {
              return data;
            }
            return matches;
          } catch (err) {
            console.error(err);
            reply.status(500).send("Error fetching matches");
          }
        },
      }),
      fastify.route({
        url: "/getMLSMatches",
        method: ["GET"],
        schema: {
          summary: "Get More Matches",
          description: "Fetches more matches from the ether",
          tags: ["Feed"],
        },
        handler: async (request, reply) => {
          try {
            const response = await fetch(
              "https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4480&s=1999-2000"
            );
            const apiResponse = await response.json();

            const matches = apiResponse.events.map((match) => {
              return {
                originMatchID: match.idEvent,
                homeTeamName: match.strHomeTeam,
                homeTeamShortName: match.strHomeTeam,
                awayTeamName: match.strAwayTeam,
                awayTeamShortName: match.strAwayTeam,
                winner:
                  match.intHomeScore > match.intAwayScore
                    ? "HOME_TEAM"
                    : "AWAY_TEAM",
                homeTeamScore: match.intHomeScore,
                awayTeamScore: match.intAwayScore,
                gameDate: match.dateEvent,
                eventType: "soccer",
              };
            });

            const { supabase } = fastify;
            const { data, error } = await supabase
              .from("games")
              .insert(matches)
              .select();

            if (error) {
              console.log(error);
              return error;
            } else {
              return data;
            }
            return matches;
          } catch (err) {
            console.error(err);
            reply.status(500).send("Error fetching matches");
          }
        },
      })
    );
};

const PostLeaderboardBody = {
  type: "object",
  properties: {
    username: { type: "string", default: "abc" },
    score: { type: "integer", minimum: 0 },
  },
};
