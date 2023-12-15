
const upColor = '#00da3c';
const downColor = '#ec0000';

interface StockData {
  "amount": number;// 成交量
  "change": number;// 表示股票价格从前一收盘价到当前收盘价的变化。
  "close": number;// 收盘价
  "high": number;// 最高价
  "low": number;// 最低价
  "open": number;// 开盘价
  "pct_chg": number;// 表示股票价格从前一收盘价到当前收盘价的百分比变化。
  "pre_close": number;// 代表股票在前一个交易周期的收盘价。
  "trade_date": string;// 交易日期
  "ts_code": string;// 股票代码
  "vol": number;// 交易量
  [key: string]: any; // Additional properties
}

interface ChartData {
  categoryData: string[];
  values: [number, number, number, number][]; // Modified data structure
  volumes: [number, number, number][];
}

const splitData = (rawData: StockData[]): ChartData => {
  const categoryData: string[] = [];
  const values: [number, number, number, number][] = [];
  const volumes: [number, number, number][] = [];
  for (let i = 0; i < rawData.length; i++) {
    const date = rawData[i].trade_date;
    categoryData.push(date);
    values.push([
      rawData[i].open,
      rawData[i].close,
      rawData[i].low,
      rawData[i].high,
    ]);
    volumes.push([i, Math.abs(rawData[i].vol), rawData[i].open > rawData[i].close ? 1 : -1]);
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
  const result: any[] = [];
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
};

export const getOptions = (rawData: any[]) => {
  const formatRow = rawData.map(item => {
    return {
      ...item,
      trade_date: formatTushareDate(item.trade_date),
    }
  })
  const data = splitData(formatRow);
  const option = {
    animation: false,
    legend: {
      top: 10,
      left: 'center',
      data: ['日K', '5日线', '10日线', '20日线', '30日线']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000',
      },
      position: function (pos, params, el, elRect, size) {
        const obj = {
          top: 10,
        };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      },
      formatter: function (params) {
        // Customize tooltip content here
        const dataIndex = params[0].dataIndex;
        const currentData = rawData[dataIndex];

        const tooltipContent = `
          日期: ${currentData.trade_date}<br/>
          开盘价: ${currentData.open}<br/>
          收盘价: ${currentData.close}<br/>
          最低价: ${currentData.low}<br/>
          最高价: ${currentData.high}<br/>
          成交量: ${currentData.vol}<br/>
        `;
        return tooltipContent;
      },
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
          show: true,
        },
        // 调整位置为右侧
        position: 'right',
        axisLabel: {
          // 使用formatter强制显示小数
          formatter: function (value: any) {
            return value.toFixed(2);
          },
        },
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
        start: 60,
        end: 100,
      },
    ],
    series: [
      // 道琼斯 -不需要
      {
        name: '日K',
        type: 'candlestick',
        data: data.values,
        yAxisIndex: 0,  // 设置y轴为第一个y轴
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined
        }
      },
      {
        name: '5日线',
        type: 'line',
        data: calculateMA(5, data),
        yAxisIndex: 0,  // 设置y轴为第一个y轴
        smooth: true,
        lineStyle: {
          opacity: 0.5
        },
        symbol: 'none', // Set symbol to 'none' to hide points
        symbolSize: 0, // Set symbolSize to 0 to hide points
      },
      {
        name: '10日线',
        type: 'line',
        data: calculateMA(10, data),
        yAxisIndex: 0,  // 设置y轴为第一个y轴
        smooth: true,
        lineStyle: {
          opacity: 0.5
        },
        symbol: 'none', // Set symbol to 'none' to hide points
        symbolSize: 0, // Set symbolSize to 0 to hide points
      },
      {
        name: '20日线',
        type: 'line',
        data: calculateMA(20, data),
        yAxisIndex: 0,  // 设置y轴为第一个y轴
        smooth: true,
        lineStyle: {
          opacity: 0.5
        },
        symbol: 'none', // Set symbol to 'none' to hide points
        symbolSize: 0, // Set symbolSize to 0 to hide points
      },
      {
        name: '30日线',
        type: 'line',
        data: calculateMA(30, data),
        yAxisIndex: 0,  // 设置y轴为第一个y轴
        smooth: true,
        lineStyle: {
          opacity: 0.5
        },
        symbol: 'none', // Set symbol to 'none' to hide points
        symbolSize: 0, // Set symbolSize to 0 to hide points
      },
      {
        name: '成交量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes,
        // label: {
        //   show: true,
        //   position: 'top',
        //   formatter: function (params) {
        //     // Customize label content here
        //     const dataIndex = params.dataIndex;
        //     const currentData = rawData[dataIndex];
        //     return currentData.vol.toFixed(2);
        //   },
        // },
      }
    ]
  }
  return option
}


