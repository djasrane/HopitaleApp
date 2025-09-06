'use strict';

// ======= Modal =======
const openModel = () => document.getElementById('modelPersonnel').classList.add('active');
const closeModel = () => {
    clearFields();
    document.getElementById('modelPersonnel').classList.remove('active');
};

// ======= Local Storage =======
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_personnel')) ?? [];
const setLocalStorage = (db_personnel) => localStorage.setItem('db_personnel', JSON.stringify(db_personnel));

const readPersonnel = () => getLocalStorage();
const createPersonnel = (personnel) => {
    const db_personnel = getLocalStorage();
    db_personnel.push(personnel);
    setLocalStorage(db_personnel);
};
const updatePersonnel = (index, personnel) => {
    const db_personnel = readPersonnel();
    db_personnel[index] = personnel;
    setLocalStorage(db_personnel);
};
const deletePersonnel = (index) => {
    const db_personnel = readPersonnel();
    db_personnel.splice(index, 1);
    setLocalStorage(db_personnel);
};

// ======= Validation & Champs =======
const isValidFields = () => document.getElementById('formPersonnel').reportValidity();
const clearFields = () => {
    const fields = document.querySelectorAll('.model-field');
    fields.forEach(field => field.value = '');
};

// ======= Enregistrer Personnel =======
const savePersonnel = () => {
    if (isValidFields()) {
        const personnel = {
            nom: document.getElementById('personnelNom').value,
            prenom: document.getElementById('personnelPrenom').value,
            poste: document.getElementById('personnelPoste').value,
            email: document.getElementById('personnelEmail').value,
            matricule: document.getElementById('personnelMatricule').value
        };

        const index = document.getElementById('personnelNom').dataset.index;
        if (index == 'new') {
            createPersonnel(personnel);
            listPersonnel();
            closeModel();
        } else {
            updatePersonnel(index, personnel);
            listPersonnel();
            closeModel();
        }
    }
};

// ======= Tableau =======
const createRow = (personnel, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td data-label="Nom">${personnel.nom}</td>
        <td data-label="Prénom">${personnel.prenom}</td>
        <td data-label="Poste">${personnel.poste}</td>
        <td data-label="Email">${personnel.email}</td>
        <td data-label="Matricule">${personnel.matricule}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Edit</button>
            <button type="button" class="button red" id="delete-${index}">Delete</button>
        </td>
    `;
    document.querySelector('#tblPersonnel>tbody').appendChild(newRow);
};

const clearTable = () => {
    const rows = document.querySelectorAll('#tblPersonnel>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

const listPersonnel = () => {
    const personnels = readPersonnel();
    clearTable();
    personnels.forEach(createRow);
};

// ======= Editer =======
const fillFields = (personnel) => {
    document.getElementById('personnelNom').value = personnel.nom;
    document.getElementById('personnelPrenom').value = personnel.prenom;
    document.getElementById('personnelPoste').value = personnel.poste;
    document.getElementById('personnelEmail').value = personnel.email;
    document.getElementById('personnelMatricule').value = personnel.matricule;
    document.getElementById('personnelNom').dataset.index = personnel.index;
};

const editPersonnel = (index) => {
    const personnel = readPersonnel()[index];
    personnel.index = index;
    fillFields(personnel);
    openModel();
};

// ======= Edit / Delete buttons =======
const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-');
        if (action == 'edit') {
            editPersonnel(index);
        } else {
            const personnel = readPersonnel()[index];
            const response = confirm(`Voulez-vous supprimer ${personnel.nom} ${personnel.prenom} ?`);
            if (response) {
                deletePersonnel(index);
                listPersonnel();
            }
        }
    }
};

// ======= Event Listeners =======
document.getElementById('idPersonnel').addEventListener('click', openModel);
document.getElementById('modelPersonnelClose').addEventListener('click', closeModel);
document.getElementById('savePersonnel').addEventListener('click', savePersonnel);
document.querySelector('#tblPersonnel>tbody').addEventListener('click', editDelete);

// ======= Initialisation =======
listPersonnel();
