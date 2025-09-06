'use strict';

// --- Ouvrir / fermer le modal ---
const openModel = () => document.getElementById('model').classList.add('active');
const closeModel = () => {
    clearFields();
    document.getElementById('model').classList.remove('active');
}

// --- LocalStorage ---
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_student')) ?? [];
const setLocalStorage = (db_student) => localStorage.setItem('db_student', JSON.stringify(db_student));

// --- CRUD ---
const readStudent = () => getLocalStorage();
const createStudent = (student) => {
    const db_student = getLocalStorage();
    db_student.push(student);
    setLocalStorage(db_student);
}
const updateStudent = (index, student) => {
    const db_student = readStudent();
    db_student[index] = student;
    setLocalStorage(db_student);
}
const deleteStudent = (index) => {
    const db_student = readStudent();
    db_student.splice(index, 1);
    setLocalStorage(db_student);
}

// --- Validation et gestion du formulaire ---
const isValidFields = () => document.getElementById('form').reportValidity();
const clearFields = () => {
    const fields = document.querySelectorAll('.model-field');
    fields.forEach(field => field.value = "");
}

// --- Enregistrer un patient ---
const saveStudent = () => {
    if(isValidFields()){
        const student = {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            dateNaissance: document.getElementById('dateNaissance').value,
            sexe: document.getElementById('sexe').value,
            adresse: document.getElementById('adresse').value,
            telephone: document.getElementById('telephone').value,
            email: document.getElementById('email').value,
            groupeSanguin: document.getElementById('groupeSanguin').value,
            historiqueMedica: document.getElementById('historiqueMedica').value,
            allergies: document.getElementById('allergies').value
        }

        const index = document.getElementById('nom').dataset.index;
        if(index === 'new'){  
            createStudent(student);
        } else {  
            updateStudent(index, student);
        }

        listStudent(); // Affiche tous les patients dans le tableau
        closeModel();  // Fermer le modal et vider le formulaire
    }
}

// --- Créer une ligne du tableau ---
const createRow = (student, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${student.nom}</td>
        <td>${student.prenom}</td>
        <td>${student.dateNaissance}</td>
        <td>${student.sexe}</td>
        <td>${student.adresse}</td>
        <td>${student.telephone}</td>
        <td>${student.email}</td>
        <td>${student.groupeSanguin}</td>
        <td>${student.historiqueMedica}</td>
        <td>${student.allergies}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Edit</button>
            <button type="button" class="button red" id="delete-${index}">Delete</button>
        </td>
    `;
    document.querySelector('#tblStudent>tbody').appendChild(newRow);
}

// --- Vider le tableau ---
const clearTable = () => {
    const rows = document.querySelectorAll('#tblStudent>tbody tr');
    rows.forEach(row => row.remove());
}

// --- Lister tous les patients ---
const listStudent = () => {
    const students = readStudent();  
    clearTable();                     
    students.forEach(createRow);      
}

// --- Remplir le formulaire pour l'édition ---
const fillFields = (student) => {
    document.getElementById('nom').value = student.nom;
    document.getElementById('prenom').value = student.prenom;
    document.getElementById('dateNaissance').value = student.dateNaissance;
    document.getElementById('sexe').value = student.sexe;
    document.getElementById('adresse').value = student.adresse;
    document.getElementById('telephone').value = student.telephone;
    document.getElementById('email').value = student.email;
    document.getElementById('groupeSanguin').value = student.groupeSanguin;
    document.getElementById('historiqueMedica').value = student.historiqueMedica;
    document.getElementById('allergies').value = student.allergies;

    document.getElementById('nom').dataset.index = student.index;
}

// --- Éditer un patient ---
const editStudent = (index) => {
    const student = readStudent()[index];
    student.index = index;
    fillFields(student);
    openModel();
}

// --- Gérer clic Edit / Delete ---
const editDelete = (event) => {
    if(event.target.type === 'button'){
        const [action, index] = event.target.id.split('-');
        if(action === 'edit'){
            editStudent(index);
        } else {
            const student = readStudent()[index];
            const response = confirm(`Voulez-vous vraiment supprimer le patient ${student.nom} ?`);
            if(response){
                deleteStudent(index);
                listStudent();
            }
        }
    }
}

// --- Initialisation ---
listStudent();
document.getElementById('idStudent').addEventListener('click', openModel);
document.getElementById('modelClose').addEventListener('click', closeModel);
document.getElementById('save').addEventListener('click', saveStudent);
document.getElementById('cancel').addEventListener('click', closeModel);
document.querySelector('#tblStudent>tbody').addEventListener('click', editDelete);
