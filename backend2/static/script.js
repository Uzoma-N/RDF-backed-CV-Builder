/**
 * Author: Uzoma Nwiwu
 * Date: 2025-11-05
 * Description: JavaScript functions to dynamically render CV data on the frontend.
 * 
 * 
 * 
 * Creates the HTML structure for a single CV item.
 * @param {Object}  -   item - The CV item data.
 * @returns {string}    - The HTML string representing the CV item.
 */

 'use strict';

import { createCertificationHTML, createEducationHTML, createProjectFilterHTML } from './jsHTMLs.js';
import { createServiceHTML, createSocialHTML, createCatHTML, createExperienceHTML } from './jsHTMLs.js';
import { createSkillHTML, createProjectHTML, createProjectSelectHTML } from './jsHTMLs.js';

// Global variable definition is now a function call
const CV_DATA = getAllData();

// Global DOM references (defined here for scope)
const profileSelect = document.getElementById('profile-select');
const createCV = document.getElementById('createCVButton');
const changeProfileBtn = document.getElementById('change-profile-btn');
const applyFilterBtn = document.getElementById('apply-filter-btn');
const cvForm = document.getElementById('cv-form');

// --- Get the data from the dedicated script block ---
function getAllData() {
    // 1. Find the script tag by its ID
    const container = document.getElementById('all-data-container');
    
    // Safety check: ensure the container exists
    if (!container) {
        console.error("CV_DATA container not found in HTML.");
        return [];
    }

    // 2. Get the text content (which is the pure JSON string)
    const jsonString = container.textContent;

    // 3. Parse the JSON string safely
    try {
        // You now only run JSON.parse on the inner content, which is protected
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse CV_DATA:", e);
        console.log("Raw JSON String:", jsonString);
        return [];
    }
}

/**
 * Renders all education data to the DOM.
 */
function renderAllData() {
    
    getProfiles(CV_DATA.NameList)
    getCategories(CV_DATA.Category)
    getUserDetails(CV_DATA.Details, CV_DATA.Name)
    getSocial(CV_DATA.Social)
    getService(CV_DATA.Service)
    getEducation(CV_DATA.Education);
    getWorkExperience(CV_DATA.WorkExperience);
    getSkill(CV_DATA.Skills, CV_DATA.SkillType);
    getCertification(CV_DATA.Certificate);
    getProjectClass(CV_DATA.ProjectClass);
    getProject(CV_DATA.Project);

    // 2. Attach the listener for the 'Change Profile' button
    changeProfileBtn.addEventListener('click', fetchFilteredCV);
    applyFilterBtn.addEventListener('click', applyCategoryFilter);
    createCV.addEventListener('click', CVBuilderActivate);
}

function getUserDetails(Details_Data, Name){
    const userData = document.getElementById('detail-data');
    userData.innerHTML = '';
    const aboutUser = document.getElementById('about-data');
    aboutUser.innerHTML = '';
    const imageData = document.getElementById('image-data');
    imageData.innerHTML = '';
    const nameRoleData = document.getElementById('nameRole-data');
    const nameData = Name;
    nameRoleData.innerHTML = `
                <h1 class="name" title="${nameData}">
                    ${nameData}
                </h1>

                <p class="title">${Details_Data[0].roleTitle}</p>  `

    // add the filepath for photo
    if (Details_Data[0].photo !== ''){
        imageData.innerHTML = `
                <figure class="avatar-box">
                    <img
                        src="/static/${Details_Data[0].photo}"                        
                        alt="${nameData} "
                        width="80"
                    />
                </figure>  `
    } else{
        imageData.innerHTML = `
                <figure class="avatar-box">
                    <img
                        src="/static/assets/avatar-5.png"                        
                        alt="${nameData} "
                        width="80"
                    />
                </figure>  `
    }

    let email = '';
    if (Details_Data[0].emailAddress !== ''){
        email = `
                <li class="contact-item">
                    <div class="icon-box">
                        <ion-icon name="mail-outline"></ion-icon>
                    </div>

                    <div class="contact-info">
                        <p class="contact-title">Email</p>

                        <a
                        href="mailto:${Details_Data[0].emailAddress}"
                        class="contact-link"
                        >${Details_Data[0].emailAddress}</a
                        >
                    </div> 
                </li> `
    }

    let phone = '';
    if (Details_Data[0].phoneNumber !== ''){
        phone = `
                <li class="contact-item">
                    <div class="icon-box">
                        <ion-icon name="phone-portrait-outline"></ion-icon>
                    </div>

                    <div class="contact-info">
                        <p class="contact-title">Phone</p>

                        <a
                        href="tel:${Details_Data[0].phoneNumber}"
                        class="contact-link"
                        >${Details_Data[0].phoneNumber}</a
                        >
                    </div>
                </li>`
    }

    let birthday = '';
    if (Details_Data[0].dob !== ''){
        birthday = `
                <li class="contact-item">
                    <div class="icon-box">
                        <ion-icon name="calendar-outline"></ion-icon>
                    </div>

                    <div class="contact-info">
                        <p class="contact-title">Birthday</p>

                        <time datetime="${Details_Data[0].dob}"
                        >${Details_Data[0].dob}</time
                        >
                    </div>
                </li>`
    }

    let location = '';
    if (Details_Data[0].address !== ''){
        location = `
                <li class="contact-item" >
                    <div class="icon-box">
                        <ion-icon name="location-outline"></ion-icon>
                    </div>

                    <div class="contact-info">
                        <p class="contact-title">Location</p>

                        <address>${Details_Data[0].address}</address>
                    </div>
                </li>`
    }

    if (Details_Data[0].aboutMe !== ''){
        aboutUser.innerHTML = `
                <p>${Details_Data[0].aboutMe}</p>  `
    } else{
        aboutUser.innerHTML = `
                <p>Please, consider writing an AboutMe post.</p>  `
    }

    userData.innerHTML = `${email} ${phone} ${birthday} ${location} ` ;
}

