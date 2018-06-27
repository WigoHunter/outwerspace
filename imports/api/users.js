import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const Users = new Mongo.Collection("users");

if (Meteor.isServer) {
	Meteor.publish("users", function findthat() {
		return Users.find();
	});
}

Meteor.methods({
	"users.insert"(user) {
		Users.insert(user);
	},

	"user.setLocation"(data) {
		Users.update({
			userId: data.id
		}, {
			$set: {
				location: data.location
			}
		});
	}
});