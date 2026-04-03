document.addEventListener('DOMContentLoaded', () => {
    const noticesContainer = document.getElementById('noticesContainer');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const filterLatest = document.getElementById('filterLatest');
    const filterOldest = document.getElementById('filterOldest');

    let allNotices = [];
    let filteredNotices = [];

    // Fetch and display notices
    const fetchNotices = async () => {
        try {
            allNotices = await window.api.getNotices();
            filteredNotices = [...allNotices];
            renderNotices();
        } catch (error) {
            console.error('Error fetching notices:', error);
            noticesContainer.innerHTML = `<p class="col-span-full text-center text-red-500 font-medium py-10 px-4 bg-red-50 rounded-xl border border-red-100">${error.message}</p>`;
        } finally {
            loadingState.classList.add('hidden');
        }
    };

    // Render notices to the DOM
    const renderNotices = () => {
        if (filteredNotices.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }

        noticesContainer.innerHTML = '';
        filteredNotices.forEach(notice => {
            const date = new Date(notice.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const card = document.createElement('div');
            card.className = 'bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between';
            
            let attachmentHtml = '';
            if (notice.attachment) {
                const colors = ['bg-blue-50 text-blue-700', 'bg-indigo-50 text-indigo-700', 'bg-purple-50 text-purple-700'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                attachmentHtml = `
                    <div class="mt-6 pt-4 border-t border-gray-50">
                        <a href="${notice.attachment}" target="_blank" class="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg ${randomColor} hover:opacity-80 transition-opacity">
                            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Attachment
                        </a>
                    </div>
                `;
            }

            card.innerHTML = `
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Notice</span>
                        <span class="text-xs text-gray-400 font-medium">${date}</span>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">${notice.title}</h2>
                    <p class="text-gray-600 leading-relaxed line-clamp-4 whitespace-pre-wrap">${notice.description}</p>
                </div>
                ${attachmentHtml}
            `;
            noticesContainer.appendChild(card);
        });
    };

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        filteredNotices = allNotices.filter(notice => 
            notice.title.toLowerCase().includes(term) || 
            notice.description.toLowerCase().includes(term)
        );
        renderNotices();
    });

    // Filtering
    filterLatest.addEventListener('click', () => {
        filteredNotices.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderNotices();
    });

    filterOldest.addEventListener('click', () => {
        filteredNotices.sort((a, b) => new Date(a.date) - new Date(b.date));
        renderNotices();
    });

    // Initial fetch
    fetchNotices();
});