function getProfiles(Profile_Data){
    const listProfile = document.getElementById('profile-select');    
    listProfile.innerHTML = ''; // Clear previous content    

    let profileHtmlContent = ''
    if (Profile_Data && Profile_Data.length > 0) {
        Profile_Data.forEach(profile => {
            profileHtmlContent += `
                            <option value="${profile}">${profile}</option> `
            // console.log("Ed Data Array:", study);
        });
        listProfile.innerHTML = profileHtmlContent;
    } else {
        listProfile.innerHTML = '';
    }
}

function getCategories(Category_Data){
    const listCategory = document.getElementById('cat-options-list');    
    listCategory.innerHTML = ''; // Clear previous content    

    let categoryHtmlContent = `
                                <label class="category-item">
                                    <input name="cat-elem" type="checkbox" data-value="all" checked>
                                    <span>All</span>
                                </label>  `
    if (Category_Data && Category_Data.length > 0) {
        Category_Data.forEach(cat => {
            categoryHtmlContent += createCatHTML(cat)
            // console.log("Ed Data Array:", study);
        });   
        listCategory.innerHTML = categoryHtmlContent     
    } else {
        listCategory.innerHTML = '';
    }
}

function getEducation(Education_Data){
    const listEducation = document.getElementById('education-list');    
    listEducation.innerHTML = ''; // Clear previous content    

    if (Education_Data && Education_Data.length > 0) {
        Education_Data.forEach(study => {
            listEducation.innerHTML += createEducationHTML(study);
            
        });

    } else {
        listEducation.innerHTML = '<p>No education data available.</p>';
    }
}

function getService(Service_Data){
    const listService = document.getElementById('services-list');    
    listService.innerHTML = ''; // Clear previous content    

    if (Service_Data && Service_Data.length > 0) {
        Service_Data.forEach(serve => {
            listService.innerHTML += createServiceHTML(serve);
            
        });

    } else {
        listService.innerHTML = '<p>No service data available.</p>';
    }
}

function getSocial(Social_Data){
    const listSocial = document.getElementById('socials-list');    
    listSocial.innerHTML = ''; // Clear previous content    

    if (Social_Data && Social_Data.length > 0) {
        Social_Data.forEach(soccy => {
            listSocial.innerHTML += createSocialHTML(soccy);
        });

    } else {
        listSocial.innerHTML = '';
    }
}

function getWorkExperience(Experience_Data){
    const listExperience = document.getElementById('experience-list');    
    listExperience.innerHTML = '';     

    if (Experience_Data && Experience_Data.length > 0) {
        Experience_Data.forEach(job => {
            listExperience.innerHTML += createExperienceHTML(job);
        });

    } else {
        listExperience.innerHTML = '<p>No experience data available.</p>';
    }
}

function getSkill(Skill_Data, Skill_Type){
    const listSkill = document.getElementById('skill-list'); 
    listSkill.innerHTML = '';         

    let skillHtmlContent = ''
    if (Skill_Type && Skill_Type.length > 0) {
        Skill_Type.forEach(stype=> {
            // Start a new skill group (the <ul> element) and add the title (h4)
            skillHtmlContent += `
                        <h4 class="h4 skills-title">${stype.main}</h4>
                        <ul class="skills-list content-card">    `
            // Iterate through ALL skill data to find matching skills
            Skill_Data.forEach(skill=> {                
                // Check if the skill's type matches the current group's main name
                if (stype.main === skill.typename[0]) {

                    // Append the HTML for the individual skill item
                    // createSkillHTML(skill) MUST return a string (e.g., <li>...</li>)
                    skillHtmlContent += createSkillHTML(skill) ;
                }

            })
            // Close the current skill group (the </ul> element)
            skillHtmlContent += `
                         </ul>` ;
        })
        // Assign the completed HTML string to the DOM element ONLY ONCE
        listSkill.innerHTML = skillHtmlContent ;
    } else {
        listSkill.innerHTML = '<p>No skill data available.</p>';
    }
}

