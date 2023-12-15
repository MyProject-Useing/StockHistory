# 股票信息
from flask import Blueprint, request, jsonify
import tushare as ts
import json
import os

# 设置tushare的token
ts.set_token('1b4ccd180d331659d9fc7fda145f97c94b548a123354cef61547f1ec')
pro = ts.pro_api()

stock_bp = Blueprint('stock', __name__)

# 获取当前脚本所在目录
current_dir = os.path.dirname(os.path.abspath(__file__))
# 构建绝对路径
file_path = os.path.join(current_dir, 'stock_data.json')

# 从静态文件加载股票信息列表
with open(file_path, 'r', encoding='utf-8') as file:
    stock_list = json.load(file)

# 定义路由来处理获取股票列表的请求
@stock_bp.route('/stock/list', methods=['GET'])
def get_stock_list():
    return jsonify(stock_list)


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

