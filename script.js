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

// Bus payment and token system in index
document.addEventListener('DOMContentLoaded', function () {
    const scheduleData = loadBusSchedule();
    displayAvailableBuses([]);
    setupPaymentModal();

    function loadBusSchedule() {
        const data = localStorage.getItem('busSchedule');
        return data ? JSON.parse(data) : [];
    }

    document.querySelector('.search-out').addEventListener('click', function () {
        const fromValue = document.getElementById('from').value;
        const toValue = document.getElementById('to').value;
        const timeValue = document.getElementById('time').value;

        const scheduleData = loadBusSchedule();
        const filteredBuses = filterBuses(scheduleData, fromValue, toValue, timeValue);
        displayAvailableBuses(filteredBuses);
    });

    function filterBuses(buses, from, to, time) {
        return buses.filter(bus => {
            const fromMatch = from === 'from' || bus.from.toLowerCase() === from.toLowerCase();
            const toMatch = to === 'to' || bus.to.toLowerCase() === to.toLowerCase();
            const timeMatch = time === 'time' || bus.time.toLowerCase() === time.toLowerCase();

            return fromMatch && toMatch && timeMatch;
        });
    }

    function displayAvailableBuses(busList) {
        const listContainer = document.querySelector('.bus-container');
        listContainer.innerHTML = busList.length
            ? busList.map(buildBusCard).join('')
            : '<div class="no-buses">No buses available</div>';

        document.querySelectorAll('.purchase-btn').forEach(button => {
            button.addEventListener('click', openPaymentModal);
        });
    }

    function buildBusCard(bus) {
        const isFull = (bus.passengers / bus.capacity) >= 1;
        const price = bus.price ?? 50;

        return `
            <div class="available-bus-card">
                <div class="available-header">
                    <span class="available-number">${bus.number}</span>
                    <span class="available-status ${isFull ? 'status-full' : 'status-ok'}">
                        ${isFull ? 'FULL' : 'AVAILABLE'}
                    </span>
                </div>
                <div class="available-driver">Driver: ${bus.driver}</div>
                <div class="available-route">
                    <div class="available-location">
                        <span class="dot"></span>
                        <span>From: ${bus.from}</span>
                    </div>
                    <div class="available-location">
                        <span class="dot"></span>
                        <span>To: ${bus.to}</span>
                    </div>
                    <div class="available-time">Departure: ${bus.time}:00 AM</div>
                </div>
                <div class="available-footer">
                    <div class="available-price">৳ ${price}</div>
                    <button class="purchase-btn">Purchase</button>
                </div>
            </div>
        `;
    }

    function setupPaymentModal() {
        const modal = document.createElement('div');
        modal.classList.add('payment-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Select Payment Method</h2>
                <select id="paymentMethod">
                    <option value="card">Card</option>
                    <option value="mobile">Mobile Bank</option>
                    <option value="1card">1Card</option>
                </select>
                <button id="proceedPayment">Proceed</button>
                <button id="closeModal">Cancel</button>
            </div>
            <div class="qr-section" style="display: none;">
                <h3>Your Ticket Token</h3>
                <canvas id="qrCanvas"></canvas>
                <p id="tokenInfo"></p>
                <button id="closeQR">Done</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#proceedPayment').onclick = handleFakePayment;
        modal.querySelector('#closeModal').onclick = () => modal.classList.remove('show');
        modal.querySelector('#closeQR').onclick = () => modal.classList.remove('show');
    }

    function openPaymentModal() {
        const modal = document.querySelector('.payment-modal');
        modal.classList.add('show');
        modal.querySelector('.modal-content').style.display = 'block';
        modal.querySelector('.qr-section').style.display = 'none';
    }

    function handleFakePayment() {
        const modal = document.querySelector('.payment-modal');
        const token = Math.floor(Math.random() * 40) + 1;
        const message = `Your token number is: ${token}`;

        modal.querySelector('.modal-content').style.display = 'none';
        modal.querySelector('.qr-section').style.display = 'block';

        const canvas = document.getElementById('qrCanvas');
        const qr = new QRious({
            element: canvas,
            value: message,
            size: 200,
            background: 'white',
            foreground: 'black'
        });

        document.getElementById('tokenInfo').textContent = 'Scan the QR to get your token.';
    }

});
//bus payment ended

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

        // function addedBusList() {
        //     try {

        //     }
        // }

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
                document.getElementById('departureTime').value = bus.time;
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
                    time: departureTime,
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
                                <span class="route-time">${bus.time}:00 AM</span>
                            </div>
                            <div class="route">
                                <span class="dot"></span>
                                <span>${bus.to}</span>
                            </div>
                        </div>
                        
                        <div class="bus-actions">
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
                const from = document.getElementById('from')?.value || 'all';
                const to = document.getElementById('to')?.value || 'all';
                const time = document.getElementById('time')?.value || 'all';

                const filtered = buses.filter(bus => {
                    const fromMatch = from === 'all' || bus.from === from;
                    const toMatch = to === 'all' || bus.to === to;
                    const timeMatch = time === 'all' || bus.time === time;

                    return fromMatch && toMatch && timeMatch;
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

// Get the search button and results section
const searchBtn = document.querySelector('.search');
const searchResults = document.getElementById('searchResults');

// Add click event to search button
searchBtn.addEventListener('click', function () {
    // Get the selected values
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const time = document.getElementById('time').value;

    // Here you would normally make an API call or filter your data
    // For now, we'll just show the results section
    searchResults.style.display = 'block';

    // Scroll to results
    searchResults.scrollIntoView({ behavior: 'smooth' });

    // In a real app, you would populate the bus-list with actual results
    // based on the from, to, and time values
});