function getCertification(Certification_Data){
    const listCertification = document.getElementById('certification-list');
    listCertification.innerHTML = '';

    if (Certification_Data && Certification_Data.length > 0) {
        Certification_Data.forEach(cert => {
            listCertification.innerHTML += createCertificationHTML(cert);
        });

    } else {
        listCertification.innerHTML = '<p>No training data available.</p>';
    }
}

function getProjectClass(Project_Class_Data){
    const listProjectFilter = document.getElementById('project-filter-list');
    const listProjectSelect = document.getElementById('project-select-list');
    listProjectFilter.innerHTML = ''; 
    listProjectSelect.innerHTML = '';

    let projectFilterContent = `
                                <li class="filter-item">
                                    <button class="active" data-filter-btn>All</button>
                                </li> `
    let projectSelectContent = `
                                <li class="select-item">
                                    <button data-select-item>All</button>
                                </li>`

    if (Project_Class_Data && Project_Class_Data.length > 0) {
        Project_Class_Data.forEach(pClass => {
            projectFilterContent += createProjectFilterHTML(pClass);
            projectSelectContent += createProjectSelectHTML(pClass);
        });        

    } else {
        projectFilterContent += '';
        projectSelectContent += '';
    }
    listProjectFilter.innerHTML = projectFilterContent; 
    listProjectSelect.innerHTML = projectSelectContent;

    // Call a function to set up listeners after rendering
    attachFilterListeners();
}

function getProject(Project_Data){
    const listProject = document.getElementById('projects-list');
    listProject.innerHTML = '';

    // Initialize a variable named 'count' with the value 0 to add active to the first instance
    let count = 1; 

    // Initialize a variable named 'score' with a floating-point value
    const first = 1.5;
    

    if (Project_Data && Project_Data.length > 0) {
        Project_Data.forEach(project => {           
            listProject.innerHTML += createProjectHTML(project, "active");                            
        });
    } else {
        listProject.innerHTML = '<p>No project data available.</p>';
    }
    // Call a function to set up listeners after rendering
    attachProjectListeners();    
}

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// custom select variables
const select = document.querySelector("[data-select]");
const selectValue = document.querySelector("[data-selecct-value]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// attach event to all select items
const attachProjectListeners = function() {
    
    const selectItems = document.querySelectorAll("[data-select-item]");
    
    // add event in all select items
    for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener("click", function () {

            //let selectedValue = this.innerText.toLowerCase();
            activeProjectType = this.innerText.toLowerCase(); 
            selectValue.innerText = this.innerText;
            elementToggleFunc(select);
            masterFilterFunc();

        });
    }
}

// --- STATE VARIABLES (Assuming these are exported/imported from app-state.js) ---
// Note: We need a state for the currently active Project Type filter.
// We'll assume the currently active filter button's value is stored in this variable.
let activeProjectType = "all"; 
let selectedCVCategories = ['all']; // The state from your multi-select checkboxes

// --- CORE FILTERING FUNCTION ---

/**
 * Master function to filter project items based on TWO criteria:
 * 1. Project Type (Single-select, from filter buttons/dropdown)
 * 2. CV Categories (Multi-select, from checkboxes)
 */
const masterFilterFunc = function () {
    
    // 1. Get all items that need filtering (your project list)
    const filterItems = document.querySelectorAll("[data-filter-item]");
    
    // Determine if the CV Category filter is effectively 'all'
    const showAllCVCategories = selectedCVCategories.includes('all');

    for (let i = 0; i < filterItems.length; i++) {
        const item = filterItems[i];
        
        // --- CRITERION 1: Project Type Filter 
        const itemProjectType = item.dataset.clas ? item.dataset.clas.toLowerCase() : '';
        
        // Check if the item matches the active single-select filter
        const isProjectTypeMatch = (
            activeProjectType === "all" || 
            activeProjectType === itemProjectType
        );

        // --- CRITERION 2: CV Category Filter (New logic for multi-value data-category) ---
        let isCVCategoryMatch = false;

        if (showAllCVCategories) {
            // Match 1: If 'All' is selected, this criterion is always met.
            isCVCategoryMatch = true;
        } else {
            // Match 2: Check multi-value attribute intersection
            const itemCVCategoriesString = item.getAttribute('data-category');
            
            if (itemCVCategoriesString) {
                // Split, trim, and normalize the item's categories (e.g., ["database", "software"])
                const itemCVCategories = itemCVCategoriesString
                    .split(',')
                    .map(cat => cat.trim().toLowerCase());

                // Check if ANY selected category is present in the item's category list
                isCVCategoryMatch = selectedCVCategories.some(selectedValue => 
                    itemCVCategories.includes(selectedValue)
                );
            }
        }
        
        // --- FINAL DECISION: Must satisfy BOTH criteria ---
        if (isProjectTypeMatch && isCVCategoryMatch) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    }
};

