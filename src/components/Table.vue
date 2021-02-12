<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="header in Object.keys(positions[0])" :key="header" v-on:click="sortTable(header)">
            {{ header }}
            <div class="arrow" v-if="header === sortColumn" v-bind:class="ascending ? 'arrow_up' : 'arrow_down'"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in positions" :key="item">
          <td v-for="key in Object.keys(item)" :key="key">{{ item[key] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Table",
  props: {
    data: Object,
  },
  data() {
    return {
      ascending: false,
      sortColumn: "",
    };
  },
  methods: {
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
        }
        return 0;
      });
    },
  },
  computed: {
    columns: function() {
      if (this.positions.length == 0) return [];
      return Object.keys(this.positions[0]);
    },
  },
});
</script>

<style lang="scss" scoped>
table {
  font-family: "Open Sans", sans-serif;
  width: 100%;
  border-collapse: collapse;
  border: 3px solid #de473b;
  margin: 10px 10px 0 0;
}

table th {
  text-transform: uppercase;
  text-align: left;
  background: var(--primary);
  color: var(--back);
  cursor: pointer;
  padding: 8px;
  min-width: 30px;
}
table th:hover {
  background: #de473b;
}
table td {
  text-align: left;
  padding: 8px;
  border-right: 2px solid var(--primary);
}
table td:last-child {
  border-right: none;
}
table tbody tr:nth-child(2n) td {
  background: #f2a29b;
}
</style>
