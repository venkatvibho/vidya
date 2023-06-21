const expres                    =   require('express')
const router                    =   expres.Router()
const authorization             =   require('../middleware/authentication')
const valiDations               =   require('../middleware/valiDations')

const CommonController          =  require('../controllers/Common.js')
const upload = require('../middleware/fileUpload')
router.post("/Common/Upload",authorization,upload.single("singleFile"),CommonController.Upload)
router.post("/Common/Indicators",authorization,CommonController.Indicators)

const UserController          =  require('../controllers/User.js')
// router.post("/sample",UserController.sample)
router.post("/User/create",UserController.create)
router.get("/User/list",authorization,UserController.list)
router.get("/User/view/:id",authorization,UserController.view)
router.patch("/User/update/:id",authorization,UserController.update)
router.post("/User/login",UserController.login)
router.post("/User/resendotp",  UserController.login)
router.post("/User/loginwithotp",UserController.loginwithotp)
router.get("/User/refreshToken/:refreshToken",UserController.refreshToken)
router.get("/User/CheckUserId/:user_id",authorization,UserController.CheckUserId)
router.get("/User/GenerateUserId",authorization,UserController.GenerateUserId)
router.get("/User/logout/:id",authorization,UserController.logout)
router.delete("/User/delete/:id",authorization,UserController.remove)
router.post("/User/hibernate/:id",authorization,UserController.hibernate)
// router.delete("/User/bulkdelete/:ids",UserController.bulkremove)
// router.get("/User/forgotpassword/:email", UserController.forgotpassword)
// router.patch("/User/resetpassword/:id/:resetPawordToken",UserController.resetpassword)
// router.post("/User/changePassword",UserController.changePassword)

const UserGiftsRewardController          =  require('../controllers/UserGiftsReward.js')
router.get("/UserGiftsReward/home",authorization,UserGiftsRewardController.home)
router.post("/UserGiftsReward/create",authorization,UserGiftsRewardController.create)
router.get("/UserGiftsReward/list",authorization,UserGiftsRewardController.list)
router.get("/UserGiftsReward/view/:id",authorization,UserGiftsRewardController.view)
router.patch("/UserGiftsReward/update/:id",authorization,UserGiftsRewardController.update)
// router.delete("/UserGiftsReward/delete/:id",authorization,UserGiftsRewardController.remove)
// router.delete("/UserGiftsReward/bulkdelete/:ids",authorization,UserGiftsRewardController.bulkremove)

const UserNotificationSettingController          =  require('../controllers/UserNotificationSetting.js')
router.post("/UserNotificationSetting/create",authorization,UserNotificationSettingController.create)
router.get("/UserNotificationSetting/list",authorization,UserNotificationSettingController.list)
router.get("/UserNotificationSetting/view/:id",authorization,UserNotificationSettingController.view)
router.patch("/UserNotificationSetting/update/:id",authorization,UserNotificationSettingController.update)
// router.delete("/UserNotificationSetting/delete/:id",authorization,UserNotificationSettingController.remove)
// router.delete("/UserNotificationSetting/bulkdelete/:ids",authorization,UserNotificationSettingController.bulkremove)

const UserReportController          =  require('../controllers/UserReport.js')
router.post("/UserReport/create",authorization,UserReportController.create)
router.get("/UserReport/list",authorization,UserReportController.list)
router.get("/UserReport/view/:id",authorization,UserReportController.view)
router.patch("/UserReport/update/:id",authorization,UserReportController.update)
router.delete("/UserReport/delete/:id",authorization,UserReportController.remove)
router.delete("/UserReport/bulkdelete/:ids",authorization,UserReportController.bulkremove)

const UserReportReplyController          =  require('../controllers/UserReportReply.js')
router.post("/UserReportReply/create",authorization,UserReportReplyController.create)
router.get("/UserReportReply/list",authorization,UserReportReplyController.list)
router.get("/UserReportReply/view/:id",authorization,UserReportReplyController.view)
router.patch("/UserReportReply/update/:id",authorization,UserReportReplyController.update)
router.delete("/UserReportReply/delete/:id",authorization,UserReportReplyController.remove)
router.delete("/UserReportReply/bulkdelete/:ids",authorization,UserReportReplyController.bulkremove)

