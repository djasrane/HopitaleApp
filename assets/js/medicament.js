'use strict';

// ===== Modal =====
const openModel = () => document.getElementById('modelMedicament').classList.add('active');
const closeModel = () => {
    clearFields();
    document.getElementById('modelMedicament').classList.remove('active');
};

// ===== LocalStorage =====
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_medicament')) ?? [];
const setLocalStorage = (db) => localStorage.setItem('db_medicament', JSON.stringify(db));

const readMedicament = () => getLocalStorage();
const createMedicament = (med) => {
    const db = getLocalStorage();
    db.push(med);
    setLocalStorage(db);
};
const updateMedicament = (index, med) => {
    const db = readMedicament();
    db[index] = med;
    setLocalStorage(db);
};
const deleteMedicament = (index) => {
    const db = readMedicament();
    db.splice(index, 1);
    setLocalStorage(db);
};

// ===== Champs =====
const isValidFields = () => document.getElementById('formMedicament').reportValidity();
const clearFields = () => document.querySelectorAll('.model-field').forEach((field) => (field.value = ''));

// ===== Enregistrer Médicament =====
const saveMedicament = () => {
    if (!isValidFields()) return;

    const med = {
        nom: document.getElementById('medNom').value.trim(),
        description: document.getElementById('medDescription').value.trim(),
        dosage: document.getElementById('medDosage').value,
        forme: document.getElementById('medForme').value,
        quantite: parseInt(document.getElementById('medQuantite').value, 10),
        seuil: parseInt(document.getElementById('medSeuil').value, 10),
        dateExp: document.getElementById('medDateExp').value,
        categorie: document.getElementById('medCategorie').value,
    };

    const index = document.getElementById('medNom').dataset.index;

    if (index === 'new') {
        createMedicament(med);
    } else {
        updateMedicament(index, med);
    }

    listMedicament();
    closeModel();
};

// ===== Créer une ligne du tableau =====
const createRow = (med, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${med.nom}</td>
        <td>${med.description}</td>
        <td>${med.dosage}</td>
        <td>${med.forme}</td>
        <td>${med.quantite}</td>
        <td>${med.seuil}</td>
        <td>${med.dateExp}</td>
        <td>${med.categorie}</td>
        <td>${med.quantite <= med.seuil ? 'alerte' : med.quantite === 0 ? 'rupture' : 'ok'}</td>
        <td>
            <button class="button green" id="edit-${index}">Éditer</button>
            <button class="button red" id="delete-${index}">Supprimer</button>
        </td>
    `;
    document.querySelector('#tblMedicament>tbody').appendChild(newRow);
};

// ===== Liste Médicaments =====
const clearTable = () => document.querySelectorAll('#tblMedicament>tbody tr').forEach((row) => row.remove());
const listMedicament = () => {
    clearTable();
    readMedicament().forEach((med, i) => createRow(med, i));
};

// ===== Remplir le formulaire pour éditer =====
const fillFields = (med) => {
    document.getElementById('medNom').value = med.nom;
    document.getElementById('medDescription').value = med.description;
    document.getElementById('medDosage').value = med.dosage;
    document.getElementById('medForme').value = med.forme;
    document.getElementById('medQuantite').value = med.quantite;
    document.getElementById('medSeuil').value = med.seuil;
    document.getElementById('medDateExp').value = med.dateExp;
    document.getElementById('medCategorie').value = med.categorie;
    document.getElementById('medNom').dataset.index = med.index;
};

// ===== Éditer Médicament =====
const editMedicament = (index) => {
    const med = readMedicament()[index];
    med.index = index;
    fillFields(med);
    openModel();
};

// ===== Gestion des boutons Éditer / Supprimer =====
const editDelete = (e) => {
    if (e.target.type !== 'button') return;

    const [action, index] = e.target.id.split('-');

    if (action === 'edit') {
        editMedicament(index);
    } else if (action === 'delete') {
        if (confirm(`Voulez-vous supprimer ${readMedicament()[index].nom} ?`)) {
            deleteMedicament(index);
            listMedicament();
        }
    }
};

// ===== Événements =====
document.getElementById('idMedicament').addEventListener('click', openModel);
document.getElementById('modelMedicamentClose').addEventListener('click', closeModel);
document.getElementById('cancelMedicament').addEventListener('click', closeModel);
document.getElementById('saveMedicament').addEventListener('click', saveMedicament);
document.querySelector('#tblMedicament>tbody').addEventListener('click', editDelete);

// ===== Initialisation =====
listMedicament();