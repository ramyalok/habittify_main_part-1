const Review = require("../model1/Review");
//create a review -post 
exports.createReview = async(req,res)=>{
    try{
      const { rating, message } = req.body;
      // Check if user already reviewed
      const existingReview = await Review.findOne({
        user: req.user.id,
      });
     if (existingReview) {
    return res.status(400).json({success: false, message: "You have already submitted a review."});
    }
     const review = await Review.create({ user: req.user.id, rating, message });
     res.status(201).json({
       success: true,
       message: "Review submitted successfully.",
       data: review,
     });
    }
   
    catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
//getreview -get
exports.getMyReview = async(req,res)=>{
    try{
        const review = await Review.findOne({
            user:req.user.id,
        }).populate("user","username email profileImage");

        res.status(200).json({success:true,data:review,});
    }
    catch(error){
      console.log(error);  
      res.status(500).json({ success: false, message: error.message });
    }
}
//update a reviw -put
exports.updateReview = async (req, res) => {
  try {
    const { rating, message } = req.body;
    const review = await Review.findOneAndUpdate(
      {
        user: req.user.id,
      },
      { rating, message },
      { returnDocument: "after", runValidators: true },
    );
    if (!review) {
      return res.status(404).json({success: false,message: "Review not found."});
    }
    res.status(200).json({success: true,message: "Review updated successfully.",data: review});
  } catch (error) {
    res.status(500).json({ success: false,message: error.message });
  }
};
//delete review -delete
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      user: req.user.id,
    });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    res.status(200).json({success: true,message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({  success: false, message: error.message});
  }
};

//review admin controller
//review all review of logged  -get
 exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "username email profileImage")
      .sort({
        createdAt: -1, //Descending order form new review to old review
      });

    res.status(200).json({ success: true, count: reviews.length, data: reviews});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 

//approve review - put
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true,
      },
      { returnDocument: "after", runValidators: true },
    );
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found."});
    }
    res.status(200).json({ success: true, message: "Review approved successfully.",data: review});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message});
  }
};
 
// Admin Delete Review -delete
exports.deleteReviewByAdmin = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found."});
    }
    return res.status(200).json({ success: true,message: "Review deleted successfully."});
  }
   catch (error) {
    return res.status(500).json({ success: false,message: error.message});
  }
};

 
// Public - Get Approved Reviews -get
exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      isApproved: true,
    })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};