/**
 * Chart Loader Utility
 * Dynamically loads and renders charts with data fetching and error handling
 */

import './chart-loader.css';
import { apiService } from '../services/api';

// TypeScript interfaces for better type safety
interface ChartConfig {
  endpoint: string;
  type: string;
  timeRange?: string;
  params?: Record<string, any>;
  options?: Record<string, any>;
}

interface ChartData {
  labels?: string[];
  datasets?: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
  data?: number[];
  value?: number;
  total?: number;
  label?: string;
  title?: string;
  change?: number;
  rows?: string[];
  cols?: string[];
  values?: number[][];
}

interface ChartInstance {
  config: ChartConfig;
  data: ChartData;
}

class ChartLoader {
  private charts: Map<string, ChartInstance> = new Map();
  private isLoading: Map<string, boolean> = new Map();
  private errorStates: Map<string, string | null> = new Map();

  constructor() {
    // Initialize retry function
    if (typeof window !== 'undefined') {
      (window as any).retryChart = (chartId: string) => {
        this.refreshChart(chartId);
      };
    }
  }

  /**
   * Initialize chart with configuration
   */
  async initChart(chartId: string, config: ChartConfig): Promise<void> {
    const element = document.getElementById(chartId);
    if (!element) {
      console.error(`Chart element ${chartId} not found`);
      return;
    }

    // Set loading state
    this.setLoading(chartId, true);
    this.renderLoadingState(element);

    try {
      // Fetch data
      const data = await this.fetchChartData(config);
      
      // Validate data
      if (!this.validateData(data, config.type)) {
        throw new Error('Invalid chart data');
      }

      // Render chart
      await this.renderChart(chartId, config, data);
      
      // Store chart reference
      this.charts.set(chartId, { config, data });
      
      // Set success state
      this.setLoading(chartId, false);
      this.setError(chartId, null);

      console.log(`[ChartLoader] Successfully initialized chart: ${chartId}`);

    } catch (error: any) {
      console.error(`Failed to load chart ${chartId}:`, error);
      this.setError(chartId, error.message || 'Unknown error');
      this.renderErrorState(element, error.message || 'Unknown error');
      this.setLoading(chartId, false);
    }
  }

  /**
   * Fetch chart data from API
   */
  async fetchChartData(config: ChartConfig): Promise<ChartData> {
    const { endpoint, timeRange, params = {} } = config;

    if (!endpoint) {
      throw new Error('Chart configuration missing endpoint');
    }

    try {
      let response: any;
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (timeRange) {
        queryParams.append('timeRange', timeRange);
      }
      
      // Add custom params
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });

      // Build full URL
      const fullUrl = endpoint + (queryParams.toString() ? `?${queryParams.toString()}` : '');
      
      console.log(`[ChartLoader] Fetching data from: ${fullUrl}`);

      // Use API service for data fetching
      response = await apiService.get(fullUrl);

