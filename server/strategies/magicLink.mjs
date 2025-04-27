import passport from 'passport'
import MagicLink from 'passport-magic-link'

import Users from '../models/users.mjs'
import {} from 'dotenv/config'

const MagicLinkStrategy = MagicLink.Strategy

// set the email parameters up
let defaultClient = brevo.ApiClient.instance

let apiKey = defaultClient.authentications['api-key']

let apiInstance = new brevo.TransactionalEmailsApi()

apiKey.apiKey = process.env.BREVO_API_KEY

let sendSmtpEmail = new brevo.SendSmtpEmail()



passport.use(
  new MagicLinkStrategy(
    {
      secret: 'keyboard cat',
      userFields: ['email','isNative'],
      tokenField: 'token',
      verifyUserAfterToken: true,
    },
    function send(user, token) {
      console.log(typeof(user.isNative))
      var link = user.isNative === "true"
        ? 'https://api.sahelimmo.info/auth/login/email/app?token=' + token
        : 'https://api.sahelimmo.info/auth/login/email/verify?token=' + token



        sendSmtpEmail.subject = 'Connectez-vous sur Sahel Immo!'
       sendSmtpEmail.htmlContent =
       '<h3>Salut!</h3><p> Cliquez le lien ci-dessous pour vous connecter sur Sahel Immo.</p><p><a href="' +
       link +
       '">Connectez-vous</a></p>',
       sendSmtpEmail.sender = {
         name: 'Sahel Immo',
         email: process.env.SENDER_EMAIL,
       }
       sendSmtpEmail.to = [{ email: user.email }]
       sendSmtpEmail.replyTo = {
         email: process.env.SENDER_EMAIL,
         name: 'Solitdio',
       }

       apiInstance.sendTransacEmail(sendSmtpEmail).then(
         function (data) {
           console.log(
             'API called successfully. Returned data: ' + JSON.stringify(data)
           )
         },
         function (error) {
           console.error(error)
         }
       )
     
    },
    async function verify(user) {
      try {
        const check = await Users.findOne({ email: user.email })
        if (!check) {
          const newUser = new Users({ email: user.email })
          await newUser.save()
          return new Promise(function (resolve, reject) {
            return resolve(newUser)
          })
        }
        return new Promise(function (resolve, reject) {
          return resolve(check)
        })
      } catch (error) {
        return new Promise(function (resolve, reject) {
          return reject(error.message)
        })
      }
    }
  )
)
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    if (user.notifUrl) {
        cb(null, {
         _id: user._id,
         email: user.email,
         fullName: user.fullName,
          notifUrl: user.notifUrl.endpoint,
          phone: user.phone || null,
         isAdmin: user.isAdmin || false,
         isVerified: user.isVerified || false,
         userType: user.userType || 'visitor',
        })
      return 
    }
    cb(null, user)
     
  })
    
})

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    //console.log(user)
    return cb(null, user)
  })
})
