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
      url: "/news",
      method: ["GET"],
      schema: {
        summary: "Get Feed",
        description: "Returns a feed",
        tags: ["News"],
      },
      handler: async (request, reply) => {
        return "HELLO FROM THE ETHERNET. THE YEAR IS 2000.";
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
              id: match.id,
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
              id: match.idEvent,
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
            "https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4346&s=2021"
          );
          const apiResponse = await response.json();

          const matches = apiResponse.events.map((match) => {
            return {
              id: match.idEvent,
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