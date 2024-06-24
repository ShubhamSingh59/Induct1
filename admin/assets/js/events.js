document.addEventListener('DOMContentLoaded', addEventToDOM);
document.addEventListener('DOMContentLoaded', addEventJoiners);
document.getElementById('eventForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Collecting  form data
    const date = document.getElementById('datePicker').value;
    const location = document.getElementById('location').value;
    const eventName = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    if (!date || !location || !eventName || !description) {
        alert('All fields are required.');
        return;
    }
    const eventData = {
        eventName: eventName,
        location: location,
        date: date,
        description: description
    };

    // Sending data to server using Axios
    try {
        const response = await axios.post('/new-event', eventData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response.data.status);
        if (response.data.status === 200) {
            alert('Event added successfully!');
            //addEventToDOM();
            window.location.href = '/events'
        }
    }

    catch (error) {
        console.error('Error adding event:', error);
        alert('Failed to add event.');
    }
});
async function addEventToDOM() {
    try {
        const response = await axios.get('/api/events')
        console.log(response.data['results']);
        const eventsContainer = document.getElementById('eventsContainer');
        //eventsContainer.innerHTML = '';  // Clear existing events

        response.data['results'].forEach(event => {
            const newEventElement = document.createElement('div');
            newEventElement.className = 'col-md-6 mb-3';
            newEventElement.innerHTML = `
                <div class="even-box">
                    <p>
                        <i class="far fa-calendar" style="color: #1777E5;"></i> <span>${new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <i class="fas fa-map-marker-alt" style="color: #1777E5;"></i> <span>${event.location}</span>
                        <a href="/events" class="delete-icon" onclick="deleteEvent('${event.eventName}')">
                            <i class="fas fa-trash-alt" style="color: #91A4B7; float: right;"></i>
                        </a>
                    </p>
                    <h4 style="text-align: left;">${event.eventName}</h4>
                    <p>${event.description}</p>
                    <button type="button" class="btn btn-primary joinEvent" onclick="openJoinForm('${event.eventName}')">Join Event</button>
                </div>
            `;
            eventsContainer.appendChild(newEventElement);
        });
    }
    catch (error) {
        console.error('Error adding event:', error);
        alert('Failed to add event.');
    }

}
function openJoinForm(eventName) {
    const formContainer = document.getElementById('joinEventFormContainer');
    const eventNameInput = document.getElementById('popupEventName');
    const overlay = document.getElementById('overlay');
    eventNameInput.value = eventName;
    formContainer.classList.remove('hidden');
    overlay.style.display = 'block';
}
function closeJoinForm() {
    const formContainer = document.getElementById('joinEventFormContainer');
    const overlay = document.getElementById('overlay');
    const joinEventForm = document.getElementById('joinEventForm');
    formContainer.classList.add('hidden');
    overlay.style.display = 'none';
    joinEventForm.reset();
}

//document.addEventListener('click', function (event) {
//    const formContainer = document.getElementById('joinEventFormContainer');
//    const overlay = document.getElementById('overlay');
//    if (!formContainer.contains(event.target) && event.target !== formContainer && overlay.style.display === 'block') {
//        closeJoinForm();
//    }
//});
//document.getElementById('joinEventFormContainer').addEventListener('click', function(event) {
//    event.stopPropagation();
//});

