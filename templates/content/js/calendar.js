!(function() {
	let weekday_headers = document.querySelectorAll('#calendar_weekdays th');
	let cells = document.querySelectorAll('.calendar_row td');
	let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth();
	let day_of_week = date.getDay();
	let last_day_of_prev_month = new Date(year, month, 0);
	let first_day_of_month = new Date(year, month, 1);
	let last_day_of_month = new Date(year, month + 1, 0);
	let first_day_of_next_month = new Date(year, month + 1, 1);
	let number_of_days_in_month = (last_day_of_month - first_day_of_month) / 86400000 + 1;

	document.getElementById('calendar_title_month').innerText = months[month];
	document.getElementById('calendar_title_year').innerText = year;
	weekday_headers[day_of_week].classList.add('current_date');

	for(let i = last_day_of_prev_month.getDate(), j = last_day_of_prev_month.getDay(); j >= 0; i--, j--) {
		cells[j].innerText = i;
	}

	for(let i = first_day_of_month.getDate(), j = first_day_of_month.getDay(); i <= last_day_of_month.getDate(); i++, j++) {
		if(i == date.getDate())
			cells[j].classList.add('current_date');

		cells[j].innerText = i;
	}

	for(let i = first_day_of_next_month.getDate(), j = first_day_of_month.getDay() + number_of_days_in_month; j < 42; i++, j++) {
		cells[j].innerText = i;
	}
})();