import Vue from "vue";
import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const graphClient = new ApolloClient({
  link: createHttpLink({ uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2" }),
  cache: new InMemoryCache(),
});

const graphHealthClient = new ApolloClient({
  link: createHttpLink({ uri: "https://api.thegraph.com/index-node/graphql" }),
  cache: new InMemoryCache(),
});

const graphBlockClient = new ApolloClient({
  link: createHttpLink({ uri: "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks" }),
  cache: new InMemoryCache(),
});

const graphProvider = new VueApollo({
  defaultClient: graphClient,
});

Vue.prototype.gql = {};
Vue.prototype.gql.client = graphClient;
Vue.prototype.gql.provider = graphProvider;
Vue.prototype.gql.health = graphHealthClient;
Vue.prototype.gql.block = graphBlockClient;
Vue.use(VueApollo);
