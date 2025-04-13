function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const hamburger = document.getElementById('hamburger');
  sidebar.classList.toggle('active');
  hamburger.classList.toggle('active');
}


function updateDate() {
  const dateSpan = document.querySelector('.showDate');
  if (dateSpan) {
    const now = new Date();
    const formattedDate = formatDate(now);
    dateSpan.textContent = formattedDate;
  }
}

// Live Date updates
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

updateDate();

setInterval(updateDate, 60000);

// Main Application Controller
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initBusSystem();
    initNoticeSystem();
    renderNoticesOnNoticePage();
});

// ===== UTILITY FUNCTIONS =====
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'busModal') {
        document.getElementById('busForm').reset();
    }
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ===== SIDEBAR =====
function initSidebar() {
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// ===== BUS MANAGEMENT SYSTEM =====
function initBusSystem() {
    if (!document.querySelector('.bus-lists')) return;
    
    let buses = loadBuses();
    setupBusEventListeners();
    renderBuses(buses);

    function loadBuses() {
        const savedBuses = localStorage.getItem('busSchedule');
        return savedBuses ? JSON.parse(savedBuses) : getSampleBuses();
    }

    // function getSampleBuses() {
    //     return [
    //         {
    //             id: '1', number: 'DIU-101', driver: 'John Doe',
    //             from: 'Mirpur', to: 'Uttara', time: '08:00 AM',
    //             capacity: 40, passengers: 32
    //         },
    //         {
    //             id: '2', number: 'DIU-102', driver: 'Jane Smith',
    //             from: 'Dhanmundi', to: 'Mirpur', time: '09:00 AM',
    //             capacity: 40, passengers: 28
    //         },
    //         {
    //             id: '3', number: 'DIU-103', driver: 'Robert Johnson',
    //             from: 'Uttara', to: 'Dhanmundi', time: '10:00 AM',
    //             capacity: 40, passengers: 35
    //         }
    //     ];
    // }

    function setupBusEventListeners() {
        // Add Bus button
        document.querySelector('.add-bus')?.addEventListener('click', () => openBusModal());
        
        // Form submission
        document.getElementById('busForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBusFormSubmit();
        });
        
        // Filter button
        document.querySelector('.filter-out')?.addEventListener('click', filterBuses);
        
        // Modal close events
        document.querySelectorAll('.modal .close, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => closeModal('busModal'));
        });
        
        // Close modal when clicking outside
        document.getElementById('busModal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal('busModal');
            }
        });
    }

    function openBusModal(busId = null) {
        const modal = document.getElementById('busModal');
        const form = document.getElementById('busForm');
        
        if (busId) {
            document.getElementById('modalTitle').textContent = 'Edit Bus';
            const bus = buses.find(b => b.id === busId);
            if (bus) populateBusForm(bus);
        } else {
            document.getElementById('modalTitle').textContent = 'Add New Bus';
            document.getElementById('busId').value = '';
            form.reset();
        }
        modal.style.display = 'block';
    }

    function populateBusForm(bus) {
        document.getElementById('busId').value = bus.id;
        document.getElementById('busNumber').value = bus.number;
        document.getElementById('driverName').value = bus.driver;
        document.getElementById('fromLocation').value = bus.from;
        document.getElementById('toLocation').value = bus.to;
        document.getElementById('departureTime').value = convertTo24Hour(bus.time);
        document.getElementById('capacity').value = bus.capacity;
    }

    function handleBusFormSubmit() {
        const busNumber = document.getElementById('busNumber').value.trim();
        const driverName = document.getElementById('driverName').value.trim();
        const fromLocation = document.getElementById('fromLocation').value;
        const toLocation = document.getElementById('toLocation').value;
        const departureTime = document.getElementById('departureTime').value;
        const capacity = document.getElementById('capacity').value;

        if (!busNumber || !driverName || !fromLocation || !toLocation || !departureTime || !capacity) {
            alert('Please fill all fields');
            return;
        }

        const formData = {
            id: document.getElementById('busId').value || Date.now().toString(),
            number: busNumber,
            driver: driverName,
            from: fromLocation,
            to: toLocation,
            time: convertTo12Hour(departureTime),
            capacity: parseInt(capacity),
            passengers: Math.floor(Math.random() * capacity)
        };

        const index = buses.findIndex(b => b.id === formData.id);
        if (index !== -1) {
            buses[index] = formData;
        } else {
            buses.push(formData);
        }

        saveBuses();
        renderBuses(buses);
        closeModal('busModal');
    }

    function convertTo12Hour(time24) {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes} ${period}`;
    }

    function convertTo24Hour(time12) {
        if (!time12) return '';
        const [time, period] = time12.split(' ');
        let [hours, minutes] = time.split(':');
        
        if (period === 'PM' && hours !== '12') hours = parseInt(hours) + 12;
        if (period === 'AM' && hours === '12') hours = '00';
        
        return `${hours}:${minutes}`;
    }

    function saveBuses() {
        localStorage.setItem('busSchedule', JSON.stringify(buses));
    }

    function renderBuses(busesToRender) {
        const container = document.querySelector('.bus-lists');
        container.innerHTML = busesToRender.length ? 
            busesToRender.map(createBusCard).join('') : 
            '<div class="no-buses">No buses found</div>';
        
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => openBusModal(e.target.dataset.id));
        });
        
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteBus(e.target.dataset.id));
        });
    }

    function createBusCard(bus) {
        const percentage = Math.round((bus.passengers / bus.capacity) * 100);
        const isFull = percentage >= 100;
        
        return `
            <div class="bus-card">
                <div class="bus-header">
                    <span class="bus-number">${bus.number}</span>
                    <span class="bus-status ${isFull ? 'status-full' : 'status-available'}">
                        ${isFull ? 'FULL' : 'AVAILABLE'}
                    </span>
                </div>
                <div class="bus-driver">Driver: ${bus.driver}</div>
                <div class="bus-route">
                    <div class="route">
                        <span class="dot"></span>
                        <span>${bus.from}</span>
                        <span class="route-time">${bus.time}</span>
                    </div>
                    <div class="route">
                        <span class="dot"></span>
                        <span>${bus.to}</span>
                    </div>
                </div>
                <div class="bus-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" 
                             style="width: ${percentage}%; 
                             background-color: ${isFull ? '#ff4d4d' : '#47A34B'}">
                        </div>
                    </div>
                    <div class="capacity-info">
                        ${bus.passengers}/${bus.capacity} (${percentage}%)
                    </div>
                </div>
                <div class="bus-actions">
                    <button class="edit-btn" data-id="${bus.id}">Edit</button>
                    <button class="delete-btn" data-id="${bus.id}">Delete</button>
                </div>
            </div>
        `;
    }

    function deleteBus(busId) {
        if (confirm('Are you sure you want to delete this bus?')) {
            buses = buses.filter(bus => bus.id !== busId);
            saveBuses();
            renderBuses(buses);
        }
    }

    function filterBuses() {
        const from = document.getElementById('from').value.toLowerCase();
        const to = document.getElementById('to').value.toLowerCase();
        const time = document.getElementById('time').value;
        
        const filtered = buses.filter(bus => {
            return (from === 'all' || bus.from.toLowerCase().includes(from)) &&
                   (to === 'all' || bus.to.toLowerCase().includes(to)) &&
                   (time === 'all' || bus.time === time);
        });
        
        renderBuses(filtered);
    }
}

// ===== NOTICE MANAGEMENT SYSTEM =====
function initNoticeSystem() {
    if (!document.querySelector('.add-notice')) return;
    
    const modal = document.getElementById('noticeModal');
    const editor = document.getElementById('noticeEditor');
    
    document.querySelector('.add-notice')?.addEventListener('click', () => {
        modal.style.display = 'block';
        editor.focus();
        loadNotices();
    });
    
    document.querySelector('.close')?.addEventListener('click', () => closeModal('noticeModal'));
    
    document.querySelectorAll('[data-command]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.execCommand(btn.dataset.command, false, btn.value);
            editor.focus();
        });
    });
    
    document.querySelector('.submit-notice')?.addEventListener('click', publishNotice);
    document.querySelector('.clear-notices')?.addEventListener('click', clearAllNotices);
    document.querySelector('.delete-selected')?.addEventListener('click', deleteSelectedNotices);
    
    document.querySelectorAll('.tab-btn')?.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    function loadNotices() {
        const notices = JSON.parse(localStorage.getItem('notices')) || [];
        const container = document.querySelector('.notices-list');
        if (!container) return;
        
        container.innerHTML = notices.length ? 
            notices.map(createNoticeItem).join('') : 
            '<div class="no-notices">No notices yet</div>';
    }

    function createNoticeItem(notice) {
        return `
            <div class="notice-item">
                <input type="checkbox" data-id="${notice.id}">
                <div class="notice-preview">
                    ${notice.content}
                    <div class="notice-date">${formatDate(notice.date)}</div>
                </div>
            </div>
        `;
    }

    function publishNotice() {
        if (!editor.innerHTML.trim()) {
            alert('Please write something before publishing!');
            return;
        }
        
        const notices = JSON.parse(localStorage.getItem('notices')) || [];
        notices.unshift({
            content: editor.innerHTML,
            date: new Date().toISOString(),
            id: Date.now()
        });
        
        localStorage.setItem('notices', JSON.stringify(notices));
        editor.innerHTML = '';
        closeModal('noticeModal');
        loadNotices();
        renderNoticesOnNoticePage();
    }

    function clearAllNotices() {
        if (confirm('Are you sure you want to delete ALL notices? This cannot be undone.')) {
            localStorage.removeItem('notices');
            loadNotices();
            renderNoticesOnNoticePage();
        }
    }

    function deleteSelectedNotices() {
        const selected = document.querySelectorAll('.notice-item input:checked');
        if (!selected.length) {
            alert('Please select at least one notice to delete');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${selected.length} notice(s)?`)) {
            const notices = JSON.parse(localStorage.getItem('notices')) || [];
            const ids = Array.from(selected).map(el => parseInt(el.dataset.id));
            const updated = notices.filter(n => !ids.includes(n.id));
            
            localStorage.setItem('notices', JSON.stringify(updated));
            loadNotices();
            renderNoticesOnNoticePage();
        }
    }

    function switchTab(tabId) {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => 
            el.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }
}

function renderNoticesOnNoticePage() {
    const container = document.querySelector('.notices');
    if (!container) return;
    
    const notices = JSON.parse(localStorage.getItem('notices')) || [];
    
    container.innerHTML = notices.length ? 
        notices.map(notice => `
            <div class="notice-card">
                <div class="notice-date">${formatDate(notice.date)}</div>
                <div class="notice-content">${notice.content}</div>
            </div>
        `).join('') : 
        '<div class="no-notices">No notices available</div>';
}