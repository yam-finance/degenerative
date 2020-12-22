<template>
  <Container :size="800">
    <Card>
      <h1>
        What is Degenerative Finance?
      </h1>
      <br />
      <p>
        Degenerative Finance is an initiative by the Yam community to build DeFi-centric derivatives on UMA’s infrastructure. With the flexible nature of UMA’s
        system, these products could include impermanent loss hedging, volatility derivatives, TVL derivatives, and more. At heart, we hope to fill a market
        need that allows for new forms of speculation and hedging in DeFi that can cater to individual and institutional investors alike.
      </p>
    </Card>
    <Card>
      <h2>
        What are Synthetic Tokens?
      </h2>
      <br />
      <p>
        Synthetic tokens are collateral-backed tokens whose value fluctuates depending on the tokens’ reference index. They are created by depositing collateral
        into a smart contract and minting tokens backed by that collateral.
      </p>
    </Card>
    <Card>
      <h2>
        What are “Priceless” Synthetic Tokens?
      </h2>
      <br />
      <p>
        Up until now, synthetic token designs required the smart contract to know the value of the collateral at all times, as reported by an on-chain price
        feed. “Priceless” synthetic tokens differ because they do not require an on-chain price feed to indicate whether the contract is properly
        collateralized. Instead, they have a liquidation mechanism that allows anyone to liquidate an undercollateralized position.
      </p>
      <br />
      <p>
        In this design, liquidators can choose to liquidate positions based on their own off-chain view of the reference index for the token, which informs
        their view on whether the position is properly collateralized. Positions that have not been liquidated are assumed to be properly collateralized.
        Oracles are only used when a liquidation is disputed — which is designed to be rare.
      </p>
    </Card>
    <Card>
      <h2>
        How do liquidations work?
      </h2>
      <br />
      <p>
        o liquidate a token sponsor position, a token holder submits tokens to the contract and posts a liquidation bond. The liquidation bond covers the cost
        of calling the DVM if the liquidation is disputed. If the liquidation is not disputed, the liquidation bond is returned to the liquidator. The tokens
        are submitted for 3 purposes: to indicate the size of the position to be liquidated, to close the token sponsor’s position, and to attest to the
        liquidator’s belief that the token sponsor’s position should be liquidated. The liquidator will lose a portion of the collateral corresponding to the
        tokens if their liquidation is disputed and found to be invalid.
      </p>
    </Card>
    <Card>
      <h2>
        What is the <u><a href="https://docs.umaproject.org/getting-started/oracle">Data Verification Mechanism (DVM)</a></u
        >?
      </h2>
      <p>
        The DVM is an optimistic oracle service available to respond to price requests made by financial contracts that are registered with it. These price
        requests ask UMA token holders to vote on the value of a price identifier at a historic timestamp. UMA token holders commit and reveal their votes
        on-chain in a process that can take 2-4 days. Once the votes are revealed, the mode of these votes is returned to the financial contract as the value
        determined by the UMA voters for the price request. The financial contract then distributes collateral to its counterparties based on the value returned
        by the DVM.
      </p>
      <br />
      <p>
        Because the DVM requires 2-4 days to respond to a price request, it is not intended to be used as an on-chain price feed that pushes prices to financial
        contracts that need it. Rather, it is complementary to “priceless” financial contracts.
      </p>
    </Card>
    <Card>
      <h2>What is the Global Collateralization Ratio?</h2>
      <br />
      <p>
        This is the average collateralization ratio across all token sponsors of a synthetic token, excluding those that have been liquidated. It is calculated
        by dividing the total collateral deposited by all token sponsors in the contract by the total number of outstanding synthetic tokens.
      </p>
      <br />
      <p>
        The GCR is used to set collateralization requirements for new synthetic token issuance and to enable “fast” withdrawals.
      </p>
      <br />
      <p>
        Additionally, “slow” withdrawals are possible that bring your collateralization ratio below the GCR, but these undergo a review period prior to
        executing.
      </p>
    </Card>
    <Card>
      <h2>What is uGAS?</h2>
      <br />
      <p>
        uGas is a synthetic Gas Futures Token (uGAS) that will settle with the median gas price of all Ethereum transactions by its expiration date, 1st day
        following expiration month.
      </p>
      <br />
      <p>
        At expiry, the uGAS-JAN21 will settle to the median gas price in ETH of all Ethereum transactions for 30 days before expiration on 00:00 UTC Feb 1st.
        Each token represents 1,000,000 Gas.
      </p>
      <br />
      <p>
        If 1 uGAS-JAN21 = 0.070 ETH. This means that median gas prices are speculated to be 70 Gwei for Jan 2021. Actual value won’t be calculated until
        expiration.
      </p>
    </Card>
    <Card>
      <h2>What can be done with uGAS token?</h2>
      <br />
      <p>
        For example, uGAS-JAN21 tokens are tradable and are usually available on Uniswap, you can trade them any time before the expiration. If you hold a token
        after expiration, you can redeem the token for ETH (after 00:00 UTC Feb 1st).
      </p>
    </Card>
  </Container>
</template>

<script>
export default {
  name: "LearnMore",
  head: {},
  data() {
    return {
      delay: 200,
      scroller: 0,
    };
  },
  components: {},
  //   methods: {},
  //   created() {},
  //   destroyed() {},
};
</script>
<style></style>
