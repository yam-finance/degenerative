<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" v-on:click="sortTable(header)">
            {{ header }}
            <div class="arrow" v-if="header === sortColumn" v-bind:class="ascending ? 'arrow-down' : 'arrow-up'" />
            <div class="arrow placeholder" v-else />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(synth, s_index) in positions" :key="s_index">
          <!--
          <td v-for="key in Object.keys(synth)" :key="key">
            {{ synth[key] }}
          </td>-->
          <td>{{ synth.name }}</td>
          <td>{{ synth.price }} WETH</td>
          <td>{{ synth.quantity }}</td>
          <td>{{ synth.total }} WETH</td>
          <td>{{ synth.collateral }} WETH</td>
          <td>{{ synth.collateralRatio }}</td>
          <td>
            <div v-for="(action, a_index) in actions" :key="a_index" v-on:click="action.action(synth.name)">
              <Button class="action-button">
                {{ action.name }}
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "Table",
  props: {
    headers: Array,
    positions: Array,
    actions: Array,
  },
  data() {
    return {
      ascending: false,
      sortColumn: "",
    };
  },
  methods: {
    sortTable: function(header) {
      console.log(this.positions);
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
  },
});
</script>

<style lang="scss" scoped>
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
