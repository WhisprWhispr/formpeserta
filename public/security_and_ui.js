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
(function() {
    var toastCSS = [
        '.custom-toast-container {',
        '    position: fixed;',
        '    bottom: 20px;',
        '    left: 50%;',
        '    transform: translateX(-50%);',
        '    z-index: 9999;',
        '    display: flex;',
        '    flex-direction: column;',
        '    gap: 10px;',
        '    align-items: center;',
        '}',
        '.custom-toast {',
        '    min-width: 280px;',
        '    background: white;',
        '    color: #333;',
        '    padding: 16px 20px;',
        '    border-radius: 8px;',
        '    box-shadow: 0 10px 25px rgba(0,0,0,0.2);',
        '    display: flex;',
        '    align-items: center;',
        '    opacity: 0;',
        '    transform: translateY(20px);',
        '    transition: opacity 0.3s ease, transform 0.3s ease;',
        '    font-family: Inter, sans-serif;',
        '    font-size: 14px;',
        '    font-weight: 500;',
        '    border-left: 5px solid #4f46e5;',
        '}',
        '.custom-toast.show {',
        '    opacity: 1;',
        '    transform: translateY(0);',
        '}',
        '.custom-toast.success { border-left-color: #10b981; }',
        '.custom-toast.error   { border-left-color: #ef4444; }',
        '.custom-toast.info    { border-left-color: #3b82f6; }',
        '.toast-icon { margin-right: 12px; font-size: 18px; }'
    ].join('\n');

    var style = document.createElement('style');
    style.innerHTML = toastCSS;
    document.head.appendChild(style);

    var toastContainer = document.createElement('div');
    toastContainer.className = 'custom-toast-container';
    document.body.appendChild(toastContainer);

    window.showToast = function(message, type) {
        type = type || 'info';
        var toast = document.createElement('div');
        toast.className = 'custom-toast ' + type;

        var icon = 'i';
        if (type === 'success') icon = '\u2705';
        if (type === 'error')   icon = '\u274c';

        toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span>' + message + '</span>';
        toastContainer.appendChild(toast);

        setTimeout(function() { toast.classList.add('show'); }, 10);

        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() { toast.remove(); }, 300);
        }, 3500);
    };
}());
