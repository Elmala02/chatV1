from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit
import bcrypt
import jwt
import datetime
import os
import functools
from database import fetch_one_dict, fetch_all_dicts, execute_query

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

SECRET_KEY = os.environ.get("SECRET_KEY", "super_secret_jwt_key")

def generate_token(user_id, nickname):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id,
        'nickname': nickname
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['sub']
    except Exception:
        return None

def token_required(f):
    @functools.wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2: token = parts[1]
        
        if not token: return jsonify({'message': 'Token es requerido'}), 401
        
        user_id = verify_token(token)
        if not user_id: return jsonify({'message': 'Token inválido o expirado'}), 401
            
        return f(user_id, *args, **kwargs)
    return decorator

def get_user_friends(user_id):
    res = fetch_all_dicts(
        "SELECT user_id_2 as f_id FROM amistades WHERE user_id_1 = :uid AND estado = 'aceptado' "
        "UNION "
        "SELECT user_id_1 as f_id FROM amistades WHERE user_id_2 = :uid AND estado = 'aceptado'",
        uid=user_id
    )
    return [r['f_id'] for r in res]

def get_user_requests(user_id):
    res = fetch_all_dicts(
        "SELECT user_id_1 FROM amistades WHERE user_id_2 = :uid AND estado = 'pendiente'",
        uid=user_id
    )
    return [r['user_id_1'] for r in res]

