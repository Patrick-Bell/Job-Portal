const swiper = new Swiper('.swiper', {
    autoplay: true,
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
  });

  const scrolls = document.querySelectorAll('.scroll-click');
  const menuContent = document.querySelector('.menu-bar');
  const viewMenu = document.querySelectorAll('.view-flex');
  const subMenu = document.querySelectorAll('.menu-hidden');
  const arrowIcons = document.querySelectorAll('.fa-arrow-down');
  const menu = document.querySelector('.menu');
  
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


submitReferral.addEventListener("click", async () => { // Add async keyword here
    const name = document.getElementById('user-name').value
    const email = document.getElementById('user-email').value
    const referralName = document.getElementById('referral-name').value
    const referralEmail = document.getElementById('referral-email').value
    const referralNumber = document.getElementById('referral-number').value

    const referral = {
        id: generateRandomId(),
        userName: name,
        userEmail: email,
        referralName: referralName,
        referralEmail: referralEmail,
        referralNumber: referralNumber,
    };

    try {
        const res = await axios.post('/api/referral', referral); // Await the axios POST request
        if (res.status === 200) {
            console.log('Referral successfully submitted', referral);
            console.log('sent', res.data);
            resetForm()
        } else {
            console.error(error);
        }
    } catch (error) {
        console.log(error);
    }
});

function resetForm() {
    const referTtext1 = document.getElementById('refer-text-1')
    const referTtext2 = document.getElementById('refer-text-2')

    document.getElementById('user-name').value = ''
    document.getElementById('user-email').value = ''
    document.getElementById('referral-name').value = ''
    document.getElementById('referral-email').value = ''
    document.getElementById('referral-number').value = ''

    referralApplicationForm.style.display = "none"

    referTtext1.innerHTML = "Thank you for your referral"
    referTtext2.innerHTML = "We will be in touch if your referral is a successul placement! Please keep an eye on the email you have provided."

    setTimeout(() => {
        referTtext1.innerHTML = 'REFER A FRIEND TO US'
        referTtext2.innerHTML = 'Every month, we rewards many people for recommending a friend to us. Refer a friend today, and if we place them, you can earn up to £1,000'
    }, 5000);

    referralApplicationForm.scrollIntoView({ behavior: 'smooth' });

    setUpMenuListeners()
}

const submitMessageBtn = document.querySelector('.send-message-btn');

function checkValidation() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name.length > 1 && message.length > 10 && email.length > 5) {
        submitMessageBtn.removeAttribute('disabled');
    } else {
        submitMessageBtn.setAttribute('disabled', 'disabled');
    }
}

document.getElementById('name').addEventListener('input', checkValidation);
document.getElementById('email').addEventListener('input', checkValidation);
document.getElementById('message').addEventListener('input', checkValidation);

checkValidation();

submitMessageBtn.addEventListener("click", async () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
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
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
}



setUpMenuListeners()