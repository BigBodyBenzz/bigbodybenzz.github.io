
var params = new URLSearchParams(window.location.search);

document.querySelector(".login").addEventListener('click', () => {
    toHome();document.addEventListener('DOMContentLoaded', function() {
    // Create stars background
    createStarsBackground();
    
    // Initialize selectors and tabs
    initializeSelectors();
    initializeTabs();
    initializeFormElements();
    initializeUpload();
    
    // Add smooth scrolling
    addSmoothScrolling();
});

// Stars background creation
function createStarsBackground() {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;
    
    function createStars() {
        // Clear existing stars
        starsContainer.innerHTML = '';
        
        // Number of stars based on screen size
        const starCount = Math.floor((window.innerWidth * window.innerHeight) / 1000);
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            const left = Math.floor(Math.random() * window.innerWidth);
            const top = Math.floor(Math.random() * window.innerHeight);
            
            // Random size (slightly larger range for more variety)
            const size = 0.5 + Math.random() * 2.5;
            
            // Random animation duration
            const duration = 2 + Math.random() * 8;
            
            // Random animation delay
            const delay = Math.random() * 10;
            
            // Some stars will be brighter
            const opacity = 0.5 + Math.random() * 0.5;
            
            star.style.left = `${left}px`;
            star.style.top = `${top}px`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${delay}s`;
            star.style.opacity = opacity;
            
            starsContainer.appendChild(star);
        }
    }
    
    // Initial creation
    createStars();
    
    // Recreate on resize (with debounce)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createStars, 200);
    });
}

// Initialize dropdown selectors
function initializeSelectors() {
    const selectors = document.querySelectorAll('.selector-box');
    if (!selectors.length) return;
    
    selectors.forEach(selector => {
        selector.addEventListener('click', () => {
            selector.classList.toggle('selector-open');
        });
        
        // Close selector when clicking outside
        document.addEventListener('click', (event) => {
            if (!selector.contains(event.target)) {
                selector.classList.remove('selector-open');
            }
        });
        
        // Set selected option
        const options = selector.querySelectorAll('.selector-option');
        const selectedText = selector.querySelector('.selected-text');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                selectedText.innerHTML = option.innerHTML;
                selector.dataset.value = option.id;
                selector.classList.remove('error-shown');
            });
        });
    });
}

// Initialize tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize form elements
function initializeFormElements() {
    // Guide section toggle
    const guideHolder = document.querySelector('.guide-holder');
    if (guideHolder) {
        guideHolder.addEventListener('click', () => {
            guideHolder.classList.toggle('unfolded');
        });
    }
    
    // Form input focus effects
    const inputHolders = document.querySelectorAll('.input-holder');
    inputHolders.forEach(holder => {
        const input = holder.querySelector('.input');
        if (!input) return;
        
        input.addEventListener('focus', () => {
            holder.classList.remove('error-shown');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                holder.classList.add('empty');
            } else {
                holder.classList.remove('empty');
            }
        });
    });
    
    // Date inputs
    const dateInputs = document.querySelectorAll('.date-input');
    if (dateInputs.length) {
        const dateContainer = document.querySelector('.date');
        
        dateInputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (dateContainer) {
                    dateContainer.classList.remove('error-shown');
                }
            });
            
            // Auto-tab through date inputs
            input.addEventListener('input', function() {
                if (this.value.length >= parseInt(this.getAttribute('maxlength') || 2)) {
                    const nextInput = this.nextElementSibling;
                    if (nextInput && nextInput.classList.contains('date-input')) {
                        nextInput.focus();
                    }
                }
            });
        });
    }
}

// Initialize file upload functionality
function initializeUpload() {
    const uploadArea = document.querySelector('.upload');
    if (!uploadArea) return;
    
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    
    uploadArea.addEventListener('click', () => {
        imageInput.click();
        uploadArea.classList.remove('error-shown');
    });
    
    imageInput.addEventListener('change', (event) => {
        if (!event.target.files.length) return;
        
        const file = event.target.files[0];
        if (!file.type.match('image.*')) {
            uploadArea.classList.add('error-shown');
            return;
        }
        
        uploadArea.classList.add('upload-loading');
        uploadArea.classList.remove('upload-loaded');
        
        // Read file as data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            // When image is loaded, update the UI
            uploadArea.classList.remove('upload-loading');
            uploadArea.classList.add('upload-loaded');
            
            const uploadedImage = uploadArea.querySelector('.upload-uploaded');
            if (uploadedImage) {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = 'block';
            }
            
            uploadArea.dataset.uploaded = 'true';
        };
        
        reader.readAsDataURL(file);
    });
}

// Add smooth scrolling to form errors
function addSmoothScrolling() {
    document.addEventListener('submit', function(e) {
        const form = e.target;
        
        // Validate form
        const requiredInputs = form.querySelectorAll('input[required]');
        let hasErrors = false;
        let firstError = null;
        
        requiredInputs.forEach(input => {
            const holder = input.closest('.input-holder') || input.closest('.date') || input.closest('.upload');
            
            if (!input.value.trim()) {
                holder.classList.add('error-shown');
                hasErrors = true;
                
                if (!firstError) {
                    firstError = holder;
                }
            } else {
                holder.classList.remove('error-shown');
            }
        });
        
        if (hasErrors) {
            e.preventDefault();
            
            // Smooth scroll to first error
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth',
                    block:
});

var welcome = "Dzień dobry!";

var hours = new Date().getHours();
if (hours >= 18 || hours < 4){
    welcome = "Dobry wieczór!"
}
document.querySelector(".welcome").innerHTML = welcome;

function toHome(){
    location.href = '/home?' + params;
}

var input = document.querySelector(".password_input");
input.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        document.activeElement.blur();
    }
})

var dot = "•";
var original = "";
var eye = document.querySelector(".eye");

input.addEventListener("input", () => {
    var value = input.value.toString();
    var char = value.substring(value.length - 1);
    if (value.length < original.length){
        original = original.substring(0, original.length - 1);
    }else{
        original = original + char;
    }

    if (!eye.classList.contains("eye_close")){
        var dots = "";
        for (var i = 0; i < value.length - 1; i++){
            dots = dots + dot
        }
        input.value = dots + char;
        delay(3000).then(() => {
            value = input.value;
            if (value.length != 0){
                input.value = value.substring(0, value.length - 1) + dot
            }
        });
        console.log(original)
    }
})

function delay(time, length) {
    return new Promise(resolve => setTimeout(resolve, time));
}
document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.getElementById('stars-container');
    
    // Create stars
    function createStars() {
        // Clear existing stars
        starsContainer.innerHTML = '';
        
        // Number of stars based on screen size
        const starCount = Math.floor((window.innerWidth * window.innerHeight) / 1000);
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            const left = Math.floor(Math.random() * window.innerWidth);
            const top = Math.floor(Math.random() * window.innerHeight);
            
            // Random size
            const size = Math.random() * 2;
            
            // Random animation duration
            const duration = 2 + Math.random() * 8;
            
            // Random animation delay
            const delay = Math.random() * 10;
            
            star.style.left = `${left}px`;
            star.style.top = `${top}px`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(star);
        }
    }
    
    // Initial creation
    createStars();
    
    // Recreate on resize
    window.addEventListener('resize', createStars);
});

eye.addEventListener('click', () => {
    var classlist = eye.classList;
    if (classlist.contains("eye_close")){
        classlist.remove("eye_close");
        var dots = "";
        for (var i = 0; i < input.value.length - 1; i++){
            dots = dots + dot
        }
        input.value = dots;
    }else{
        classlist.add("eye_close");
        input.value = original;
    }
})