document.getElementById('joinEventForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const eventName = document.getElementById('popupEventName').value;
    const yourName = document.getElementById('yourName').value;
    const yourEmail = document.getElementById('yourEmail').value;
    const yourDesignation = document.getElementById('Designation').value;
    const yourNumber = document.getElementById('yourNumber').value;
    const joinData = { eventName, yourName, yourEmail, yourDesignation, yourNumber };
    console.log(joinData);
    try {
        const response = await axios.post('/api/join-event', joinData, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.status === 200) {
            alert('Successfully joined the event!');
            document.getElementById('joinEventFormContainer').style.display = 'none';
            window.location.href = '/events'
        }
    } catch (error) {
        console.error('Error joining event:', error);
        alert('Failed to join event.');
    }
});
async function addEventJoiners() {
    try {
        const response = await axios.get('/api/eventJoiner');
        const tableBody = document.querySelector('#activity-table .activity-section');
        response.data.results.forEach(row => {
            const rowElement = document.createElement('tr');
            rowElement.className = "activity-rows";
            rowElement.innerHTML = `
                    <td><input type="checkbox" class="checkbox-custom individual-checkbox"></td>
                      <td style="text-align: left;">${row.name}</td>
                      <td style="text-align: left;">${row.email}</td>
                      <td style="text-align: left;">${row.designation} </td>
                      <td style="text-align: left;">${row.number}</td>
                      <td style="text-align: left;">${row.eventName}</td>
                      <td class="button-dropdown" style="text-align: left;">
                        <a class="edit-icon" onclick="editEvent(event)">
                          <i class="far fa-edit" style="color: #6B7280; float: right; margin-right: 5px;"></i>
                        </a>
                      </td>
                      <td>
                        <a href="/events" class="delete-icon" onclick="deleteJoiner('${row.email}')">
                          <i class="fas fa-trash-alt" style="color: #91A4B7; float: right;"></i>
                        </a>
                      </td>`;
            tableBody.appendChild(rowElement);
        })

    }
    catch (error) {
        console.error('Error in finding eventJoiners:', error);
        alert('Error.');
    }
}
async function deleteEvent(data) {
    try {
        const response = await axios.delete(`/api/delete-event/${data}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            alert('Event deleted successfully!');
            addEventToDOM();
        } else {
            alert('Failed to delete event.');
        }
    }
    catch (error) {
        console.error('Error adding event:', error);
        alert('Failed to add event.');
    }
}
async function deleteJoiner(mail) {
    console.log(mail);
    try {
        const response = await axios.delete(`/api/delete-joiner/${mail}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            alert('Data Deleted!');
            addEventJoiners();
        }
        else {
            alert(response.data.message);
        }
    }
    catch (error) {
        console.error('Error in deleting data:', error);
        alert('Failed to delete data.');
    }
};
async function deletemultiJoiners(event) {
    const checkboxes = document.querySelectorAll('.individual-checkbox:checked')
    const emails = [];
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const email = row.querySelector('td:nth-child(3)').textContent;
        emails.push(email);
    })
    const mails = {
        emails: emails
    }
    try {
        const response = await axios.post('/api/multi-delete', mails, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            alert('Data Deleted!');
            addEventJoiners();
        }
        else {
            alert(response.data.message);
        }
    }
    catch (error) {
        console.error('Error in deleting data:', error);
        alert('Failed to delete data.');
    }

};
function toggleAllCheckboxes() {
    var checkboxes = document.querySelectorAll('.individual-checkbox');
    var selectAllCheckbox = document.getElementById('select-all');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = selectAllCheckbox.checked;
    }
}

function toggleIndividualCheckboxes(checkbox) {
    var checkboxes = document.querySelectorAll('.individual-checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = checkbox.checked;
    }
}


function selectFile(type) {
    document.getElementById('fileInput').value = null;
    document.getElementById('fileInput').removeAttribute('webkitdirectory');
    switch (type) {
        case 'file':
            document.getElementById('fileInput').setAttribute('accept', '*');
            break;
        case 'link':
            document.getElementById('fileInput').setAttribute('accept', '.url');
            break;
        case 'smile':
            document.getElementById('fileInput').setAttribute('accept', '.txt');
            break;
        case 'folder':
            document.getElementById('fileInput').setAttribute('webkitdirectory', '');
            break;
        case 'image':
            document.getElementById('fileInput').setAttribute('accept', 'image');
            break;
        default:
            break;
    }
    document.getElementById('fileInput').click();
}
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const fileDisplayArea = document.getElementById('fileDisplayArea');
        fileDisplayArea.innerHTML = '';

        const fileLink = document.createElement('a');
        fileLink.href = URL.createObjectURL(file);
        fileLink.textContent = file.name;
        //fileLink.download = file.name; // Allow downloading the file
        fileLink.target = '_blank'; // Open in new tab if clicked
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.style.marginLeft = '10px';
        removeButton.onclick = () => {
            document.getElementById('fileInput').value = null;
            fileDisplayArea.innerHTML = '';
        };

        fileDisplayArea.appendChild(fileLink);
        fileDisplayArea.appendChild(removeButton)
    }
}

async function sendMail() {
    const recipient = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const body = document.getElementById('body').value; // Correctly retrieve textarea value
    const fileInput = document.getElementById('fileInput').files[0];
    console.log(fileInput);
    const formData = new FormData();
    formData.append('recipient', recipient);
    formData.append('subject', subject);
    formData.append('html', body); 

    if (fileInput) {
        formData.append('attachment', fileInput, fileInput.name);
    }

    for (const value of formData.values()) {
        console.log(value);
      }
    try {
        const response = await axios.post('/api/send-email', formData);
        if (response.status === 200) {
            alert('mail sent successfully!');
            //addEventToDOM();
            //window.location.href = '/events'
        }
    }
    catch (error) {
        console.error('Error in sending mail:', error);
        alert('error in Mail sending.');
    }
}