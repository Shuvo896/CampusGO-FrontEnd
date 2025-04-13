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


// Notice add remove

document.addEventListener('DOMContentLoaded', function() {
  // Initialize based on current page
  if (document.querySelector('.add-notice')) setupNoticeEditor();
  if (document.querySelector('.notices')) displayNotices();
});

function setupNoticeEditor() {
  const modal = document.getElementById('noticeModal');
  const editor = document.getElementById('noticeEditor');
  const noticesList = document.querySelector('.notices-list');
  
  // Event handlers
  document.querySelector('.add-notice').addEventListener('click', () => {
      modal.style.display = 'block';
      editor.focus();
      loadNoticesForManagement();
  });
  
  document.querySelector('.close').addEventListener('click', closeModal);
  window.addEventListener('click', e => e.target === modal && closeModal());
  
  // Text editor
  document.querySelectorAll('[data-command]').forEach(btn => {
      btn.addEventListener('click', function() {
          document.execCommand(this.dataset.command, false, this.value || this.dataset.value);
          editor.focus();
      });
  });
  
  // Notice actions
  document.querySelector('.submit-notice').addEventListener('click', publishNotice);
  document.querySelector('.clear-notices').addEventListener('click', clearAllNotices);
  document.querySelector('.delete-selected').addEventListener('click', deleteSelectedNotices);
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
          document.querySelectorAll('.tab-btn, .tab-content').forEach(el => 
              el.classList.remove('active'));
          this.classList.add('active');
          document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
      });
  });
  
  function closeModal() {
      modal.style.display = 'none';
      editor.innerHTML = '';
  }
  
  function publishNotice() {
      if (!editor.innerHTML.trim()) return alert('Please write something!');
      
      const notices = JSON.parse(localStorage.getItem('notices')) || [];
      notices.push({
          content: editor.innerHTML,
          date: new Date().toLocaleString(),
          id: Date.now()
      });
      
      localStorage.setItem('notices', JSON.stringify(notices));
      closeModal();
      alert('Notice published!');
      refreshNotices();
  }
  
  function clearAllNotices() {
      if (confirm('Delete ALL notices?')) {
          localStorage.removeItem('notices');
          refreshNotices();
          alert('All notices cleared.');
      }
  }
  
  function deleteSelectedNotices() {
      const selected = document.querySelectorAll('.notice-item input:checked');
      if (!selected.length) return alert('Select notices to delete');
      
      if (confirm(`Delete ${selected.length} notice(s)?`)) {
          const notices = JSON.parse(localStorage.getItem('notices')) || [];
          const ids = Array.from(selected).map(el => parseInt(el.dataset.id));
          const updated = notices.filter(n => !ids.includes(n.id));
          
          localStorage.setItem('notices', JSON.stringify(updated));
          refreshNotices();
      }
  }
  
  function loadNoticesForManagement() {
      const notices = JSON.parse(localStorage.getItem('notices')) || [];
      noticesList.innerHTML = notices.length ? 
          notices.reverse().map(n => `
              <div class="notice-item">
                  <input type="checkbox" data-id="${n.id}">
                  <div class="notice-preview">
                      ${n.content}
                      <div class="notice-date">${n.date}</div>
                  </div>
              </div>
          `).join('') : '<p>No notices yet</p>';
  }
  
  function refreshNotices() {
      if (document.querySelector('.notices')) displayNotices();
      if (noticesList) loadNoticesForManagement();
  }
}

function displayNotices() {
  const container = document.querySelector('.notices');
  const notices = JSON.parse(localStorage.getItem('notices')) || [];
  
  container.innerHTML = notices.length ? 
      notices.reverse().map(n => `
          <div class="notice-card">
              <div class="notice-date">${n.date}</div>
              <div class="notice-content">${n.content}</div>
          </div>
      `).join('') : '<p>No notices yet</p>';
}