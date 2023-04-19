const DataTypes = require("sequelize").DataTypes;
const _Activity = require("./Activity");
const _ActivityUser = require("./ActivityUser");
const _ChatRoom = require("./ChatRoom");
const _ChatRoomHistory = require("./ChatRoomHistory");
const _ChatroomUserReportReply = require("./ChatroomUserReportReply");
const _ChatroomUserReport = require("./ChatroomUserReport");
const _DjangoMigration = require("./DjangoMigration");
const _GroupChat = require("./GroupChat");
const _GroupChatroomUserReportReply = require("./GroupChatroomUserReportReply");
const _GroupChatroomUserReport = require("./GroupChatroomUserReport");
const _Group = require("./Group");
const _MasterActivity = require("./MasterActivity");
const _MasterBeatQuestion = require("./MasterBeatQuestion");
const _MasterIndustry = require("./MasterIndustry");
const _MasterInterest = require("./MasterInterest");
const _MasterProfession = require("./MasterProfession");
const _PollOption = require("./PollOption");
const _PollUserReportReply = require("./PollUserReportReply");
const _PollUserReport = require("./PollUserReport");
const _PollUser = require("./PollUser");
const _Poll = require("./Poll");
const _PostCommentReply = require("./PostCommentReply");
const _PostComment = require("./PostComment");
const _PostUserReportReply = require("./PostUserReportReply");
const _PostUserReport = require("./PostUserReport");
const _PostUser = require("./PostUser");
const _Post = require("./Post");
const _SlambookBeat = require("./SlambookBeat");
const _UserFollowing = require("./UserFollowing");
const _UserInterest = require("./UserInterest");
const _User = require("./User");