const UserInterestController          =  require('../controllers/UserInterest.js')
router.post("/UserInterest/create/selectAndDeselect",authorization,UserInterestController.create)
router.get("/UserInterest/list",authorization,UserInterestController.list)
router.get("/UserInterest/view/:id",authorization,UserInterestController.view)
// router.patch("/UserInterest/update/:id",authorization,UserInterestController.update)
// router.delete("/UserInterest/delete/:id",authorization,UserInterestController.remove)
// router.delete("/UserInterest/bulkdelete/:ids",authorization,UserInterestController.bulkremove)

const ActivityController          =  require('../controllers/Activity.js')
router.post("/Activity/create",authorization,ActivityController.create)
router.get("/Activity/list",authorization,ActivityController.list)
router.get("/Activity/view/:id",authorization,ActivityController.view)
router.patch("/Activity/update/:id",authorization,ActivityController.update)
router.delete("/Activity/delete/:id",authorization,ActivityController.remove)
router.delete("/Activity/bulkdelete/:ids",authorization,ActivityController.bulkremove)

const ActivityUserController          =  require('../controllers/ActivityUser.js')
router.post("/ActivityUser/publicActivityAccess",authorization,ActivityUserController.create)
router.get("/ActivityUser/list",authorization,ActivityUserController.list)
router.get("/ActivityUser/view/:id",authorization,ActivityUserController.view)
router.patch("/ActivityUser/update/:id",authorization,ActivityUserController.update)
router.delete("/ActivityUser/delete/:id",authorization,ActivityUserController.remove)
router.delete("/ActivityUser/bulkdelete/:ids",authorization,ActivityUserController.bulkremove)

const UserFollowingController          =  require('../controllers/UserFollowing.js')
router.post("/UserFollowing/create",authorization,UserFollowingController.create)
router.get("/UserFollowing/list",authorization,UserFollowingController.list)
router.get("/UserFollowing/view/:id",authorization,UserFollowingController.view)
router.patch("/UserFollowing/update/:id",authorization,UserFollowingController.update)
router.delete("/UserFollowing/delete/:id",authorization,UserFollowingController.remove)
router.delete("/UserFollowing/bulkdelete/:ids",authorization,UserFollowingController.bulkremove)

const SlambookBeatController          =  require('../controllers/SlambookBeat.js')
router.post("/SlambookBeat/create",authorization,SlambookBeatController.create)
router.get("/SlambookBeat/list",authorization,SlambookBeatController.list)
router.get("/SlambookBeat/view/:id",authorization,SlambookBeatController.view)
router.patch("/SlambookBeat/update/:id",authorization,SlambookBeatController.update)
router.delete("/SlambookBeat/delete/:id",authorization,SlambookBeatController.remove)
router.delete("/SlambookBeat/bulkdelete/:ids",authorization,SlambookBeatController.bulkremove)

// const SlambookBeatQuestionController          =  require('../controllers/SlambookBeatQuestion.js')
// router.post("/SlambookBeatQuestion/create",authorization,SlambookBeatQuestionController.create)
// router.get("/SlambookBeatQuestion/list",authorization,SlambookBeatQuestionController.list)
// router.get("/SlambookBeatQuestion/view/:id",authorization,SlambookBeatQuestionController.view)
// router.patch("/SlambookBeatQuestion/update/:id",authorization,SlambookBeatQuestionController.update)
// router.delete("/SlambookBeatQuestion/delete/:id",authorization,SlambookBeatQuestionController.remove)
// router.delete("/SlambookBeatQuestion/bulkdelete/:ids",authorization,SlambookBeatQuestionController.bulkremove)

const PostController          =  require('../controllers/Post.js')
router.post("/Post/create",authorization,PostController.create)
router.get("/Post/list",authorization,PostController.list)
router.get("/Post/view/:id",authorization,PostController.view)
// router.patch("/Post/update/:id",authorization,PostController.update)
router.delete("/Post/delete/:id",authorization,PostController.remove)
router.delete("/Post/bulkdelete/:ids",authorization,PostController.bulkremove)

const PostUserController          =  require('../controllers/PostUser.js')
router.post("/PostUser/create",authorization,PostUserController.create)
router.get("/PostUser/list",authorization,PostUserController.list)
router.get("/PostUser/view/:id",authorization,PostUserController.view)
router.patch("/PostUser/update/:id",authorization,PostUserController.update)
router.delete("/PostUser/delete/:id",authorization,PostUserController.remove)
router.delete("/PostUser/bulkdelete/:ids",authorization,PostUserController.bulkremove)

