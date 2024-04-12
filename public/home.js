const swiper = new Swiper('.swiper', {
    autoplay: true,
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
  });

  function setUpMenuListeners() {
    const viewMenu = document.querySelectorAll('.view-flex');
    const subMenu = document.querySelectorAll('.menu-hidden');
    const arrowIcons = document.querySelectorAll('.fa-arrow-down')

    viewMenu.forEach((view, index) => {
        view.addEventListener("click", () => {
            subMenu[index].classList.toggle('active');
            arrowIcons[index].classList.toggle('rotate');
        })
    })
}

const menu = document.querySelector('.menu');
const menuContent = document.querySelector('.menu-bar');

menu.addEventListener("click", () => {
    menuContent.classList.toggle('active')
})

const referralApplicationForm = document.querySelector('.refer-application');
const termsAndConditionsContainer = document.querySelector('.terms-container');
const submitReferral = document.getElementById('submit-referral')
const referBtn = document.getElementById('refer-btn')
const viewTermsBtn = document.getElementById('view-terms')

referBtn.addEventListener("click", () => {
    referralApplicationForm.style.display = "block"
})

viewTermsBtn.addEventListener("click", () => {
    termsAndConditionsContainer.classList.toggle('active')
});

submitReferral.addEventListener("click", async () => { // Add async keyword here
    const name = document.getElementById('user-name').value
    const email = document.getElementById('user-email').value
    const referralName = document.getElementById('referral-name').value
    const referralEmail = document.getElementById('referral-email').value
    const referralNumber = document.getElementById('referral-number').value

    const referral = {
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

    termsAndConditionsContainer.style.display = "none"
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


setUpMenuListeners()