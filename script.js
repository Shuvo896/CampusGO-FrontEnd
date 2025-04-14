// Hamburger icon toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.getElementById('hamburger');
    sidebar.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Functional Date section
function updateDate() {
    const dateSpan = document.querySelector('.showDate');
    if (dateSpan) {
        const now = new Date();
        const formattedDate = formatDate(now);
        dateSpan.textContent = formattedDate;
    }
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

updateDate();
setInterval(updateDate, 60000);


// Main Application Controller
document.addEventListener('DOMContentLoaded', function () {
    try {
        initSidebar();
        initBusSystem();
        initNoticeSystem();
        renderNoticesOnNoticePage();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// ===== UTILITY FUNCTIONS =====
function closeModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            if (modalId === 'busModal') {
                const form = document.getElementById('busForm');
                if (form) form.reset();
            }
        }
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}

function formatDate(dateString) {
    try {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Date formatting error:', error);
        return dateString; // Return original if formatting fails
    }
}

// SIDEBAR TOGGLE HANDLER
function initSidebar() {
    try {
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');

        if (!hamburger || !sidebar) return;

        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    } catch (error) {
        console.error('Sidebar initialization error:', error);
    }
}

// ===== BUS MANAGEMENT SYSTEM =====
function initBusSystem() {
    try {
        if (!document.querySelector('.bus-lists')) return;

        let buses = loadBuses();
        setupBusEventListeners();
        renderBuses(buses);

        function loadBuses() {
            try {
                const savedBuses = localStorage.getItem('busSchedule');
                return savedBuses ? JSON.parse(savedBuses) : getSampleBuses();
            } catch (error) {
                console.error('Error loading buses:', error);
                return getSampleBuses();
            }
        }

        function getSampleBuses() {
            return [
                {
                    id: '1', number: 'DIU-101', driver: 'John Doe',
                    from: 'Mirpur', to: 'Uttara', time: '08:00 AM',
                    capacity: 40, passengers: 32
                },
                {
                    id: '2', number: 'DIU-102', driver: 'Jane Smith',
                    from: 'Dhanmundi', to: 'Mirpur', time: '09:00 AM',
                    capacity: 40, passengers: 28
                },
                {
                    id: '3', number: 'DIU-103', driver: 'Robert Johnson',
                    from: 'Uttara', to: 'Dhanmundi', time: '10:00 AM',
                    capacity: 40, passengers: 35
                }
            ];
        }

        function setupBusEventListeners() {
            try {
                // Add Bus button
                document.querySelector('.add-bus')?.addEventListener('click', () => openBusModal());

                // Form submission
                const busForm = document.getElementById('busForm');
                if (busForm) {
                    busForm.addEventListener('submit', function (e) {
                        e.preventDefault();
                        handleBusFormSubmit();
                    });
                }

                // Filter button
                document.querySelector('.filter-out')?.addEventListener('click', filterBuses);

                // Modal close events
                document.querySelectorAll('.modal .close, .cancel-btn').forEach(btn => {
                    btn.addEventListener('click', () => closeModal('busModal'));
                });

                // Close modal when clicking outside
                const busModal = document.getElementById('busModal');
                if (busModal) {
                    busModal.addEventListener('click', function (e) {
                        if (e.target === this) {
                            closeModal('busModal');
                        }
                    });
                }
            } catch (error) {
                console.error('Bus event listeners setup error:', error);
            }
        }

        function openBusModal(busId = null) {
            try {
                const modal = document.getElementById('busModal');
                const form = document.getElementById('busForm');
                const modalTitle = document.getElementById('modalTitle');

                if (!modal || !form || !modalTitle) return;

                if (busId) {
                    modalTitle.textContent = 'Edit Bus';
                    const bus = buses.find(b => b.id === busId);
                    if (bus) populateBusForm(bus);
                } else {
                    modalTitle.textContent = 'Add New Bus';
                    const busIdInput = document.getElementById('busId');
                    if (busIdInput) busIdInput.value = '';
                    form.reset();
                }
                modal.style.display = 'block';
            } catch (error) {
                console.error('Error opening bus modal:', error);
            }
        }

        function populateBusForm(bus) {
            try {
                document.getElementById('busId').value = bus.id;
                document.getElementById('busNumber').value = bus.number;
                document.getElementById('driverName').value = bus.driver;
                document.getElementById('fromLocation').value = bus.from;
                document.getElementById('toLocation').value = bus.to;
                document.getElementById('departureTime').value = convertTo24Hour(bus.time);
                document.getElementById('capacity').value = bus.capacity;
            } catch (error) {
                console.error('Error populating bus form:', error);
            }
        }

        function handleBusFormSubmit() {
            try {
                const busNumber = document.getElementById('busNumber')?.value.trim();
                const driverName = document.getElementById('driverName')?.value.trim();
                const fromLocation = document.getElementById('fromLocation')?.value;
                const toLocation = document.getElementById('toLocation')?.value;
                const departureTime = document.getElementById('departureTime')?.value;
                const capacity = document.getElementById('capacity')?.value;

                if (!busNumber || !driverName || !fromLocation || !toLocation || !departureTime || !capacity) {
                    alert('Please fill all fields');
                    return;
                }

                const formData = {
                    id: document.getElementById('busId')?.value || Date.now().toString(),
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
            } catch (error) {
                console.error('Error handling bus form submission:', error);
            }
        }

        function convertTo12Hour(time24) {
            try {
                if (!time24) return '';
                const [hours, minutes] = time24.split(':');
                const period = hours >= 12 ? 'PM' : 'AM';
                const hours12 = hours % 12 || 12;
                return `${hours12}:${minutes} ${period}`;
            } catch (error) {
                console.error('Time conversion error:', error);
                return time24;
            }
        }

        function convertTo24Hour(time12) {
            try {
                if (!time12) return '';
                const [time, period] = time12.split(' ');
                let [hours, minutes] = time.split(':');

                if (period === 'PM' && hours !== '12') hours = parseInt(hours) + 12;
                if (period === 'AM' && hours === '12') hours = '00';

                return `${hours}:${minutes}`;
            } catch (error) {
                console.error('Time conversion error:', error);
                return time12;
            }
        }

        function saveBuses() {
            try {
                localStorage.setItem('busSchedule', JSON.stringify(buses));
            } catch (error) {
                console.error('Error saving buses:', error);
            }
        }

        function renderBuses(busesToRender) {
            try {
                const container = document.querySelector('.bus-lists');
                if (!container) return;

                container.innerHTML = busesToRender.length ?
                    busesToRender.map(createBusCard).join('') :
                    '<div class="no-buses">No buses found</div>';

                container.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => openBusModal(e.target.dataset.id));
                });

                container.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => deleteBus(e.target.dataset.id));
                });
            } catch (error) {
                console.error('Error rendering buses:', error);
            }
        }

        function createBusCard(bus) {
            try {
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
                        
                        <div class="bus-actions">
                            <button class="edit-btn" data-id="${bus.id}">Edit</button>
                            <button class="delete-btn" data-id="${bus.id}">Delete</button>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error creating bus card:', error);
                return '<div class="bus-card error">Error loading bus information</div>';
            }
        }

        function deleteBus(busId) {
            if (confirm('Are you sure you want to delete this bus?')) {
                buses = buses.filter(bus => bus.id !== busId);
                saveBuses();
                renderBuses(buses);
            }
        }

        function filterBuses() {
            try {
                const from = document.getElementById('from')?.value.toLowerCase() || 'all';
                const to = document.getElementById('to')?.value.toLowerCase() || 'all';
                const time = document.getElementById('time')?.value || 'all';

                const filtered = buses.filter(bus => {
                    return (from === 'all' || bus.from.toLowerCase().includes(from)) &&
                        (to === 'all' || bus.to.toLowerCase().includes(to)) &&
                        (time === 'all' || bus.time === time);
                });

                renderBuses(filtered);
            } catch (error) {
                console.error('Error filtering buses:', error);
            }
        }
    } catch (error) {
        console.error('Bus system initialization error:', error);
    }
}

