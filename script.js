document.addEventListener('DOMContentLoaded', function() {
    // Step navigation
    const steps = document.querySelectorAll('.booking-step');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');
    const confirmButton = document.querySelector('.btn-confirm');
    const statusElement = document.getElementById('upload-status');
    let currentStep = 1;
    
    // Variables to store selections
    let selectedSpecialty = null;
    let selectedDoctor = null;
    let selectedDate = null;
    let selectedTime = null;
    
    // Update active step
    function updateActiveStep(stepNumber) {
        steps.forEach(step => step.classList.remove('active'));
        progressSteps.forEach(step => step.classList.remove('active'));
        
        document.getElementById(`step${stepNumber}`).classList.add('active');
        
        // Update progress steps (all previous steps and current step)
        progressSteps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum <= stepNumber) {
                step.classList.add('active');
            }
        });
        
        currentStep = stepNumber;
    }

    // Next button event listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep === 2) { // When moving from step 2 to step 3
                updateAppointmentSummary();
            }
            if (currentStep === 4) { // When moving from step 4 to step 5
                updateConfirmationPage();
            }
            if (currentStep < 5) {
                updateActiveStep(currentStep + 1);
            }
        });
    });
    
    // Back button event listeners
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 1) {
                updateActiveStep(currentStep - 1);
            }
        });
    });
    
    // Confirm button (final step)
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            alert('Appointment confirmed! A confirmation has been sent to your email.');
            // Here you would normally submit the form or redirect
        });
    }
    
    // Specialty selection (Step 1)
    const specialtyCards = document.querySelectorAll('.specialty-card');
    const step1NextBtn = document.querySelector('#step1 .btn-next');
    
    specialtyCards.forEach(card => {
        card.addEventListener('click', function() {
            specialtyCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            step1NextBtn.removeAttribute('disabled');
            
            // Store the selected specialty
            selectedSpecialty = this.querySelector('h3').textContent;
        });
    });
    
    // Search functionality for specialties
    const specialtySearch = document.getElementById('specialtySearch');
    const clearSearchBtn = document.querySelector('.clear-search');
    
    if (specialtySearch) {
        specialtySearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            specialtyCards.forEach(card => {
                const specialty = card.getAttribute('data-specialty').toLowerCase();
                const specialtyName = card.querySelector('h3').textContent.toLowerCase();
                const specialtyDesc = card.querySelector('p').textContent.toLowerCase();
                
                if (specialty.includes(searchTerm) || specialtyName.includes(searchTerm) || specialtyDesc.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show/hide clear button
            if (this.value) {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }
        });
    }
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            specialtySearch.value = '';
            specialtyCards.forEach(card => {
                card.style.display = 'flex';
            });
            this.style.display = 'none';
        });
    }
    
    // Doctor selection (Step 2)
    const doctorCards = document.querySelectorAll('.doctor-card');
    doctorCards.forEach(card => {
        const doctorImg = card.querySelector('.doctor-img');
        
        // Load placeholder image for each doctor
        if (doctorImg) {
            loadPlaceholderImage(doctorImg, 150, 150);
        }

        card.addEventListener('click', function() {
            doctorCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedDoctor = this.querySelector('h3').textContent;
        });
    });
    
    // Calendar functionality
    function generateCalendar() {
        const today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        
        const daysGrid = document.querySelector('.days-grid');
        const monthYearHeader = document.querySelector('.month-year');
        const prevMonthBtn = document.querySelector('.prev-month');
        const nextMonthBtn = document.querySelector('.next-month');
        
        function updateCalendar() {
            // Clear previous days
            daysGrid.innerHTML = '';
            
            // Update month/year display
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
            monthYearHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            // Get first day of the month
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            
            // Get number of days in month
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            // Create empty cells for days before first day of month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'day empty';
                daysGrid.appendChild(emptyDay);
            }
            
            // Create day cells
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'day';
                dayElement.textContent = day;
                
                // Check if this is today
                if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate()) {
                    dayElement.classList.add('today');
                }
                
                // Check if this date is in the past
                const currentDate = new Date(currentYear, currentMonth, day);
                if (currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                    dayElement.classList.add('disabled');
                } else {
                    // Add click event for selectable dates
                    dayElement.addEventListener('click', function() {
                        document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                        this.classList.add('selected');
                        
                        // Store the selected date
                        const selectedDay = this.textContent;
                        selectedDate = `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`;
                    });
                }
                
                daysGrid.appendChild(dayElement);
            }
        }
        
        // Initialize calendar
        updateCalendar();
        
        // Month navigation
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', function() {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                updateCalendar();
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', function() {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                updateCalendar();
            });
        }
    }
    
    // Initialize calendar if it exists
    if (document.querySelector('.calendar')) {
        generateCalendar();
    }
    
    // Time slot selection
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            
            // Store the selected time
            selectedTime = this.textContent;
        });
    });
    
    // Function to update appointment summary
    function updateAppointmentSummary() {
        const summaryCard = document.querySelector('.appointment-summary-card .doctor-time-info');
        
        if (selectedDoctor && selectedDate && selectedTime) {
            summaryCard.innerHTML = `
                <h3>${selectedDoctor} - ${selectedSpecialty || 'Specialty'}</h3>
                <p>${selectedDate} at ${selectedTime}</p>
            `;
        }
    }
    
    // Change link functionality
    const changeLink = document.querySelector('.change-link');
    if (changeLink) {
        changeLink.addEventListener('click', function(e) {
            e.preventDefault();
            updateActiveStep(2); // Go back to step 2 to change selection
        });
    }
    
    // File upload functionality
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const browseText = document.getElementById('browse-text');
    const fileList = document.getElementById('file-list');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const uploadStatus = document.getElementById('upload-status');

    let uploadedFiles = [];

    // Click to browse functionality
    browseText.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });

    // Make the whole drop area clickable
    dropArea.addEventListener('click', function(e) {
        if (e.target === this || e.target === browseText) {
            fileInput.click();
        }
    });

    // File input change handler
    document.querySelector('input[type="file"]').addEventListener('change', function(e) {
        handleFiles(e.target.files); // Pass the FileList
    });

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

   // Define this function (can be at the top level of your script)
