// ==========================================
// SECURITY: Anti Right-Click & Anti-Inspect
// ==========================================
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
        e.preventDefault();
    }
});

// ==========================================
// UI: Custom Toast Notification
// ==========================================
const toastCSS = `
    .custom-toast-container {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }
    .custom-toast {
        min-width: 280px;
        background: white;
        color: #333;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        border-left: 5px solid #4f46e5;
    }
    .custom-toast.show {
        opacity: 1;
        transform: translateY(0);
    }
    .custom-toast.success {
        border-left-color: #10b981;
    }
    .custom-toast.error {
        border-left-color: #ef4444;
    }
    .custom-toast.info {
        border-left-color: #3b82f6;
    }
    .toast-icon {
        margin-right: 12px;
        font-size: 18px;
    }
`;

// Inject CSS
const style = document.createElement('style');
style.innerHTML = toastCSS;
document.head.appendChild(style);

// Create Container
const toastContainer = document.createElement('div');
toastContainer.className = 'custom-toast-container';
document.body.appendChild(toastContainer);

// Global Toast Function
window.showToast = function(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = \`custom-toast \${type}\`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = \`<span class="toast-icon">\${icon}</span> <span>\${message}</span>\`;
    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};
