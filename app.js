let foods = [];

async function loadFoods() {
  try {
    const res = await fetch('foods.json');
    if (!res.ok) throw new Error('missing');
    foods = await res.json();
  } catch (err) {
    foods = [];
  }
}

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function findFood(query) {
  const q = normalize(query.trim());
  if (!q) return null;
  return foods.find(food => normalize(food.name).includes(q)) || null;
}

function makeRow(label, value) {
  if (!value) return null;

  const row = document.createElement('div');
  row.className = 'row';

  const strong = document.createElement('strong');
  strong.textContent = label;

  const span = document.createElement('span');
  span.textContent = value;

  row.append(strong, span);
  return row;
}

function render(food) {
  const result = document.getElementById('result');
  result.classList.remove('hidden', 'Green', 'Yellow', 'Red');

  if (!food) {
    result.textContent = 'No verified food card yet. Please check back soon.';
    return;
  }

  result.classList.add(food.light);
  result.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = food.name;
  result.append(title);

  const servingRow = makeRow('Serving', food.serving);
  if (servingRow) result.append(servingRow);

  if (food.net_carbs && food.fiber) {
    const netRow = makeRow('Net carbs', food.net_carbs + ' g');
    if (netRow) result.append(netRow);
  } else {
    const totalRow = makeRow('Total carbs', food.total_carbs ? food.total_carbs + ' g' : 'Unverified');
    if (totalRow) result.append(totalRow);
  }

  const fiberRow = makeRow('Fiber', food.fiber ? food.fiber + ' g' : 'Unverified');
  if (fiberRow) result.append(fiberRow);

  const giRow = makeRow('GI category', food.gi);
  if (giRow) result.append(giRow);

  const plateRow = makeRow('Plate placement', food.plate);
  if (plateRow) result.append(plateRow);

  const portionRow = makeRow('Portion note', food.portion);
  if (portionRow) result.append(portionRow);

  const swapOneRow = makeRow('Swap one', food.swap1);
  if (swapOneRow) result.append(swapOneRow);

  const swapTwoRow = makeRow('Swap two', food.swap2);
  if (swapTwoRow) result.append(swapTwoRow);

  if (food.source) {
    const sourceLine = document.createElement('p');
    const sourceLink = document.createElement('a');
    sourceLink.href = food.source;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener';
    sourceLink.textContent = 'Source';
    sourceLine.append('Reference: ', sourceLink);
    result.append(sourceLine);
  }
}

document.getElementById('foodSearch').addEventListener('input', event => {
  render(findFood(event.target.value));
});

loadFoods();
