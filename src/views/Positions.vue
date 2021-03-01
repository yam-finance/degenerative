<template>
  <div class="positions">
    <Container :size="900">
      <Card>
        <h2 class="flex">
          <b>Positions</b>
        </h2>
      </Card>
      <Space size="md" />
      <div v-if="true" style="overflow-x: auto;" id="container">
        <Table :headers="headers" :positions="positions" :actions="actions" />
      </div>
      <div v-else>
        <span>You do not have any positions to display.</span>
      </div>
    </Container>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Positions",

  head: {
    title: "Positions",
    meta: [{ name: "description", content: "User Positions" }],
  },

  data() {
    return {
      headers: ["name", "price", "qty", "total", "collateral", "collateral ratio", "actions"],
      positions: [],
    };
  },

  methods: {
    ...mapActions(["getAllUserPositions", "settleUserPosition"]),

    sortTable: function(header) {
      if (this.sortColumn === header) {
        this.ascending = !this.ascending;
      } else {
        this.ascending = true;
        this.sortColumn = header;
      }

      this.positions.sort((a, b) => {
        if (a[header] > b[header]) {
          return this.ascending ? 1 : -1;
        } else if (a[header] < b[header]) {
          return this.ascending ? -1 : 1;
        } else {
          return 0;
        }
      });
    },

    setCurrentPositions: async function() {
      this.positions = await this.getAllUserPositions();
    },
  },

  mounted: async function() {
    this.setCurrentPositions();
  },

  computed: {
    showTable: function() {
      return this.positions.length !== 0;
    },

    // Create all necessary actions and pass into Table
    actions: function() {
      return [
        {
          name: "Settle",
          action: tokenName => this.settleUserPosition(tokenName),
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  box-shadow: 0px 4px 10px 2px #ca625a14;
  border-radius: 10px;
  z-index: 1;
}
</style>