function initModels(sequelize) {
  const Activity = _Activity(sequelize, DataTypes);
  const ActivityUser = _ActivityUser(sequelize, DataTypes);
  const ChatRoom = _ChatRoom(sequelize, DataTypes);
  const ChatRoomHistory = _ChatRoomHistory(sequelize, DataTypes);
  const ChatroomUserReportReply = _ChatroomUserReportReply(sequelize, DataTypes);
  const ChatroomUserReport = _ChatroomUserReport(sequelize, DataTypes);
  const DjangoMigration = _DjangoMigration(sequelize, DataTypes);
  const GroupChat = _GroupChat(sequelize, DataTypes);
  const GroupChatroomUserReportReply = _GroupChatroomUserReportReply(sequelize, DataTypes);
  const GroupChatroomUserReport = _GroupChatroomUserReport(sequelize, DataTypes);
  const Group = _Group(sequelize, DataTypes);
  const MasterActivity = _MasterActivity(sequelize, DataTypes);
  const MasterBeatQuestion = _MasterBeatQuestion(sequelize, DataTypes);
  const MasterIndustry = _MasterIndustry(sequelize, DataTypes);
  const MasterInterest = _MasterInterest(sequelize, DataTypes);
  const MasterProfession = _MasterProfession(sequelize, DataTypes);
  const PollOption = _PollOption(sequelize, DataTypes);
  const PollUserReportReply = _PollUserReportReply(sequelize, DataTypes);
  const PollUserReport = _PollUserReport(sequelize, DataTypes);
  const PollUser = _PollUser(sequelize, DataTypes);
  const Poll = _Poll(sequelize, DataTypes);
  const PostCommentReply = _PostCommentReply(sequelize, DataTypes);
  const PostComment = _PostComment(sequelize, DataTypes);
  const PostUserReportReply = _PostUserReportReply(sequelize, DataTypes);
  const PostUserReport = _PostUserReport(sequelize, DataTypes);
  const PostUser = _PostUser(sequelize, DataTypes);
  const Post = _Post(sequelize, DataTypes);
  const SlambookBeat = _SlambookBeat(sequelize, DataTypes);
  const UserFollowing = _UserFollowing(sequelize, DataTypes);
  const UserInterest = _UserInterest(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);

  ActivityUser.belongsTo(Activity, { foreignKey: "activity_id"});
  Activity.hasMany(ActivityUser, { foreignKey: "activity_id"});
  Post.belongsTo(Activity, { foreignKey: "activity_id"});
  Activity.hasMany(Post, { foreignKey: "activity_id"});
  ChatRoomHistory.belongsTo(ChatRoom, { foreignKey: "chatroom_id"});
  ChatRoom.hasMany(ChatRoomHistory, { foreignKey: "chatroom_id"});
  ChatroomUserReport.belongsTo(ChatRoom, { foreignKey: "chatroom_id"});
  ChatRoom.hasMany(ChatroomUserReport, { foreignKey: "chatroom_id"});
  ChatroomUserReportReply.belongsTo(ChatroomUserReport, { foreignKey: "chatroomreport_id"});
  ChatroomUserReport.hasMany(ChatroomUserReportReply, { foreignKey: "chatroomreport_id"});
  GroupChatroomUserReportReply.belongsTo(GroupChatroomUserReport, { foreignKey: "group_chat_report_id"});
  GroupChatroomUserReport.hasMany(GroupChatroomUserReportReply, { foreignKey: "group_chat_report_id"});
  Activity.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(Activity, { foreignKey: "group_id"});
  GroupChat.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(GroupChat, { foreignKey: "group_id"});
  GroupChatroomUserReport.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(GroupChatroomUserReport, { foreignKey: "group_id"});
  Poll.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(Poll, { foreignKey: "group_id"});
  Post.belongsTo(Group, { foreignKey: "group_id"});
  Group.hasMany(Post, { foreignKey: "group_id"});
  Activity.belongsTo(MasterActivity, { foreignKey: "activity_id"});
  MasterActivity.hasMany(Activity, { foreignKey: "activity_id"});
  MasterProfession.belongsTo(MasterIndustry, { foreignKey: "industry_id"});
  MasterIndustry.hasMany(MasterProfession, { foreignKey: "industry_id"});
  UserInterest.belongsTo(MasterInterest, { foreignKey: "interest_id"});
  MasterInterest.hasMany(UserInterest, { foreignKey: "interest_id"});
  PollUser.belongsTo(PollOption, { foreignKey: "is_voted_option_id"});
  PollOption.hasMany(PollUser, { foreignKey: "is_voted_option_id"});
  PollUserReportReply.belongsTo(PollUserReport, { foreignKey: "postuserreport_id"});
  PollUserReport.hasMany(PollUserReportReply, { foreignKey: "postuserreport_id"});
  PollUserReport.belongsTo(PollUser, { foreignKey: "postuser_id"});
  PollUser.hasMany(PollUserReport, { foreignKey: "postuser_id"});
  PollOption.belongsTo(Poll, { foreignKey: "poll_id"});
  Poll.hasMany(PollOption, { foreignKey: "poll_id"});
  PollUser.belongsTo(Poll, { foreignKey: "post_id"});
  Poll.hasMany(PollUser, { foreignKey: "post_id"});
  PostCommentReply.belongsTo(PostComment, { foreignKey: "postcomment_id"});
  PostComment.hasMany(PostCommentReply, { foreignKey: "postcomment_id"});
  PostUserReportReply.belongsTo(PostUserReport, { foreignKey: "postuserreport_id"});
  PostUserReport.hasMany(PostUserReportReply, { foreignKey: "postuserreport_id"});
  PostComment.belongsTo(PostUser, { foreignKey: "postuser_id"});
  PostUser.hasMany(PostComment, { foreignKey: "postuser_id"});
  PostUserReport.belongsTo(PostUser, { foreignKey: "postuser_id"});
  PostUser.hasMany(PostUserReport, { foreignKey: "postuser_id"});
  PostUser.belongsTo(Post, { foreignKey: "post_id"});
  Post.hasMany(PostUser, { foreignKey: "post_id"});
  MasterBeatQuestion.belongsTo(UserFollowing, { foreignKey: "user_following_id"});
  UserFollowing.hasMany(MasterBeatQuestion, { foreignKey: "user_following_id"});
  SlambookBeat.belongsTo(UserFollowing, { foreignKey: "user_following_id"});
  UserFollowing.hasMany(SlambookBeat, { foreignKey: "user_following_id"});
  ActivityUser.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(ActivityUser, { foreignKey: "user_id"});
  ChatRoom.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(ChatRoom, { foreignKey: "user_id"});
  ChatRoomHistory.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(ChatRoomHistory, { foreignKey: "user_id"});
  GroupChat.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(GroupChat, { foreignKey: "user_id"});
  GroupChatroomUserReport.belongsTo(User, { foreignKey: "reported_user_id"});
  User.hasMany(GroupChatroomUserReport, { foreignKey: "reported_user_id"});
  Group.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(Group, { foreignKey: "user_id"});
  PollUser.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(PollUser, { foreignKey: "user_id"});
  Poll.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(Poll, { foreignKey: "user_id"});
  PostUser.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(PostUser, { foreignKey: "user_id"});
  Post.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(Post, { foreignKey: "user_id"});
  UserFollowing.belongsTo(User, { foreignKey: "user_from_id"});
  User.hasMany(UserFollowing, { foreignKey: "user_from_id"});
  UserFollowing.belongsTo(User, { foreignKey: "user_to_id"});
  User.hasMany(UserFollowing, { foreignKey: "user_to_id"});
  UserInterest.belongsTo(User, { foreignKey: "user_id"});
  User.hasMany(UserInterest, { foreignKey: "user_id"});

  return {
    Activity,
    ActivityUser,
    ChatRoom,
    ChatRoomHistory,
    ChatroomUserReportReply,
    ChatroomUserReport,
    DjangoMigration,
    GroupChat,
    GroupChatroomUserReportReply,
    GroupChatroomUserReport,
    Group,
    MasterActivity,
    MasterBeatQuestion,
    MasterIndustry,
    MasterInterest,
    MasterProfession,
    PollOption,
    PollUserReportReply,
    PollUserReport,
    PollUser,
    Poll,
    PostCommentReply,
    PostComment,
    PostUserReportReply,
    PostUserReport,
    PostUser,
    Post,
    SlambookBeat,
    UserFollowing,
    UserInterest,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
