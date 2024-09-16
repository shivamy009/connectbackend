const  mongoose = require("mongoose")
let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema= new mongoose.Schema({
    username: { type: String,
         required: true,
          unique: true
         },
    password: { 
        type: String,
         required: true
         },

         profile_img: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
            } 
        },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//    friendRequests: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',  // Reference to the User model
//   }],

friendRequests: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

})

module.exports=mongoose.model('User',userSchema)