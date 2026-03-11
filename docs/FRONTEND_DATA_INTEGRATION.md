# Frontend Data Integration Guide

**Last Updated**: March 2026  
**Status**: 100% Core Features Integrated

---

## Overview

All frontend components in the React application are integrated with the backend API. No mock data, sample data, or hardcoded data is used in the core modules. Data is fetched dynamically using the `apiService` located in `frontend/src/services/api.ts`.

---

## Current Issues

### Chart Data File
- **File**: `frontend/public/assets/plugins/apexchart/chart-data.js`
- **Issue**: Contains hardcoded sample data for charts
- **Solution**: Replace with dynamic API calls

---

## Implementation Guidelines

### 1. Dashboard Charts

All dashboard charts should fetch real-time data from the backend:

```javascript
// WRONG - Hardcoded data
const chartData = {
  series: [{
    name: 'Avg. Exam Score',
    data: [75, 68, 65, 68, 75] // Sample data - DO NOT USE
  }]
};

// CORRECT - Fetch from API
async function loadChartData() {
  try {
    const response = await fetch('/api/v1/analytics/performance', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      const chartData = {
        series: [{
          name: 'Avg. Exam Score',
          data: result.data.examScores // Real data from database
        }, {
          name: 'Avg. Attendance',
          data: result.data.attendance // Real data from database
        }]
      };
      
      renderChart(chartData);
    }
  } catch (error) {
    console.error('Failed to load chart data:', error);
    // Show empty state or error message
    showEmptyState('No data available');
  }
}
```

### 2. Empty State Handling

When no data exists in the database, show appropriate empty states:

