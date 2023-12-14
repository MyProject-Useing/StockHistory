````markdown
# Stock History API

Stock History API 是一个使用 Python Flask 和 tushare 库编写的简单接口，用于获取中国股市某个股票在指定日期范围内的历史数据。

## 安装

确保您已经安装了 Python 和 Flask。使用以下命令安装依赖：

```bash
pip install Flask
pip install tushare
```
````

## 配置

在 `app.py` 文件中设置 tushare 的 token：

```python
ts.set_token('1b4ccd180d331659d9fc7fda145f97c94b548a123354cef61547f1ec')
```

## 使用

运行应用：

```bash
python app.py
```

接口将在 [http://127.0.0.1:5000/stock-history](http://127.0.0.1:5000/stock-history) 上运行。

### 获取股票历史数据

发送 GET 请求到 `/stock-history`，并提供以下参数：

- `symbol`：股票代码，例如 `000001.sz`
- `start_date`：开始日期，格式为 `YYYYMMDD`
- `end_date`：结束日期，格式为 `YYYYMMDD`

示例请求：

```bash
curl "http://127.0.0.1:5000/stock-history?symbol=000001.sz&start_date=20190101&end_date=20200213"
```

示例响应：

```json
{
  "symbol": "000001.sz",
  "history": [
    {
      "ts_code": "000001.sz",
      "trade_date": "20190102",
      "open": 9.2,
      "high": 9.24,
      "low": 9.11,
      "close": 9.19,
      "vol": 228896.66
    }
    // 其他历史数据...
  ]
}
```