// Function to handle the active class toggling and filtering logic
const attachFilterListeners = function() {
    // 1. Re-select the filter buttons since they were just rendered
    const filterBtns = document.querySelectorAll("[data-filter-btn]");

    // Re-initialize the lastClickedBtn variable with the "All" button
    let lastClickedBtn = filterBtns[0];
    
    // 2. Add event in all filter button items for large screen
    for (let i = 0; i < filterBtns.length; i++) {

        filterBtns[i].addEventListener("click", function () {

            // Assuming selectValue is defined globally and available
            activeProjectType = this.innerText.toLowerCase();
            selectValue.innerText = this.innerText; 
            masterFilterFunc();

            lastClickedBtn.classList.remove("active");
            this.classList.add("active");
            lastClickedBtn = this;

        });
    }
}

async function fetchFilteredCV() {
    // 1. Get current filter selections
    const user_namer = profileSelect.value;

    const requestBody = {
        profile_user: user_namer        
    };

    // Display a loading message while fetching data
    try {
        // 2. Make the API call to your Flask backend
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const filteredCV_JSON = await response.json();


        // 3. Clear existing data and render new content
        getCategories(filteredCV_JSON.Category);
        getUserDetails(filteredCV_JSON.Details, filteredCV_JSON.Name);
        getSocial(filteredCV_JSON.Social);
        getService(filteredCV_JSON.Service);
        getEducation(filteredCV_JSON.Education);
        getWorkExperience(filteredCV_JSON.WorkExperience);
        getSkill(filteredCV_JSON.Skills, filteredCV_JSON.SkillType);
        getCertification(filteredCV_JSON.Certificate);
        getProjectClass(filteredCV_JSON.ProjectClass);
        getProject(filteredCV_JSON.Project);
        

    } catch (error) {
        console.error("Error applying filters:", error);
        // Display an error message if the fetch fails
        
    }
}

// Function to apply category filter based on checkbox selections
function applyCategoryFilter() {
    
    // 1. Retrieve all checked category values
    const checkedCheckboxes = document.querySelectorAll('#cat-options-list input[type="checkbox"]:checked');
    
    // Create an array of values (e.g., ['software', 'research', 'All'])
    let calcSelectedValues = Array.from(checkedCheckboxes)
        .map(checkbox => checkbox.getAttribute('data-value').toLowerCase());

    // 2. Implement the 'Select All' Override
    const showAll = calcSelectedValues.includes('all');

    // If 'All' is present, simplify the list to just ['all'] 
    // This is the core logic for the override.
    if (showAll) {
        calcSelectedValues = ['all'];
    }

    // --- NEW: Update the Global State Variable ---
    // Ensure the filtering function has access to the correct state
    selectedCVCategories = calcSelectedValues;

    masterFilterFunc()
    // 3. Get all items that need filtering
    const CertificationItems = document.querySelectorAll('.certification-item');
    const ExperienceItems = document.querySelectorAll('.exp-timeline-item');
    const SkillItems = document.querySelectorAll('.skills-item[data-skill-group="Digital Skill"]');

    filterCVSection(CertificationItems, calcSelectedValues, showAll)
    filterCVSection(ExperienceItems, calcSelectedValues, showAll)
    filterCVSection(SkillItems, calcSelectedValues, showAll)
}


function filterCVSection(Items, selectedValues, showAll) {
    
    // Loop through projects and apply visibility (using the 'active' class)
    Items.forEach(item => {
        //const itemCategory = item.getAttribute('data-category').toLowerCase();
        let shouldShow = false;

        if (showAll) {
            // Case 1: If 'All' is selected, show everything.
            shouldShow = true;
        } else {
            // Get the item's categories string, split it, clean up whitespace, and convert to lowercase
            const itemCategoriesString = item.getAttribute('data-category');
            
            // Handle case where data-category might be missing or empty
            if (!itemCategoriesString) {
                shouldShow = false;
            } else {
                const itemCategories = itemCategoriesString
                    .split(',')
                    .map(cat => cat.trim().toLowerCase());

                // Check for intersection: Is ANY selected value present in the item's categories?
                shouldShow = selectedValues.some(selectedValue => 
                    itemCategories.includes(selectedValue)
                );
            }
        }

        // Apply or remove the 'active' class to control visibility via CSS
        if (shouldShow) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

}


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    // **Part 1: Deactivate all navigation links**
    // This ensures only one link is 'active' at a time.
    navigationLinks.forEach(link => link.classList.remove("active"));

    // **Part 2: Activate the clicked link (this)**
    this.classList.add("active");

    // Part 3: Loop through pages to find a match and toggle its 'active' class
    const clickedPageName = this.innerHTML.toLowerCase(); // 'about' or 'training'

    for (let j = 0; j < pages.length; j++) {
      if (clickedPageName === pages[j].dataset.page) {
        // Only activate the matched page
        pages[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        // Deactivate all other pages
        pages[j].classList.remove("active");
      }
    }
  });
}

// --- CONTACT FORM VARIABLES ---
const contactForm = document.getElementById("contactForm");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.getElementById("form-status");

// Function to display status messages
function displayStatus(message, isError = false) {
    formStatus.textContent = message;
    formStatus.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
        
    // Use Tailwind classes to style the message box
    if (isError) {
        formStatus.classList.add('bg-red-100', 'text-red-700');
    } else {
         formStatus.classList.add('bg-green-100', 'text-green-700');
    }
}

