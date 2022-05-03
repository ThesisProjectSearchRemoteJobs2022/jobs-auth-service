const dotenv = require('dotenv');
const sendMail = require('@sendgrid/mail');


dotenv.config();
sendMail.setApiKey(process.env.SENDGRID_API_KEY);

const usersControllers = {

 emailMessage : (userEmail, userName,OfertasTrabajosList, jobOfferSearch,sandboxMode=false) => {
  
  const orders=[
    {
      title:"DESARROLLADOR WEB",
      content:"https://marketing-image-production.s3.amazonaws.com/uploads/8dda1131320a6d978b515cc04ed479df259a458d5d45d58b6b381cae0bf9588113e80ef912f69e8c4cc1ef1a0297e8eefdb7b270064cc046b79a44e21b811802.png",
      salary:"$ 79.95"
   },
   {
      title:"Old Line Sneakers",
      content:"https://marketing-image-production.s3.amazonaws.com/uploads/3629f54390ead663d4eb7c53702e492de63299d7c5f7239efdc693b09b9b28c82c924225dcd8dcb65732d5ca7b7b753c5f17e056405bbd4596e4e63a96ae5018.png",
      salary:"$ 79.95"
   },
   {
      title:"Blue Line Sneakers",
      content:"https://marketing-image-production.s3.amazonaws.com/uploads/00731ed18eff0ad5da890d876c456c3124a4e44cb48196533e9b95fb2b959b7194c2dc7637b788341d1ff4f88d1dc88e23f7e3704726d313c57f350911dd2bd0.png",
      salary:"$ 79.95"
   }
  ]
  //Se has subscripto a recibir ofertas Laborales de {{jobs_search}}
  const obj = {
    subject: "SendGrid Template Demo",
    
    
    image:
      "https://static.wixstatic.com/media/829a0c_445ce9cfb01b48b6ae3a035bd1d04de2~mv2.png"
  };

  
  return {
  
    subject: 'Someone claimed some swag!',
    // from: {
    //   name: 'NO-REPLY - JoBoardDev Co',
    //   email: 'rogercolquecalcina@gmail.com',
      
    // },

    from: 'NO-REPLY - JoBoardDev Co <rogercolquecalcina@gmail.com>',
    
    templateId: process.env.JOBS_DYNAMIC_TEMPLATE_ID,
    // personalizations

    personalizations: [{
      to: `${userName} <${userEmail}>`,
      dynamic_template_data: {
        subject: `🔔 Notificaremos ofertas laborales de ${jobOfferSearch} `,
        items:OfertasTrabajosList,
        customer_name: userName,
        jobs_search:jobOfferSearch

      },
    
    }],

    // dynamicTemplateData: {
    //               items:OfertasTrabajosList,

    //   customer_name: userName,
    //   jobs_search:jobOfferSearch
      
    // },
      mail_settings: {
        sandbox_mode: {
          enable: sandboxMode
        }
      }
  };
},

 sendEmail : async (emailMessage) => {
  try {
    const response = await sendMail.send(emailMessage);
    // console.log(("sendMAIL:",response[0].statusCode));
    const resp = (response[0].statusCode==202)? true : false
    return resp
  } catch (error) {
    console.error((error.message));
    return resp
  }
}

}

module.exports = usersControllers