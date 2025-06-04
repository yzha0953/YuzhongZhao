<template>
  <div class="container">
    <h1>Health & Education Programs</h1>

    <div class="tables-wrapper">
      <div class="table-container">
        <interactive-table
          :data="table1Data"
          :columns="columns1"
          title="Health Support Services"
        />
      </div>

      <div class="table-container">
        <interactive-table
          :data="table2Data"
          :columns="columns2"
          title="Educational Programs"
        />
      </div>
    </div>
    <button @click="exportCSV('table1')" class="btn btn-primary">Export Health Support Services as CSV</button>
    <button @click="exportCSV('table2')" class="btn btn-primary">Export Educational Programs as CSV</button>
  </div>
</template>

<script>
import InteractiveTable from "@/components/InteractiveTable.vue";
import table1Data from "@/assets/services.json";
import table2Data from "@/assets/programs.json";

export default {
  components: {
    InteractiveTable
  },
  data() {
    return {
      columns1: [
        { label: "Service Name", key: "service" },
        { label: "Target Group", key: "targetGroup" },
        { label: "Start Date", key: "startDate" },
        { label: "End Date", key: "endDate" },
        { label: "Location", key: "location" }
      ],
      table1Data,
      columns2: [
        { label: "Program Name", key: "program" },
        { label: "Target Group", key: "targetGroup" },
        { label: "Start Date", key: "startDate" },
        { label: "End Date", key: "endDate" },
        { label: "Location", key: "location" }
      ],
      table2Data
    };
  },
  methods: {
    exportCSV(tableName) {
      let dataToExport = [];

      if (tableName === 'table1') {
        dataToExport = this.table1Data;
      } else if (tableName === 'table2') {
        dataToExport = this.table2Data;
      }

      const headers = Object.keys(dataToExport[0]).join(',') + '\n';

      const csvRows = dataToExport.map(row => Object.values(row).join(',')).join('\n');

      const csvContent = headers + csvRows;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create the download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${tableName}_data.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 20px;
  text-align: center;
}

.tables-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.table-container {
  flex: 1 1 48%;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.buttons-container .btn {
  padding: 12px 24px;
  font-size: 18px;
  background-color: #28a745; 
  color: white;
  border: none;
  border-radius: 30px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
}

.buttons-container .btn:hover {
  background-color: #218838; 
  transform: scale(1.05); 
}

.buttons-container .btn:active {
  transform: scale(0.98); 
}

@media (max-width: 1200px) {
  .tables-wrapper {
    flex-direction: column;
  }

  .table-container {
    width: 100%;
  }

  .buttons-container {
    flex-direction: column; 
    gap: 10px;
  }

  .buttons-container .btn {
    margin: 10px 0;
  }
}
</style>
