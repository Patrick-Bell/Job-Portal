const swiper = new Swiper('.swiper', {
    autoplay: true,
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
  });


  const accordianHeader = document.querySelectorAll('.accordian-header');
  const accordianDesc = document.querySelectorAll('.accordian-desc');
  const plusIcon = document.querySelectorAll('.fa-plus')

  function accordionMenu() {
    accordianHeader.forEach((accordion, index) => {
        accordion.addEventListener("click", () => {
            // Toggle active class for accordion description
            accordianDesc[index].classList.toggle('active');
            
            plusIcon[index].classList.toggle('fa-minus');
            
            // Add back fa-plus class when accordion is collapsed
            if (accordianDesc[index].classList.contains('active')) {
                plusIcon[index].classList.remove('fa-plus')
                plusIcon[index].classList.add('fa-minus');
            } else {
                plusIcon[index].classList.add('fa-plus')
                plusIcon[index].classList.remove('fa-minus');
            }
        });
    });
}

  
  accordionMenu()




  const scrolls = document.querySelectorAll('.scroll-click');
  const menuContent = document.querySelector('.menu-bar');
  const viewMenu = document.querySelectorAll('.view-flex');
  const subMenu = document.querySelectorAll('.menu-hidden');
  const arrowIcons = document.querySelectorAll('.fa-arrow-down');
  const menu = document.querySelector('.menu');
  const closeMenu = document.querySelector('.fa-x')
  
  // Set up event listeners for menu items

   // Set up event listener for menu toggle
   menu.addEventListener("click", () => {
    menuContent.classList.toggle('active');
    console.log('clicking menu icon')
});


  function setUpMenuListeners() {
    viewMenu.forEach((view, index) => {
        view.addEventListener("click", () => {
            subMenu[index].classList.toggle('active');
            arrowIcons[index].classList.toggle('rotate');
        })
    })
}
  
  // Set up event listener for scroll clicks
  scrolls.forEach(scroll => {
      scroll.addEventListener("click", () => {
          console.log('clicked');
          menuContent.classList.toggle('active');
      });
  });
  

  closeMenu.addEventListener("click", () => {
    menuContent.classList.toggle('active')
  })



  const toTopIcon = document.querySelector('.back-to-top')
  toTopIcon.addEventListener("click", () => {
    console.log('clicked icon')
    scrollTo({
        top: 0,
        behavior: 'smooth'
    })
  })


  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show'); // Add .show class when element is intersecting
        } 
    });
});

const hiddenUp = document.querySelectorAll('.hidden-up')
const hiddenRight = document.querySelectorAll('.hidden-right')
const hiddenLeft = document.querySelectorAll('.hidden-left')
hiddenUp.forEach((el) => observer.observe(el))
hiddenRight.forEach((el) => observer.observe(el))
hiddenLeft.forEach((el) => observer.observe(el))


  const referralPrize = document.querySelector('.referralvalue')
  let interval = 10000
  let startValue = 0
  let endValueString = referralPrize.getAttribute('data-value')

  let endValue = parseFloat(endValueString)

  console.log(endValue)

  let duration = Math.floor(interval / endValue)
  let counter = setInterval(function() {
    startValue += 1;
    referralPrize.textContent = '£' + startValue
    if (startValue === endValue) {
        clearInterval(counter)
    }
  }, duration)


  function generateRandomId() {
    min = 1;
    max = 1000000

    const randomId = Math.floor(Math.random() * (max - min + 1) + min)

    return randomId.toString()
}



const referralApplicationForm = document.querySelector('.refer-application');
const submitReferral = document.getElementById('submit-referral')
const referBtn = document.getElementById('refer-btn')
const closeReferralBtn = document.getElementById('close-referral')

referBtn.addEventListener("click", () => {
    referralApplicationForm.style.display = "block"
})

closeReferralBtn.addEventListener("click", () => {
    referralApplicationForm.style.display = "none"
})