// Existing logic: enable/disable button based on validation (retains your original functionality)
for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
        if (form.checkValidity()) {
            formBtn.removeAttribute("disabled");
        } else {
            formBtn.setAttribute("disabled", "");
        }
    });
}

// NEW LOGIC: Handle form submission via AJAX (Fetch) to Formspree
contactForm.addEventListener("submit", async function (event) {
// Stop the browser from attempting a default page reload/navigation
    event.preventDefault();
        
    // 1. Disable button and show loading state
    formBtn.setAttribute("disabled", "disabled");
    formBtn.querySelector("span").textContent = "Sending...";
    formStatus.classList.add('hidden'); // Hide status message during submission

    // 2. Prepare data for the fetch request
    const data = new FormData(event.target);
        
    try {
        // 3. Send data to the Formspree endpoint defined in the form's 'action' attribute
        const response = await fetch(event.target.action, {
            method: event.target.method,
            body: data,
            headers: {
                'Accept': 'application/json' // Crucial for getting a proper AJAX response from Formspree
            }
        });

        // 4. Handle response
        if (response.ok) {
            displayStatus("Thank you! Your message has been sent successfully. I will be in touch shortly.", false);
            form.reset(); // Clear the form fields after successful submission
            formBtn.setAttribute("disabled", ""); // Keep disabled after successful send and reset
        } else {
            // If the response is not OK (e.g., Formspree error)
            const responseData = await response.json();
            const errorMessage = responseData.error || "There was an issue submitting your form. Please try again later.";
            displayStatus(`Error: ${errorMessage}`, true);
        }

    } catch (error) {
        // Handle network errors (e.g., no internet connection)
        console.error("Fetch error:", error);
        displayStatus("Network error occurred. Please check your connection and try again.", true);
    } finally {
        // 5. Restore button text regardless of success or failure
        formBtn.querySelector("span").textContent = "Send Message";
    }
});


// --- GLOBAL STATE & SETUP for CV Creation ---
let currentTab = 'personal';
const modal = document.getElementById('customModal');
    // --- UTILITY FUNCTIONS ---
    // Template for a dynamic Work Experience entry
const workTemplate = (index) => `
        <div class="p-4 border border-indigo-200 rounded-lg bg-indigo-50 relative" data-index="${index}">
            <div class="degree-header">
            <h4 class="creator-title">Work Entry #${index + 1}</h4>
            <button type="button" class="remove-entry primary-btn">&times;</button>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
                <div class="form-group">
                    <label for="work-title-${index}" class="creator-label">Job Title *</label>
                    <input type="text" id="work-title-${index}" name="workTitle" createcvinput data-type="work" required class="form-input">
                </div>
                <div class="form-group">
                    <label for="work-company-${index}" class="creator-label">Company Name *</label>
                    <input type="text" id="work-company-${index}" name="workCompany" createcvinput data-type="work" required class="form-input">
                </div>
                <div class="form-group">
                    <label for="work-city-${index}" class="creator-label">City (Optional)</label>
                    <input type="text" id="work-city-${index}" name="workCity" createcvinput data-type="work" class="form-input">
                </div>
                <div class="form-group">
                    <label for="work-country-${index}" class="creator-label">Country (Optional)</label>
                    <input type="text" id="work-country-${index}" name="workCountry" createcvinput data-type="work" class="form-input">
                </div>
                <div class="form-group">
                    <label for="work-start-${index}" class="creator-label">Start Date (YYYY-MM) *</label>
                    <input type="date" id="work-start-${index}" name="workStart" createcvinput data-type="work" required class="form-input">
                </div>
                <div class="form-group">
                    <label for="work-end-${index}" class="creator-label">End Date (YYYY-MM) *</label>
                    <input type="date" id="work-end-${index}" name="workEnd" createcvinput data-type="work" required class="form-input">
                </div>
            </div>
            
            <div class="form-group">
                <label for="work-desc-${index}" class="creator-label">Key Responsibilities (Optional)</label>
                <textarea id="work-desc-${index}" name="workDesc" createcvinput data-type="work" rows="3" class="form-input"></textarea>
            </div>
        </div>
`;
    // Template for a dynamic Education entry
