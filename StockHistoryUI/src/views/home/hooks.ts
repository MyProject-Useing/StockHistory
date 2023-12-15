
const upColor = '#00da3c';
const downColor = '#ec0000';

interface StockData {
  open: number;
  close: number;
  low: number;
  high: number;
  [key: string]: any; // Additional properties
}

interface ChartData {
  categoryData: string[];
  values: StockData[];
  volumes: [number, number, number][];
}

const splitData = (rawData: StockData[]): ChartData => {
  const categoryData: string[] = [];
  const values: StockData[] = [];
  const volumes: [number, number, number][] = [];

  for (let i = 0; i < rawData.length; i++) {
    const date = formatTushareDate(rawData[i].trade_date);
    categoryData.push(date);
    values.push(rawData[i]);
    volumes.push([i, rawData[i].high, rawData[i].open > rawData[i].close ? 1 : -1]);
  }

  // 日期数据应该从左往右依次递增
  categoryData.reverse();

  return {
    categoryData,
    values,
    volumes,
  };
};

// 格式化日期
function formatTushareDate(tushareDate: string): string {
  const year = tushareDate.substr(0, 4);
  const month = tushareDate.substr(4, 2);
  const day = tushareDate.substr(6, 2);
  return `${year}-${month}-${day}`;
}

const calculateMA = (dayCount: number, data: ChartData): number[] => {
  const result: number[] = [];
  for (let i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push(-1); // Modify based on your requirement
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += data.values[i - j].close;
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
};

export const getOptions = (rawData: any[]) => {
  const data = splitData(rawData);
  const option = {
    animation: false,
    legend: {
      bottom: 10,
      left: 'center',
      data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000'
      },
      position: function (pos, params, el, elRect, size) {
        const obj = {
          top: 10
        };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      }
      // extraCssText: 'width: 170px'
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#777'
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false
        },
        brush: {
          type: ['lineX', 'clear']
        }
      }
    },
    brush: {
      xAxisIndex: 'all',
      brushLink: 'all',
      outOfBrush: {
        colorAlpha: 0.1
      }
    },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: downColor
        },
        {
          value: -1,
          color: upColor
        }
      ]
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '50%'
      },
      {
        left: '10%',
        right: '8%',
        top: '63%',
        height: '16%'
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 98,
        end: 100
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '85%',
        start: 98,
        end: 100
      }
    ],
    series: [
      {
        name: 'Dow-Jones index',
        type: 'candlestick',
        data: data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes
      }
    ]
  }
  return option
}