submitReferral.addEventListener("click", async () => {
    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const referralName = document.getElementById('referral-name').value.trim();
    const referralEmail = document.getElementById('referral-email').value.trim();
    const referralNumber = document.getElementById('referral-number').value.trim();

    // Validate form fields
    if (name.length < 1 || email.length < 1 || referralName.length < 1 || referralEmail.length < 1 || referralNumber.length < 1) {
        alert('Please fill out all required fields.');

        // Add the 'shake' class to trigger the animation
        submitReferral.classList.add('shake');

        // Remove the 'shake' class after a delay to reset the animation
        setTimeout(() => {
            submitReferral.classList.remove('shake');
        }, 500); // Adjust the delay (in milliseconds) as needed

        return; // Exit function if any field is empty
    }

    // Additional validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !emailRegex.test(referralEmail)) {
        alert('Please enter a valid email address.');

        // Add the 'shake' class to trigger the animation
        submitReferral.classList.add('shake');

        // Remove the 'shake' class after a delay to reset the animation
        setTimeout(() => {
            submitReferral.classList.remove('shake');
        }, 500); // Adjust the delay (in milliseconds) as needed

        return; // Exit function if email format is invalid
    }

    const phoneRegex = /^(?:(?:\+|00)44|0)7\d{9}$/;
    if (!phoneRegex.test(referralNumber)) {
        alert('Plese enter a valid phone number');
        submitReferral.classList.add('shake');

        setTimeout(() => {
            submitReferral.classList.remove('shake')
        }, 500);

        return;
    }


    const referral = {
        id: generateRandomId(),
        userName: name,
        userEmail: email,
        referralName: referralName,
        referralEmail: referralEmail,
        referralNumber: referralNumber
    };

    try {
        const res = await axios.post('/api/referral', referral); // Await the axios POST request
        if (res.status === 200) {
            console.log('Referral successfully submitted:', referral);
            console.log('Response:', res.data);
            resetForm();
        } else {
            console.error('Failed to submit referral. Status:', res.status);
        }
    } catch (error) {
        console.error('Error submitting referral:', error);
    }
});

function resetForm() {
    // Reset form fields
    document.getElementById('user-name').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('referral-name').value = '';
    document.getElementById('referral-email').value = '';
    document.getElementById('referral-number').value = '';

    // Display success message
    const referText1 = document.getElementById('refer-text-1');
    const referText2 = document.getElementById('refer-text-2');
    referText1.textContent = "Thank you for your referral!";
    referText2.textContent = "We will be in touch if your referral is a successful placement. Please keep an eye on the email you provided.";

    // Reset message after a delay
    setTimeout(() => {
        referText1.textContent = 'REFER A FRIEND TO US';
        referText2.textContent = 'Every month, we reward many people for recommending a friend to us. Refer a friend today, and if we place them, you can earn up to £1,000';
    }, 5000);

    // Scroll to the form section
    const referralApplicationForm = document.querySelector('.refer-application');
    referralApplicationForm.style.display = "none"; // Hide the form section


    const referralSection = document.getElementById('referral-scroll')
    referralSection.scrollIntoView({ behavior: 'smooth' });

    // Set up menu listeners (if needed)
    setUpMenuListeners();
}


















const submitMessageBtn = document.querySelector('.send-message-btn');

function checkValidation() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('message').value;

    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length > 5 && message.length > 20 && emailRegex.test(email)) {
        submitMessageBtn.removeAttribute('disabled');
        submitMessageBtn.style.cursor = 'not-allowed'
    } else {
        submitMessageBtn.setAttribute('disabled', 'disabled');
        submitMessageBtn.style.cursor = 'pointer'
    }
}

// Add input event listeners to form fields
document.getElementById('name').addEventListener('input', checkValidation);
document.getElementById('contact-email').addEventListener('input', checkValidation);
document.getElementById('message').addEventListener('input', checkValidation);

// Initial validation check on page load
checkValidation();


