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
        const { data, error } = await supabase.from("games").select();
        if (error) {
          return error;
        } else {
          return data;
        }
      },
    },
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
        console.log(request.body);

        const { supabase } = fastify;
        const { data, error } = await supabase
          .from("leaderboard")
          .insert(request.body)
          .select();

        if (error) {
          return error;
        } else {
          console.log(data);
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
            "https://api.football-data.org/v4/matches",
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