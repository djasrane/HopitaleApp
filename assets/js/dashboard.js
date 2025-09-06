'use strict';

const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) ?? [];

const updateDashboard = () => {
    document.querySelector('#totalPatients p').textContent = getLocalStorage('db_patient').length;
    document.querySelector('#totalPersonnel p').textContent = getLocalStorage('db_personnel').length;

    const consultations = getLocalStorage('db_consultation');
    const today = new Date().toISOString().split('T')[0];
    const todayConsultations = consultations.filter(c => c.date.startsWith(today)).length;
    document.querySelector('#consultationsToday p').textContent = todayConsultations;

    const medicaments = getLocalStorage('db_medicament');
    const alertMeds = medicaments.filter(m => m.quantiteDisponible <= m.seuilAlerte).length;
    document.querySelector('#medicamentsAlert p').textContent = alertMeds;

    const rendezvous = getLocalStorage('db_rendezvous');
    const upcoming = rendezvous.filter(r => new Date(r.date) > new Date()).length;
    document.querySelector('#rendezvousUpcoming p').textContent = upcoming;
};

updateDashboard();