const educationTemplate = (index) => `
        <div class="p-4 border border-purple-200 rounded-lg bg-purple-50 relative" data-index="${index}">
            <div class="degree-header">
            <h4 class="creator-title">Education Entry #${index + 1}</h4>
            <button type="button" class="remove-entry primary-btn">&times;</button>
            </div>
            <div class="form-group">
                <label for="edu-degree-${index}" class="creator-label">Degree/Certification *</label>
                <input type="text" id="edu-degree-${index}" name="eduDegree" createcvinput  data-type="education" required class="form-input" placeholder="e.g, Bachelor of Science in Computer Science">
            </div>
            <div class="form-group">
                <label for="edu-institution-${index}" class="creator-label">Institution Name *</label>
                <input type="text" id="edu-institution-${index}" name="eduInstitution" createcvinput  data-type="education" required class="form-input">
            </div>
            <div class="grid sm:grid-cols-3 gap-4">
                <div class="form-group">
                    <label for="edu-city-${index}" class="creator-label">City (Optional)</label>
                    <input type="text" id="edu-city-${index}" name="eduCity" createcvinput data-type="education" class="form-input">
                </div>
                <div class="form-group">
                    <label for="edu-country-${index}" class="creator-label">Country (Optional)</label>
                    <input type="text" id="edu-country-${index}" name="eduCountry" createcvinput data-type="education" class="form-input">
                </div>
                <div class="form-group">
                    <label for="edu-year-${index}" class="creator-label">Admission Year (YYYY) *</label>
                    <input type="date" id="edu-year-${index}" name="eduYear" createcvinput data-type="education" required min="1900" max="2100" class="form-input">
                </div>
                <div class="form-group">
                    <label for="edu-year-end-${index}" class="creator-label">Graduation Year (YYYY) *</label>
                    <input type="date" id="edu-year-end-${index}" createcvinput name="eduYearEnd" data-type="education" required min="1900" max="2100" class="form-input">
                </div>
            </div>
        </div>
`;
    // Template for a dynamic Professional Profile entry
const functionTemplate = (index) => `
                <div class="p-4 border border-purple-200 rounded-lg bg-purple-50 relative" data-index="${index}">   
                    <div class="degree-header">    
                    <h4 class="creator-title">Function Entry #${index + 1}</h4>
                    <button type="button" class="remove-entry primary-btn">&times;</button>
                    </div>
                    <div class="form-group">
                      <label for="act-title-${index}" class="creator-label">Activity Title</label>
                      <input type="text" id="act-title-${index}" name="act-title" required createcvinput class="form-input" placeholder="e.g., Software Development, Data Science, ...">
                    </div>
                  <div class="form-group">
                    <label for="professionalProfile-${index}" class="creator-label">Professional Profile Text (Optional)</label>
                    <textarea id="professionalProfile-${index}" name="professionalProfile" createcvinput rows="1" class="form-input"></textarea>
                  </div>
                </div>
`;

    // Template for a dynamic Skill entry
const skillTemplate = (index) => `
                <div class="p-4 border border-purple-200 rounded-lg bg-purple-50 relative" data-index="${index}">   
                  <div class="degree-header">
                    <h4 class="creator-title">Skill Entry #${index + 1}</h4>
                  <button type="button" class="remove-entry primary-btn">&times;</button>
                    </div>
                  <div class="form-group">
                    <label for="skill-name-${index}" class="creator-label">Core Skill *</label>
                    <input type="text" id="skill-name-${index}" name="skill-name" createcvinput required class="form-input" placeholder="e.g., Software Development">
                  </div>
                  <div class="form-group">
                    <label for="skill-tool-${index}" class="creator-label">Tools Used *</label>
                    <input type="text" id="skill-tool-${index}" name="skill-tool" createcvinput required class="form-input" placeholder="e.g., Python, React, RDF, SPARQL">
                  </div>
                  <div class="form-group">
                    <label for="skill-type-${index}" class="creator-label">Skill Type (Optional)</label>
                    <input type="text" id="skill-type-${index}" name="skill-type" createcvinput class="form-input">
                  </div>
                  <div class="form-group">
                    <label for="skill-level-${index}" class="creator-label">Knowledge Level(in percentage) *</label>
                    <input type="text" id="skill-level-${index}" name="skill-level" createcvinput required class="form-input" placeholder="e.g., 80%">
                  </div>
                </div>
`;

    // Template for a dynamic Project entry
const projectTemplate = (index) => `
                <div class="p-4 border border-purple-200 rounded-lg bg-purple-50 relative" data-index="${index}">   
                    <div class="degree-header">
                    <h4 class="creator-title">Project Entry #${index + 1}</h4>
                    <button type="button" class="remove-entry primary-btn">&times;</button>
                    </div>
                    <div class="form-group">
                    <label for="project-name-${index}" class="creator-label">Project Name *</label>
                    <input type="text" id="project-name-${index}" name="project-name" createcvinput required class="form-input">
                  </div>
                  <div class="form-group">
                    <label for="project-type-${index}" class="creator-label">Project Type (Optional)</label>
                    <input type="text" id="project-type-${index}" name="project-type" createcvinput class="form-input">
                  </div>
                  <div class="form-group">
                    <label for="project-skill-${index}" class="creator-label">Skills Acquired *</label>
                    <textarea id="project-skill-${index}" name="project-skill" rows="4" createcvinput required class="form-input"></textarea>
                  </div>
                </div>
`;

    // Function to add a new dynamic field entry
function addEntry(type, containerId, templateFunction) {
    const container = document.getElementById(containerId);
    const currentIndex = container.children.length;
    const newEntryDiv = document.createElement('div');
    newEntryDiv.innerHTML = templateFunction(currentIndex).trim();
    container.appendChild(newEntryDiv.firstChild);
    // Reattach remove event listeners
    document.querySelectorAll('.remove-entry').forEach(button => {
        button.onclick = handleRemoveEntry;
    });
    updateEntryTitles(container);

    // Re-enable form validation and button activation
    formCVInputs = document.querySelectorAll("[createcvinput]");

    activateButton();
}
    // Function to handle the removal of a dynamic entry
