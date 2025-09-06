// Gestion des sections actives dans le tableau de bord
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-item button");
  const sections = document.querySelectorAll(".section");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Supprimer la classe active de toutes les sections
      sections.forEach((section) => section.classList.remove("active"));

      // Ajouter la classe active à la section correspondante
      const sectionId = button.getAttribute("data-section");
      const activeSection = document.getElementById(sectionId);
      if (activeSection) {
        activeSection.classList.add("active");
      }

      // Mettre à jour le bouton actif
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });
});

// Exemple de mise à jour dynamique des données
function updateDashboardData() {
  const upcomingAppointments = document.getElementById("upcomingAppointments");
  const pastConsultations = document.getElementById("pastConsultations");
  const medAlerts = document.getElementById("medAlerts");

  // Simuler des données dynamiques
  const data = {
    upcomingAppointments: Math.floor(Math.random() * 10),
    pastConsultations: Math.floor(Math.random() * 20),
    medAlerts: Math.floor(Math.random() * 5),
  };

  // Mettre à jour les éléments HTML
  upcomingAppointments.textContent = data.upcomingAppointments;
  pastConsultations.textContent = data.pastConsultations;
  medAlerts.textContent = data.medAlerts;
}

// Appeler la fonction pour mettre à jour les données toutes les 5 secondes
setInterval(updateDashboardData, 5000);