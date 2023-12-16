import dayjs from 'dayjs';

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

  return {
    categoryData,
    values,
    volumes,
  };
};

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

const getStartNumber = (dataLength: number = 1000) => {
  if (dataLength > 5000) {
    return 98;
  }

  if (dataLength > 4000) {
    return 96;
  }

  if (dataLength > 3000) {
    return 90;
  }

  if (dataLength > 2000) {
    return 74;
  }

  return 60;
}

const getTipsFormat = (currentData: StockData) => {
  const openColor = currentData.open > currentData.pre_close ? 'color: #ec0000;' : 'color: #00da3c;';
  const highColor = currentData.high > currentData.open ? 'color: #ec0000;' : 'color: #00da3c;';
  const lowColor = currentData.low > currentData.open ? 'color: #ec0000;' : 'color: #00da3c;';
  const closeColor = currentData.close > currentData.open ? 'color: #ec0000;' : 'color: #00da3c;';

  const riseFallAmount = currentData.close - currentData.pre_close;
  const riseFallPercentage = ((riseFallAmount / currentData.pre_close) * 100).toFixed(2);

  const tooltipContent = `<div class='tooltips-content'>
    <div class='tips-item'>${dayjs(currentData.trade_date).format('YYYYMMDD')}</div>
    <div class='tips-item'><span>开: </span><span style="${openColor}">${currentData.open}</span></div>
    <div class='tips-item'><span>高: </span><span style="${highColor}">${currentData.high}</span></div>
    <div class='tips-item'><span>低: </span><span style="${lowColor}">${currentData.low}</span></div>
    <div class='tips-item'><span>收: </span><span style="${closeColor}">${currentData.close}</span></div>
    <div class='tips-item'><span>涨跌: </span><span style="${riseFallAmount >= 0 ? 'color: #ec0000;' : 'color: #00da3c;'}">${riseFallAmount.toFixed(2)}</span></div>
    <div class='tips-item'><span>涨幅: </span><span style="${riseFallAmount >= 0 ? 'color: #ec0000;' : 'color: #00da3c;'}">${riseFallPercentage}%</span></div>
  </div>`;

  return tooltipContent;
};


export const getOptions = (rawData: any[]) => {
  const formatRow = rawData.map(item => {
    return {
      ...item,
      trade_date: dayjs(item.trade_date).format("YYYY-MM-DD"),
    }
  })
  const data = splitData(formatRow);
  const option = {
    backgroundColor: 'transparent', // 将背景色设置为透明
    animation: false,
    legend: {
      top: 0,
      left: 'center',
      data: ['日K', '5日线', '10日线', '20日线', '30日线']
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    tooltip: {
      show: true,  // 设置为显示
      trigger: 'axis',
      borderWidth: 0,
      padding: 4,
      axisPointer: {
        type: 'cross',
      },
      position: ['5%', 28],  // 固定在左上角
      formatter: function (params: any) {
        const dataIndex = params[0].dataIndex;
        const currentData = formatRow[dataIndex];
        return getTipsFormat(currentData);
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#909399'
      }
    },
    // 在 axisPointer 的配置中设置 label 的 backgroundColor，仅影响y轴

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
        left: '5%',
        right: '5%',
        height: '50%',
        borderColor: '#ddd',  // 调整网格线颜色
        show: true,
      },
      {
        left: '5%',
        right: '5%',
        top: '63%',
        height: '16%',
        borderColor: '#ddd',
        show: true,
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
        axisLabel: {
          interval: 'auto',
          textStyle: {
            fontSize: 10,  // 调整字体大小
            color: '#666', // 调整字体颜色
          },
        },
        axisPointer: {
          z: 100,
          link: { xAxisIndex: 'all' }, // 添加 link 配置
        },
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
        axisPointer: {
          label: {
            backgroundColor: '#f56c6c'
          },
        },
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
        start: getStartNumber(data.values.length),
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
          color: upColor,   // 上涨K线颜色
          color0: downColor, // 下跌K线颜色
          borderColor: undefined,
          borderColor0: undefined,
          borderWidth: 1.5,  // 线条粗细
        }
      },
      {
        name: '5日线',
        type: 'line',
        data: calculateMA(5, data),
        yAxisIndex: 0,
        smooth: true,
        lineStyle: {
          opacity: 0.8,
          width: 1.5,  // 调整线条粗细
        },
        symbol: 'none',
        symbolSize: 0,
      },
      {
        name: '10日线',
        type: 'line',
        data: calculateMA(10, data),
        yAxisIndex: 0,  // 设置y轴为第一个y轴
        smooth: true,
        lineStyle: {
          opacity: 0.8,
          width: 1.5,  // 调整线条粗细
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
          opacity: 0.8,
          width: 1.5,  // 调整线条粗细
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
          opacity: 0.8,
          width: 1.5,  // 调整线条粗细
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
        itemStyle: {
          // 根据涨跌幅的正负决定颜色
          color: function (params: any) {
            return params.data[1] >= 0 ? upColor : downColor;
          },
        },
        // itemStyle: {
        //   // 根据涨跌幅的正负决定颜色
        //   color: function (params: any) {
        //     return params.data[1] >= 0 ? upColor : downColor;
        //   },
        // },
      }
    ]
  }
  return option
}