function handleRemoveEntry(event) {
    // Prevent default behavior if the element is an anchor or similar
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A') {
        event.preventDefault();
    }
    
    // Find the closest entry element based on the data-index attribute
    const entryDiv = event.target.closest('[data-index]');
    
    // Check if an entry was found
    if (!entryDiv) {
        console.error("Could not find a valid entry container to remove.");
        return;
    }

    const container = entryDiv.parentNode;
        
    // 1. Remove the entry from the DOM
    entryDiv.remove();

    // 2. Re-index and rename the remaining entries in the container.
    if (typeof updateEntryTitles === 'function') {
        updateEntryTitles(container);
    } else {
        console.warn("updateEntryTitles function is missing or not defined.");
    }

    // 3. Re-select form inputs and reactivate the main button (External dependencies)
    // Re-select all relevant inputs for validation after removal
    if (typeof document !== 'undefined') {
        window.formCVInputs = document.querySelectorAll("[createcvinput]");
    }
    
    // Call external function to check form status and enable/disable button
    if (typeof activateButton === 'function') {
        activateButton();
    }
}

function convertToISO(ddMmYyyyStr) {
    // Ensure it matches the DD-MM-YYYY pattern
    const parts = ddMmYyyyStr.split('.');
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
                    
        // Simple validation check for number ranges (not comprehensive, but helps)
        if (parseInt(day) > 0 && parseInt(day) <= 31 && parseInt(month) > 0 && parseInt(month) <= 12 && parseInt(year) >= 1900) {
            return `${year}-${month}-${day}`;
        }
    }
    return ''; // Return empty string if conversion/validation fails
}

    
    // Function to re-index titles after add/remove
function updateEntryTitles(container) {
    let type = container.id.replace('-container', '').replace(/-/g, ' ');

    // Capitalize the first letter of each word (e.g., 'work history' -> 'Work History')
    type = type.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // 2. Iterate over all child entry elements
    Array.from(container.children).forEach((child, index) => {
        // Set a data attribute for internal tracking
        child.setAttribute('data-index', index);

        // Find the title element (assuming it's still an h4) and update its text
        // New title format: "Work Entry #1" or "Skill #1"
        const titleElement = child.querySelector('h4');
        if (titleElement) {
             titleElement.textContent = `${type} Entry #${index + 1}`;
        }
    });
}

//create cv pag nav
const cvTab = document.querySelectorAll("[data-cv-page]");
const cvPage = document.querySelectorAll("[data-cv]");