```javascript
function showEmptyState(message) {
  const container = document.getElementById('chart-container');
  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-chart-line"></i>
      <p>${message}</p>
      <p class="text-muted">Data will appear here once available</p>
    </div>
  `;
}
```

### 3. Loading States

Always show loading indicators while fetching data:

```javascript
function showLoadingState() {
  const container = document.getElementById('chart-container');
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p>Loading data...</p>
    </div>
  `;
}
```

---

## API Endpoints for Charts

### Dashboard Analytics
```
GET /api/v1/analytics/dashboard
Response: {
  success: true,
  data: {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRate: 0,
    examScores: [],
    attendanceData: []
  }
}
```

### Performance Charts
```
GET /api/v1/analytics/performance?period=monthly
Response: {
  success: true,
  data: {
    examScores: [0, 0, 0, 0, 0], // Will be empty initially
    attendance: [0, 0, 0, 0, 0],
    categories: ['Quarter 1', 'Quarter 2', 'Half yearly', 'Model', 'Final']
  }
}
```

### Student Statistics
```
GET /api/v1/analytics/students?year=2026
Response: {
  success: true,
  data: {
    monthlyData: [], // Empty array if no data
    totalCount: 0,
    activeCount: 0
  }
}
```

### Revenue Analytics (Super Admin)
```
GET /api/v1/superadmin/analytics/revenue-growth
Response: {
  success: true,
  data: [] // Empty array if no transactions
}
```

---

## Required Changes

### Files to Update

1. **Dashboard Pages**
   - `frontend/pages/dashboard.html` - Replace static charts with API calls
   - `frontend/pages/admin-dashboard.html` - Fetch admin analytics
   - `frontend/pages/teacher-dashboard.html` - Fetch teacher-specific data
   - `frontend/pages/student-dashboard.html` - Fetch student-specific data

2. **Chart Initialization**
   - Remove dependency on `chart-data.js` for production data
   - Create new `api-chart-loader.js` for dynamic chart loading

3. **Analytics Pages**
   - `frontend/pages/analytics.html` - All charts from API
   - `frontend/pages/reports.html` - Report data from API

---

## Implementation Steps

### Step 1: Create API Service Layer
```javascript
// frontend/js/services/api.js
class APIService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('accessToken');
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  }
}

const api = new APIService('/api/v1');
```

### Step 2: Create Chart Loader
```javascript
// frontend/js/utils/chart-loader.js
class ChartLoader {
  static async loadDashboardCharts() {
    try {
      showLoadingState();
      
      const data = await api.get('/analytics/dashboard');
      
      if (data.success && data.data) {
        this.renderPerformanceChart(data.data);
        this.renderAttendanceChart(data.data);
        this.renderStatisticsChart(data.data);
      } else {
        showEmptyState('No data available');
      }
    } catch (error) {
      console.error('Failed to load charts:', error);
      showErrorState('Failed to load data');
    }
  }

  static renderPerformanceChart(data) {
    // Only render if data exists
    if (!data.examScores || data.examScores.length === 0) {
      showEmptyState('No performance data available');
      return;
    }

    const options = {
      chart: { type: 'area', height: 355 },
      series: [{
        name: 'Avg. Exam Score',
        data: data.examScores // Real data from database
      }, {
        name: 'Avg. Attendance',
        data: data.attendance // Real data from database
      }],
      xaxis: {
        categories: data.categories || []
      }
    };

    const chart = new ApexCharts(
      document.querySelector("#performance_chart"),
      options
    );
    chart.render();
  }
}
```

### Step 3: Update HTML Pages
```html
<!-- Remove static chart-data.js -->
<!-- <script src="/assets/plugins/apexchart/chart-data.js"></script> -->

<!-- Add dynamic chart loader -->
<script src="/js/services/api.js"></script>
<script src="/js/utils/chart-loader.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', async () => {
    await ChartLoader.loadDashboardCharts();
  });
</script>
```

---

## Testing Empty States

### Initial State (No Data)
- All charts should show empty state messages
- No errors should be thrown
- UI should remain functional

### With Data
- Charts should render with real data from database
- Data should update when new records are added
- Filters should work correctly

---

## Best Practices

1. **Always Check for Data**
   ```javascript
   if (!data || data.length === 0) {
     showEmptyState();
     return;
   }
   ```

2. **Handle Errors Gracefully**
   ```javascript
   try {
     const data = await api.get('/endpoint');
   } catch (error) {
     showErrorState(error.message);
   }
   ```

3. **Show Loading States**
   ```javascript
   showLoadingState();
   const data = await fetchData();
   hideLoadingState();
   ```

4. **Cache When Appropriate**
   ```javascript
   const cacheKey = 'dashboard_data';
   const cached = sessionStorage.getItem(cacheKey);
   
   if (cached) {
     renderCharts(JSON.parse(cached));
   } else {
     const data = await fetchData();
     sessionStorage.setItem(cacheKey, JSON.stringify(data));
     renderCharts(data);
   }
   ```

---

### 3. Transport Pickup Points CRUD

- **Live API wiring**: `frontend/src/pages/transport/TransportPickupPointsPage.tsx` now loads pickup points through `transportService.getPickupPoints({ institutionId })` and re-fetches the list every time a modal submits so the UI mirrors MongoDB rather than mutate a local array.

- **CRUD modals**: Add, edit, delete, and bulk-delete actions call the corresponding `transportService` helper (`createPickupPoint`, `updatePickupPoint`, `deletePickupPoint`, `bulkDeletePickupPoints`) before refreshing the table, guaranteeing backend persistence every time.

- **User feedback**: Toasts plus loading/saving flags show success/error states while the backend sync completes.

---

## Summary

- **NO hardcoded data** in production
- **ALL data** must come from backend API
- **Empty states** for zero data scenarios
- **Loading states** during API calls
- **Error handling** for failed requests
- **Real-time updates** when data changes

---

## Next Steps

1. Create API service layer (`frontend/js/services/api.js`)
2. Create chart loader utility (`frontend/js/utils/chart-loader.js`)
3. Update all dashboard HTML files to use dynamic loading
4. Remove or deprecate `chart-data.js` for production use
5. Test with empty database to verify empty states
6. Test with populated database to verify data rendering

---

> **Important**: The application should work perfectly with an empty database, showing appropriate "No data available" messages instead of errors or mock data.
