/**
 * Author: Uzoma Nwiwu
 * Date: 2025-11-05
 * This section helps to populate the html syntaxes
 * 
 * 
 * 
 * Creates the HTML structure for a single CV item.
 * @param {Object}  - The certification data object.
 * @returns {string} The HTML string for the item.
 */


export function createCertificationHTML(cert) {
    //console.log("Skill Data Array:", cert.title);
    let part_2 = ''
    const part_1 =   `
                    <div class="certification-item active" data-category="${cert.category}" id="cert-${cert.category}">                        
                        <h4 class="h4 timeline-item-title"> ${cert.certTitle} </h4>  
                        <span class="timeline-text"> ${cert.endDate} </span>                   
                        <div class="link">
                            <a href="${cert.link}" target="_blank">View Certification Link</a>
                        </div>  
                        <div class="category">  `
                        
    const part_3 =         `
                            </div>
                        </div>  `

    cert.category.forEach(cat => {
        if (cat !== ''){
            part_2 += assignCategory(cat);
        };
    })
    ;
    return `${part_1} ${part_2} ${part_3}`
}

export function createEducationHTML(education) {
    return `
        <li class="timeline-item">
                <div class="degree-header">
                  <h4 class="h4 timeline-item-title">
                    ${education.schoolName}
                  </h4>
                  <span>${education.startDate} — ${education.endDate}</span>
                </div>

                <p class="timeline-text">
                  ${education.degreeTitle}
                </p>
                <div class="degree-detail">
                  <ion-icon
                    class="socials-icons"
                    name="location-outline"
                  ></ion-icon>
                  <p class="timeline-text">${education.city}, ${education.country}</p>
                </div>
                <div class="degree-detail">
                  <ion-icon
                    class="socials-icons"
                    name="school-outline"
                  ></ion-icon>
                  <p class="timeline-text">
                    ${education.grade} (${education.gradeVal})
                  </p>
                </div>
              </li>
    `;
}

export function createProjectFilterHTML(filter) {
    return `
                <li class="filter-item">
                    <button data-filter-btn>${filter.main}</button>
                </li>
    `;
}

export function createProjectSelectHTML(filter) {
    return `
                <li class="select-item">
                  <button data-select-item>${filter.main}</button>
                </li>
    `;
}

export function createServiceHTML(service) {

    return `
                <li class="service-item">
                    <div class="service-icon-box">
                    <img
                        src="/static/${service.serviceImage}"
                        alt="${service.serviceTitle}"
                        width="40"
                    />
                    </div>

                    <div class="service-content-box">
                    <h4 class="h4 service-item-title">
                        ${service.serviceTitle}
                    </h4>

                    <p class="service-item-text">
                        ${service.serviceText}
                    </p>
                    </div>
                </li>
    `;
}

export function createSocialHTML(social) {
    
    return `
                <li class="social-item">
                    <a
                        href="${social.socialLink}"
                        class="social-link"
                    >
                        <ion-icon class="socials-icons" name="logo-${social.socialType[0].toLowerCase()}"></ion-icon>
                    </a>
                </li>
    `;
}

export function createCatHTML(cat) {
    
    return `
                <label class="category-item">
                    <input name="cat-elem" type="checkbox" data-value="${cat.main.toLowerCase()}">
                    <span>${cat.main}</span>
                </label> `;
}


export function createExperienceHTML(experience) {

    // Join all strings with the HTML line break tag
    // const htmlString = dutiesArray.join('<br>');
    let part_3 = ''
    let part_6 = ''
    const part_1 =      `
                        <li class="exp-timeline-item active" data-category="${experience.category}">
                            <div class="degree-header">
                                <h4 class="h4 timeline-item-title">                    
                                    ${experience.workTitle}
                                </h4>
                                <span>${experience.startDate} — ${experience.endDate}</span>
                            </div>

                            <p class="timeline-text">                  
                                ${experience.industryName} - ${experience.city}, ${experience.country}
                            </p> `
    const part_2 =      `
                            <div class="category">   `
    const part_4 =      `     
                            </div>       `

    const part_5 =      `
                            <ul class="work-text">  `

    const part_7 =     `  
                            </ul>
                        </li> `
    
    experience.category.forEach(cat => {
        if (cat !== '') {
            part_3 += assignCategory(cat);
        };
    })

    experience.dutyDescription.forEach(duty => {
        part_6 += createDuties(duty);
    
    });
    // return `${part_1}, ${part_2}, ${part_3}, ${part_4}, ${part_5} ${part_6}, ${part_7}`  ;

    if (part_3 !== '' ) {
        return `${part_1} ${part_2} ${part_3} ${part_4} ${part_5} ${part_6} ${part_7}` ;
    } else{
        return `${part_1} ${part_5} ${part_6} ${part_7}`  ;
    };
}   

export function createSkillHTML(skill) {

    // Join all strings with the HTML line break tag
    // const htmlString = dutiesArray.join('<br>');
    let part_3 = ''
    //console.log("Skill Data Array:", skill.skillTitle);
    const part_1 =      `
                            <li class="skills-item active" data-category="${skill.category}" data-skill-group="${skill.typename}">
                                <div class="title-wrapper">
                                    <h5 class="h5">${skill.skillTitle}</h5>                                                    
                                    <data value="${skill.percentage}">${skill.percentageScore}</data>
                                </div>   
                                <p class="skill-text">
                                    ${skill.skillDescription}
                                </p>   `
    const part_2 =      `
                                <div class="category">   `

    const part_4 =      `        
                                </div> `
    const part_5 =      `                         
                                <div class="skill-progress-bg">
                                    <div class="skill-progress-fill" style="width: ${skill.percentageScore}"></div>
                                </div>
                                </li>  `
    
    skill.category.forEach(cat => {
        if (cat !== ''){
            part_3 += assignCategory(cat);
        };
    });

    // return `${part_1} ${part_2} ${part_3}` ;

    if (part_3 !== '' ) {
        return `${part_1} ${part_2} ${part_3} ${part_4} ${part_5}` ;
    } else{
        return `${part_1} ${part_5}` ;
    };
}

export function createProjectHTML(project, status) {

    // Join all strings with the HTML line break tag
    // const htmlString = dutiesArray.join('<br>');
    let part_3 = ''
    //console.log("Skill Data Array:", project.projectTitle);  
    
    const part_1 =      `
                               <li
                                    class="project-item ${status}"
                                    data-filter-item
                                    data-clas="${project.projectClass[0].toLowerCase()}"
                                    data-category="${project.category}"
                                >
                                    <a href="${project.projectLink}">         

                                        <h3 class="project-title">
                                                ${project.projectTitle}
                                        </h3>

                                        <p class="project-category">${project.projectClass}</p>
                                        <p class="port-text">
                                            ${project.projectDescription}
                                        </p> `

    const part_2 =      `
                                        <div class="category">   `
    
    const part_4 =      `        
                                        </div> `

    const part_5 =      `
                                    </a>
                                </li>  `

    project.category.forEach(cat => {
        if (cat !== ''){
            part_3 += assignCategory(cat);
        };
    });

    if (part_3 !== '' ) {
        return `${part_1} ${part_2} ${part_3} ${part_4} ${part_5}` ;
    } else{
        return `${part_1} ${part_5}` ;
    };
}

function createDuties(duty) {
    return `
        <li>
            <p class="timeline-text">
                ${duty}
            </p>
        </li>
    `;
}

function assignCategory(cat) {
    return `        
                                        <div class="category-tag ${cat}">${cat}</div>  `;
}

