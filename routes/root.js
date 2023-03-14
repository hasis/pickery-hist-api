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
    })
  );
};
