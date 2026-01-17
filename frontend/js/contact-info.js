// Contact Information Configuration
const CONTACT_INFO = {
    email: 'ravinonline23@gmail.com',
    phone: '+918839540925',
    whatsapp: '918839540925', // Without + for WhatsApp API
    github: 'https://github.com/ravin2313'
};

// Update all contact links on page load
document.addEventListener('DOMContentLoaded', function() {
    updateContactLinks();
});

function updateContactLinks() {
    // Update email links
    document.querySelectorAll('a[href*="info@thebinary.com"], a[href*="admin@thebinary.com"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('mailto:')) {
            link.setAttribute('href', `mailto:${CONTACT_INFO.email}`);
            if (link.textContent.includes('@')) {
                link.textContent = CONTACT_INFO.email;
            }
        }
    });
    
    // Update phone links
    document.querySelectorAll('a[href*="tel:"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('XXXXXXXXXX') || href.includes('91XXXXXXXXXX')) {
            link.setAttribute('href', `tel:${CONTACT_INFO.phone}`);
            if (link.textContent.includes('XXXX')) {
                link.textContent = CONTACT_INFO.phone;
            }
        }
    });
    
    // Update WhatsApp links
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        const href = link.getAttribute('href');
        const urlParams = new URLSearchParams(href.split('?')[1]);
        const text = urlParams.get('text') || 'Hi, I\'m interested in TheBinary projects';
        link.setAttribute('href', `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(text)}`);
    });
    
    // Update text content showing phone numbers
    document.querySelectorAll('p, span, div').forEach(element => {
        if (element.textContent.includes('+91 XXXXXXXXXX')) {
            element.textContent = element.textContent.replace('+91 XXXXXXXXXX', CONTACT_INFO.phone);
        }
    });
}

// Function to get WhatsApp link with custom message
function getWhatsAppLink(message = '') {
    const defaultMessage = 'Hi, I\'m interested in TheBinary projects';
    const text = message || defaultMessage;
    return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
}

// Function to get email link with subject
function getEmailLink(subject = '', body = '') {
    let link = `mailto:${CONTACT_INFO.email}`;
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    if (params.length > 0) link += '?' + params.join('&');
    return link;
}
