document.addEventListener('DOMContentLoaded', () => {
	const calculateButton = document.getElementById('calculate-button');
	const resultContainer = document.getElementById('result');
	const resultValue = document.getElementById('result-value');
	const historyList = document.getElementById('history-list');

	// 加载历史记录
	loadHistory();

	calculateButton.addEventListener('click', () => {
		const institution = document.getElementById('institution').value;
		const startDate = document.getElementById('start-date').value;
		const endDate = document.getElementById('end-date').value;
		const pastValue = parseFloat(document.getElementById('past-value').value);
		const currentValue = parseFloat(document.getElementById('current-value').value);

		if (isNaN(pastValue) || isNaN(currentValue) || !institution || !startDate || !endDate) {
			alert('请填写所有字段并输入有效的数字');
			return;
		}

		const growthRate = ((currentValue - pastValue) / pastValue) * 100;
		resultValue.textContent = `增长率: ${growthRate.toFixed(2)}%`;
		resultContainer.style.display = 'block';

		const historyItem = {
			institution,
			startDate,
			endDate,
			pastValue: pastValue.toFixed(3),
			currentValue: currentValue.toFixed(3),
			growthRate: growthRate.toFixed(2)
		};

		addHistoryItem(historyItem);
		saveHistory(historyItem);
	});

	function addHistoryItem({
		institution,
		startDate,
		endDate,
		pastValue,
		currentValue,
		growthRate
	}) {
		const listItem = document.createElement('li');
		listItem.classList.add('history-item');

		const createLabelValueElement = (labelText, valueText) => {
			const container = document.createElement('div');
			container.classList.add('label-value-pair');

			const label = document.createElement('label');
			label.textContent = labelText;

			const value = document.createElement('p');
			value.textContent = valueText;

			container.appendChild(label);
			container.appendChild(value);

			return container;
		};

		// Helper function to calculate the number of days between two dates
		const calculateDateSpan = (start, end) => {
			const startDate = new Date(start);
			const endDate = new Date(end);

			let years = endDate.getFullYear() - startDate.getFullYear();
			let months = endDate.getMonth() - startDate.getMonth();
			let days = endDate.getDate() - startDate.getDate();

			if (days < 0) {
				months -= 1;
				days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
			}
			if (months < 0) {
				years -= 1;
				months += 12;
			}

			return {
				years,
				months,
				days
			};
		};

		const institutionElement = createLabelValueElement('投资项目:', institution);
		const dateElement = createLabelValueElement('时间:', `${startDate} 至 ${endDate}`);
		const dateSpan = calculateDateSpan(startDate, endDate);
		const dateSpanElement = createLabelValueElement('时间跨度:',
			`共 ${dateSpan.years} 年 ${dateSpan.months} 个月 ${dateSpan.days} 天`);
		const pastValueElement = createLabelValueElement('过去值:', pastValue);
		const currentValueElement = createLabelValueElement('现在值:', currentValue);
		const growthRateElement = createLabelValueElement('增长率:', `${growthRate}%`);

		const deleteButton = document.createElement('button');
		deleteButton.textContent = '删除';
		deleteButton.addEventListener('click', () => {
			historyList.removeChild(listItem);
			removeHistoryItem({
				institution,
				startDate,
				endDate,
				pastValue,
				currentValue,
				growthRate
			});
		});

		listItem.appendChild(institutionElement);
		listItem.appendChild(dateElement);
		listItem.appendChild(dateSpanElement);
		listItem.appendChild(pastValueElement);
		listItem.appendChild(currentValueElement);
		listItem.appendChild(growthRateElement);
		listItem.appendChild(deleteButton);
		historyList.appendChild(listItem);
	}

	function saveHistory(item) {
		let history = JSON.parse(localStorage.getItem('history')) || [];
		history.push(item);
		localStorage.setItem('history', JSON.stringify(history));
	}

	function loadHistory() {
		const history = JSON.parse(localStorage.getItem('history')) || [];
		history.forEach(item => addHistoryItem(item));
	}

	function removeHistoryItem(itemToRemove) {
		let history = JSON.parse(localStorage.getItem('history')) || [];
		history = history.filter(item => {
			return !(item.institution === itemToRemove.institution &&
				item.startDate === itemToRemove.startDate &&
				item.endDate === itemToRemove.endDate &&
				item.pastValue === itemToRemove.pastValue &&
				item.currentValue === itemToRemove.currentValue &&
				item.growthRate === itemToRemove.growthRate);
		});
		localStorage.setItem('history', JSON.stringify(history));
	}
});