// add event to all nav link in cv creator
for (let i = 0; i < cvTab.length; i++) {
  cvTab[i].addEventListener("click", function () {

    // **Part 1: Deactivate all navigation links**
    // This ensures only one link is 'active' at a time.
    cvTab.forEach(tab => tab.classList.remove("active"));

    // **Part 2: Activate the clicked link (this)**
    this.classList.add("active");

    // Part 3: Loop through pages to find a match and toggle its 'active' class
    const clickedTabName = this.innerHTML.toLowerCase(); // 'about' or 'training'

    for (let j = 0; j < cvPage.length; j++) {
      if (clickedTabName === cvPage[j].dataset.cv) {
        // Only activate the matched page
        cvPage[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        // Deactivate all other pages
        cvPage[j].classList.remove("active");
      }
    }
  });
}

// Displays success or error messages
function showMessage(title, content, type) {
    const box = document.getElementById('message-box');
    const titleEl = document.getElementById('message-title');
    const contentEl = document.getElementById('message-content');
    box.classList.remove('hidden', 'bg-red-100', 'border-red-500', 'bg-green-100', 'border-green-500');
    box.classList.add(type === 'red' ? 'bg-red-100' : 'bg-green-100');
    box.style.borderColor = type === 'red' ? '#ef4444' : '#10b981';
    titleEl.textContent = title;
    contentEl.textContent = content;
}
    // Function to collect and structure all form data
function collectCVData(form) {
    const data = {
            personal: {},
            professionalProfile: [],
            workExperience: [],
            education: [],
            projects: [],
            skills: []
    };
        // 1. Collect Personal and Profile
    const personalFields = ['fullName', 'function', 'email', 'phone', 'birthday', 'location',  'aboutMe'];
    personalFields.forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (name === 'birthday' && input) {
            data.personal[name] = convertToISO(input.value.trim());
        } else if (input) data.personal[name] = input.value.trim();
    });
        

            // 2. Collect Dynamic Entries (What I do)
    const functionEntries = document.getElementById('function-container').children;
    Array.from(functionEntries).forEach(funct => {
            const functionData = {
                title: funct.querySelector('[name="actTitle"]').value.trim(),
                description: funct.querySelector('[name="professionalProfile"]').value.trim(),                
        };
         data.professionalProfile.push(functionData);
    });

        // 3. Collect Dynamic Entries (Work Experience)
    const workEntries = document.getElementById('work-container').children;
    Array.from(workEntries).forEach(entry => {
            const startDateISOw = convertToISO(entry.querySelector('[name="workStart"]').value.trim());
            const endDateISOw = convertToISO(entry.querySelector('[name="workEnd"]').value.trim());
            const workData = {
                title: entry.querySelector('[name="workTitle"]').value.trim(),
                company: entry.querySelector('[name="workCompany"]').value.trim(),
                city: entry.querySelector('[name="workCity"]').value.trim(),
                country: entry.querySelector('[name="workCountry"]').value.trim(),
                startDate: startDateISOw,
                endDate: endDateISOw,
                duty: entry.querySelector('[name="workDesc"]').value.trim(),
        };
         data.workExperience.push(workData);
    });
        // 4. Collect Dynamic Entries (Education)
    const eduEntries = document.getElementById('education-container').children;
    Array.from(eduEntries).forEach(entry => {
        const startDateISO = convertToISO(entry.querySelector('[name="eduYear"]').value.trim());
        const endDateISO = convertToISO(entry.querySelector('[name="eduYearEnd"]').value.trim());
        const entryData = {
                degree: entry.querySelector('[name="eduDegree"]').value.trim(),
                institution: entry.querySelector('[name="eduInstitution"]').value.trim(),
                city: entry.querySelector('[name="eduCity"]').value.trim(),
                country: entry.querySelector('[name="eduCountry"]').value.trim(),
                startDate: startDateISO,
                endDate: endDateISO,
        };
        data.education.push(entryData);
    });

    // 5. Collect Dynamic Entries (Skill)
    const skillEntries = document.getElementById('skill-container').children;
    Array.from(skillEntries).forEach(skill => {
        const entryData = {
                title: skill.querySelector('[name="skill-name"]').value.trim(),
                description: skill.querySelector('[name="skill-tool"]').value.trim(),
                type: skill.querySelector('[name="skill-type"]').value.trim(),
                status: skill.querySelector('[name="skill-level"]').value.trim(),                
        };
        data.skills.push(entryData);
    });

        // 6. Collect Dynamic Entries (Project)
    const projEntries = document.getElementById('project-container').children;
    Array.from(projEntries).forEach(proj => {
        const entryData = {
                title: proj.querySelector('[name="project-name"]').value.trim(),
                type: proj.querySelector('[name="project-type"]').value.trim(),
                description: proj.querySelector('[name="project-skill"]').value.trim(),               
        };
        data.projects.push(entryData);
    });
    return data;
}

// Main activation function to set up event listeners
function CVBuilderActivate() {
    document.getElementById('add-function').addEventListener('click', () => addEntry('function', 'function-container', functionTemplate));
    document.getElementById('add-work').addEventListener('click', () => addEntry('work', 'work-container', workTemplate));
    document.getElementById('add-education').addEventListener('click', () => addEntry('education', 'education-container', educationTemplate));
    document.getElementById('add-skill').addEventListener('click', () => addEntry('skill', 'skill-container', skillTemplate));
    document.getElementById('add-project').addEventListener('click', () => addEntry('project', 'project-container', projectTemplate));    
    activateButton();
}


        // 4. Form Submission (Simulating Backend Call)
cvForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('Processing...', 'Collecting and validating data.', 'green');
            
            // Client-Side Validation (Only check mandatory fields)
        if (!cvForm.reportValidity()) {
            return showMessage('Validation Error', 'Please fill out all mandatory fields (marked with *).', 'red');
        }
            
            // Collect Data
        const formCVData = collectCVData(cvForm);
        console.log("Form Data Collected:", formCVData);
        updateTTLFile(formCVData)      

 });
        
let formCVInputs = document.querySelectorAll("[createcvinput]");
const formCVBtn = document.querySelector("[saveCVbutton]");

// Existing logic: enable/disable button based on validation (retains your original functionality)
async function activateButton(){
    for (let i = 0; i < formCVInputs.length; i++) {
        formCVInputs[i].addEventListener("input", function () {
            if (cvForm.checkValidity()) {
                formCVBtn.removeAttribute("disabled");
            } else {
                formCVBtn.setAttribute("disabled", "");
            }
        });
    }
}

async function updateTTLFile(cvFileToSend) {   

    try {
        // 2. Make the API call to your Flask backend
        const response = await fetch('/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cvFileToSend)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        //  Handle response
        const status = await response.json();

        if (status.status === 'success') {
            formCVInputs.forEach(input => input.value = ''); // Clear all form inputs
            formCVBtn.setAttribute("disabled", ""); // Disable button after successful save

            showMessage('Success', 'Your CV data has been saved successfully!', 'green');
        } else {
            showMessage('Error', 'There was an error saving your CV data. Please try again later.', 'red');
        }

    } catch (error) {
        console.error("Error applying filters:", error);
        // Display an error message if the fetch fails
        
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', renderAllData);