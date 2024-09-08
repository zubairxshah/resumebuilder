
const resumeForm = document.getElementById('resume-form') as HTMLFormElement;
const resumeContainer = document.getElementById('resume-container') as HTMLElement;
const educationEntries = document.getElementById('education-entries') as HTMLElement;
const workExperienceEntries = document.getElementById('work-experience-entries') as HTMLElement;
const skillsEntries = document.getElementById('skills-entries') as HTMLElement;

let education: { degree: string; institution: string; graduationDate: string }[] = [];
let workExperience: { jobTitle: string; companyName: string; startDate: string; endDate: string }[] = [];
let skills: string[] = [];

function addEntry(containerId: string) {
    const container = document.getElementById(containerId) as HTMLElement;
    const newEntry = container.querySelector('.education-entry, .work-experience-entry, .skills-entry')?.cloneNode(true) as HTMLElement;

    newEntry.querySelectorAll('input, textarea').forEach(input => {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            input.value = ''; 
        }
    });

    container.appendChild(newEntry);
}


function removeEntry(entryElement: HTMLElement) {
    if (entryElement.parentElement) {
        entryElement.parentElement.removeChild(entryElement);
    }
}

educationEntries.addEventListener('click', (event) => {
    if (event.target instanceof HTMLButtonElement) {
        if (event.target.classList.contains('add-entry')) {
            addEntry('education-entries');
        } else if (event.target.classList.contains('remove-entry')) {
            removeEntry(event.target.parentElement as HTMLElement);
        }
    }
});

workExperienceEntries.addEventListener('click', (event) => {
    if (event.target instanceof HTMLButtonElement) {
        if (event.target.classList.contains('add-entry')) {
            addEntry('work-experience-entries');
        } else if (event.target.classList.contains('remove-entry')) {
            removeEntry(event.target.parentElement as HTMLElement);
        }
    }
});

skillsEntries.addEventListener('click', (event) => {
    if (event.target instanceof HTMLButtonElement) {
        if (event.target.classList.contains('add-entry')) {
            addEntry('skills-entries');
        } else if (event.target.classList.contains('remove-entry')) {
            removeEntry(event.target.parentElement as HTMLElement);
        }
    }
});

resumeForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    generateResume();
});

function generateResume() {
    const formData = new FormData(resumeForm);

    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';

    education = []; 
    const educationEntryElements = educationEntries.querySelectorAll('.education-entry');
    educationEntryElements.forEach(entry => {
        const degreeInput = entry.querySelector('#degree') as HTMLInputElement;
        const institutionInput = entry.querySelector('#institution') as HTMLInputElement;
        const graduationDateInput = entry.querySelector('#graduationDate') as HTMLInputElement;

        const degree = degreeInput.value || '';
        const institution = institutionInput.value || '';
        const graduationDate = graduationDateInput.value || '';

        education.push({ degree, institution, graduationDate });
    });

    workExperience = []; 
    const workExperienceEntryElements = workExperienceEntries.querySelectorAll('.work-experience-entry');
    workExperienceEntryElements.forEach(entry => {
        const jobTitleInput = entry.querySelector('#jobTitle') as HTMLInputElement;
        const companyNameInput = entry.querySelector('#companyName') as HTMLInputElement;
        const startDateInput = entry.querySelector('#startDate') as HTMLInputElement;
        const endDateInput = entry.querySelector('#endDate') as HTMLInputElement;

        const jobTitle = jobTitleInput.value || '';
        const companyName = companyNameInput.value || '';
        const startDate = startDateInput.value || '';
        const endDate = endDateInput.value || '';

        workExperience.push({ jobTitle, companyName, startDate, endDate });
    });

    skills = []; 
    const skillsEntryElements = skillsEntries.querySelectorAll('.skills-entry');
    skillsEntryElements.forEach(entry => {
        const skillInput = entry.querySelector('#skill') as HTMLInputElement;
        const skill = skillInput.value || '';
        if (skill) { 
            skills.push(skill);
        }
    });

    let resumeHTML = `
        <h1>${name}</h1>
        <p>Email: ${email}</p>

        <h2>Education</h2>
        <ul id="education-list">
            ${education.map(entry => `
                <li>
                    <span class="resume-text" contenteditable="true">${entry.degree} - ${entry.institution} (${entry.graduationDate})</span>
                    <textarea class="edit-textarea" style="display: none;"></textarea>
                    <button class="save-button" style="display: none;">Save</button>
                </li>
            `).join('')}
        </ul>

        <h2>Work Experience</h2>
        <ul id="work-experience-list">
            ${workExperience.map(entry => `
                <li>
                    <span class="resume-text" contenteditable="true">${entry.jobTitle} - ${entry.companyName} (${entry.startDate} - ${entry.endDate})</span>
                    <textarea class="edit-textarea" style="display: none;"></textarea>
                    <button class="save-button" style="display: none;">Save</button>
                </li>
            `).join('')}
        </ul>

        <h2>Skills</h2>
        <ul id="skills-list">
            ${skills.map(entry => `
                <li>
                    <span class="resume-text" contenteditable="true">${entry}</span>
                    <textarea class="edit-textarea" style="display: none;"></textarea>
                    <button class="save-button" style="display: none;">Save</button>
                </li>
            `).join('')}
        </ul>
    `;

    resumeContainer.innerHTML = resumeHTML; 
    resumeContainer.style.display = 'block'; 
    resumeForm.style.display = 'none'; 

    const resumeItems = resumeContainer.querySelectorAll('.resume-text');
    resumeItems.forEach(item => {
        item.addEventListener('click', handleResumeItemClick);
    });
    addEditListeners();
}
function handleResumeItemClick(event) {
    const target = event.target;
    const editTextarea = target.nextElementSibling;

    target.style.display = 'none';
    editTextarea.style.display = 'block';
    editTextarea.focus();
}
function addEditListeners() {
    const educationList = resumeContainer.querySelector('h2:contains("Education") + ul') as HTMLElement;
    const workExperienceList = resumeContainer.querySelector('h2:contains("Work Experience") + ul') as HTMLElement;
    const skillsList = resumeContainer.querySelector('h2:contains("Skills") + ul') as HTMLElement;

    educationList.addEventListener('input', handleInputChange);
    workExperienceList.addEventListener('input', handleInputChange);
    skillsList.addEventListener('input', handleInputChange);

    educationList.addEventListener('focusout', handleFocusOut);
    workExperienceList.addEventListener('focusout', handleFocusOut);
    skillsList.addEventListener('focusout', handleFocusOut);
}

