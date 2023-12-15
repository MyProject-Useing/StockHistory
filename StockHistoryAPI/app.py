from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp  # 引入 auth_bp
from routes.stock import stock_bp  # 引入 stock_bp


app = Flask(__name__)

# 允许跨域访问
CORS(app)
# 注册用户验证路由
app.register_blueprint(auth_bp)

# 注册股票信息路由
app.register_blueprint(stock_bp)

if __name__ == '__main__':
    app.run(debug=False)
