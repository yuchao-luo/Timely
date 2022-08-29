from datetime import datetime
import uuid
from flask import Flask, request, redirect, url_for, render_template, send_from_directory, json

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/', methods=['GET'])
def home():
	return render_template(
		'home.html',
		title='Home',
	)

@app.route('/get_content', methods=['GET'])
def get_content():
	if request.args['page'] == 'todo':
		data = json.load(open('./todo.json'))
		def due_date(due):
			if due is False:
				return ""
			else:
				due = due.split(';')
				month, day, year = due[0].split('/')
				hour, minute = due[1].split(':')
				due_time = datetime(int(year), int(month), int(day), hour=int(hour), minute=int(minute))
				now = datetime.now()
				diff_seconds = (due_time - now).total_seconds()
				diff_days = int(diff_seconds / 86400) + 1
				diff = f'due in {diff_days} days'
				if diff_seconds < 86400:
					diff_hours = int(diff_seconds / 3600)
					diff_minutes = int((diff_seconds % 3600) / 60)
					diff = f"due in {diff_hours} hour{'s' if diff_hours > 1 else ''} {diff_minutes} minute{'s' if diff_minutes > 1 else ''}"
				return f"Due: {due_time.strftime('%m/%d/%Y %H:%M:%S')}, {diff}"
		return render_template('content/' + request.args['page'] + '.html', data=data, due_date=due_date)
	else:
		return render_template('content/' + request.args['page'] + '.html')

@app.route('/get_script/<path:path>', methods=['GET'])
def get_script(path):
	return send_from_directory('templates/content/js/', path)

@app.route('/new_todo', methods=['POST'])
def new_todo():
	todo_obj = request.json;

	if len(todo_obj['tags']) > 0:
		todo_obj['tags'] = todo_obj['tags'].split(', ')

	if todo_obj['metadata']['due'] == 'false':
		todo_obj['metadata']['due'] = False

	if todo_obj['metadata']['repeat'] == 'false,0':
		todo_obj['metadata']['repeat'] = False

	todo_obj['completed'] = False
	todo_obj['uuid'] = uuid.uuid4().hex

	data = json.load(open('./todo.json'))
	data['count'] += 1
	data['items'].append(todo_obj)

	with open('./todo.json', 'w', encoding='utf-8') as f:
		json.dump(data, f, ensure_ascii=False, indent=4, sort_keys=False)

	return ('OK', 200)

@app.route('/delete', methods=['POST'])
def delete_todo():
	todo_uuid = request.data.decode('utf-8')
	data = json.load(open('./todo.json'))
	index = -1

	for i in range(len(data['items'])):
		if data['items'][i]['uuid'] == todo_uuid:
			index = i
			break

	if index > -1:
		del data['items'][index]
		data['count'] -= 1

		with open('./todo.json', 'w', encoding='utf-8') as f:
			json.dump(data, f, ensure_ascii=False, indent=4, sort_keys=False)

	return ('OK', 200)

if __name__ == '__main__':
	app.run(host='127.0.0.1', port=80)