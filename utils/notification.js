
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
    let registration_ids = null
    let description = null
    let title = null
    if(registration_ids){
        $serverkey = 'IpvaOHLq0syvH2HFtI8T71GpcRrxGxl_k0Pogn-';
        let data = array()
        data['registration_ids'] = registration_ids
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
        let options = {
            method: 'POST',
            body: data,
            json: true,
            url: 'https://api.github.com/repos/request/request',
            headers: {
                'Authorization':'Bearer '+serverkey
            }
        };
    }

}

const Notif = {};
Notif.sendPushnotification         =   sendPushnotification
module.exports = Notif;