const PostUserReportController          =  require('../controllers/PostUserReport.js')
router.post("/PostUserReport/create",authorization,PostUserReportController.create)
router.get("/PostUserReport/list",authorization,PostUserReportController.list)
router.get("/PostUserReport/view/:id",authorization,PostUserReportController.view)
router.patch("/PostUserReport/update/:id",authorization,PostUserReportController.update)
router.delete("/PostUserReport/delete/:id",authorization,PostUserReportController.remove)
router.delete("/PostUserReport/bulkdelete/:ids",authorization,PostUserReportController.bulkremove)

const PostUserReportReplyController          =  require('../controllers/PostUserReportReply.js')
router.post("/PostUserReportReply/create",authorization,PostUserReportReplyController.create)
router.get("/PostUserReportReply/list",authorization,PostUserReportReplyController.list)
router.get("/PostUserReportReply/view/:id",authorization,PostUserReportReplyController.view)
router.patch("/PostUserReportReply/update/:id",authorization,PostUserReportReplyController.update)
router.delete("/PostUserReportReply/delete/:id",authorization,PostUserReportReplyController.remove)
router.delete("/PostUserReportReply/bulkdelete/:ids",authorization,PostUserReportReplyController.bulkremove)

const PostCommentController          =  require('../controllers/PostComment.js')
router.post("/PostComment/create",authorization,PostCommentController.create)
router.get("/PostComment/list",authorization,PostCommentController.list)
router.get("/PostComment/view/:id",authorization,PostCommentController.view)
router.patch("/PostComment/update/:id",authorization,PostCommentController.update)
router.delete("/PostComment/delete/:id",authorization,PostCommentController.remove)
router.delete("/PostComment/bulkdelete/:ids",authorization,PostCommentController.bulkremove)

const PostCommentLikeController          =  require('../controllers/PostCommentLike.js')
router.post("/PostCommentLike/create",authorization,PostCommentLikeController.create)
router.get("/PostCommentLike/list",authorization,PostCommentLikeController.list)
router.get("/PostCommentLike/view/:id",authorization,PostCommentLikeController.view)
router.patch("/PostCommentLike/update/:id",authorization,PostCommentLikeController.update)
router.delete("/PostCommentLike/delete/:id",authorization,PostCommentLikeController.remove)
router.delete("/PostCommentLike/bulkdelete/:ids",authorization,PostCommentLikeController.bulkremove)

const PostCommentReplyController          =  require('../controllers/PostCommentReply.js')
router.post("/PostCommentReply/create",authorization,PostCommentReplyController.create)
router.get("/PostCommentReply/list",authorization,PostCommentReplyController.list)
router.get("/PostCommentReply/view/:id",authorization,PostCommentReplyController.view)
router.patch("/PostCommentReply/update/:id",authorization,PostCommentReplyController.update)
router.delete("/PostCommentReply/delete/:id",authorization,PostCommentReplyController.remove)
router.delete("/PostCommentReply/bulkdelete/:ids",authorization,PostCommentReplyController.bulkremove)

const PostCommentReplayLikeController          =  require('../controllers/PostCommentReplayLike.js')
router.post("/PostCommentReplayLike/create",authorization,PostCommentReplayLikeController.create)
router.get("/PostCommentReplayLike/list",authorization,PostCommentReplayLikeController.list)
router.get("/PostCommentReplayLike/view/:id",authorization,PostCommentReplayLikeController.view)
router.patch("/PostCommentReplayLike/update/:id",authorization,PostCommentReplayLikeController.update)
router.delete("/PostCommentReplayLike/delete/:id",authorization,PostCommentReplayLikeController.remove)
router.delete("/PostCommentReplayLike/bulkdelete/:ids",authorization,PostCommentReplayLikeController.bulkremove)

const GroupController          =  require('../controllers/Group.js')
router.post("/Group/create",authorization,GroupController.create)
router.get("/Group/list",authorization,GroupController.list)
router.get("/Group/view/:id",authorization,GroupController.view)
router.patch("/Group/update/:id",authorization,GroupController.update)
router.get("/Group/medialinks:id",authorization,GroupController.medialinks)
router.delete("/Group/delete/:id",authorization,GroupController.remove)
router.delete("/Group/bulkdelete/:ids",authorization,GroupController.bulkremove)

