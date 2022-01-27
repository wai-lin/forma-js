module.exports = {
  client: {
    service: {
      name: "my-graphql-service",
      localSchemaFile: "./schema.gql",
      includes: [
        "./src/**/*.js",
        "./src/**/*.ts",
        "./src/**/*.jsx",
        "./src/**/*.tsx",
        "./src/**/*.graphql",
        "./src/**/*.gql",
      ],
      excludes: ["**/__test__/**", "*.text.*", "*.spec.*"],
    },
  },
};
