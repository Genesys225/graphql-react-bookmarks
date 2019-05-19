module.exports = {
  service: {
    service: {
      name: "server",
      url: "http://localhost:5000/graphql", // defaults to http://localhost:4000
      //   headers: {
      //     // optional
      //     authorization: "Bearer null"
      //   },
      skipSSLValidation: true // optional, disables SSL validation check
    }
  }
};