// ===== NOTICE MANAGEMENT SYSTEM =====
function initNoticeSystem() {
    try {
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
            try {
                const notices = JSON.parse(localStorage.getItem('notices')) || [];
                const container = document.querySelector('.notices-list');
                if (!container) return;

                container.innerHTML = notices.length ?
                    notices.map(createNoticeItem).join('') :
                    '<div class="no-notices">No notices yet</div>';
            } catch (error) {
                console.error('Error loading notices:', error);
            }
        }

        function createNoticeItem(notice) {
            try {
                return `
                    <div class="notice-item">
                        <input type="checkbox" data-id="${notice.id}">
                        <div class="notice-preview">
                            ${notice.content}
                            <div class="notice-date">${formatDate(notice.date)}</div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error creating notice item:', error);
                return '<div class="notice-item error">Error loading notice</div>';
            }
        }

        function publishNotice() {
            try {
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
            } catch (error) {
                console.error('Error publishing notice:', error);
            }
        }

        function clearAllNotices() {
            if (confirm('Are you sure you want to delete ALL notices? This cannot be undone.')) {
                localStorage.removeItem('notices');
                loadNotices();
                renderNoticesOnNoticePage();
            }
        }

        function deleteSelectedNotices() {
            try {
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
            } catch (error) {
                console.error('Error deleting selected notices:', error);
            }
        }

        function switchTab(tabId) {
            try {
                document.querySelectorAll('.tab-btn, .tab-content').forEach(el =>
                    el.classList.remove('active'));

                const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
                const tabContent = document.getElementById(`${tabId}-tab`);
                
                if (tabBtn) tabBtn.classList.add('active');
                if (tabContent) tabContent.classList.add('active');
            } catch (error) {
                console.error('Error switching tabs:', error);
            }
        }
    } catch (error) {
        console.error('Notice system initialization error:', error);
    }
}

function renderNoticesOnNoticePage() {
    try {
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
    } catch (error) {
        console.error('Error rendering notices:', error);
    }
}