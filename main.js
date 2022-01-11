document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.table');
  const btnModal = document.querySelector('.btn__client');
  const btnAddContact = document.querySelector('.modal__add');
  const btnChangeAdd = document.querySelector('.modal__change .modal__add');
  const inputFilter = document.querySelector('.header__input');
  const simbol = /^[а-яА-ЯёЁ-\s]+$/;
  let surnameInput = document.querySelector('.modal-surname');
  let surnameChange = document.querySelector('.modal__change .modal-surname');
  let nameInput = document.querySelector('.modal-name');
  let nameChange = document.querySelector('.modal__change .modal-name');
  let lastnameInput = document.querySelector('.modal-lastname');
  let lastnameChange = document.querySelector('.modal__change .modal-lastname');
  let sortType = 1;
  let clickDelSum = 0;
  let sortStudents;
  let currentList;

  async function createStudentsList(students) {
    for (let student of students) {
      const response = await fetch(`http://localhost:3000/api/clients`, {
        method: 'POST',
        body: JSON.stringify({
          surname: student.surname,
          name: student.name,
          lastName: student.lastname,
          contacts: student.contacts,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      let list = await response.json();
      console.log(list)

    }
    // createTable(list)
  }
  // createStudentsList(students);

  // Получение списка клиентов
  async function getStudentsList() {
    const response1 = await fetch(`http://localhost:3000/api/clients`);
    currentList = await response1.json();

    createTable(currentList);
    createAutocompletion(currentList);
    return console.log(currentList);
  };
  getStudentsList();

  // Создание шапки таблицы
  function createHeadTable() {

    let tr = document.createElement('tr');
    tr.classList.add('head__table');

    let thId = document.createElement('th');
    thId.innerHTML = 'ID';
    thId.classList.add('head__id');
    thId.classList.add('head-click');
    thId.classList.add('show');
    tr.appendChild(thId);

    let thSurname = document.createElement('th');
    let spanSurname = document.createElement('span');
    spanSurname.classList.add('surname__span');
    spanSurname.innerHTML = 'А-Я';
    thSurname.innerHTML = 'Фамилия Имя Отчество';
    thSurname.classList.add('head__surname');
    thSurname.classList.add('head-click');
    thSurname.appendChild(spanSurname);
    tr.appendChild(thSurname);

    let thDate = document.createElement('th');
    thDate.innerHTML = 'Дата и время создания';
    thDate.classList.add('head__date');
    thDate.classList.add('head-click');
    tr.appendChild(thDate);

    let thLast = document.createElement('th');
    thLast.innerHTML = 'Последние изменения';
    thLast.classList.add('head__last');
    thLast.classList.add('head-click');
    tr.appendChild(thLast);

    let thContacts = document.createElement('th');
    thContacts.innerHTML = 'Контакты';
    thContacts.classList.add('head__contacts');
    tr.appendChild(thContacts);

    let thAction = document.createElement('th');
    thAction.innerHTML = 'Действия';
    thAction.classList.add('head__action');
    tr.appendChild(thAction);

    table.appendChild(tr);
  }
  createHeadTable()

  // Создание таблицы
  function createTable(lists) {

    for (let list of lists) {
      let tr = document.createElement('tr');
      tr.classList.add('table__row');

      let td = document.createElement('td');
      td.classList.add('table__id');
      td.innerHTML = list.id;
      tr.appendChild(td);

      let td1 = document.createElement('td');
      td1.classList.add('surname');
      td1.innerHTML = list.surname + ' ' + list.name + ' ' + list.lastName;
      tr.appendChild(td1);

      let td2 = document.createElement('td');
      td2.classList.add('date-create');
      let td2Span = document.createElement('span');
      td2Span.classList.add('span-time');
      let dateCreate = list.createdAt.slice(0, 10).split('-').reverse().join('.');
      let timeCreate = list.createdAt.slice(11, 16);
      td2Span.innerHTML = timeCreate;

      td2.innerHTML = dateCreate + ' ';
      td2.appendChild(td2Span);
      tr.appendChild(td2);

      let td3 = document.createElement('td');
      let td3Span = document.createElement('span');
      td3Span.classList.add('span-time');
      let dateUpdate = list.updatedAt.slice(0, 10).split('-').reverse().join('.');
      let timeUpdate = list.updatedAt.slice(11, 16);
      td3Span.innerHTML = timeUpdate;

      td3.innerHTML = dateUpdate + ' ';
      td3.appendChild(td3Span);
      tr.appendChild(td3);

      let td4 = document.createElement('td');
      let text = '';
      let div = document.createElement('div');
      div.classList.add('tooltip');

      td4.classList.add('td__contact');
      td4.innerHTML = text;
      td4.appendChild(div);
      tr.appendChild(td4);

      let td5 = document.createElement('td');
      let btn1 = document.createElement('button');
      btn1.className = 'btn btn__change';
      btn1.innerHTML = 'Изменить';
      let btn2 = document.createElement('button');
      btn2.className = 'btn btn__delete';
      btn2.innerHTML = 'Удалить';
      td5.appendChild(btn1);
      td5.appendChild(btn2);
      tr.appendChild(td5)

      table.appendChild(tr);
      madeIconsTooltip(list.contacts, div);
      btn1.addEventListener('click', clickModal);
      btn1.addEventListener('click', createChangedForm)
      btn2.addEventListener('click', clickDelete);
    }

    let tds = document.querySelectorAll('td');
    tds.forEach((td) => {
      td.classList.add('table__td');
    })

    sorted(lists);
  }
  document.querySelector('.modal__label-new ').addEventListener('click', createLabel);
  document.querySelector('.modal-surname').addEventListener('input', createLabel);
  document.querySelector('.modal-name').addEventListener('input', createLabel);
  document.querySelector('.modal__form').addEventListener('input', createLabel);

  // Создание декоративных элементов в модальном окне 
  function createLabel(e) {
    if (e.target != '') {
      if (this.closest('.modal-surname')) {
        document.querySelector('.label-surname').innerHTML = '';
      }
      if (this.closest('.modal-name')) {
        document.querySelector('.label-name').innerHTML = '';
      }
    } else {
      if (this.closest('.modal-surname')) {
        document.querySelector('.label-surname').innerHTML = 'Фамилия';
        let span = document.createElement('span');
        span.innerHTML = ' *';
        span.classList.add('modal__elem');
        document.querySelector('.label-surname').append(span)
      }
      if (this.closest('.modal-name')) {
        document.querySelector('.label-name').innerHTML = 'Имя';
        let span = document.createElement('span');
        span.innerHTML = ' *';
        span.classList.add('modal__elem');
        document.querySelector('.label-name').append(span)
      }
    }
  }

  // Валидация при создании нового клиента
  function validate() {
    let valueSurname = surnameInput.value.trim();
    let valueName = nameInput.value.trim();
    let valueLastname = lastnameInput.value.trim();
    let spanError = document.querySelector('.modal__error');
    let inputs = document.querySelectorAll('.modal__input');
    let contacts = [];

    document.querySelectorAll('.modal__contact').forEach(el => {
      let type = el.querySelector('.btn__drop').innerHTML;
      let value = el.querySelector('.modal__contact-input').value.trim();
      contacts.push({ type: type, value: value });
    })

    if ((valueSurname === '') || (valueName === '')) {
      spanError.innerHTML = 'Поля должны быть заполнены';
      inputs.forEach(function (input) {
        if (input.value.length === 0) {
          input.style.borderColor = '#F06A4D';
        }
      })
      document.querySelector('.modal-lastname').style.borderColor = '#C8C5D1';

    } else if (!valueSurname.match(simbol) || !valueName.match(simbol)) {
      spanError.innerHTML = '';
      spanError.innerHTML = 'Недопустимое значение';

      if (!valueSurname.match(simbol)) {
        document.querySelector('.modal-surname').style.borderColor = '#F06A4D';
      } else {
        document.querySelector('.modal-surname').style.borderColor = '#C8C5D1';
      }
      if (!valueName.match(simbol)) {
        document.querySelector('.modal-name').style.borderColor = '#F06A4D';
      } else {
        document.querySelector('.modal-name').style.borderColor = '#C8C5D1'
      }
    } else {
      if (valueLastname.length !== 0) {
        if (!valueLastname.match(simbol)) {
          spanError.innerHTML = '';
          spanError.innerHTML = 'Недопустимое значение';
          document.querySelector('.modal-lastname').style.borderColor = '#F06A4D';
          return
        }
        spanError.innerHTML = '';
        document.querySelector('.modal-lastname').style.borderColor = '#C8C5D1';
      }

      spanError.innerHTML = '';
      valueSurname = valueSurname[0].toUpperCase() + valueSurname.slice(1).toLowerCase();
      valueName = valueName[0].toUpperCase() + valueName.slice(1).toLowerCase();
      if (valueLastname.length != 0) {
        valueLastname = valueLastname[0].toUpperCase() + valueLastname.slice(1).toLowerCase();
      } else {
        valueLastname = '';
      }

      createNewStudent(valueSurname, valueName, valueLastname, contacts);
      sorted();
      surnameInput.value = '';
      nameInput.value = '';
      lastnameInput.value = '';
      document.querySelectorAll('.modal__contact').forEach(elem => {
        elem.remove();
      })

      inputs.forEach(input => input.style.borderColor = '#C8C5D1');
      return true
    }

  }

  document.querySelector('.modal__save').addEventListener('click', (e) => {
    const isValid = validate();

    if (!isValid) {
      return
    }
    document.querySelector('.modal').classList.remove('modal_active');
    document.body.classList.remove('active');
    cleanTable();
    getStudentsList();
  })

  // Создание нового клиента
  async function createNewStudent(valueSurname, valueName, valueLastname, contacts) {

    const response = await fetch(`http://localhost:3000/api/clients`, {
      method: 'POST',
      body: JSON.stringify({
        surname: valueSurname,
        name: valueName,
        lastName: valueLastname,
        contacts: contacts,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    let list2 = await response.json();


  }

  // Создание иконок с контактами клиента
  function madeIconsTooltip(listContacts, list) {

    for (let i = 0; i < listContacts.length; i++) {
      let type = listContacts[i].type;
      let value = listContacts[i].value;
      let div = document.createElement('div');

      if (type === 'Vkontakte' || type === 'Vk') {
        div.className = 'tooltip__icon vk';
        let spanVk = document.createElement('span');
        let spanTypeVk = document.createElement('span');
        spanVk.className = 'tooltipe__type span-vk';
        spanTypeVk.className = 'tooltip__content span-type';
        spanTypeVk.textContent = type;
        spanVk.textContent = ': ' + value;
        spanTypeVk.setAttribute('role', 'tooltip');
        spanTypeVk.appendChild(spanVk);
        div.appendChild(spanTypeVk);
      }

      if (type === 'Facebook') {
        div.className = 'tooltip__icon fb';
        let spanFb = document.createElement('span');
        let spanTypeFb = document.createElement('span');
        spanFb.className = 'tooltipe__type span-fb';
        spanTypeFb.className = 'tooltip__content span-type';
        spanTypeFb.textContent = type;
        spanFb.textContent = ': ' + value;
        spanTypeFb.appendChild(spanFb);
        spanTypeFb.setAttribute('role', 'tooltip');
        div.appendChild(spanTypeFb);
      }

      if (type === 'Телефон') {
        div.className = 'tooltip__icon phone';
        let spanPhone = document.createElement('span');
        let spanTypePhone = document.createElement('span');
        spanPhone.className = 'tooltipe__type span-phone';
        spanTypePhone.className = 'tooltip__content span-type';
        spanTypePhone.textContent = type;
        spanPhone.textContent = ': ' + value;
        spanTypePhone.setAttribute('role', 'tooltip');
        spanTypePhone.appendChild(spanPhone);
        div.appendChild(spanTypePhone);
      }

      if (type === 'Email') {
        div.className = 'tooltip__icon email';
        let spanEmail = document.createElement('span');
        let spanTypeEmail = document.createElement('span');
        spanEmail.className = 'tooltipe__type span-email';
        spanTypeEmail.className = 'tooltip__content span-type';
        spanTypeEmail.textContent = type;
        spanEmail.textContent = ': ' + value;
        spanTypeEmail.setAttribute('role', 'tooltip');
        spanTypeEmail.appendChild(spanEmail);
        div.appendChild(spanTypeEmail);
      }

      if (type === 'Другое') {
        div.className = 'tooltip__icon other';
        let spanEmail = document.createElement('span');
        let spanTypeEmail = document.createElement('span');
        spanEmail.className = 'tooltipe__type span-other';
        spanTypeEmail.className = 'tooltip__content span-type';
        spanTypeEmail.textContent = type;
        spanEmail.textContent = ': ' + value;
        spanTypeEmail.setAttribute('role', 'tooltip');
        spanTypeEmail.appendChild(spanEmail);
        div.appendChild(spanTypeEmail);

      }
      let tooltips = document.querySelectorAll('.tooltip');
      tooltips.forEach(tt => {
        tt.appendChild(div);
      })
    }

    let btnIcons = document.createElement('button');
    btnIcons.classList.add('btn__icons');
    btnIcons.classList.add('visible');
    if (listContacts.length >= 6) {
      let icons = list.querySelectorAll('.tooltip__icon:nth-child(n+5)');
      icons.forEach(ic => {
        ic.classList.add('visible');
      });
      btnIcons.innerHTML = '+' + (listContacts.length - 4);
      list.append(btnIcons);
      btnIcons.addEventListener('click', e => {
        e.preventDefault();
        
        list.querySelector('.tooltip__icon:first-child').style.marginBottom = '7px';
        icons.forEach(ic => {
          ic.classList.remove('visible')
        });
        btnIcons.remove();
      })
    }
  }

  btnModal.addEventListener('click', clickModal);
  document.addEventListener('click', closeModal);

  // Работа с модальными окнами
  function clickModal(e) {
    e.preventDefault();
    const modalNew = document.querySelector('.modal__new');
    if (e.target.closest('.btn__client')) {
      modalNew.classList.add('modal_active');
      document.body.classList.add('active');
      return
    }
  }

  function closeModal() {
    let menuClose = document.querySelector('.menu__close');
    let menuCancell = document.querySelector('.menu__cancell');
    menuClose.addEventListener('click', () => {
      document.querySelector('.modal').classList.remove('modal_active');
      document.body.classList.remove('active');
    });
    menuCancell.addEventListener('click', () => {
      document.querySelector('.modal').classList.remove('modal_active');
      document.body.classList.remove('active');
    });
  }

  document.addEventListener('click', (e) => {
    e.preventDefault();
    let target = e.target;
    if (e.target.closest('.btn__change')) {
      document.querySelector('.modal__change').classList.add('modal_active');
      document.body.classList.add('active');
      return
    }
    if (target.closest('.menu__close') || target.closest('.menu__close-span')) {
      document.querySelector('.modal__delete').classList.remove('modal_active');
      document.querySelector('.modal__change').classList.remove('modal_active');
      document.body.classList.remove('active');
      document.querySelectorAll('.modal__change .modal__contact').forEach(elem => {
        elem.remove();
      })
      return
    }
    if (target.closest('.menu__cancell')) {
      document.querySelector('.modal__delete').classList.remove('modal_active');
      document.body.classList.remove('active');
      return
    }

    if (target.closest('.modal__delete')) {
      document.querySelector('.modal__delete').classList.remove('modal_active');
      document.body.classList.remove('active');
      return
    }

    if (e.target.classList.contains('modal__change')) {
      document.querySelector('.modal__change').classList.remove('modal_active');
      document.body.classList.remove('active');
      return
    }

    if (e.target.classList.contains('modal__new')) {
      document.querySelector('.modal__new').classList.remove('modal_active');
      document.body.classList.remove('active');
      document.querySelectorAll('.modal__new .modal__contact').forEach(elem => {
        elem.remove();
      })
      return
    }

    if (!target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown__menu').forEach(el => {
        el.classList.remove('show');
      })
      document.querySelectorAll('.btn__drop').forEach(el => {
        el.classList.remove('show')
      })
    }
    if (target.closest('.dropdown__item')) {
      document.querySelector('.btn__drop.show').innerHTML = target.innerHTML;
      document.querySelector('.dropdown__menu.show').classList.remove('show');
    }
  });

  // Удаление клиента
  function clickDelete(e) {
    document.querySelector('.modal__delete').classList.add('modal_active');
    document.body.classList.add('active');
    let parentBtn = e.target.parentNode;
    let parentRow = parentBtn.parentNode;
    let idDelete = parentRow.childNodes[0];
    document.querySelector('.modal__btn-delete').addEventListener('click', (e) => {

      deleteStudent(idDelete.innerHTML, parentRow);

    })

  }

  function deleteStudent(id, elem) {

    elem.remove();
    fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE',
    })

    document.querySelector('.modal__delete').classList.remove('modal_active');
    document.querySelector('.modal__change').classList.remove('modal_active');
    document.body.classList.remove('active');

  }

  btnAddContact.addEventListener('click', createContactForm);
  btnChangeAdd.addEventListener('click', createContactForm);

  // Создание формы с контактами
  function createContactForm(contacts, type, value) {
    clickDelSum++;

    let div = document.createElement('div');
    div.classList.add('modal__contact');

    let divDrop = document.createElement('div');
    divDrop.classList.add('dropdown');
    let btnDrop = document.createElement('button');
    btnDrop.classList.add('btn__drop');
    btnDrop.innerHTML = 'Телефон';
    divDrop.appendChild(btnDrop);
    let divDropdown = document.createElement('div');
    divDropdown.classList.add('dropdown__menu');
    divDrop.appendChild(divDropdown);
    let a1 = document.createElement('a');
    a1.classList.add('dropdown__item');
    a1.innerHTML = 'Vk';
    divDropdown.appendChild(a1);
    let a2 = document.createElement('a');
    a2.classList.add('dropdown__item');
    a2.innerHTML = 'Facebook';
    divDropdown.appendChild(a2);
    let a3 = document.createElement('a');
    a3.classList.add('dropdown__item');
    a3.innerHTML = 'Email';
    divDropdown.appendChild(a3);
    let a4 = document.createElement('a');
    a4.classList.add('dropdown__item');
    a4.innerHTML = 'Другое';
    divDropdown.appendChild(a4);
    let a5 = document.createElement('a');
    a5.classList.add('dropdown__item');
    a5.innerHTML = 'Телефон';
    divDropdown.appendChild(a5);

    let input = document.createElement('input');
    input.classList.add('modal__contact-input');
    input.setAttribute('placeholder', 'Введите данные контакта');
    let deleteContact = document.createElement('button');

    input.addEventListener('click', () => {

      deleteContact.classList.add('modal__contact-del');
      let spanDel = document.createElement('span');
      spanDel.classList.add('modal__tooltip-container');
      spanDel.innerHTML = 'Удалить контакт';
      deleteContact.appendChild(spanDel);
      div.appendChild(deleteContact);

    })
    deleteContact.addEventListener('click', function (e) {
      e.preventDefault()
      e.target.parentNode.remove();
    })

    div.appendChild(divDrop);
    div.appendChild(input);

    if (this.length != '0') {
      this.before(div);
      let btnsDrop = document.querySelectorAll('.btn__drop');
      btnsDrop.forEach((btn) => {
        btn.addEventListener('click', clickDrop);
      })

      if (clickDelSum >= 10) {
        this.setAttribute('disabled', 'disabled');
        this.classList.add('disabled');
        this.removeEventListener('click', createContactForm);
        return
      }
    } else {
      document.querySelector('.modal__change .modal__add').before(div);
      btnDrop.innerHTML = type;
      input.value = value;

    }

  }

  function clickDrop(e) {
    let btn = this;
    let dropdown = this.parentElement.querySelector('.dropdown__menu');

    document.querySelectorAll('.btn__drop').forEach(el => {
      if (el != btn) {
        el.classList.remove('show');
      }
    })
    document.querySelectorAll('.dropdown__menu').forEach(el => {
      if (el != dropdown) {
        el.classList.remove('show');
      }
    })
    dropdown.classList.toggle('show');
    btn.classList.toggle('show');
  }
  let contacts = [];

  // Создание формы при изменении данных клиента
  async function createChangedForm(e) {
    const response2 = await fetch(`http://localhost:3000/api/clients`);
    let listChange = await response2.json();

    let elemParent = e.target.parentNode;
    let parentElemParent = elemParent.parentNode;
    let idClient = parentElemParent.childNodes[0];

    listChange.forEach(elem => {
      if (idClient.innerHTML === elem.id) {
        document.querySelector('.modal__change .modal-surname').value = elem.surname;
        document.querySelector('.modal__change .modal-name').value = elem.name;
        document.querySelector('.modal__change .modal-lastname').value = elem.lastName;
        if (elem.contacts.length != '0') {
          for (let i = 0; i < elem.contacts.length; i++) {
            let type = elem.contacts[i].type;
            let value = elem.contacts[i].value;
            createContactForm(elem.contacts, type, value);
          }
        }
      }
    })
    document.querySelector('.modal__id').innerHTML = "ID" + ' ' + idClient.innerHTML;

    document.querySelector('.modal__change-btn').addEventListener('click', (e) => {
      deleteStudent(idClient.innerHTML, parentElemParent);
    })
  }

  // Изменение клиента
  async function changeClient(id, valueSurname, valueName, valueLastname, contacts) {
    fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        surname: valueSurname,
        name: valueName,
        lastName: valueLastname,
        contacts: contacts,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })

    cleanTable();
    getStudentsList();

  }

  // Валидация при изменении клиента
  function validateChange(id) {

    let valueSurname = surnameChange.value.trim();
    let valueName = nameChange.value.trim();
    let valueLastname = lastnameChange.value.trim();
    let spanError = document.querySelector('.modal__change .modal__error');
    let inputs = document.querySelectorAll('.modal__change .modal__input');

    document.querySelectorAll('.modal__contact').forEach(el => {
      let type = el.querySelector('.btn__drop').innerHTML;
      let value = el.querySelector('.modal__contact-input').value.trim();
      contacts.push({ type: type, value: value });
    })

    if ((valueSurname === '') || (valueName === '')) {
      spanError.innerHTML = 'Поля должны быть заполнены';
      inputs.forEach(function (input) {
        if (input.value.length === 0) {
          input.style.borderColor = '#F06A4D';
        }
      })
      document.querySelector('.modal__change .modal-lastname').style.borderColor = '#C8C5D1';

    } else if (!valueSurname.match(simbol) || !valueName.match(simbol)) {

      spanError.innerHTML = '';
      spanError.innerHTML = 'Недопустимое значение';

      if (!valueSurname.match(simbol)) {
        document.querySelector('.modal__change .modal-surname').style.borderColor = '#F06A4D';
      } else {
        document.querySelector('.modal__change .modal-surname').style.borderColor = '#C8C5D1';
      }
      if (!valueName.match(simbol)) {
        document.querySelector('.modal__change .modal-name').style.borderColor = '#F06A4D';
      } else {
        document.querySelector('.modal__change .modal-name').style.borderColor = '#C8C5D1'
      }
    } else {
      if (valueLastname.length !== 0) {
        if (!valueLastname.match(simbol)) {
          spanError.innerHTML = '';
          spanError.innerHTML = 'Недопустимое значение';
          document.querySelector('.modal__change .modal-lastname').style.borderColor = '#F06A4D';
          return
        }
        spanError.innerHTML = '';
        document.querySelector('.modal__change .modal-lastname').style.borderColor = '#C8C5D1';
      }
      spanError.innerHTML = '';
      valueSurname = valueSurname[0].toUpperCase() + valueSurname.slice(1).toLowerCase();
      valueName = valueName[0].toUpperCase() + valueName.slice(1).toLowerCase();
      valueSurname = valueSurname[0].toUpperCase() + valueSurname.slice(1).toLowerCase();
      changeClient(id, valueSurname, valueName, valueLastname, contacts);
      sorted();

      inputs.forEach(input => input.style.borderColor = '#C8C5D1');
      return true
    }
  }

  document.querySelector('.modal__change .modal__save').addEventListener('click', function (e) {
    const isValid = validateChange(document.querySelector('.modal__id').innerHTML.slice(3));

    if (!isValid) {
      return
    }
    document.querySelector('.modal__change').classList.remove('modal_active');
    document.body.classList.remove('active');
  })

  // Очищение таблицы
  function cleanTable() {
    let list = document.querySelectorAll('.table__row');
    if (list.length) {
      for (let i = 0; i < list.length; i++) {
        let elem = list[i];
        table.removeChild(elem);
      }
    }
  }

  // Сортировка и фильтрация
  let switching = false;
  function sorted(students) {
    let ths = document.querySelectorAll('.head-click');

    ths.forEach(function (th) {

      if (!switching) {
        th.addEventListener('click', function (e) {
          e.preventDefault();

          let clickName = e.target;

          if (!e.target.closest('.show')) {
            this.classList.add('show');
          } else {
            this.classList.remove('show');
          }
          switch (clickName.className) {
            case 'head__surname head-click':
              sortStudents = sortSurname(students, 'surname', sortType);
              switching = true;
              break;
            case 'head__surname head-click show':
              sortStudents = sortSurname(students, 'surname', sortType);
              switching = true;
              break;
            case 'surname__span':
              sortStudents = sortSurname(students, 'surname', sortType);
              switching = true;
              break;
            case 'head__date head-click':
              sortStudents = sortSurname(students, 'createdAt', sortType);
              switching = true;
              break;
            case 'head__date head-click show':
              sortStudents = sortSurname(students, 'createdAt', sortType);
              switching = true;
              break;
            case 'head__id head-click':
              sortStudents = sortSurname(students, 'id', sortType);
              switching = true;
              break;
            case 'head__id head-click show':
              sortStudents = sortSurname(students, 'id', sortType);
              switching = true;
              break;
            case 'head__last head-click':
              sortStudents = sortSurname(students, 'updatedAt', sortType);
              switching = true;
              break;
            case 'head__last head-click show':
              sortStudents = sortSurname(students, 'updatedAt', sortType);
              switching = true;
              break;
          }
          sortType *= -1;

          cleanTable();
          createTable(sortStudents);
        })
      }
    })
  }

  function sortSurname(students, field, type) {
    sortStudents = students.slice();

    return sortStudents.sort((a, b) => {
      let nameA = a[field].toLowerCase();
      let nameB = b[field].toLowerCase();

      if (nameA < nameB) return -1 * type;

      if (nameA > nameB) return type;

      return 0
    })

  }

  let studentsFilter = [];
  inputFilter.addEventListener('input', delaySearch);
  let timeoutId;
  async function delaySearch() {
    clearTimeout(timeoutId);
    const response3 = await fetch(`http://localhost:3000/api/clients`);
    list = await response3.json();

    timeoutId = setTimeout(function () {

      if (inputFilter.value != undefined) {
        filterCreate(list);
      }
    }, 300);
  }

  function filterSearch(students, label, value) {

    return studentsFilter = students.filter(item => item[label].indexOf(value) !== -1)

  }

  function filterCreate(students) {

    studentsFilter = students.slice();
    studentsFilter.forEach(function (person) {
      person.surname = `${person.surname} ${person.name} ${person.lastName}`
      person.name = '';
      person.lastName = '';
    })
    if (inputFilter.value.length != '0') {
      let value = inputFilter.value.trim()[0].toUpperCase() + inputFilter.value.trim().slice(1).toLowerCase();
      let localData = studentsFilter.length ? studentsFilter : students

      if (inputFilter) {
        studentsFilter = filterSearch(localData, 'surname', value);
      }

      cleanTable();
      createTable(studentsFilter);
      sorted(studentsFilter);

    } else {
      cleanTable();
      getStudentsList();
    }

    return
  }

  // Автодополнение при поиске
  function createAutocompletion(list) {
    let inputSearch = document.querySelector('.header__input');
    let ul = document.createElement('ul');
    ul.classList.add('header__list');
    document.querySelector('.header__form').appendChild(ul);
    let matches;
    
    inputSearch.addEventListener('input', function () {
      ul.innerHTML = '';
      let value = inputSearch.value.trim()[0].toUpperCase() + inputSearch.value.trim().slice(1).toLowerCase();
      if(this.value !== '') {
        
        list.forEach( (item => {
          item.surname = `${item.surname} ${item.name} ${item.lastName}`;
          item.name = '';
          item.lastName = '';

          matches = filterSearch(list, 'surname', value) ;
        }))
        
        if(matches.length > 0) {
          for(let match of matches) {
            let li = document.createElement('li');
            li.classList.add('header__item');
            li.innerHTML = match.surname + ' ' + match.name + ' ' + match.lastName;
            ul.appendChild(li);

            li.addEventListener('click', function() {
              inputSearch.value = this.innerHTML;
              ul.innerHTML = '';
            })
          }
        }
      }
    })
  }
})