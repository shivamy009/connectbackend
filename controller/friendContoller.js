const User=require('../model/userModel')

exports.getFriend=async(req,res)=>{
    try{
        const { query } = req.body;
        // console.log(query)
        const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('username profile_img');

        // console.log(users)
        if(!users.length){
            return res.status(400).json({
                success:false,
                message:"User not found ",
            //    users
            })

        }
        return res.status(200).json({
            success:true,
            // message:"User login success",
           users
        })

    }
    catch(err){
        // console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error while serching friend"
        })
    }
}
// send friend request
exports.sendFriend=async(req,res)=>{
    const senderId = req.user.id;   // The authenticated user's ID (sender)
  const recipientId = req.params.id;  // The user receiving the friend request
    try{
        // Check if recipient exists
    const recipientUser = await User.findById(recipientId);
    if (!recipientUser) {
      return res.status(404).json({ msg: 'Recipient user not found' });
    }

    // Check if a request already exists or users are already friends
    const existingRequest = recipientUser.friendRequests.find(
      (req) => req.sender.toString() === senderId && req.status === 'pending'
    );
    const isAlreadyFriend = recipientUser.friends.includes(senderId);

    if (existingRequest) {
      return res.status(400).json({ msg: 'Friend request already sent' });
    }
    if (isAlreadyFriend) {
      return res.status(400).json({ msg: 'You are already friends' });
    }

    // Add the friend request with a status of 'pending'
    recipientUser.friendRequests.push({
      sender: senderId,
      status: 'pending',
    });

    await recipientUser.save();

    res.json({ msg: 'Friend request sent' });


    }
    catch(err){
        // console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error while sending friend request"
        })
    }
}

// exports.respondFriend=async(req,res)=>{
//     const { requestId, action } = req.body;
//     try{
//         const user = await User.findById(req.user.id);
//     const request = user.friendRequests.id(requestId);
//     if (!request) return res.status(404).json({ msg: 'Request not found' });

//     if (action === 'accept') {
//         user.friends.push(request.from);
//         await User.findByIdAndUpdate(request.from, { $push: { friends: user._id } });
//       }

//       request.remove();
//       await user.save();
//      return res.json({ msg: `Friend request ${action}ed` });

//     }
//     catch(err){
//         return res.status(400).json({
//             success:false,
//             message:"Error while responding friend"
//         })
//     }
// }

exports.accept=async(req,res)=>{
    const userId  = req.user.id; // ID of the current user
  const requestId  = req.params.id; // ID of the user whose request is being accepted

//   console.log(userId)
//   console.log(requestId)

  try {
    // Find the current user
    const currentUser = await User.findById(userId);
    const requester = await User.findById(requestId);

    if (!currentUser || !requester) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the request exists

    if (!currentUser.friendRequests.some(req => req.sender.toString() === requestId)) {
      return res.status(400).json({ msg: 'No friend request from this user' });
    }

    // Remove the request from current user's friend requests
    currentUser.friendRequests = currentUser.friendRequests.filter(req => req.sender.toString() !== requestId);

    // Add each other to friends list
    currentUser.friends.push(requester._id);
    requester.friends.push(currentUser._id);

    // Save changes
    await currentUser.save();
    await requester.save();

    res.json({ msg: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

exports.reject=async(req,res)=>{
    const userId  = req.user.id; // ID of the current user
    const requestId  = req.params.id; // ID of the user whose request is being rejected
    // console.log(requestId)
    try {
      // Find the current user
      const currentUser = await User.findById(userId);
  
      if (!currentUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Check if the request exists
      if (!currentUser.friendRequests.some(req => req.sender.toString() === requestId)) {
        return res.status(400).json({ msg: 'No friend request from this user' });
      }
  
      // Remove the request from current user's friend requests
      currentUser.friendRequests = currentUser.friendRequests.filter(req => req.sender.toString() !== requestId);
  
      // Save changes
      await currentUser.save();
  
      res.json({ msg: 'Friend request rejected' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
}

exports.getfriendandrequest=async(req,res)=>{
    try {
        const userId = req.user.id; // Assuming the user ID comes from JWT
    
        // Find the user and populate friends and friend requests with their details
        const user = await User.findById(userId)
          .populate('friends', '_id username profile_img')        // Populates friend's details
          .populate('friendRequests.sender', 'sender username profile_img') // Populates friend request details
    
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }
    
        // Prepare the response with friends and friend requests
        const friends = user.friends.map(friend => ({
          _id: friend._id,
          username: friend.username,
        //   email: friend.email
        profile_img:friend.profile_img
        }));
    
        const friendRequests = user.friendRequests.map(request => ({
          _id: request.sender,
          username: request.username,
          profile_img:request.profile_img
        }));
    
        // Send the response with both friends and friend requests
        res.json({
          friends,
          friendRequests
        });
      } catch (err) {
        // console.error(err);
        res.status(500).json({ msg: 'Server error' });
      }
}

exports.unfriend = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user is authenticated and their ID is stored in req.user
        const friendId = req.params.friendId;

        // Remove the friend from the user's friend list
        await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
        
        // Remove the user from the friend's friend list
        await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

        return res.status(200).json({ message: 'Friend removed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

exports.findTenuser=async(req,res)=>{
    try{
        const users = await User.find()
        .limit(6)
        
        if(!users){
            return res.status(400).json({
                message:"NO data found"
            })
        }

        return res.status(200).json({
            // message:"NO data found"
            users
        })
    }

    catch(err){
        // console.log(err)
        
            return res.status(400).json({
                message:"Error while fetching ten user"
            })
      

    }

}