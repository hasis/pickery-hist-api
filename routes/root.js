"use strict";

module.exports = async function (fastify, opts) {
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
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            games: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  homeTeamName: { type: "string" },
                  awayTeamName: { type: "string" },
                  gameDate: { type: "string", format: "date-time" },
                },
              },
            },
          },
          required: ["name", "description", "games"],
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
            },
          },
        },
        tags: ["events"],
      },
      handler: async (request, reply) => {
        const { name, description, games } = request.body;

        // Perform any necessary validation of the request data here
        // ...

        const { supabase } = fastify;
        const { data, error } = await supabase.from("events").insert({
          name,
          description,
          games: JSON.stringify(games),
        });

        if (error) {
          reply.status(500).send({ message: "Failed to create event" });
        } else {
          reply.status(201).send({ id: data[0].id });
        }
      },
    }),
    fastify.route({
      url: "/event",
      method: ["GET"],
      schema: {
        summary: "Get Feed",
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
        summary: "Get Feed",
        description: "Returns a feed",
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
        summary: "Get Feed",
        description: "Returns the leaderboard",
        tags: ["Feed"],
      },
      handler: async (request, reply) => {
        const { supabase } = fastify;
        const { data, error } = await supabase
          .from("leaderboard")
          .select()
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