function clearUploadErrors() {
    // Find all error message elements - adjust selector as needed
    const errorElements = document.querySelectorAll('.upload-error-message');
    
    // Remove or hide each error element
    errorElements.forEach(errorElement => {
        errorElement.remove(); // Or use errorElement.style.display = 'none';
    });
    
    // Also clear any status messages if they exist
    if (uploadStatus) {
        uploadStatus.style.display = 'none';
        uploadStatus.textContent = '';
    }
}


    async function handleFiles(files) {
        clearUploadErrors();
        const filesArray = Array.from(files);
        
        const validFiles = filesArray.filter(file => {
            const isValid = file.size <= 10*1024*1024 && 
                        ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
            if (!isValid) showUploadError(`Invalid file: ${file.name}`);
            return isValid;
        });

        if (validFiles.length > 0) {
            try {
                showProgressBar();
                const result = await uploadFiles(validFiles);
                uploadedFiles = uploadedFiles.concat(validFiles);
                updateFileList();
                showUploadSuccess(`${validFiles.length} file(s) uploaded successfully`);
            } catch (error) {
                console.error('Upload error:', error);
                showUploadError(error.message || 'Upload failed');
            } finally {
                hideProgressBar();
            }
        }
    }

    // Add these functions to your script
    function showProgressBar() {
        const progressContainer = document.getElementById('progress-container');
        const progressBar = document.getElementById('progress-bar');
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
    }

    function hideProgressBar() {
        const progressContainer = document.getElementById('progress-container');
        progressContainer.style.display = 'none';
    }

    function updateProgressBar(percent) {
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${percent}%`;
    }
    
    function updateFileList() {
        if (uploadedFiles.length === 0) {
            fileList.innerHTML = '';
            return;
        }
        
        fileList.innerHTML = `
            <div class="file-list-header">Selected Files:</div>
            <div class="file-list-items">
                ${uploadedFiles.map((file, index) => `
                    <div class="file-item">
                        <div class="file-info">
                            <i class="fas fa-file"></i>
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">(${(file.size/1024/1024).toFixed(2)}MB)</span>
                        </div>
                        <button class="remove-file" data-index="${index}" aria-label="Remove file">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-file').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                uploadedFiles.splice(index, 1);
                updateFileList();
            });
        });
    }

   async function uploadFiles(files) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        try {
            const response = await fetch('http://localhost:3000/api/uploads', {
            method: 'POST',
            body: formData
            });

            if (!response.ok) throw new Error('Upload failed');
            return await response.json();
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    function showUploadError(message) {
        const uploadStatus = document.getElementById('upload-status');
        if (uploadStatus) {
            uploadStatus.textContent = message;
            uploadStatus.style.color = 'red';
            uploadStatus.style.display = 'block';
            setTimeout(() => {
                uploadStatus.style.display = 'none';
            }, 5000);
        }
    }

    function showUploadSuccess(message) {
        const uploadStatus = document.getElementById('upload-status');
        uploadStatus.textContent = message;
        uploadStatus.style.color = 'green';
        uploadStatus.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            uploadStatus.style.display = 'none';
        }, 5000);
    }

    function loadPlaceholderImage(element, width = 80, height = 80) {
        fetch('/api/placeholder/80/80')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
            })
            .then(blob => {
                const imgUrl = URL.createObjectURL(blob);
                element.src = imgUrl;
                // Store the URL for cleanup if needed
                element.dataset.objectUrl = imgUrl; 
            })
            .catch(error => {
                console.error('Failed to load placeholder:', error);
                // Fallback to public placeholder
                element.src = `https://via.placeholder.com/${width}`;
            });
    }

    function collectAppointmentData() {
        return {
            // Step 3 data
            doctor: selectedDoctor,
            specialty: selectedSpecialty,
            dateTime: `${selectedDate} at ${selectedTime}`,
            reason: document.getElementById('visit-reason').value,
            insurance: {
                provider: document.getElementById('insurance-provider').value,
                policyNumber: document.getElementById('policy-number').value
            },
            firstVisit: document.querySelector('input[name="first-visit"]:checked')?.value,
            additionalNotes: document.getElementById('additional-notes').value,
            uploadedFiles: uploadedFiles.map(file => file.name),
            
            // Step 4 data
            patient: {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                dob: document.getElementById('date-of-birth').value,
                gender: document.getElementById('gender').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: {
                    street: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zip: document.getElementById('zip').value
                }
            },
            medicalHistory: {
                conditions: [
                    document.getElementById('high-blood-pressure').checked ? 'High Blood Pressure' : null,
                    document.getElementById('diabetes').checked ? 'Diabetes' : null,
                    document.getElementById('heart-disease').checked ? 'Heart Disease' : null,
                    document.getElementById('asthma').checked ? 'Asthma' : null,
                    document.getElementById('cancer').checked ? 'Cancer' : null,
                    document.getElementById('allergies').checked ? 'Allergies' : null
                ].filter(Boolean),
                medications: document.getElementById('current-medications').value
            },
            emergencyContact: {
                name: document.getElementById('emergency-contact').value,
                relationship: document.getElementById('emergency-relationship').value,
                phone: document.getElementById('emergency-phone').value
            },
            saveInfo: document.getElementById('save-info').checked
        };
    }

    function updateConfirmationPage() {
        const data = collectAppointmentData();
        
        // Appointment Summary
        document.getElementById('confirm-doctor').textContent = data.doctor || 'Not selected';
        document.getElementById('confirm-specialty').textContent = data.specialty || 'Not selected';
        document.getElementById('confirm-datetime').textContent = data.dateTime || 'Not selected';
        document.getElementById('confirm-reason').textContent = data.reason || 'Not provided';
        document.getElementById('confirm-insurance-provider').textContent = data.insurance.provider || 'Not provided';
        document.getElementById('confirm-policy-number').textContent = data.insurance.policyNumber || 'Not provided';
        document.getElementById('confirm-first-visit').textContent = data.firstVisit ? (data.firstVisit === 'yes' ? 'Yes' : 'No') : 'Not specified';
        
        // Uploaded files
        const filesContainer = document.getElementById('confirm-uploaded-files');
        if (data.uploadedFiles.length > 0) {
            filesContainer.innerHTML = data.uploadedFiles.map(file => 
                `<div><i class="fas fa-file"></i> ${file}</div>`
            ).join('');
            document.getElementById('uploaded-files-row').style.display = 'flex';
        } else {
            filesContainer.textContent = 'No files uploaded';
            document.getElementById('uploaded-files-row').style.display = 'flex';
        }
        
        // Patient Information
        document.getElementById('confirm-patient-name').textContent = 
            `${data.patient.firstName || ''} ${data.patient.lastName || ''}`.trim() || 'Not provided';
        document.getElementById('confirm-dob').textContent = data.patient.dob || 'Not provided';
        document.getElementById('confirm-gender').textContent = data.patient.gender || 'Not provided';
        document.getElementById('confirm-email').textContent = data.patient.email || 'Not provided';
        document.getElementById('confirm-phone').textContent = data.patient.phone || 'Not provided';
        document.getElementById('confirm-address').textContent = 
            `${data.patient.address.street || ''}, ${data.patient.address.city || ''}, ${data.patient.address.state || ''} ${data.patient.address.zip || ''}`.trim() || 'Not provided';
        
        // Medical History
        document.getElementById('confirm-conditions').textContent = 
            data.medicalHistory.conditions.length > 0 ? data.medicalHistory.conditions.join(', ') : 'None reported';
        document.getElementById('confirm-medications').textContent = 
            data.medicalHistory.medications || 'None reported';
        
        // Emergency Contact
        document.getElementById('confirm-emergency-name').textContent = data.emergencyContact.name || 'Not provided';
        document.getElementById('confirm-emergency-relationship').textContent = data.emergencyContact.relationship || 'Not provided';
        document.getElementById('confirm-emergency-phone').textContent = data.emergencyContact.phone || 'Not provided';
    }

    // Checkbox for confirmation
    const confirmCheckbox = document.getElementById('confirm-info');
    if (confirmCheckbox && confirmButton) {
        confirmCheckbox.addEventListener('change', function() {
            confirmButton.disabled = !this.checked;
        });
                    
        // Initialize button state
        confirmButton.disabled = !confirmCheckbox.checked;
    }
});