function handleInputChange(event: Event) {
    const target = event.target as HTMLElement;
    const listItem = target.closest('li') as HTMLElement;
    const resumeText = listItem.querySelector('.resume-text') as HTMLElement;
    const editTextarea = listItem.querySelector('.edit-textarea') as HTMLTextAreaElement;
    const saveButton = listItem.querySelector('.save-button') as HTMLButtonElement;

    resumeText.style.display = 'none';
    editTextarea.style.display = 'block';
    saveButton.style.display = 'block';
editTextarea.value = resumeText.textContent || '';
}

function handleFocusOut(event: Event) {
    const target = event.target as HTMLElement;
    const listItem = target.closest('li') as HTMLElement;
    const resumeText = listItem.querySelector('.resume-text') as HTMLElement;
    const editTextarea = listItem.querySelector('.edit-textarea') as HTMLTextAreaElement;
    const saveButton = listItem.querySelector('.save-button') as HTMLButtonElement;

    resumeText.textContent = editTextarea.value.trim();

    resumeText.style.display = 'block';
    editTextarea.style.display = 'none';
    saveButton.style.display = 'none';
        updateResumeData(listItem, resumeText.textContent || '');
    }
function updateResumeData(listItem: HTMLElement, newText: string) {
    const listIndex = Array.from(listItem.parentElement?.children || []).indexOf(listItem);

    if (listIndex >= 0) {
        const section = listItem.parentElement?.parentElement?.querySelector('h2')?.textContent;

        if (section === 'Education') {
            const parts = newText.split(' - ');
            education[listIndex].degree = parts[0] || '';
            education[listIndex].institution = parts[1]?.split('(')[0] || ''; 
            education[listIndex].graduationDate = parts[1]?.split('(')[1]?.replace(')', '') || '';
        } else if (section === 'Work Experience') {
            const parts = newText.split(' - ');
            workExperience[listIndex].jobTitle = parts[0] || '';
            workExperience[listIndex].companyName = parts[1]?.split('(')[0] || ''; 
            workExperience[listIndex].startDate = parts[1]?.split('(')[1]?.split(' - ')[0]?.replace(')', '') || ''; 
            workExperience[listIndex].endDate = parts[1]?.split('(')[1]?.split(' - ')[1]?.replace(')', '') || '';
        } else if (section === 'Skills') {
            skills[listIndex] = newText; 
        }
    }
}

function handleListItemClick(event: MouseEvent) {
    if (event.target instanceof HTMLElement) {
        const listItem = event.target.closest('li') as HTMLElement;
        const resumeText = listItem.querySelector('.resume-text') as HTMLElement;
        const editTextarea = listItem.querySelector('.edit-textarea') as HTMLTextAreaElement;

        if (event.target === resumeText) { 
            resumeText.style.display = 'none';
            editTextarea.style.display = 'block';
            editTextarea.focus();
        } else if (event.target === editTextarea) { 
            resumeText.style.display = 'block';
            editTextarea.style.display = 'none';

            const newText = editTextarea.value.trim();
            resumeText.textContent = newText;

            updateResumeData(listItem, newText); 
        }
    }
}

