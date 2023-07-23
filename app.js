const inputElement = document.getElementById('title')
const createBtn = document.getElementById('create')
const listElement = document.getElementById('list')


// массив объектов | [] -> массив {} -> объект
const savedNotes = localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];
const notes = savedNotes
localStorage.setItem("notes", JSON.stringify(notes))

listElement.addEventListener('click', handleClick)
createBtn.addEventListener('click', insertData)

// функция отрисовки
function render() {
    // очистка чтобы при каждом клике не дублировать строки из массива
    listElement.innerHTML = ''

    if (notes.length === 0) {
        listElement.innerHTML = '<p>Пусто</p>'
    }

    for (let i = 0; i < notes.length; i++) {
        // вставляем HTML код внутри элемента, в самый конец содержимого.
        listElement.insertAdjacentHTML("afterbegin", getNoteTemplate(notes[i], i))
    }
}
render()

// добавление записи в массив объектов
function insertData() {

    // если строка пустая, то ничего не добавлять
    if (inputElement.value.length === 0) {
        return;
    }

    const currentDate = updateDay()
    const currentClock = document.getElementById('clock').textContent;
    const currentDateAndClock = currentDate + ', ' + currentClock;
    
    // шаблон для новой записи
    const newNote = {
        title: inputElement.value,
        completed: false,
        date: currentDateAndClock 
    }
    
     // вызываем функции для обновления времени и даты
     

    // добавляем в основной массив запись
    notes.push(newNote)

    // обновляем localStorage с новыми данными
    localStorage.setItem("notes", JSON.stringify(notes));
    // отрисовка элементов
    render()

    // очищаем инпут после каждого добавления
    inputElement.value = ''
}

function handleClick(event) {
    // если мы кликаем по элементу который имеет index, то
    if (event.target.dataset.index) {

        // получение индекса из data-index
        const index = Number(event.target.dataset.index)

        // получение типа из data-type
        const type = event.target.dataset.type

        // если тип равен 'toggle' то меняем значение completed на противоположное с помощью !
        if (type === 'toggle') {

            notes[index].completed = !notes[index].completed // Пример: был true, стал false. И так в обратную сторону

        } else if (type === 'remove') {

            // удаление массива по его индексу, 1 значит удалить только один элемент
            notes.splice(index, 1)

        }

        // обновляем localStorage с новыми данными после внесенных изменений в массив notes
        localStorage.setItem("notes", JSON.stringify(notes));
        // отрисовка
        render()
    }
}

function getNoteTemplate(note, index) {

    // динамический шаблон html кода
    // Каждая запись хранит в себе индекс, чтобы потом к ней обращаться и проводить с ней действие
    return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="note-title ${note.completed ? 'text-decoration-line-through' : ''}">${note.title}</span>
        <span class="btn-group">
            <span class="btn btn-small ${note.completed ? 'btn-warning' : 'btn-success'}" data-index="${index}" data-type="toggle">&check;</span>
            <span class="btn btn-small btn-danger" data-index="${index}" data-type="remove">&times;</span>
        </span>
    </li> 
    <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="text-muted">Время добавления: ${note.date}</span>
    </li>

        
    `

}

function updateClock() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2,'0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    const clock = document.getElementById('clock')
    clock.textContent = `${hours}:${minutes}:${seconds}`
}
setInterval(updateClock, 1000)

function updateDay(){
    const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    const myDate = new Date();
    const date = document.getElementById('date')
    const fullDate = myDate.getDate() + " " + months[myDate.getMonth()] + " " + myDate.getFullYear() + ", " + days[myDate.getDay()];
    date.textContent = fullDate
    return fullDate
}
updateDay()

