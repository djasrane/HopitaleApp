'use strict';

/* Modal */
const openModelRendezvous = () => document.getElementById('modelRendezvous').classList.add('active');
const closeModelRendezvous = () => {
    clearFieldsRendezvous();
    document.getElementById('modelRendezvous').classList.remove('active');
}

/* LocalStorage CRUD */
const getLocalStorageRV = () => JSON.parse(localStorage.getItem('db_rendezvous')) ?? [];
const setLocalStorageRV = (db_rv) => localStorage.setItem('db_rendezvous', JSON.stringify(db_rv));

const readRendezvous = () => getLocalStorageRV();
const createRendezvous = (rv) => {
    const db_rv = readRendezvous();
    db_rv.push(rv);
    setLocalStorageRV(db_rv);
}
const updateRendezvous = (index, rv) => {
    const db_rv = readRendezvous();
    db_rv[index] = rv;
    setLocalStorageRV(db_rv);
}
const deleteRendezvous = (index) => {
    const db_rv = readRendezvous();
    db_rv.splice(index, 1);
    setLocalStorageRV(db_rv);
}

/* Formulaire */
const isValidFieldsRV = () => document.getElementById('formRendezvous').reportValidity();
const clearFieldsRendezvous = () => {
    const fields = document.querySelectorAll('#formRendezvous .model-field');
    fields.forEach(field => field.value = '');
    document.getElementById('rvPatient').dataset.index = 'new';
}

/* Remplir selects */
const fillPatientOptionsRV = () => {
    const select = document.getElementById('rvPatient');
    select.innerHTML = '<option value="">Sélectionner un patient</option>';
    const patients = JSON.parse(localStorage.getItem('db_student')) ?? [];
    patients.forEach((p, i) => {
        const option = document.createElement('option');
        option.value = p.name;
        option.textContent = p.name;
        select.appendChild(option);
    });
}

const fillPersonnelOptionsRV = () => {
    const select = document.getElementById('rvPersonnel');
    select.innerHTML = '<option value="">Sélectionner un médecin</option>';
    const personnels = JSON.parse(localStorage.getItem('db_personnel')) ?? [];
    personnels.forEach(personnel => {
        if(personnel.poste === 'medecin' || personnel.poste === 'infirmier'){
            const option = document.createElement('option');
            option.value = personnel.name;
            option.textContent = personnel.name;
            select.appendChild(option);
        }
    });
}

/* Sauvegarder */
const saveRendezvous = () => {
    if(isValidFieldsRV()){
        const rv = {
            patient: document.getElementById('rvPatient').value,
            personnel: document.getElementById('rvPersonnel').value,
            date: document.getElementById('rvDate').value,
            time: document.getElementById('rvTime').value,
            duree: document.getElementById('rvDuree').value,
            motif: document.getElementById('rvMotif').value
        };
        const index = document.getElementById('rvPatient').dataset.index;
        if(index === 'new') createRendezvous(rv);
        else updateRendezvous(index, rv);
        listRendezvous();
        closeModelRendezvous();
    }
}

/* Créer ligne tableau */
const createRowRendezvous = (rv, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td data-label="Patient">${rv.patient}</td>
        <td data-label="Médecin">${rv.personnel}</td>
        <td data-label="Date">${rv.date}</td>
        <td data-label="Heure">${rv.time}</td>
        <td data-label="Durée">${rv.duree}</td>
        <td data-label="Motif">${rv.motif}</td>
        <td data-label="Actions">
            <button class="button green" id="editRV-${index}">Edit</button>
            <button class="button red" id="deleteRV-${index}">Delete</button>
        </td>
    `;
    document.querySelector('#tblRendezvous>tbody').appendChild(newRow);
}

/* Vider tableau */
const clearTableRendezvous = () => {
    document.querySelectorAll('#tblRendezvous>tbody tr').forEach(r => r.remove());
}

/* Lister */
const listRendezvous = () => {
    const rvs = readRendezvous();
    clearTableRendezvous();
    rvs.forEach(createRowRendezvous);
}

/* Editer */
const fillFieldsRendezvous = (rv) => {
    document.getElementById('rvPatient').value = rv.patient;
    document.getElementById('rvPersonnel').value = rv.personnel;
    document.getElementById('rvDate').value = rv.date;
    document.getElementById('rvTime').value = rv.time;
    document.getElementById('rvDuree').value = rv.duree;
    document.getElementById('rvMotif').value = rv.motif;
    document.getElementById('rvPatient').dataset.index = rv.index;
}

const editRendezvous = (index) => {
    const rv = readRendezvous()[index];
    rv.index = index;
    fillFieldsRendezvous(rv);
    openModelRendezvous();
}

/* Edit/Delete bouton */
const editDeleteRendezvous = (e) => {
    if(e.target.type === 'button'){
        const [action, index] = e.target.id.split('-');
        if(action === 'editRV') editRendezvous(index);
        else if(action === 'deleteRV'){
            if(confirm('Supprimer ce rendez-vous ?')){
                deleteRendezvous(index);
                listRendezvous();
            }
        }
    }
}

/* Init */
listRendezvous();
document.getElementById('idRendezvous').addEventListener('click', () => {
    fillPatientOptionsRV();
    fillPersonnelOptionsRV();
    openModelRendezvous();
});
document.getElementById('modelRendezvousClose').addEventListener('click', closeModelRendezvous);
document.getElementById('saveRendezvous').addEventListener('click', saveRendezvous);
document.getElementById('cancelRendezvous').addEventListener('click', closeModelRendezvous);
document.querySelector('#tblRendezvous>tbody').addEventListener('click', editDeleteRendezvous);