const GroupsParticipantController          =  require('../controllers/GroupsParticipant.js')
router.post("/GroupsParticipant/create",authorization,GroupsParticipantController.create)
router.get("/GroupsParticipant/list",authorization,GroupsParticipantController.list)
router.get("/GroupsParticipant/view/:id",authorization,GroupsParticipantController.view)
router.patch("/GroupsParticipant/update/:id",authorization,GroupsParticipantController.update)
router.delete("/GroupsParticipant/delete/:id",authorization,GroupsParticipantController.remove)
router.delete("/GroupsParticipant/bulkdelete/:ids",authorization,GroupsParticipantController.bulkremove)

const GroupChatInvitedController          =  require('../controllers/GroupChatInvited.js')
router.post("/GroupChatInvited/create",authorization,GroupChatInvitedController.create)
router.get("/GroupChatInvited/list",authorization,GroupChatInvitedController.list)
// router.get("/GroupChatInvited/view/:id",authorization,GroupChatInvitedController.view)
// router.patch("/GroupChatInvited/update/:id",authorization,GroupChatInvitedController.update)
// router.delete("/GroupChatInvited/delete/:id",authorization,GroupChatInvitedController.remove)
// router.delete("/GroupChatInvited/bulkdelete/:ids",authorization,GroupChatInvitedController.bulkremove)

const GroupChatController          =  require('../controllers/GroupChat.js')
router.post("/GroupChat/create",authorization,GroupChatController.create)
router.get("/GroupChat/list",authorization,GroupChatController.list)
router.get("/GroupChat/view/:id",authorization,GroupChatController.view)
// router.patch("/GroupChat/update/:id",authorization,GroupChatController.update)
router.delete("/GroupChat/delete/:id",authorization,GroupChatController.remove)
router.delete("/GroupChat/bulkdelete/:ids",authorization,GroupChatController.bulkremove)

const PollController          =  require('../controllers/Poll.js')
router.post("/Poll/create",authorization,PollController.create)
router.get("/Poll/list",authorization,PollController.list)
router.get("/Poll/view/:id",authorization,PollController.view)
// router.patch("/Poll/update/:id",authorization,PollController.update)
router.delete("/Poll/delete/:id",authorization,PollController.remove)
router.delete("/Poll/bulkdelete/:ids",authorization,PollController.bulkremove)

const PollOptionController          =  require('../controllers/PollOption.js')
router.post("/PollOption/create",authorization,PollOptionController.create)
router.get("/PollOption/list",authorization,PollOptionController.list)
router.get("/PollOption/view/:id",authorization,PollOptionController.view)
router.patch("/PollOption/update/:id",authorization,PollOptionController.update)
router.delete("/PollOption/delete/:id",authorization,PollOptionController.remove)
router.delete("/PollOption/bulkdelete/:ids",authorization,PollOptionController.bulkremove)

const PollUserController          =  require('../controllers/PollUser.js')
router.post("/PollUser/create",authorization,PollUserController.create)
router.get("/PollUser/list",authorization,PollUserController.list)
router.get("/PollUser/view/:id",authorization,PollUserController.view)
// router.patch("/PollUser/update/:id",authorization,PollUserController.update)
router.delete("/PollUser/delete/:id",authorization,PollUserController.remove)
router.delete("/PollUser/bulkdelete/:ids",authorization,PollUserController.bulkremove)

const PollUserReportController          =  require('../controllers/PollUserReport.js')
router.post("/PollUserReport/create",authorization,PollUserReportController.create)
router.get("/PollUserReport/list",authorization,PollUserReportController.list)
router.get("/PollUserReport/view/:id",authorization,PollUserReportController.view)
router.patch("/PollUserReport/update/:id",authorization,PollUserReportController.update)
router.delete("/PollUserReport/delete/:id",authorization,PollUserReportController.remove)
router.delete("/PollUserReport/bulkdelete/:ids",authorization,PollUserReportController.bulkremove)

const PollUserReportReplyController          =  require('../controllers/PollUserReportReply.js')
router.post("/PollUserReportReply/create",authorization,PollUserReportReplyController.create)
router.get("/PollUserReportReply/list",authorization,PollUserReportReplyController.list)
router.get("/PollUserReportReply/view/:id",authorization,PollUserReportReplyController.view)
router.patch("/PollUserReportReply/update/:id",authorization,PollUserReportReplyController.update)
router.delete("/PollUserReportReply/delete/:id",authorization,PollUserReportReplyController.remove)
router.delete("/PollUserReportReply/bulkdelete/:ids",authorization,PollUserReportReplyController.bulkremove)

