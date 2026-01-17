// WhatsApp Floating Button - Simple and Direct
(function() {
    console.log('WhatsApp Float Script Loading...');
    
    function createWhatsAppButton() {
        console.log('Creating WhatsApp button...');
        
        // Check if button already exists
        if (document.querySelector('.whatsapp-float')) {
            console.log('WhatsApp button already exists');
            return;
        }
        
        // Create the HTML
        const html = `
            <div class="whatsapp-float">
                <a href="https://wa.me/918839540925?text=Hi%2C%20I'm%20interested%20in%20TheBinary%20projects" 
                   class="whatsapp-button" 
                   target="_blank"
                   aria-label="Chat on WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                </a>
                <div class="whatsapp-tooltip">Chat with us on WhatsApp</div>
            </div>
        `;
        
        // Insert at end of body
        document.body.insertAdjacentHTML('beforeend', html);
        console.log('WhatsApp button created successfully!');
    }
    
    // Try multiple times to ensure it loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWhatsAppButton);
    } else {
        createWhatsAppButton();
    }
    
    // Also try after a delay as backup
    setTimeout(createWhatsAppButton, 500);
})();

