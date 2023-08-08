
// 1. When a connect request Invite to Group and Create group
// 2. When any message comes in Chat
// 3. When any activity scheduled
// 4. Activity start reminder 10 minutes before 
// 5. Post you mentioned or tagged              ########
// 6. Post your group mentioned or tagged       ########
// 7. Comment or shared on your tagged post     ########
// 8. Any slam-book request received        
// 9. Slam-book filled by other user
// 10. Friends birthday comes
// 11. Any of mobile contacts registered in app 
// 12. Any one likes you                        #################
// 13. Following you

const sendPushnotification = async (req,res,notificationSno,user_id,object)=> {
    let Model            =     require("../models");
    let description = null
    let title = null
    user_id  = (user_id==0)?req.user.id:user_id
    let userToken = await Model.User.findById(user_id)
    if(userToken && userToken.fcm_token){
        switch(notificationSno) {
            case 1:
                title       = 'Connect request'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 2:
                title       = 'A new message arrived.'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 3:
                title       = 'Activity sheduled'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 4:
                title       = 'Your activity will start within 10 mins'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 5:
                title       = 'Post created for you'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 6:
                title       = 'Post created for you'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 7:
                title       = 'Commnted to your post'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 8:
                title       = 'Slambook request received'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 9:
                title       = 'Slambook request submitted'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 10:
                title       = 'Birthday alert'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 11:
                title       = 'Your friend registered'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            case 12:
                title       = 'Like alert'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                break;
            default:
                title       = 'Following request'
                description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
        }
        registration_ids = userToken.fcm_token
        try{
            $serverkey = 'AAAA6JufjL8:APA91bEqrRFphqKGYD_tMhdKn2XPrLl9YDnbrsjZ3HZn3f2pKQqCIHObzRGH_JVnLdukC0ZuUrV8aeY4T7BzvbWc7nH-js35JTZN_DiDCd2R4ABzh3jNggdhnAkKjdNVqayhczIt-0D6';
            let data = array()
            data['registration_ids'] = [registration_ids]
            let notification = array()
            notification['body'] = description
            notification['title'] = title
            notification['image'] = null
            let sub_data = array()
            sub_data['click_action'] = 'FLUTTER_NOTIFICATION_CLICK'
            sub_data['sound'] = 'default'
            sub_data['status'] = 'done'
            notification['sub_data'] = await sub_data
            data['notification'] = await notification
            let NotifData = JSON.stringify(data)
            let config = {
                method: 'POST',
                body: NotifData,
                json: true,
                url: 'https://api.github.com/repos/request/request',
                headers: {
                    'Authorization':'Bearer '+serverkey
                }
            };
            const axios = await require("axios");
            await axios(config).then(function (response) {
                console.log("Sent successfully")
            }).catch(function (error) {
                console.log(error)
            });
        }catch(error){
            console.log(error)
        }
    }
}

const Notif = {};
Notif.sendPushnotification         =   sendPushnotification
module.exports = Notif;
