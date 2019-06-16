module.exports = {
  service: {
    service: {
      name: "Genesys225-1393",
      url: "http://localhost:5000/graphql"
    },
    skipSSLValidation: true,
    excludes: ["node_modules/**/*"],
    includes: ["src/**/*.{ts,gql,tsx,js,jsx,graphql}"]
  }
};
