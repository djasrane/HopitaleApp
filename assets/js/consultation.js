'use strict';

/* ============================
   Modal
============================ */
const openModelConsultation = () => document.getElementById('modelConsultation').classList.add('active');
const closeModelConsultation = () => {
    clearFieldsConsultation();
    document.getElementById('modelConsultation').classList.remove('active');
}

/* ============================
   LocalStorage CRUD
============================ */
const getLocalStorageConsultation = () => JSON.parse(localStorage.getItem('db_consultation')) ?? [];
const setLocalStorageConsultation = (db_consultation) => localStorage.setItem('db_consultation', JSON.stringify(db_consultation));

const readConsultation = () => getLocalStorageConsultation();

const createConsultation = (consultation) => {
    const db_consultation = readConsultation();
    db_consultation.push(consultation);
    setLocalStorageConsultation(db_consultation);
}

const updateConsultation = (index, consultation) => {
    const db_consultation = readConsultation();
    db_consultation[index] = consultation;
    setLocalStorageConsultation(db_consultation);
}

const deleteConsultation = (index) => {
    const db_consultation = readConsultation();
    db_consultation.splice(index, 1);
    setLocalStorageConsultation(db_consultation);
}

/* ============================
   Validation / Formulaire
============================ */
const isValidFieldsConsultation = () => document.getElementById('formConsultation').reportValidity();

const clearFieldsConsultation = () => {
    const fields = document.querySelectorAll('#formConsultation .model-field');
    fields.forEach(field => field.value = '');
    document.getElementById('consultPatient').dataset.index = 'new';
}

/* ============================
   Remplir les selects dynamiquement
============================ */
const fillPatientOptions = () => {
    const select = document.getElementById('consultPatient');
    select.innerHTML = '<option value="">Sélectionner un patient</option>';
    const patients = JSON.parse(localStorage.getItem('db_student')) ?? [];
    patients.forEach((patient, index) => {
        const option = document.createElement('option');
        option.value = patient.name; // remplacer par patient.id si tu utilises MongoDB
        option.textContent = patient.name;
        select.appendChild(option);
    });
}

const fillPersonnelOptions = () => {
    const select = document.getElementById('consultPersonnel');
    select.innerHTML = '<option value="">Sélectionner un médecin</option>';
    const personnels = JSON.parse(localStorage.getItem('db_personnel')) ?? [];
    personnels.forEach(personnel => {
        if(personnel.poste === 'medecin' || personnel.poste === 'infirmier') {
            const option = document.createElement('option');
            option.value = personnel.name; // remplacer par personnel.id si MongoDB
            option.textContent = personnel.name;
            select.appendChild(option);
        }
    });
}

/* ============================
   Sauvegarder Consultation
============================ */
const saveConsultation = () => {
    if(isValidFieldsConsultation()){
        const consultation = {
            patient: document.getElementById('consultPatient').value,
            personnel: document.getElementById('consultPersonnel').value,
            date: document.getElementById('consultDate').value,
            time: document.getElementById('consultTime').value,
            duree: document.getElementById('consultDuree').value,
            diagnostic: document.getElementById('consultDiagnostic').value
        };

        const index = document.getElementById('consultPatient').dataset.index;
        if(index === 'new'){
            createConsultation(consultation);
        } else {
            updateConsultation(index, consultation);
        }

        listConsultation();
        closeModelConsultation();
    }
}

/* ============================
   Créer ligne tableau
============================ */
const createRowConsultation = (consultation, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td data-label="Patient">${consultation.patient}</td>
        <td data-label="Médecin">${consultation.personnel}</td>
        <td data-label="Date">${consultation.date}</td>
        <td data-label="Heure">${consultation.time}</td>
        <td data-label="Durée">${consultation.duree}</td>
        <td data-label="Diagnostic">${consultation.diagnostic}</td>
        <td data-label="Actions">
            <button type="button" class="button green" id="editConsult-${index}">Edit</button>
            <button type="button" class="button red" id="deleteConsult-${index}">Delete</button>
        </td>
    `;
    document.querySelector('#tblConsultation>tbody').appendChild(newRow);
}

/* ============================
   Vider tableau
============================ */
const clearTableConsultation = () => {
    const rows = document.querySelectorAll('#tblConsultation>tbody tr');
    rows.forEach(row => row.remove());
}

/* ============================
   Lister consultations
============================ */
const listConsultation = () => {
    const consultations = readConsultation();
    clearTableConsultation();
    consultations.forEach(createRowConsultation);
}

/* ============================
   Remplir formulaire pour édition
============================ */
const fillFieldsConsultation = (consultation) => {
    document.getElementById('consultPatient').value = consultation.patient;
    document.getElementById('consultPersonnel').value = consultation.personnel;
    document.getElementById('consultDate').value = consultation.date;
    document.getElementById('consultTime').value = consultation.time;
    document.getElementById('consultDuree').value = consultation.duree;
    document.getElementById('consultDiagnostic').value = consultation.diagnostic;

    document.getElementById('consultPatient').dataset.index = consultation.index;
}

/* ============================
   Éditer consultation
============================ */
const editConsultation = (index) => {
    const consultation = readConsultation()[index];
    consultation.index = index;
    fillFieldsConsultation(consultation);
    openModelConsultation();
}

/* ============================
   Clic Edit/Delete
============================ */
const editDeleteConsultation = (event) => {
    if(event.target.type === 'button'){
        const [action, index] = event.target.id.split('-');
        if(action === 'editConsult'){
            editConsultation(index);
        } else if(action === 'deleteConsult'){
            const consultation = readConsultation()[index];
            const response = confirm(`Supprimer la consultation du patient ${consultation.patient} ?`);
            if(response){
                deleteConsultation(index);
                listConsultation();
            }
        }
    }
}

/* ============================
   Initialisation
============================ */
listConsultation();
document.getElementById('idConsultation').addEventListener('click', () => {
    fillPatientOptions();
    fillPersonnelOptions();
    openModelConsultation();
});
document.getElementById('modelConsultationClose').addEventListener('click', closeModelConsultation);
document.getElementById('saveConsultation').addEventListener('click', saveConsultation);
document.getElementById('cancelConsultation').addEventListener('click', closeModelConsultation);
document.querySelector('#tblConsultation>tbody').addEventListener('click', editDeleteConsultation);
