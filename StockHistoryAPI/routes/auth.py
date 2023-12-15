# 用户信息
from flask import Blueprint, jsonify

# 创建一个Blueprint对象
auth_bp = Blueprint('mock', __name__)

# 登录
@auth_bp.route('/auth/oauth2/token', methods=['POST'])
def auth_oauth2_token():
    # 模拟生成access_token和refresh_token
    access_token = '111111'
    refresh_token = '222222'

    # 构造返回的数据
    response_data = {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'code': 200,
    }
    return jsonify(response_data)


# 用户信息
@auth_bp.route('/admin/user/info', methods=['GET'])
def admin_user_info():
    # 模拟用户信息数据
    user_info = {
        'sysUser': {
            'userId': '1',
            'username': 'admin',
            'password': '$2a$10$c/Ae0pRjJtMZg3BnvVpO.eIK6WYWVbKTzqgdy3afR7w.vd.xi3Mgy',
            'phone': '13412341234',
            'avatar': '/admin/sys-file/local/336766bc9b044f20b5efc044093c6181.png',
            'deptId': '4',
            'tenantId': '1',
            'wxDingUserid': None,
            'miniOpenid': 'oBxPy5E-v82xWGsfzZVzkD3wEX64',
            'nickname': '管理员666777',
            'name': '管理员',
            'email': '646042371@qq.com',
        },
        'permissions': [],
        'roles': ['1'],
    }

    return jsonify({
        'code': 200,
        'ok': True,
        'data': user_info,
    })
