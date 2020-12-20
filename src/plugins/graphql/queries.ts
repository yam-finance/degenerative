import gql from "graphql-tag";

export const GET_BLOCK = gql`
  query blocks($timestampFrom: Int!, $timestampTo: Int!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }) {
      id
      number
      timestamp
    }
  }
`;

export const GET_HEALTH = gql`
  query health {
    indexingStatusForCurrentVersion(subgraphName: "uniswap/uniswap-v2") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`;

export const GET_BLOCKS = timestamps => {
  let queryString = "query blocks {";
  queryString += timestamps.map(timestamp => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
      number
    }`;
  });
  queryString += "}";
  return gql(queryString);
};

export const GET_PRICES_BY_BLOCK = (tokenAddress, blocks) => {
  let queryString = "query blocks {";
  queryString += blocks.map(
    block => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) { 
        derivedETH
      }
    `
  );
  queryString += ",";
  queryString += blocks.map(
    block => `
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) { 
        ethPrice
      }
    `
  );
  queryString += "}";
  return gql(queryString);
};
