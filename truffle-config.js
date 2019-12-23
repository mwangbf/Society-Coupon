module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    compilers: {
        solc: {
            version: "0.4.23",
        }
    },
    networks: {
        "development": {
            host: "127.0.0.1",
            port: 9545,
            network_id: "*" // Match any network id
        },
    }
    // develop: {
    //   port: 8545
    //}
    //}
};