# --- RUTAS DE AUTH ---

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    nickname = data.get('name')
    email = data.get('email')
    password = data.get('password')

    existing = fetch_one_dict("SELECT id FROM usuarios WHERE correo = :correo OR nickname = :nick", correo=email, nick=nickname)
    if existing: return jsonify({'message': 'El correo o nickname ya están en uso'}), 409

    salt = bcrypt.gensalt()
    pwd_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    avatar = nickname[0].upper()

    res, _ = execute_query(
        "INSERT INTO usuarios (nickname, correo, password_hash, avatar_url) VALUES (:nick, :correo, :pwd, :avatar) RETURNING id",
        nick=nickname, correo=email, pwd=pwd_hash, avatar=avatar
    )
    user_id = res[0][0]
    token = generate_token(user_id, nickname)
    execute_query("UPDATE usuarios SET token_auth = :token WHERE id = :uid", token=token, uid=user_id)

    return jsonify({
        'token': token,
        'user': {'id': user_id, 'name': nickname, 'email': email, 'avatar': avatar, 'requests': [], 'friends': []}
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = fetch_one_dict("SELECT id, nickname, password_hash, avatar_url FROM usuarios WHERE correo = :correo", correo=email)
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'message': 'Credenciales inválidas'}), 401

    token = generate_token(user['id'], user['nickname'])
    execute_query("UPDATE usuarios SET token_auth = :token WHERE id = :uid", token=token, uid=user['id'])

    return jsonify({
        'token': token,
        'user': {
            'id': user['id'], 'name': user['nickname'], 'email': email, 'avatar': user['avatar_url'],
            'friends': get_user_friends(user['id']), 'requests': get_user_requests(user['id'])
        }
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_me(user_id):
    user = fetch_one_dict("SELECT id, nickname, correo, avatar_url FROM usuarios WHERE id = :uid", uid=user_id)
    if not user: return jsonify({'message': 'No encontrado'}), 404
    return jsonify({
        'user': {
            'id': user['id'], 'name': user['nickname'], 'email': user['correo'], 'avatar': user['avatar_url'],
            'friends': get_user_friends(user_id), 'requests': get_user_requests(user_id)
        }
    }), 200

# --- USUARIOS Y AMIGOS ---

@app.route('/api/notifications', methods=['GET'])
@token_required
def get_notifications(user_id):
    notifs = fetch_all_dicts(
        "SELECT n.id, n.tipo as type, n.leido as read, n.created_at as time, u.nickname as from_user "
        "FROM notificaciones n JOIN usuarios u ON n.sender_user_id = u.id "
        "WHERE n.target_user_id = :uid ORDER BY n.id DESC", uid=user_id
    )
    for n in notifs:
        n['from'] = n.pop('from_user', '')
        n['time'] = n['time'].strftime("%H:%M") if n['time'] else ""
        if n['type'] == 'friend_request': n['message'] = 'te ha enviado una solicitud'
        elif n['type'] == 'request_accepted': n['message'] = 'ha aceptado tu solicitud'
        elif n['type'] == 'like': n['message'] = 'le dio me gusta a tu post'
        elif n['type'] == 'comment': n['message'] = 'comentó tu post'
        elif n['type'] == 'message': n['message'] = 'te envió un mensaje privado'
    return jsonify(notifs), 200

@app.route('/api/notifications/read', methods=['POST'])
@token_required
def mark_notifications_read(user_id):
    execute_query("UPDATE notificaciones SET leido = TRUE WHERE target_user_id = :uid", uid=user_id)
    return jsonify({'message': 'OK'}), 200

@app.route('/api/users', methods=['GET'])
@token_required
def get_users(user_id):
    # Traemos todos los usuarios excepto el actual
    users = fetch_all_dicts("SELECT id, nickname as name, avatar_url as avatar FROM usuarios WHERE id != :uid", uid=user_id)
    
    # Traemos todas las relaciones de amistad del usuario actual
    rels = fetch_all_dicts("SELECT user_id_1, user_id_2, estado FROM amistades WHERE user_id_1 = :uid OR user_id_2 = :uid", uid=user_id)
    
    # Mapeamos las relaciones por el ID del "otro" usuario
    status_map = {}
    for r in rels:
        other_id = r['user_id_2'] if r['user_id_1'] == user_id else r['user_id_1']
        if r['estado'] == 'aceptado':
            status_map[other_id] = 'friend'
        elif r['estado'] == 'pendiente':
            if r['user_id_1'] == user_id:
                status_map[other_id] = 'pending_sent'
            else:
                status_map[other_id] = 'pending_received'
                
    # Inyectamos el status en cada usuario
    for u in users:
        u['status'] = status_map.get(u['id'], 'none')
        
    return jsonify(users), 200

@app.route('/api/friends/request', methods=['POST'])
@token_required
def send_request(user_id):
    target_id = request.json.get('targetId')
    
    ext = fetch_one_dict("SELECT * FROM amistades WHERE (user_id_1 = :uid AND user_id_2 = :tid) OR (user_id_1 = :tid AND user_id_2 = :uid)", uid=user_id, tid=target_id)
    if ext: return jsonify({'message': 'Ya existe una solicitud o amistad'}), 200

    execute_query("INSERT INTO amistades (user_id_1, user_id_2, estado) VALUES (:uid, :tid, 'pendiente')", uid=user_id, tid=target_id)
    
    sender = fetch_one_dict("SELECT nickname FROM usuarios WHERE id = :uid", uid=user_id)
    res, _ = execute_query("INSERT INTO notificaciones (target_user_id, sender_user_id, tipo) VALUES (:tid, :uid, 'friend_request') RETURNING id", tid=target_id, uid=user_id)
    socketio.emit('notification', {
        'id': res[0][0], 'type': 'friend_request', 'from': sender['nickname'], 'message': 'te ha enviado una solicitud', 'time': datetime.datetime.now().strftime("%H:%M"), 'read': False
    }, room=f"user_{target_id}")

    return jsonify({'message': 'Enviada'}), 200

@app.route('/api/friends/accept', methods=['POST'])
@token_required
def accept_request(user_id):
    request_id = request.json.get('requestId')
    execute_query("UPDATE amistades SET estado = 'aceptado' WHERE user_id_1 = :rid AND user_id_2 = :uid", rid=request_id, uid=user_id)
    
    sender = fetch_one_dict("SELECT nickname FROM usuarios WHERE id = :uid", uid=user_id)
    res, _ = execute_query("INSERT INTO notificaciones (target_user_id, sender_user_id, tipo) VALUES (:rid, :uid, 'request_accepted') RETURNING id", rid=request_id, uid=user_id)
    socketio.emit('notification', {
        'id': res[0][0], 'type': 'request_accepted', 'from': sender['nickname'], 'message': 'ha aceptado tu solicitud', 'time': datetime.datetime.now().strftime("%H:%M"), 'read': False
    }, room=f"user_{request_id}")

    return jsonify({'message': 'Aceptada'}), 200

# --- BLOG GLOBAL ---

@app.route('/api/blog/posts', methods=['GET'])
@token_required
def get_posts(user_id):
    posts = fetch_all_dicts(
        "SELECT m.id, m.contenido as text, m.fecha_envio as time, u.nickname as sender, u.id as senderId "
        "FROM mensajes m JOIN usuarios u ON m.user_id = u.id "
        "WHERE m.sala_id = 1 AND m.mensaje_padre_id IS NULL "
        "ORDER BY m.id DESC LIMIT 50"
    )
    if not posts: return jsonify([]), 200

    post_ids = [p['id'] for p in posts]
    placeholders = ', '.join([f":id{i}" for i in range(len(post_ids))])
    params = {f"id{i}": post_ids[i] for i in range(len(post_ids))}

    all_likes = fetch_all_dicts(f"SELECT mensaje_id, user_id FROM mensaje_likes WHERE mensaje_id IN ({placeholders})", **params)
    likes_map = {}
    for l in all_likes:
        likes_map.setdefault(l['mensaje_id'], []).append(l['user_id'])

    all_comments = fetch_all_dicts(
        f"SELECT m.id, m.mensaje_padre_id as parent_id, m.contenido as text, m.fecha_envio as time, u.nickname as userName, u.id as userId "
        f"FROM mensajes m JOIN usuarios u ON m.user_id = u.id "
        f"WHERE m.mensaje_padre_id IN ({placeholders}) ORDER BY m.id ASC", **params
    )
    comments_map = {}
    for c in all_comments:
        c['time'] = c['time'].strftime("%H:%M") if c['time'] else ""
        if 'userid' in c: c['userId'] = c.pop('userid')
        if 'username' in c: c['userName'] = c.pop('username')
        
        parent = c.pop('parent_id')
        comments_map.setdefault(parent, []).append(c)

    for p in posts:
        p['time'] = p['time'].strftime("%H:%M") if p['time'] else ""
        if 'senderid' in p:
            p['senderId'] = p.pop('senderid')

        p['likes'] = likes_map.get(p['id'], [])
        p['comments'] = comments_map.get(p['id'], [])

    return jsonify(posts), 200

@app.route('/api/blog/post', methods=['POST'])
@token_required
def create_post(user_id):
    text = request.json.get('text')
    res, _ = execute_query("INSERT INTO mensajes (user_id, sala_id, contenido) VALUES (:uid, 1, :text) RETURNING id, fecha_envio", uid=user_id, text=text)
    msg_id, time_val = res[0]
    
    sender = fetch_one_dict("SELECT nickname FROM usuarios WHERE id = :uid", uid=user_id)
    post_data = {
        'id': msg_id, 'text': text, 'time': time_val.strftime("%H:%M"),
        'sender': sender['nickname'], 'senderId': user_id, 'likes': [], 'comments': []
    }
    
    socketio.emit('new_post', post_data, room="global_blog")
    return jsonify(post_data), 201

@app.route('/api/blog/like', methods=['POST'])
@token_required
def like_post(user_id):
    post_id = request.json.get('postId')
    ext = fetch_one_dict("SELECT * FROM mensaje_likes WHERE user_id = :uid AND mensaje_id = :mid", uid=user_id, mid=post_id)
    
    if ext:
        execute_query("DELETE FROM mensaje_likes WHERE user_id = :uid AND mensaje_id = :mid", uid=user_id, mid=post_id)
        action = 'unliked'
    else:
        execute_query("INSERT INTO mensaje_likes (user_id, mensaje_id) VALUES (:uid, :mid)", uid=user_id, mid=post_id)
        action = 'liked'
        
        post_owner = fetch_one_dict("SELECT user_id FROM mensajes WHERE id = :mid", mid=post_id)
        if post_owner and post_owner['user_id'] != user_id:
            sender = fetch_one_dict("SELECT nickname FROM usuarios WHERE id = :uid", uid=user_id)
            res, _ = execute_query("INSERT INTO notificaciones (target_user_id, sender_user_id, tipo) VALUES (:tid, :uid, 'like') RETURNING id", tid=post_owner['user_id'], uid=user_id)
            socketio.emit('notification', {
                'id': res[0][0], 'type': 'like', 'from': sender['nickname'], 'message': 'le dio me gusta a tu post', 'time': datetime.datetime.now().strftime("%H:%M"), 'read': False
            }, room=f"user_{post_owner['user_id']}")

    # Emitimos a todos los conectados el cambio en el post
    new_likes = fetch_all_dicts("SELECT user_id FROM mensaje_likes WHERE mensaje_id = :mid", mid=post_id)
    likes_array = [l['user_id'] for l in new_likes]
    socketio.emit('update_post_likes', {'postId': post_id, 'likes': likes_array}, room="global_blog")

    return jsonify({'liked': not ext}), 200

@app.route('/api/blog/comment', methods=['POST'])
@token_required
def comment_post(user_id):
    post_id = request.json.get('postId')
    text = request.json.get('text')
    
    res, _ = execute_query("INSERT INTO mensajes (user_id, sala_id, mensaje_padre_id, contenido) VALUES (:uid, 1, :mid, :text) RETURNING id, fecha_envio", uid=user_id, mid=post_id, text=text)
    c_id, time_val = res[0]
    
    sender = fetch_one_dict("SELECT nickname FROM usuarios WHERE id = :uid", uid=user_id)
    post_owner = fetch_one_dict("SELECT user_id FROM mensajes WHERE id = :mid", mid=post_id)
    if post_owner and post_owner['user_id'] != user_id:
        rn, _ = execute_query("INSERT INTO notificaciones (target_user_id, sender_user_id, tipo) VALUES (:tid, :uid, 'comment') RETURNING id", tid=post_owner['user_id'], uid=user_id)
        socketio.emit('notification', {
            'id': rn[0][0], 'type': 'comment', 'from': sender['nickname'], 'message': 'comentó tu post', 'time': datetime.datetime.now().strftime("%H:%M"), 'read': False
        }, room=f"user_{post_owner['user_id']}")

    comment_data = { 'postId': post_id, 'comment': { 'id': c_id, 'text': text, 'time': time_val.strftime("%H:%M"), 'userName': sender['nickname'], 'userId': user_id } }
    socketio.emit('new_comment', comment_data, room="global_blog")
    return jsonify(comment_data), 201

# --- CHAT PRIVADO API ---

@app.route('/api/chat/private/<int:friend_id>', methods=['GET'])
@token_required
def get_private_messages(user_id, friend_id):
    sala = fetch_one_dict(
        "SELECT s.id FROM salas s "
        "JOIN participantes p1 ON s.id = p1.sala_id AND p1.user_id = :uid "
        "JOIN participantes p2 ON s.id = p2.sala_id AND p2.user_id = :fid "
        "WHERE s.tipo = 'privado'", uid=user_id, fid=friend_id
    )
    if not sala: return jsonify([]), 200
    
    msgs = fetch_all_dicts(
        "SELECT m.id, m.contenido as text, m.fecha_envio as time, u.nickname as senderName, u.id as senderId "
        "FROM mensajes m JOIN usuarios u ON m.user_id = u.id "
        "WHERE m.sala_id = :sid ORDER BY m.id ASC", sid=sala['id']
    )
    for m in msgs: 
        m['time'] = m['time'].strftime("%H:%M") if m['time'] else ""
        if 'senderid' in m:
            m['senderId'] = m.pop('senderid')
        if 'sendername' in m:
            m['senderName'] = m.pop('sendername')
    return jsonify({'salaId': sala['id'], 'messages': msgs}), 200


# --- WEBSOCKETS (SOCKET.IO) ---

@socketio.on('connect')
def handle_connect():
    pass

@socketio.on('identify')
def handle_identify(data):
    token = data.get('token')
    if token:
        user_id = verify_token(token)
        if user_id:
            join_room(f"user_{user_id}")
            join_room("global_blog")

@socketio.on('join_private_room')
def on_join_private(data):
    sala_id = data.get('salaId')
    if sala_id:
        join_room(f"sala_{sala_id}")

@socketio.on('send_private_message')
def on_send_private(data):
    token = data.get('token')
    friend_id = data.get('friendId')
    text = data.get('text')
    
    user_id = verify_token(token)
    if not user_id: return
    
    sala = fetch_one_dict(
        "SELECT s.id FROM salas s "
        "JOIN participantes p1 ON s.id = p1.sala_id AND p1.user_id = :uid "
        "JOIN participantes p2 ON s.id = p2.sala_id AND p2.user_id = :fid "
        "WHERE s.tipo = 'privado'", uid=user_id, fid=friend_id
    )
    
    sala_id = None
    if not sala:
        res, _ = execute_query("INSERT INTO salas (nombre, tipo) VALUES ('Chat Privado', 'privado') RETURNING id")
        sala_id = res[0][0]
        execute_query("INSERT INTO participantes (user_id, sala_id) VALUES (:uid, :sid), (:fid, :sid)", uid=user_id, fid=friend_id, sid=sala_id)
    else:
        sala_id = sala['id']
        
    res, _ = execute_query("INSERT INTO mensajes (user_id, sala_id, contenido) VALUES (:uid, :sid, :text) RETURNING id, fecha_envio", uid=user_id, sid=sala_id, text=text)
    msg_id, time_val = res[0]
    
    sender = fetch_one_dict("SELECT nickname FROM usuarios WHERE id = :uid", uid=user_id)
    msg_data = {
        'id': msg_id, 'senderId': user_id, 'senderName': sender['nickname'],
        'text': text, 'time': time_val.strftime("%H:%M"), 'salaId': sala_id, 'targetId': friend_id
    }
    
    if data.get('salaId'):
        emit('receive_private_message', msg_data, room=f"sala_{sala_id}")
    else:
        # Solo emitir al receptor, el emisor ya lo tiene en su estado local
        emit('receive_private_message', msg_data, room=f"user_{friend_id}")
        
    rn, _ = execute_query("INSERT INTO notificaciones (target_user_id, sender_user_id, tipo) VALUES (:tid, :uid, 'message') RETURNING id", tid=friend_id, uid=user_id)
    emit('notification', {
        'id': rn[0][0], 'type': 'message', 'from': sender['nickname'], 'message': 'te envió un mensaje privado', 'time': datetime.datetime.now().strftime("%H:%M"), 'read': False
    }, room=f"user_{friend_id}")

if __name__ == '__main__':
    socketio.run(app, debug=True, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
