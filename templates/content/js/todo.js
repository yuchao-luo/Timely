!(function(){
	let add_todo_item_btn,
		new_todo_title_input,
		new_todo_tags_input,
		new_todo_due,
		new_todo_repeat,
		new_todo_priority,
		new_todo_description_input,
		cancel_new_todo_btn,
		add_new_todo_btn,
		context_menu_div,
		context_menu_btns,
		context_menu_see_in_calendar,
		context_menu_delete;
	let context_menu_uuid = '';
	try {
		add_todo_item_btn = document.getElementById('add_todo_item');
		new_todo_title_input = document.getElementById('new_todo_title');
		new_todo_tags_input = document.getElementById('new_todo_tags');
		new_todo_due = document.getElementById('new_todo_due_value');
		new_todo_repeat = document.getElementById('new_todo_repeat_value');
		new_todo_priority = document.getElementById('new_todo_priority');
		new_todo_description_input = document.getElementById('new_todo_description');
		cancel_new_todo_btn = document.getElementById('cancel_new_todo_button');
		add_new_todo_btn = document.getElementById('add_new_todo_button');
		context_menu_div = document.getElementById('todo_context_menu');
		context_menu_btns = document.querySelectorAll('svg.todo_item_vertical_dots');
		context_menu_see_in_calendar = document.getElementById('todo_context_menu_see_in_calendar');
		context_menu_delete = document.getElementById('todo_context_menu_delete');
		const priorities = ['Lowest', 'Low', 'Normal', 'High', 'Highest'];
		add_todo_item_btn.addEventListener('click', function() {
			window['timely'].show_new_todo_window();
		});
		new_todo_priority.addEventListener('click', function() {
			let current = priorities.indexOf(new_todo_priority.value);
			let next = current + 1;
			if(next < priorities.length) {
				new_todo_priority.value = priorities[next];
			} else {
				new_todo_priority.value = priorities[0];
			}
		});
		cancel_new_todo_btn.addEventListener('click', function() {
			window['timely'].hide_new_todo_window();
		});
		add_new_todo_btn.addEventListener('click', function() {
			let new_todo_obj = {
				title: new_todo_title_input.value,
				tags: new_todo_tags_input.value,
				metadata: {
					due: new_todo_due.value,
					repeat: new_todo_repeat.value,
					priority: priorities.indexOf(new_todo_priority.value)
				},
				description: new_todo_description_input.value
			};
			fetch('/new_todo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(new_todo_obj)
			});
		});
		context_menu_btns.forEach((e) => {
			e.onclick = function(evt) {
				let focused_context_menu_btn = document.querySelector('svg.todo_item_vertical_dots.show');
				if(focused_context_menu_btn != null) {
					focused_context_menu_btn.classList.remove('show');
				}
				if(!e.classList.contains('show')) {
					let rect = e.getBoundingClientRect(),
						top = rect.y,
						left = rect.x - 245;
					e.classList.add('show');
					context_menu_uuid = e.dataset.uuid;
					context_menu_div.classList.add('show');
					context_menu_div.style.top = top + 'px';
					context_menu_div.style.left = left + 'px';
				}
			}
		});
		context_menu_see_in_calendar.addEventListener('click', function() {
			// TODO
		});
		context_menu_delete.addEventListener('click', function() {
			fetch('/delete', {
				method: 'POST',
				body: context_menu_uuid
			});
		});
		document.body.addEventListener('click', function(evt) {
			if(!evt.target.classList.contains('todo_item_vertical_dots')) {
				let focused_context_menu_btn = document.querySelector('svg.todo_item_vertical_dots.show');
				if(focused_context_menu_btn != null) {
					focused_context_menu_btn.classList.remove('show');
				}
				setTimeout(function() {
					context_menu_div.classList.remove('show');
				}, 80);
			}
		});
	}
	catch(e) {
		console.log(e);
	}
})();