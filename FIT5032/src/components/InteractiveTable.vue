<template>
  <div>
    <h3>{{ title }}</h3>
    <table class="display" ref="dataTable" style="width:100%">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in paginatedData" :key="index">
          <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
        </tr>
      </tbody>
    </table>

    <div class="search-box">
      <input
        v-for="(column, colIndex) in columns"
        :key="colIndex"
        type="text"
        :placeholder="'Search ' + column.label"
        @input="handleColumnSearch(colIndex, $event)"
      />
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" aria-label="Go to previous page">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" aria-label="Go to next page">Next</button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watchEffect } from 'vue';
import 'datatables.net';

export default {
  props: ['data', 'columns', 'title'],
  setup(props) {
    const dataTable = ref(null);
    const searchValues = reactive({});
    const filteredData = ref([...props.data]);
    const currentPage = ref(1);
    const pageSize = ref(10);

    const handleColumnSearch = (colIndex, event) => {
      searchValues[colIndex] = event.target.value.toLowerCase();
      applyColumnFilter();
    };

    const applyColumnFilter = () => {
      filteredData.value = props.data.filter((row) => {
        return props.columns.every((column, index) => {
          const searchValue = searchValues[index] || '';
          const cellValue = row[column.key]?.toString().toLowerCase() || '';
          return cellValue.includes(searchValue);
        });
      });
      currentPage.value = 1;
    };

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredData.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredData.value.length / pageSize.value);
    });

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    onMounted(() => {
      $(dataTable.value).DataTable({
        paging: false,
        ordering: true,
        searching: false,
        lengthChange: false,
        dom: 't'
      });
    });

    watchEffect(() => {
      filteredData.value = [...props.data];
    });

    return {
      dataTable,
      filteredData,
      paginatedData,
      handleColumnSearch,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
    };
  }
};
</script>

<style scoped>
table {
  margin-top: 10px;
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.search-box {
  margin-top: 10px;
  display: flex;
  gap: 1px;
  justify-content: center;
}

.search-box input {
  padding: 2px; 
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100px; 
  font-size: 12px; 
}

.search-box input::placeholder {
  font-size: 12px; 
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
