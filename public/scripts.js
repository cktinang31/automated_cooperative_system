const signupButton = document.getElementById("signup");
const signinButton = document.getElementById("signin");
const container = document.getElementById("container");

signupButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

signinButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

function toggleSidebar() {
    var sidebarContainer = document.getElementById("sidebarContainer");
    sidebarContainer.classList.toggle("active");

    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");

    var sidebarMenu = document.getElementById("sidebarMenu");
    sidebarMenu.classList.toggle("active");
}