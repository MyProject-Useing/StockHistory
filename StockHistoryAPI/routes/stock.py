# 股票信息
import requests
from flask import Blueprint, request, jsonify
import tushare as ts
import random

# 设置tushare的token
ts.set_token('1b4ccd180d331659d9fc7fda145f97c94b548a123354cef61547f1ec')
pro = ts.pro_api()

stock_bp = Blueprint('stock', __name__)

# 定义路由来处理获取历史数据的请求
@stock_bp.route('/stock/history', methods=['GET'])
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

# 调用证卷交易所-通过名称查询股票下拉
@stock_bp.route('/stock/shortname', methods=['GET'])
def stock_shortname():
    dataTypeMap = {
        'A': '[agzqdm]',
        'B': '[bgzqdm]',
        'CDR': '[cdrzqdm]',
        'AB': '[abgzqdm]',
    }

    base_url = "http://www.szse.cn/api/report/shortname/gethangqing"

    # 获取查询参数中的股票类型和代码
    dataType = request.args.get('dataType')
    input_value = request.args.get('input')

    # 映射 dataType
    if dataType in dataTypeMap:
        mapped_dataType = dataTypeMap[dataType]
    else:
        return jsonify({"error": "Invalid dataType"}), 400

    params = {
        "dataType": mapped_dataType,
        "input": input_value,
        "random": str(random.random())  # 生成一个随机值
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        return jsonify(response.json()["data"])
    else:
        return jsonify({"error": "Failed to fetch data"}), 500

# 调用证卷交易所-通过代码查询股票详情
@stock_bp.route('/stock/data', methods=['GET'])
def get_stock_data():
    # 请求第三方接口
    url = "http://www.szse.cn/api/report/ShowReport/data?SHOWTYPE=JSON&CATALOGID=1110&TABKEY=tab1&PAGENO=2&random=0.26671036372294243"
    response = requests.get(url)

    if response.status_code == 200:
        # 解析 JSON 数据
        data = response.json()

        # 格式化需要的数据
        formatted_data = []
        for entry in data:
            formatted_entry = {
                "name": entry['metadata']['name'],
                "data": entry['data']
            }
            formatted_data.append(formatted_entry)

        return jsonify(formatted_data)
    else:
        return jsonify({"error": "请求失败"}), 500

# 无权限访问
# 定义路由来处理获取指标数据的请求
# @stock_bp.route('/stock/basic', methods=['GET'])
# def stock_basic():
#     try:
#         # 调用tushare方法获取指数基本信息
#         index_basic_data = pro.index_basic().head(3).to_dict(orient='records')  # 获取前三条数据
#         return jsonify({"index_basic": index_basic_data})
#     except Exception as e:
#         print(f"Error fetching index basic data: {e}")
#         return jsonify({"error": "发生了内部服务器错误"}), 500

# 无权限访问
# 获取A股前100股票列表
# def get_top_100_stock_info():
#     df = ts.get_stock_list(top=100)
#     return df.to_dict(orient='records')

# # # 定义路由来处理获取A股前100股票信息的请求
# @stock_bp.route('/top-100-stocks', methods=['GET'])
# def top_100_stocks():
#     # 调用获取A股前100股票信息的方法
#     stock_info = get_top_100_stock_info()
#     return jsonify(stock_info)

