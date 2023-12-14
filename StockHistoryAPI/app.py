from flask import Flask, request, jsonify
import tushare as ts

app = Flask(__name__)

# 设置tushare的token
ts.set_token('1b4ccd180d331659d9fc7fda145f97c94b548a123354cef61547f1ec')
pro = ts.pro_api()

# 定义路由来处理获取历史数据的请求
@app.route('/stock-history', methods=['GET'])
def stock_history():
    # 获取查询参数中的股票代码和日期范围
    stock_symbol = request.args.get('symbol')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    if stock_symbol and start_date and end_date:
        try:
            # 调用tushare方法获取股票历史数据
            history_data = pro.daily(ts_code=stock_symbol, start_date=start_date, end_date=end_date).to_dict(orient='records')
            return jsonify({"symbol": stock_symbol, "history": history_data})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "股票代码、开始日期和结束日期均需要提供"}), 400

if __name__ == '__main__':
    # 启动Flask应用
    app.run(debug=True)

# http://127.0.0.1:5000/stock-history?symbol=000001&start_date=20190101&end_date=20200213