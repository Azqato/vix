// Custom plugin: renders VIX value in the doughnut center hole.
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    if (chart.config.type !== 'doughnut') return;
    const { ctx, chartArea } = chart;
    const cx = (chartArea.left + chartArea.right) / 2;
    const cy = (chartArea.top + chartArea.bottom) / 2;
    const vix = chart.options.plugins.centerText?.value ?? '--';

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Primary value
    ctx.font = 'bold 2rem "Courier New", monospace';
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = 'rgba(0, 255, 136, 0.5)';
    ctx.shadowBlur = 12;
    ctx.fillText(vix, cx, cy - 10);

    // Sub-label
    ctx.shadowBlur = 0;
    ctx.font = '0.7rem "Courier New", monospace';
    ctx.fillStyle = '#6b7280';
    ctx.letterSpacing = '2px';
    ctx.fillText('VIX', cx, cy + 14);

    ctx.restore();
  },
};

function initChart(canvasId) {
  // Chart is the global exposed by the UMD script tag.
  const ChartJS = window.Chart;
  const TICKERS = window.VixStrategy.TICKERS;

  const colors = [
    TICKERS.BIL.color,
    TICKERS.SPY.color,
    TICKERS.QQQ.color,
    TICKERS.TQQQ.color,
  ];

  const ctx = document.getElementById(canvasId).getContext('2d');

  return new ChartJS(ctx, {
    type: 'doughnut',
    plugins: [centerTextPlugin],
    data: {
      labels: ['BIL', 'SPY', 'QQQ', 'TQQQ'],
      datasets: [
        {
          data: [25, 50, 20, 5],
          backgroundColor: colors,
          borderColor: '#0a0e1a',
          borderWidth: 3,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 600,
        easing: 'easeInOutQuart',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#9ca3af',
          bodyColor: '#ffffff',
          bodyFont: { family: '"Courier New", monospace', size: 14, weight: 'bold' },
          callbacks: {
            label: (ctx) => `  ${ctx.label}: ${Number(ctx.raw).toFixed(2)}%`,
          },
        },
        centerText: { value: '--' },
      },
    },
  });
}

function updateChart(chartInstance, allocation, vixValue) {
  chartInstance.data.datasets[0].data = [
    allocation.BIL,
    allocation.SPY,
    allocation.QQQ,
    allocation.TQQQ,
  ];
  chartInstance.options.plugins.centerText = {
    value: typeof vixValue === 'number' ? vixValue.toFixed(2) : '--',
  };
  chartInstance.update();
}

window.VixChart = { initChart, updateChart };