const ChatRoomController          =  require('../controllers/ChatRoom.js')
router.post("/ChatRoom/create",authorization,ChatRoomController.create)
router.get("/ChatRoom/list",authorization,ChatRoomController.list)
router.get("/ChatRoom/view/:id",authorization,ChatRoomController.view)
// router.patch("/ChatRoom/update/:id",authorization,ChatRoomController.update)
router.delete("/ChatRoom/delete/:id",authorization,ChatRoomController.remove)
router.delete("/ChatRoom/bulkdelete/:ids",authorization,ChatRoomController.bulkremove)

const ChatRoomInvitedController          =  require('../controllers/ChatRoomInvited.js')
router.post("/ChatRoomInvited/create",authorization,ChatRoomInvitedController.create)
router.get("/ChatRoomInvited/list",authorization,ChatRoomInvitedController.list)
// router.get("/ChatRoomInvited/view/:id",authorization,ChatRoomInvitedController.view)
// router.patch("/ChatRoomInvited/update/:id",authorization,ChatRoomInvitedController.update)
// router.delete("/ChatRoomInvited/delete/:id",authorization,ChatRoomInvitedController.remove)
// router.delete("/ChatRoomInvited/bulkdelete/:ids",authorization,ChatRoomInvitedController.bulkremove)

const ChatRoomParticipantController          =  require('../controllers/ChatRoomParticipant.js')
router.post("/ChatRoomParticipant/create",authorization,ChatRoomParticipantController.create)
router.get("/ChatRoomParticipant/list",authorization,ChatRoomParticipantController.list)
router.get("/ChatRoomParticipant/view/:id",authorization,ChatRoomParticipantController.view)
// router.patch("/ChatRoomParticipant/update/:id",authorization,ChatRoomParticipantController.update)
router.delete("/ChatRoomParticipant/delete/:id",authorization,ChatRoomParticipantController.remove)
router.delete("/ChatRoomParticipant/bulkdelete/:ids",authorization,ChatRoomParticipantController.bulkremove)

const ChatRoomHistoryController          =  require('../controllers/ChatRoomHistory.js')
router.post("/ChatRoomHistory/create",authorization,ChatRoomHistoryController.create)
router.get("/ChatRoomHistory/list",authorization,ChatRoomHistoryController.list)
router.get("/ChatRoomHistory/view/:id",authorization,ChatRoomHistoryController.view)
router.patch("/ChatRoomHistory/update/:id",authorization,ChatRoomHistoryController.update)
router.delete("/ChatRoomHistory/delete/:id",authorization,ChatRoomHistoryController.remove)
router.delete("/ChatRoomHistory/bulkdelete/:ids",authorization,ChatRoomHistoryController.bulkremove)

const MasterRegionController          =  require('../controllers/MasterRegion.js')
router.post("/MasterRegion/create",authorization,MasterRegionController.create)
router.get("/MasterRegion/list",authorization,MasterRegionController.list)
router.get("/MasterRegion/view/:id",authorization,MasterRegionController.view)
router.patch("/MasterRegion/update/:id",authorization,MasterRegionController.update)
router.delete("/MasterRegion/delete/:id",authorization,MasterRegionController.remove)
router.delete("/MasterRegion/bulkdelete/:ids",authorization,MasterRegionController.bulkremove)

const MasterLanguageController          =  require('../controllers/MasterLanguage.js')
router.post("/MasterLanguage/create",authorization,MasterLanguageController.create)
router.get("/MasterLanguage/list",authorization,MasterLanguageController.list)
router.get("/MasterLanguage/view/:id",authorization,MasterLanguageController.view)
router.patch("/MasterLanguage/update/:id",authorization,MasterLanguageController.update)
router.delete("/MasterLanguage/delete/:id",authorization,MasterLanguageController.remove)
router.delete("/MasterLanguage/bulkdelete/:ids",authorization,MasterLanguageController.bulkremove)

