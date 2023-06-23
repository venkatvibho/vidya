const DataTypes = require("sequelize").DataTypes;
const _Activity = require("./Activity");
const _ActivityGroup = require("./ActivityGroup");
const _ActivityUser = require("./ActivityUser");
const _ChatRoom = require("./ChatRoom");
const _ChatRoomHistory = require("./ChatRoomHistory");
const _ChatRoomHistoryViewed = require("./ChatRoomHistoryViewed");
const _ChatRoomInvited = require("./ChatRoomInvited");
const _ChatRoomParticipant = require("./ChatRoomParticipant");
const _ChatroomUserReportReply = require("./ChatroomUserReportReply");
const _ChatroomUserReport = require("./ChatroomUserReport");
const _DjangoMigration = require("./DjangoMigration");
const _GroupChat = require("./GroupChat");
const _GroupChatInvited = require("./GroupChatInvited");
const _GroupChatViewed = require("./GroupChatViewed");
const _GroupChatroomUserReportReply = require("./GroupChatroomUserReportReply");
const _GroupChatroomUserReport = require("./GroupChatroomUserReport");
const _Group = require("./Group");
const _GroupsParticipant = require("./GroupsParticipant");
const _MasterActivity = require("./MasterActivity");
const _MasterBeatQuestion = require("./MasterBeatQuestion");
const _MasterGiftsReward = require("./MasterGiftsReward");
const _MasterIndustry = require("./MasterIndustry");
const _MasterInterest = require("./MasterInterest");
const _MasterLanguage = require("./MasterLanguage");
const _MasterProfession = require("./MasterProfession");
const _MasterRegion = require("./MasterRegion");
const _PollOption = require("./PollOption");
const _PollUserReportReply = require("./PollUserReportReply");
const _PollUserReport = require("./PollUserReport");
const _PollUser = require("./PollUser");
const _PollViewed = require("./PollViewed");
const _Poll = require("./Poll");
const _PostCommentLike = require("./PostCommentLike");
const _PostCommentReplayLike = require("./PostCommentReplayLike");
const _PostCommentReply = require("./PostCommentReply");
const _PostComment = require("./PostComment");
const _PostUserReportReply = require("./PostUserReportReply");
const _PostUserReport = require("./PostUserReport");
const _PostUser = require("./PostUser");
const _Post = require("./Post");
const _SlambookBeatQuestion = require("./SlambookBeatQuestion");
const _SlambookBeat = require("./SlambookBeat");
const _UserFollowing = require("./UserFollowing");
const _UserGiftsReward = require("./UserGiftsReward");
const _UserInterest = require("./UserInterest");
const _UserLoginHistory = require("./UserLoginHistory");
const _UserNotificationSetting = require("./UserNotificationSetting");
const _UserPrivacySetting = require("./UserPrivacySetting");
const _UserReportReply = require("./UserReportReply");
const _UserReport = require("./UserReport");
const _User = require("./User");
const _UsersLanguage = require("./UsersLanguage");