      // Handle different response formats
      if (response.data) {
        return response.data;
      } else if (response) {
        return response;
      } else {
        throw new Error('No data received from API');
      }

    } catch (error: any) {
      console.error(`[ChartLoader] API Error:`, error);
      
      // In demo mode, return mock data
      if (this.isDemoMode()) {
        console.log(`[ChartLoader] Returning mock data for ${config.type}`);
        return this.getMockData(config.type);
      }
      
      throw new Error(`Failed to fetch chart data: ${error.message || 'Network error'}`);
    }
  }

  /**
   * Check if running in demo mode
   */
  private isDemoMode(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('demoModeActive') === 'true' || 
           sessionStorage.getItem('demoModeActive') === 'true';
  }

  /**
   * Get mock data for demo mode
   */
  private getMockData(chartType: string): ChartData {
    switch (chartType) {
      case 'line':
      case 'bar':
        return {
          labels: [],
          datasets: [{
            label: 'No Data',
            data: [],
            backgroundColor: 'rgba(200, 200, 200, 0.2)',
            borderColor: 'rgba(200, 200, 200, 0.5)'
          }]
        };
      case 'pie':
      case 'doughnut':
        return {
          labels: ['No Data'],
          data: [0]
        };
      case 'statistic':
        return {
          value: 0,
          label: 'No Data',
          change: 0
        };
      case 'gauge':
        return {
          value: 0,
          label: 'No Data'
        };
      default:
        return {
          labels: ['No Data'],
          datasets: [{
            label: 'No Data',
            data: [0]
          }]
        };
    }
  }

  /**
   * Render chart based on type
   */
  async renderChart(chartId: string, config: ChartConfig, data: ChartData): Promise<void> {
    const element = document.getElementById(chartId);
    if (!element) return;

    const { type, options = {} } = config;

    // Clear existing content
    element.innerHTML = '';

    switch (type) {
      case 'line':
        await this.renderLineChart(chartId, element, data, options);
        break;
      case 'bar':
        await this.renderBarChart(chartId, element, data, options);
        break;
      case 'pie':
        await this.renderPieChart(chartId, element, data, options);
        break;
      case 'doughnut':
        await this.renderDoughnutChart(chartId, element, data, options);
        break;
      case 'radar':
        await this.renderRadarChart(chartId, element, data, options);
        break;
      case 'polarArea':
        await this.renderPolarAreaChart(chartId, element, data, options);
        break;
      case 'scatter':
        await this.renderScatterChart(chartId, element, data, options);
        break;
      case 'bubble':
        await this.renderBubbleChart(chartId, element, data, options);
        break;
      case 'gauge':
        await this.renderGaugeChart(chartId, element, data, options);
        break;
      case 'heatmap':
        await this.renderHeatmapChart(chartId, element, data, options);
        break;
      case 'statistic':
        await this.renderStatisticCard(chartId, element, data, options);
        break;
      default:
        throw new Error(`Unsupported chart type: ${type}`);
    }
  }

  /**
   * Render Line Chart
   */
  private async renderLineChart(chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    // This would integrate with Chart.js library
    // For now, creating a basic structure
    canvas.getContext('2d'); // Get context for future Chart.js integration
    
    // Basic line chart rendering logic would go here
    // This is a placeholder for the actual Chart.js implementation
    console.log(`Rendering line chart for ${chartId}`, data);
  }

  /**
   * Render Bar Chart
   */
  private async renderBarChart(chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    console.log(`Rendering bar chart for ${chartId}`, data);
  }

  /**
   * Render Pie Chart
   */
  private async renderPieChart(chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    console.log(`Rendering pie chart for ${chartId}`, data);
  }

  /**
   * Render Doughnut Chart
   */
  private async renderDoughnutChart(chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    console.log(`Rendering doughnut chart for ${chartId}`, data);
  }

  /**
   * Render Radar Chart
   */
  private async renderRadarChart(chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    console.log(`Rendering radar chart for ${chartId}`, data);
  }

  /**
   * Render Polar Area Chart
   */
  private async renderPolarAreaChart(chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    console.log(`Rendering polar area chart for ${chartId}`, data);
  }

  /**
   * Render Scatter Chart
   */
  private async renderScatterChart(chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    console.log(`Rendering scatter chart for ${chartId}`, data);
  }

  /**
   * Render Bubble Chart
   */
  private async renderBubbleChart(chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    console.log(`Rendering bubble chart for ${chartId}`, data);
  }

  /**
   * Render Gauge Chart
   */
  private async renderGaugeChart(_chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    // Gauge charts typically show single values with thresholds
    const gaugeElement = document.createElement('div');
    gaugeElement.className = 'gauge-chart';
    gaugeElement.innerHTML = `
      <div class="gauge-value">${data.value || 0}</div>
      <div class="gauge-label">${data.label || 'Value'}</div>
    `;
    element.appendChild(gaugeElement);
  }

  /**
   * Render Heatmap Chart
   */
  private async renderHeatmapChart(_chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    // Heatmap for showing data density or correlations
    const heatmapElement = document.createElement('div');
    heatmapElement.className = 'heatmap-chart';
    
    // Create grid based on data
    const rows = data.rows || [];
    const cols = data.cols || [];
    
    rows.forEach((row, rowIndex) => {
      const rowElement = document.createElement('div');
      rowElement.className = 'heatmap-row';
      
      cols.forEach((col, colIndex) => {
        const cellElement = document.createElement('div');
        cellElement.className = 'heatmap-cell';
        if (data.values && data.values[rowIndex]) {
          cellElement.style.backgroundColor = this.getHeatmapColor(data.values[rowIndex][colIndex]);
          cellElement.title = `${row} - ${col}: ${data.values[rowIndex][colIndex]}`;
        }
        rowElement.appendChild(cellElement);
      });
      
      heatmapElement.appendChild(rowElement);
    });
    
    element.appendChild(heatmapElement);
  }

  /**
   * Render Statistic Card
   */
  private async renderStatisticCard(_chartId: string, element: HTMLElement, data: ChartData, _options: Record<string, any>): Promise<void> {
    const cardElement = document.createElement('div');
    cardElement.className = 'statistic-card';
    
    const value = data.value || data.total || 0;
    const label = data.label || data.title || 'Statistic';
    const change = data.change || 0;
    
    cardElement.innerHTML = `
      <div class="statistic-value">${this.formatNumber(value)}</div>
      <div class="statistic-label">${label}</div>
      ${change !== 0 ? `<div class="statistic-change ${change > 0 ? 'positive' : 'negative'}">
        ${change > 0 ? '▲' : '▼'} ${Math.abs(change)}%
      </div>` : ''}
    `;
    
    element.appendChild(cardElement);
  }

  /**
   * Utility Methods
   */

  // Get color for heatmap based on value
  private getHeatmapColor(value: number): string {
    const intensity = Math.min(1, Math.max(0, value));
    const r = Math.round(255 * intensity);
    const g = Math.round(255 * (1 - intensity));
    return `rgb(${r}, ${g}, 0)`;
  }

  // Format numbers for display
  private formatNumber(value: number): string {
    if (typeof value !== 'number') return String(value);
    
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    } else {
      return value.toLocaleString();
    }
  }

  // Validate chart data
  private validateData(data: ChartData, _chartType: string): boolean {
    if (!data) return false;
    
    // Basic validation - can be extended for specific chart types
    return !!(data.labels || data.data || data.value || data.total);
  }

  // Set loading state
  private setLoading(chartId: string, isLoading: boolean): void {
    this.isLoading.set(chartId, isLoading);
  }

  // Set error state
  private setError(chartId: string, error: string | null): void {
    this.errorStates.set(chartId, error);
  }

  // Render loading state
  private renderLoadingState(element: HTMLElement): void {
    element.innerHTML = `
      <div class="chart-loading">
        <div class="spinner"></div>
        <div class="loading-text">Loading chart...</div>
      </div>
    `;
  }

  // Render error state
  private renderErrorState(element: HTMLElement, errorMessage: string): void {
    element.innerHTML = `
      <div class="chart-error">
        <div class="error-icon">⚠️</div>
        <div class="error-message">${errorMessage}</div>
        <button class="retry-btn" onclick="window.retryChart('${element.id}')">Retry</button>
      </div>
    `;
  }

  /**
   * Chart Management
   */

  // Refresh chart data
  async refreshChart(chartId: string): Promise<void> {
    const chart = this.charts.get(chartId);
    if (chart) {
      await this.initChart(chartId, chart.config);
    }
  }

  // Refresh all charts
  async refreshAllCharts(): Promise<void> {
    for (const [chartId] of this.charts) {
      await this.refreshChart(chartId);
    }
  }

  // Destroy chart
  destroyChart(chartId: string): void {
    this.charts.delete(chartId);
    this.isLoading.delete(chartId);
    this.errorStates.delete(chartId);
  }

  // Get chart status
  getChartStatus(chartId: string): { isLoading: boolean; error: string | null; hasData: boolean } {
    return {
      isLoading: this.isLoading.get(chartId) || false,
      error: this.errorStates.get(chartId) || null,
      hasData: this.charts.has(chartId)
    };
  }

  /**
   * Batch Operations
   */

  // Initialize multiple charts
  async initCharts(configs: Record<string, ChartConfig>): Promise<void> {
    const promises = Object.entries(configs).map(([chartId, config]) => 
      this.initChart(chartId, config)
    );
    
    await Promise.allSettled(promises);
  }

  // Handle empty data state
  private handleEmptyData(element: HTMLElement, _chartType: string): void {
    element.innerHTML = `
      <div class="empty-data">
        <div class="empty-icon">📊</div>
        <div class="empty-message">No data available</div>
        <div class="empty-subtext">Please check your data sources or try a different time range</div>
      </div>
    `;
  }
}

// Global instance
const chartLoader = new ChartLoader();

// Export for module usage
export default chartLoader;
export { ChartLoader };
export type { ChartConfig, ChartData };