const MasterActivityController          =  require('../controllers/MasterActivity.js')
router.post("/MasterActivity/create",authorization,MasterActivityController.create)
router.get("/MasterActivity/list",authorization,MasterActivityController.list)
router.get("/MasterActivity/view/:id",authorization,MasterActivityController.view)
router.patch("/MasterActivity/update/:id",authorization,MasterActivityController.update)
router.delete("/MasterActivity/delete/:id",authorization,MasterActivityController.remove)
router.delete("/MasterActivity/bulkdelete/:ids",authorization,MasterActivityController.bulkremove)

const MasterIndustryController          =  require('../controllers/MasterIndustry.js')
router.post("/MasterIndustry/create",authorization,MasterIndustryController.create)
router.get("/MasterIndustry/list",authorization,MasterIndustryController.list)
router.get("/MasterIndustry/view/:id",authorization,MasterIndustryController.view)
router.patch("/MasterIndustry/update/:id",authorization,MasterIndustryController.update)
router.delete("/MasterIndustry/delete/:id",authorization,MasterIndustryController.remove)
router.delete("/MasterIndustry/bulkdelete/:ids",authorization,MasterIndustryController.bulkremove)

const MasterInterestController          =  require('../controllers/MasterInterest.js')
router.post("/MasterInterest/create",authorization,MasterInterestController.create)
router.get("/MasterInterest/list",authorization,MasterInterestController.list)
router.get("/MasterInterest/view/:id",authorization,MasterInterestController.view)
router.patch("/MasterInterest/update/:id",authorization,MasterInterestController.update)
router.delete("/MasterInterest/delete/:id",authorization,MasterInterestController.remove)
router.delete("/MasterInterest/bulkdelete/:ids",authorization,MasterInterestController.bulkremove)

const MasterProfessionController          =  require('../controllers/MasterProfession.js')
router.post("/MasterProfession/create",authorization,MasterProfessionController.create)
router.get("/MasterProfession/list",authorization,MasterProfessionController.list)
router.get("/MasterProfession/view/:id",authorization,MasterProfessionController.view)
router.patch("/MasterProfession/update/:id",authorization,MasterProfessionController.update)
router.delete("/MasterProfession/delete/:id",authorization,MasterProfessionController.remove)
router.delete("/MasterProfession/bulkdelete/:ids",authorization,MasterProfessionController.bulkremove)

const MasterBeatQuestionController          =  require('../controllers/MasterBeatQuestion.js')
router.post("/MasterBeatQuestion/create",authorization,MasterBeatQuestionController.create)
router.get("/MasterBeatQuestion/list",authorization,MasterBeatQuestionController.list)
router.get("/MasterBeatQuestion/view/:id",authorization,MasterBeatQuestionController.view)
router.patch("/MasterBeatQuestion/update/:id",authorization,MasterBeatQuestionController.update)
router.delete("/MasterBeatQuestion/delete/:id",authorization,MasterBeatQuestionController.remove)
router.delete("/MasterBeatQuestion/bulkdelete/:ids",authorization,MasterBeatQuestionController.bulkremove)

const UserPrivacySettingController          =  require('../controllers/UserPrivacySetting.js')
router.post("/UserPrivacySetting/create",authorization,UserPrivacySettingController.create)
router.get("/UserPrivacySetting/list",authorization,UserPrivacySettingController.list)
router.get("/UserPrivacySetting/view/:id",authorization,UserPrivacySettingController.view)
router.patch("/UserPrivacySetting/update/:id",authorization,UserPrivacySettingController.update)
router.delete("/UserPrivacySetting/delete/:id",authorization,UserPrivacySettingController.remove)
router.delete("/UserPrivacySetting/bulkdelete/:ids",authorization,UserPrivacySettingController.bulkremove)

const MasterGiftsRewardController          =  require('../controllers/MasterGiftsReward.js')
router.post("/MasterGiftsReward/create",authorization,MasterGiftsRewardController.create)
router.get("/MasterGiftsReward/list",authorization,MasterGiftsRewardController.list)
router.get("/MasterGiftsReward/view/:id",authorization,MasterGiftsRewardController.view)
router.patch("/MasterGiftsReward/update/:id",authorization,MasterGiftsRewardController.update)
router.delete("/MasterGiftsReward/delete/:id",authorization,MasterGiftsRewardController.remove)
router.delete("/MasterGiftsReward/bulkdelete/:ids",authorization,MasterGiftsRewardController.bulkremove)

const SettingsController          =  require('../controllers/Settings.js')
router.post("/Settings/helpsupport",authorization,SettingsController.helpsupport)

module.exports = router