function initModels(sequelize) {
  const Activity = _Activity(sequelize, DataTypes);
  const ActivityGroup = _ActivityGroup(sequelize, DataTypes);
  const ActivityUser = _ActivityUser(sequelize, DataTypes);
  const ChatRoom = _ChatRoom(sequelize, DataTypes);
  const ChatRoomHistory = _ChatRoomHistory(sequelize, DataTypes);
  const ChatRoomHistoryViewed = _ChatRoomHistoryViewed(sequelize, DataTypes);
  const ChatRoomInvited = _ChatRoomInvited(sequelize, DataTypes);
  const ChatRoomParticipant = _ChatRoomParticipant(sequelize, DataTypes);
  const ChatroomUserReportReply = _ChatroomUserReportReply(sequelize, DataTypes);
  const ChatroomUserReport = _ChatroomUserReport(sequelize, DataTypes);
  const DjangoMigration = _DjangoMigration(sequelize, DataTypes);
  const GroupChat = _GroupChat(sequelize, DataTypes);
  const GroupChatInvited = _GroupChatInvited(sequelize, DataTypes);
  const GroupChatViewed = _GroupChatViewed(sequelize, DataTypes);
  const GroupChatroomUserReportReply = _GroupChatroomUserReportReply(sequelize, DataTypes);
  const GroupChatroomUserReport = _GroupChatroomUserReport(sequelize, DataTypes);
  const Group = _Group(sequelize, DataTypes);
  const GroupsParticipant = _GroupsParticipant(sequelize, DataTypes);
  const MasterActivity = _MasterActivity(sequelize, DataTypes);
  const MasterBeatQuestion = _MasterBeatQuestion(sequelize, DataTypes);
  const MasterGiftsReward = _MasterGiftsReward(sequelize, DataTypes);
  const MasterIndustry = _MasterIndustry(sequelize, DataTypes);
  const MasterInterest = _MasterInterest(sequelize, DataTypes);
  const MasterLanguage = _MasterLanguage(sequelize, DataTypes);
  const MasterProfession = _MasterProfession(sequelize, DataTypes);
  const MasterRegion = _MasterRegion(sequelize, DataTypes);
  const PollOption = _PollOption(sequelize, DataTypes);
  const PollUserReportReply = _PollUserReportReply(sequelize, DataTypes);
  const PollUserReport = _PollUserReport(sequelize, DataTypes);
  const PollUser = _PollUser(sequelize, DataTypes);
  const PollViewed = _PollViewed(sequelize, DataTypes);
  const Poll = _Poll(sequelize, DataTypes);
  const PostCommentLike = _PostCommentLike(sequelize, DataTypes);
  const PostCommentReplayLike = _PostCommentReplayLike(sequelize, DataTypes);
  const PostCommentReply = _PostCommentReply(sequelize, DataTypes);
  const PostComment = _PostComment(sequelize, DataTypes);
  const PostUserReportReply = _PostUserReportReply(sequelize, DataTypes);
  const PostUserReport = _PostUserReport(sequelize, DataTypes);
  const PostUser = _PostUser(sequelize, DataTypes);
  const Post = _Post(sequelize, DataTypes);
  const SlambookBeatQuestion = _SlambookBeatQuestion(sequelize, DataTypes);
  const SlambookBeat = _SlambookBeat(sequelize, DataTypes);
  const UserFollowing = _UserFollowing(sequelize, DataTypes);
  const UserGiftsReward = _UserGiftsReward(sequelize, DataTypes);
  const UserInterest = _UserInterest(sequelize, DataTypes);
  const UserLoginHistory = _UserLoginHistory(sequelize, DataTypes);
  const UserNotificationSetting = _UserNotificationSetting(sequelize, DataTypes);
  const UserPrivacySetting = _UserPrivacySetting(sequelize, DataTypes);
  const UserReportReply = _UserReportReply(sequelize, DataTypes);
  const UserReport = _UserReport(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);
  const UsersLanguage = _UsersLanguage(sequelize, DataTypes);

  ActivityGroup.belongsTo(Activity, { foreignKey: "activity_id"});
  Activity.hasMany(ActivityGroup, { foreignKey: "activity_id"});
  ActivityUser.belongsTo(Activity, { foreignKey: "activity_id"});
  Activity.hasMany(ActivityUser, { foreignKey: "activity_id"});
  Post.belongsTo(Activity, { foreignKey: "activity_id"});
  Activity.hasMany(Post, { foreignKey: "activity_id"});
  ChatRoomHistory.belongsTo(ChatRoom, { foreignKey: "chatroom_id"});
  ChatRoom.hasMany(ChatRoomHistory, { foreignKey: "chatroom_id"});
  ChatRoomHistoryViewed.belongsTo(ChatRoom, { foreignKey: "chatroom_id"});
  ChatRoom.hasMany(ChatRoomHistoryViewed, { foreignKey: "chatroom_id"});
  ChatRoomInvited.belongsTo(ChatRoom, { foreignKey: "chat_room_id"});
  ChatRoom.hasMany(ChatRoomInvited, { foreignKey: "chat_room_id"});
  ChatRoomParticipant.belongsTo(ChatRoom, { foreignKey: "chatroom_id"});
  ChatRoom.hasMany(ChatRoomParticipant, { foreignKey: "chatroom_id"});
  ChatroomUserReport.belongsTo(ChatRoom, { foreignKey: "chatroom_id"});
  ChatRoom.hasMany(ChatroomUserReport, { foreignKey: "chatroom_id"});
  ChatRoomHistoryViewed.belongsTo(ChatRoomHistory, { foreignKey: "chat_room_history_id"});
  ChatRoomHistory.hasMany(ChatRoomHistoryViewed, { foreignKey: "chat_room_history_id"});
  ChatroomUserReportReply.belongsTo(ChatroomUserReport, { foreignKey: "chatroomreport_id"});
  ChatroomUserReport.hasMany(ChatroomUserReportReply, { foreignKey: "chatroomreport_id"});
  GroupChatViewed.belongsTo(GroupChat, { foreignKey: "group_chat_id"});
  GroupChat.hasMany(GroupChatViewed, { foreignKey: "group_chat_id"});
  GroupChatroomUserReportReply.belongsTo(GroupChatroomUserReport, { foreignKey: "group_chat_report_id"});
  GroupChatroomUserReport.hasMany(GroupChatroomUserReportReply, { foreignKey: "group_chat_report_id"});
  ActivityGroup.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(ActivityGroup, { foreignKey: "group_id"});
  ActivityUser.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(ActivityUser, { foreignKey: "group_id"});
  GroupChat.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(GroupChat, { foreignKey: "group_id"});
  GroupChatInvited.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(GroupChatInvited, { foreignKey: "group_id"});
  GroupChatViewed.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(GroupChatViewed, { foreignKey: "group_id"});
  GroupChatroomUserReport.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(GroupChatroomUserReport, { foreignKey: "group_id"});
  GroupsParticipant.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(GroupsParticipant, { foreignKey: "group_id"});
  Poll.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(Poll, { foreignKey: "group_id"});
  Post.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(Post, { foreignKey: "group_id"});
  Activity.belongsTo(MasterActivity, { foreignKey: "activity_id"});
  MasterActivity.hasMany(Activity, { foreignKey: "activity_id"});
  MasterProfession.belongsTo(MasterIndustry, { foreignKey: "industry_id"});
  MasterIndustry.hasMany(MasterProfession, { foreignKey: "industry_id"});
  User.belongsTo(MasterIndustry, { foreignKey: "industry_id"});
  MasterIndustry.hasMany(User, { foreignKey: "industry_id"});
  UserInterest.belongsTo(MasterInterest, { foreignKey: "interest_id"});
  MasterInterest.hasMany(UserInterest, { foreignKey: "interest_id"});
  UsersLanguage.belongsTo(MasterLanguage, { foreignKey: "languages_id"});
  MasterLanguage.hasMany(UsersLanguage, { foreignKey: "languages_id"});
  User.belongsTo(MasterProfession, { foreignKey: "profession_id"});
  MasterProfession.hasMany(User, { foreignKey: "profession_id"});
  PollUser.belongsTo(PollOption, { foreignKey: "poll_option_id"});
  PollOption.hasMany(PollUser, { foreignKey: "poll_option_id"});
  PollUserReportReply.belongsTo(PollUserReport, { foreignKey: "polluserreport_id"});
  PollUserReport.hasMany(PollUserReportReply, { foreignKey: "polluserreport_id"});
  PollUserReport.belongsTo(PollUser, { foreignKey: "polltuser_id"});
  PollUser.hasMany(PollUserReport, { foreignKey: "polltuser_id"});
  PollOption.belongsTo(Poll, { foreignKey: "poll_id"});
  Poll.hasMany(PollOption, { foreignKey: "poll_id"});
  PollUser.belongsTo(Poll, { foreignKey: "poll_id"});
  Poll.hasMany(PollUser, { foreignKey: "poll_id"});
  PollViewed.belongsTo(Poll, { foreignKey: "poll_id"});
  Poll.hasMany(PollViewed, { foreignKey: "poll_id"});
  PostCommentReplayLike.belongsTo(PostCommentReply, { foreignKey: "postcommentreplay_id"});
  PostCommentReply.hasMany(PostCommentReplayLike, { foreignKey: "postcommentreplay_id"});
  PostCommentLike.belongsTo(PostComment, { foreignKey: "postcomment_id"});
  PostComment.hasMany(PostCommentLike, { foreignKey: "postcomment_id"});
  PostCommentReply.belongsTo(PostComment, { foreignKey: "postcomment_id"});
  PostComment.hasMany(PostCommentReply, { foreignKey: "postcomment_id"});
  PostUserReportReply.belongsTo(PostUserReport, { foreignKey: "postuserreport_id"});
  PostUserReport.hasMany(PostUserReportReply, { foreignKey: "postuserreport_id"});
  PostComment.belongsTo(PostUser, { foreignKey: "postuser_id"});
  PostUser.hasMany(PostComment, { foreignKey: "postuser_id"});
  PostUserReport.belongsTo(PostUser, { foreignKey: "postuser_id"});
  PostUser.hasMany(PostUserReport, { foreignKey: "postuser_id"});
  PostComment.belongsTo(Post, { foreignKey: "post_id"});
  Post.hasMany(PostComment, { foreignKey: "post_id"});
  PostUser.belongsTo(Post, { foreignKey: "post_id"});
  Post.hasMany(PostUser, { foreignKey: "post_id"});
  SlambookBeatQuestion.belongsTo(SlambookBeat, { foreignKey: "user_following_id"});
  SlambookBeat.hasMany(SlambookBeatQuestion, { foreignKey: "user_following_id"});
  SlambookBeat.belongsTo(UserFollowing, { foreignKey: "user_following_id"});
  UserFollowing.hasOne(SlambookBeat, { foreignKey: "user_following_id"});
  UserReportReply.belongsTo(UserReport, { foreignKey: "user_report_id"});
  UserReport.hasMany(UserReportReply, { foreignKey: "user_report_id"});
  Activity.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(Activity, { foreignKey: "user_id"});
  ActivityUser.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(ActivityUser, { foreignKey: "user_id"});
  ChatRoom.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(ChatRoom, { foreignKey: "user_id"});
  ChatRoomHistory.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(ChatRoomHistory, { foreignKey: "user_id"});
  ChatRoomHistoryViewed.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(ChatRoomHistoryViewed, { foreignKey: "user_id"});
  ChatRoomInvited.belongsTo(User, { foreignKey: "invited_by_id"});
  User.hasMany(ChatRoomInvited, { foreignKey: "invited_by_id"});
  ChatRoomParticipant.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(ChatRoomParticipant, { foreignKey: "user_id"});
  GroupChat.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(GroupChat, { foreignKey: "user_id"});
  GroupChatInvited.belongsTo(User, { foreignKey: "invited_by_id"});
  User.hasMany(GroupChatInvited, { foreignKey: "invited_by_id"});
  GroupChatViewed.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(GroupChatViewed, { foreignKey: "user_id"});
  GroupChatroomUserReport.belongsTo(User, { foreignKey: "reported_user_id"});
  User.hasMany(GroupChatroomUserReport, { foreignKey: "reported_user_id"});
  Group.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(Group, { foreignKey: "user_id"});
  GroupsParticipant.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(GroupsParticipant, { foreignKey: "user_id"});
  PollUser.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(PollUser, { foreignKey: "user_id"});
  PollViewed.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(PollViewed, { foreignKey: "user_id"});
  Poll.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(Poll, { foreignKey: "user_id"});
  PostCommentLike.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(PostCommentLike, { foreignKey: "user_id"});
  PostCommentReplayLike.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(PostCommentReplayLike, { foreignKey: "user_id"});
  PostCommentReply.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(PostCommentReply, { foreignKey: "user_id"});
  PostUserReportReply.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(PostUserReportReply, { foreignKey: "user_id"});
  PostUser.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(PostUser, { foreignKey: "user_id"});
  Post.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(Post, { foreignKey: "user_id"});
  SlambookBeat.belongsTo(User, { foreignKey: "user_from_id"});
  User.hasMany(SlambookBeat, { foreignKey: "user_from_id"});
  SlambookBeat.belongsTo(User, { foreignKey: "user_to_id"});
  User.hasMany(SlambookBeat, { foreignKey: "user_to_id"});
  UserFollowing.belongsTo(User, { foreignKey: "user_from_id"});
  User.hasMany(UserFollowing, { foreignKey: "user_from_id"});
  UserFollowing.belongsTo(User, { foreignKey: "user_to_id"});
  User.hasMany(UserFollowing, { foreignKey: "user_to_id"});
  UserGiftsReward.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(UserGiftsReward, { foreignKey: "user_id"});
  UserInterest.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(UserInterest, { foreignKey: "user_id"});
  UserLoginHistory.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(UserLoginHistory, { foreignKey: "user_id"});
  UserNotificationSetting.belongsTo(User, { foreignKey: "user_id"});
  User.hasOne(UserNotificationSetting, { foreignKey: "user_id"});
  UserPrivacySetting.belongsTo(User, { foreignKey: "user_id"});
  User.hasOne(UserPrivacySetting, { foreignKey: "user_id"});
  UserReportReply.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(UserReportReply, { foreignKey: "user_id"});
  UserReport.belongsTo(User, { foreignKey: "from_user_id"});
  User.hasMany(UserReport, { foreignKey: "from_user_id"});
  UserReport.belongsTo(User, { foreignKey: "to_user_id"});
  User.hasMany(UserReport, { foreignKey: "to_user_id"});
  UsersLanguage.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(UsersLanguage, { foreignKey: "user_id"});
  UserFollowing.belongsTo(User, { as:"FollowingFrom",foreignKey: "user_from_id"});
  User.hasMany(UserFollowing, { as:"UserFollowing",foreignKey: "user_from_id"});
  UserReport.belongsTo(User, { as:"ReportFrom",foreignKey: "from_user_id"});
  User.hasMany(UserReport, { as:"UserReportFrom",foreignKey: "from_user_id"});
  Activity.hasOne(ActivityUser, { as:"PrivateUser",foreignKey: "activity_id"});
  ChatRoom.hasOne(ChatRoomHistory, { as:"Chat_Room_History",foreignKey: "chatroom_id"});
  Group.hasOne(GroupChat, { as:"Group_Chat",foreignKey: "group_id"});
  ChatRoom.hasOne(ChatRoomParticipant, { as:"ChatRoom_Participant",foreignKey: "chatroom_id"});
  Group.hasOne(GroupsParticipant, { as:"Groups_Participant",foreignKey: "group_id"});
  Activity.hasOne(ActivityUser, { as:"IsParticipant",foreignKey: "activity_id"});
  SlambookBeat.belongsTo(User, { as:"UserTo",foreignKey: "user_to_id"});
  SlambookBeat.belongsTo(User, { as:"UserFrom",foreignKey: "user_from_id"});
  Poll.hasOne(PollUser, { as:"PollUserDetails",foreignKey: "poll_id"});

  return {
    Activity,
    ActivityGroup,
    ActivityUser,
    ChatRoom,
    ChatRoomHistory,
    ChatRoomHistoryViewed,
    ChatRoomInvited,
    ChatRoomParticipant,
    ChatroomUserReportReply,
    ChatroomUserReport,
    DjangoMigration,
    GroupChat,
    GroupChatInvited,
    GroupChatViewed,
    GroupChatroomUserReportReply,
    GroupChatroomUserReport,
    Group,
    GroupsParticipant,
    MasterActivity,
    MasterBeatQuestion,
    MasterGiftsReward,
    MasterIndustry,
    MasterInterest,
    MasterLanguage,
    MasterProfession,
    MasterRegion,
    PollOption,
    PollUserReportReply,
    PollUserReport,
    PollUser,
    PollViewed,
    Poll,
    PostCommentLike,
    PostCommentReplayLike,
    PostCommentReply,
    PostComment,
    PostUserReportReply,
    PostUserReport,
    PostUser,
    Post,
    SlambookBeatQuestion,
    SlambookBeat,
    UserFollowing,
    UserGiftsReward,
    UserInterest,
    UserLoginHistory,
    UserNotificationSetting,
    UserPrivacySetting,
    UserReportReply,
    UserReport,
    User,
    UsersLanguage,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
