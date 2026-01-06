// Main JavaScript file for Flask frontend

// Auto-hide flash messages after 5 seconds
document.addEventListener('DOMContentLoaded', function () {
    const flashMessages = document.querySelectorAll('[role="alert"]');
    flashMessages.forEach(function (message) {
        setTimeout(function () {
            message.style.opacity = '0';
            setTimeout(function () {
                message.remove();
            }, 300);
        }, 5000);
    });
});

// Utility function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(endpoint, options);
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        return null;
    }
}

// Form validation helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });

    return isValid;
}

// Export functions for global use
window.apiCall = apiCall;
window.validateForm = validateForm;

// Mobile Sidebar Toggle Logic
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-menu-close');

    if (sidebar && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('flex', 'w-full'); // Fill screen on mobile
        });
    }

    if (sidebar && closeBtn) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.add('hidden');
            sidebar.classList.remove('flex', 'w-full');
        });
    }

    // Close sidebar when clicking on a link (for mobile)
    const sidebarLinks = sidebar ? sidebar.querySelectorAll('nav a') : [];
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) { // lg breakpoint
                sidebar.classList.add('hidden');
                sidebar.classList.remove('flex', 'w-full');
            }
        });
    });
});
