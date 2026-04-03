document.addEventListener('DOMContentLoaded', () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    // Check authentication
    if (!adminToken) {
        window.location.href = '/admin-login.html';
        return;
    }

    document.getElementById('adminName').textContent = adminUser;

    const noticesList = document.getElementById('noticesList');
    const tableLoadingState = document.getElementById('tableLoadingState');
    const tableEmptyState = document.getElementById('tableEmptyState');
    const totalNoticesEl = document.getElementById('totalNotices');
    const lastUpdateEl = document.getElementById('lastUpdate');

    const noticeModal = document.getElementById('noticeModal');
    const noticeForm = document.getElementById('noticeForm');
    const modalTitle = document.getElementById('modalTitle');
    const addNoticeBtn = document.getElementById('addNoticeBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelModalBtn = document.getElementById('cancelModal');

    let allNotices = [];
    let isEditing = false;
    let currentEditId = null;

    // --- Core Functions ---

    const fetchNotices = async () => {
        tableLoadingState.classList.remove('hidden');
        tableEmptyState.classList.add('hidden');
        noticesList.innerHTML = '';

        try {
            allNotices = await window.api.getNotices();
            renderNotices();
            updateStats();
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        } finally {
            tableLoadingState.classList.add('hidden');
        }
    };

    const renderNotices = () => {
        if (allNotices.length === 0) {
            tableEmptyState.classList.remove('hidden');
            return;
        }

        noticesList.innerHTML = '';
        allNotices.forEach(notice => {
            const date = new Date(notice.date).toLocaleDateString('en-GB');
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">${date}</td>
                <td class="px-6 py-4 text-sm font-bold text-gray-900 border-l group max-w-xs overflow-hidden text-ellipsis">${notice.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${notice.attachment ? `<a href="${notice.attachment}" target="_blank" class="text-indigo-600 hover:text-indigo-900 flex items-center font-semibold">
                        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        View File
                    </a>` : '<span class="text-gray-300 italic">No file</span>'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onclick="window.editNotice('${notice._id}')" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md transition-colors">Edit</button>
                    <button onclick="window.deleteNotice('${notice._id}')" class="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors">Delete</button>
                </td>
            `;
            noticesList.appendChild(row);
        });
    };

    const updateStats = () => {
        totalNoticesEl.textContent = allNotices.length;
        if (allNotices.length > 0) {
            const latest = new Date(allNotices[0].updatedAt || allNotices[0].date);
            lastUpdateEl.textContent = latest.toLocaleDateString() + ' ' + latest.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };

    // --- Modal Logic ---

    const openModal = (editing = false, notice = null) => {
        isEditing = editing;
        modalTitle.textContent = editing ? 'Edit Notice' : 'Post New Notice';

        if (editing && notice) {
            currentEditId = notice._id;
            document.getElementById('title').value = notice.title;
            document.getElementById('description').value = notice.description;
            if (notice.date) {
                document.getElementById('date').value = new Date(notice.date).toISOString().split('T')[0];
            }
        } else {
            currentEditId = null;
            noticeForm.reset();
        }

        noticeModal.classList.remove('hidden');
        document.body.classList.add('modal-active');
    };

    const closeModal = () => {
        noticeModal.classList.add('hidden');
        document.body.classList.remove('modal-active');
    };

    // --- Event Listeners ---

    addNoticeBtn.addEventListener('click', () => openModal(false));
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    noticeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(noticeForm);

        try {
            if (isEditing) {
                await window.api.updateNotice(currentEditId, formData, adminToken);
                showToast('Notice updated successfully!');
            } else {
                await window.api.createNotice(formData, adminToken);
                showToast('Notice posted successfully!');
            }
            closeModal();
            fetchNotices();
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin-login.html';
    });

    // --- Global Helpers for table buttons ---

    window.editNotice = (id) => {
        const notice = allNotices.find(n => n._id === id);
        if (notice) openModal(true, notice);
    };

    window.deleteNotice = async (id) => {
        if (confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
            try {
                await window.api.deleteNotice(id, adminToken);
                showToast('Notice deleted successfully');
                fetchNotices();
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
    };

    // --- Toast Notification ---
    const showToast = (message, type = 'success') => {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMessage');

        toastMsg.textContent = message;
        toast.className = `fixed bottom-5 right-5 z-[60] px-6 py-4 rounded-2xl shadow-2xl flex items-center transition-all duration-300 transform translate-y-0 opacity-100 ${type === 'success' ? 'bg-indigo-900 border-indigo-500 text-white' : 'bg-red-900 border-red-500 text-white'}`;

        setTimeout(() => {
            toast.className = 'fixed bottom-5 right-5 z-[60] bg-gray-900 border border-gray-800 text-white px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform translate-y-20 opacity-0 flex items-center';
        }, 3000);
    };

    // Initial load
    fetchNotices();
});
