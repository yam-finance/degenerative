<template>
  <div class="positions">
    <Container :size="900">
      <Card>
        <h2 class="flex">
          <b>Positions</b>
        </h2>
      </Card>
      <Space size="md" />
      <div v-if="showTable" style="overflow-x: auto;" id="container">
        <!--
        <table>
          <thead>
            <tr>
              <th v-for="header in this.headers" :key="header" v-on:click="sortTable(header)">
                {{ header }}
                <div class="arrow" v-if="header === sortColumn" v-bind:class="ascending ? 'arrow-down' : 'arrow-up'" />
                <div class="arrow placeholder" v-else />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in positions" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.price }} WETH</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.total }} WETH</td>
              <td>{{ item.collateral }} WETH</td>
              <td>{{ item.collateralRatio }}</td>
              <td>
                <div v-on:click="actions[0].function(item.name)">
                  <Button class="action-button">
                    {{ actions[0].name }}
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        -->
        <Table headers="headers" positions="positions" actions="actions" />
      </div>
      <div v-else>
        <span>You do not have any positions to display.</span>
      </div>
      <!--<Table headers="testHeaders" data="positions"></Table>-->
    </Container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Positions",

  head: {
    title: "Positions",
    meta: [{ name: "description", content: "User Positions" }],
  },

  data() {
    return {
      // TODO Get these from the store
      headers: ["name", "price", "quantity", "total", "collateral", "ratio", "actions"],
      positions: [],
      ascending: false,
      sortColumn: "",
    };
  },

  methods: {
    ...mapActions(["getAllUserPositions", "settleUserPosition"]),

    ...mapGetters(["userPositions"]),

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

    settlePosition: async function(tokenName) {
      await this.settleUserPosition(tokenName);
    },

    setCurrentPositions: async function() {
      //this.positions = this.$store.getters.userPositions;
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
table {
  table-layout: auto;
  font-family: "Shanti", sans-serif;
  width: 100%;
  border-collapse: collapse;
}
table th {
  text-transform: uppercase;
  text-align: left;
  background: var(--primary);
  color: var(--back);
  cursor: pointer;
  padding: 5px;
}
table th:hover {
  background: #de473b;
}
table td {
  text-align: left;
  padding-left: 8px;
  padding-right: 8px;
  border-right: 2px solid #00000017;
}
table td:last-child {
  border-right: none;
}
table tbody tr:nth-child(2n) td {
  background: #f2a29b;
}
.arrow {
  float: right;
}
.arrow-down::after,
.arrow-up::after {
  content: " ";
  position: relative;
  border: 7px solid transparent;
  bottom: 15px;
  right: 5px;
  border-bottom-color: white;
}
.arrow-down::after {
  top: 14px;
  border-top-color: white;
}
.arrow-up::after {
  bottom: 14px;
  border-bottom-color: white;
}
.placeholder {
  content: " ";
  border: 7px solid transparent;
}

.action-button {
  margin: 4px;
}
</style>
