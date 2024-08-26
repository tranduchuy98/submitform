let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)


document.addEventListener("DOMContentLoaded", function() {
  let el = document.getElementById('comment')

  if (!iOS) {
    el.focus()
  }
  el.addEventListener('click', onTextClick)
  el.addEventListener('focus', () => {
    window.scrollTop()
  })
})

function onTextClick() {
  let el = document.getElementsByClassName('title')[0],
    top = window.scrollY + el.getBoundingClientRect().top

  if (iOS) {
    top++
  }

  setTimeout(() => {
    fnc_scrollto(top)
  }, 150)
}

function fnc_scrollto(to) {
  let smoothScrollFeature = 'scrollBehavior' in document.documentElement.style,
    i = parseInt(window.pageYOffset)

  if ( i != to ) {
    if (!smoothScrollFeature) {
      to = parseInt(to);
      if (i < to) {
        let int = setInterval(function() {
          if (i > (to-20)) i += 1
          else if (i > (to-40)) i += 3
          else if (i > (to-80)) i += 8
          else if (i > (to-160)) i += 18
          else if (i > (to-200)) i += 24
          else if (i > (to-300)) i += 40
          else i += 60
          window.scroll(0, i)
          if (i >= to) clearInterval(int)
        }, 15)
      }
      else {
        let int = setInterval(function() {
          if (i < (to+20)) i -= 1
          else if (i < (to+40)) i -= 3
          else if (i < (to+80)) i -= 8
          else if (i < (to+160)) i -= 18
          else if (i < (to+200)) i -= 24
          else if (i < (to+300)) i -= 40
          else i -= 60
          window.scroll(0, i)
          if (i <= to) clearInterval(int)
        }, 15)
      }
    }
    else {
      window.scroll({
        top: to,
        behavior: 'smooth'
      })
    }
  }
}

function clearContact() {
  document.getElementById('contact').value = ''
}

function submitForm(e, form) {
  e.preventDefault()

  let contact = form.contact.value,
    comment = form.comment.value,
    errList = document.getElementsByClassName('error-msg'),
    btn = document.getElementsByClassName('btn-submit'),
    isEnLang = window.location.pathname.includes('/en')

  if (!validateComment(comment)) {
    errList[0].classList.add('show')
    return false
  }
  errList[0].classList.remove('show')

  errList[1].classList.remove('show')

  btn[0].classList.add('loading')

  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

// const raw = JSON.stringify({
//       scr: getParameterByName('scr'),
//       staffName: form.service.value,
//       tableNumber: form.table.value,
//       lang: isEnLang ? 'en' : 'vi',
//       comment,
//       contact,
//       date: Date()
//     })
// const requestOptions = {
//   method: "POST",
//   headers: myHeaders,
//   body: raw,
//   redirect: "follow"
// };

// fetch("http://localhost:8080/auth/submitForm", requestOptions)
//   .then((response) => {
//     console.log("huytd11");
//     console.log(response);
//   })
//   .then((result) => {
//      console.log("huytd");
//      console.log(result);
    // if (result.code != 200) {
    //   if (isEnLang) {
    //               handleSubmitError({ message: 'Link is expired or invalid, please scan the QR code for the latest link.' })
    //               return
    //             }
    //             handleSubmitError({ message: 'Liên kết đã hết hạn hoặc không hợp lệ, vui lòng quét lại mã QR để lấy liên kết mới nhất.' })
    //             return
    // } else {
    //   btn[0].classList.remove('loading')
    //   let pathname = window.location.pathname.split('/en')[0]

    //   if (isEnLang) {
    //     window.location.href = pathname + '/success/en'
    //     return
    //   }
    //   window.location.href = pathname + 'success'
    // }
//   })
//   .catch((error) => console.error(error));

  fetch('http://localhost:8080/auth/submitForm', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      scr: getParameterByName('scr'),
      staffName: form.service.value,
      tableNumber: form.table.value,
      lang: isEnLang ? 'en' : 'vi',
      comment,
      contact,
      date: Date()
    })
  }).then(function(response) {
    response.json()
      .then(json => {
  if (json.code != 200) {
      if (isEnLang) {
                  handleSubmitError({ message: 'Link is expired or invalid, please scan the QR code for the latest link.' })
                  return
                }
                handleSubmitError({ message: 'Liên kết đã hết hạn hoặc không hợp lệ, vui lòng quét lại mã QR để lấy liên kết mới nhất.' })
                return
    } else {
      btn[0].classList.remove('loading')
      let pathname = window.location.pathname.split('/en')[0]

      if (isEnLang) {
        window.location.href = pathname + '/success/en'
        return
      }
      window.location.href = "file:///Users/huytran/Desktop/form/success.html"
    }
      })
      .catch(handleSubmitError)
  }).catch(handleSubmitError)
}

function handleSubmitError(err) {
  console.error(err.message)

  document.getElementsByClassName('btn-submit')[0].classList.remove('loading')
  document.getElementById('common-error').innerText = err.message
  document.getElementById('common-error').classList.add('show')
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')

  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)

  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function validateComment(comment) {
  return comment.length > 0
}

function validateContact(contact) {
  return validatePhone(contact) || validateEmail(contact)
}

function validatePhone(phone) {
  if (phone.match(/[a-zA-Z@.]/g)) {
    return false
  }
  let matchs = phone.match(/[0-9]/g) || []
  return matchs.length === 10 || matchs.length === 11
}

function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function redirectToVNLang() {
  let scr = getParameterByName('scr'),
    pathname = window.location.pathname,
    newPath = pathname.split('/')

  newPath.pop()
  if (newPath[newPath.length - 1] == 'en') {
    newPath.pop()
  }
  window.location.href = `${newPath.join('/')}/`
}

function redirectToENLang() {
  let scr = getParameterByName('scr'),
    pathname = window.location.pathname

  window.location.href = `${pathname}/`
}