submitMessageBtn.addEventListener("click", async () => {
    
    console.log('clicking')
    const name = document.getElementById('name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('message').value;

    // Check if any of the form fields are empty
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
        alert('Please fill out all required fields.');
        return; // Prevent further execution of the function
    }

    submitMessageBtn.classList.add('effect1');

    const contactMessage = {
        id: generateRandomId(),
        name: name,
        email: email,
        message: message,
        responded: 'no'
    };

    console.log(contactMessage);

    try {
        const res = await axios.post('/api/messages', contactMessage);
        console.log(res); // Log the entire response object

        if (res.status === 200) {
            console.log('data sent successfully', contactMessage);
            console.log(res.data);

            setTimeout(() => {
                submitMessageBtn.classList.remove('effect1');
                submitMessageBtn.classList.add('effect2');
                removeContactForm();
                console.log('adding effect2');
                
                setTimeout(() => {
                    submitMessageBtn.classList.remove('effect2');
                    console.log('removing effect2');
                }, 3000); // Remove effect2 after 3 seconds
            }, 2000); // Remove effect1 after 2 seconds
            
            // Re-enable the button if it was disabled during form validation
        }

    } catch (error) {
        console.log(error);
        submitMessageBtn.classList.remove('effect1')
        submitMessageBtn.classList.add('effect3')
    }
});



function removeContactForm() {
    document.getElementById('name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('message').value = '';
}











/// Get DOM elements
const eventEmail = document.getElementById('event-email');
const eventBtn = document.getElementById('event-btn');
const emailValidationText = document.querySelector('.email-valid');

// Function to check email validation
function checkEmailValidation() {
    const emailInput = eventEmail.value.trim(); // Get the trimmed value of the email input

    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const correctEmail = emailRegex.test(emailInput);

    console.log(correctEmail);

    if (correctEmail) {
        // Enable the button if the email is valid
        eventBtn.removeAttribute('disabled');
        eventBtn.style.background = '#262F4C'
    } else {
        // Disable the button and show validation message if the email is invalid
        eventBtn.setAttribute('disabled', 'disabled');
        eventBtn.style.background = 'red'

    }
}

// Add input event listener to the email input field
eventEmail.addEventListener('input', checkEmailValidation);




const registerEventInterestBtn = document.getElementById('event-btn')

registerEventInterestBtn.addEventListener('click', async () => {
    const eventEmail = document.getElementById('event-email').value

        const event = {
            id: generateRandomId(),
            email: eventEmail,
        }

    try{
        const res = await axios.post('/api/events', event)
        if (res.status === 200) {
            console.log('interest registered', event)
            console.log('sent', res.data)
            resetEventForm()
            checkEmailValidation()

            registerEventInterestBtn.innerHTML = 'Saving to the DB.'
            registerEventInterestBtn.style.background = 'green'


            setTimeout(() => {
                registerEventInterestBtn.innerHTML = 'Register interest'
                registerEventInterestBtn.style.background = 'red'
            }, 3000);

        } else {
            console.log('error')
        }
    }catch(error){
        console.error(error)
        console.log(error)
    }
})

function resetEventForm() {
    document.getElementById('event-email').value = ''
}


const loginModal = document.getElementById('staticBackdrop');
const toLogin = new bootstrap.Modal(loginModal);
const loginScroll = document.getElementById('login-scroll');

loginScroll.addEventListener('click', () => {
    toLogin.show()
})















document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const toastLiveExample = document.getElementById('loginToast');
    const toastBootstrap = new bootstrap.Toast(toastLiveExample); // Initialize Bootstrap toast

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed'); // Throw an error if login is unsuccessful
            }

            // Login successful logic (redirect, display success message, etc.)
            window.location.href = '/admin'; // Redirect to home page upon successful login
        } catch (error) {
            console.error('Login Error:', error);
            toastLiveExample.querySelector('.toast-body').textContent = 'Your credentials are incorrect. Please try again.'; // Update toast message
            toastBootstrap.show(); // Display the toast notification

            // Clear the form inputs (optional)
            loginForm.reset();
        } finally {
            // Close the login modal
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
            modalInstance.hide();
        }
    });
});



setUpMenuListeners()