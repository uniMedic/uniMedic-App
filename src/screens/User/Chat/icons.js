import React from "react";
import { Icon, Image } from "@ui-kitten/components";

module.exports.MenuIcon = (props) => <Icon {...props} name="settings" />;
module.exports.InfoIcon = (props) => <Icon {...props} name="info" />;
module.exports.ShareIcon = (props) => <Icon {...props} name="share-outline" />;
module.exports.LogoutIcon = (props) => <Icon {...props} name="log-out" />;
module.exports.PhotoIcon = (props) => <Icon {...props} name="image" />;
module.exports.HeartIcon = (props) => <Icon {...props} name="heart" />;
module.exports.LightIcon = (props) => <Icon {...props} name="bulb-outline" />;

const avatar1 = require("./../../../images/doctor1.png");
const avatar2 = require("./../../../images/doctor2.png");
const avatar3 = require("./../../../images/doctor3.png");
const avatar4 = require("./../../../images/doctor4.png");

var avatars = [avatar1, avatar2, avatar3, avatar4];

module.exports.ChatAvatar = function () {
  return avatars[Math.floor(Math.random() * avatars.length)];
};
