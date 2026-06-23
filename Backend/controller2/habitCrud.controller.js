const HabitModel = require ("../model1/Addhabit");

exports.addHabit =  async(req,res)=>{

    try{
      const { habitName, emoji } = req.body;
      // check duplicate ONLY for current user or admin
      const IssameHabit = await HabitModel.findOne({ habitName,createdBy:req.user.id });
      if (IssameHabit) {
        return res.status(400).json({
          success: false,
          message: "Habit already Exists",
        });
      }
      const newHabit = await HabitModel.create({
        habitName,
        emoji,
        createdBy: req.user.id,
      });
      res
        .status(200)
        .json({
          success: true,
          message: "Habits added successfully",
          data: newHabit,
        });
    }
    catch(err){
    res.status(500).json({ message: err.message });
    }
}
// So Habit needs ownership.User A → only Exercise //User B → only Reading
// Habit project should use 😎createdBy 😎if:Every user owns their own habits

exports.getHabit = async(req,res)=>{

    try{
    const habits = await HabitModel.find({createdBy:req.user.id});
    res.status(200).json({success:true,message:"All Habits ",data:habits});
    }
    catch(error)
    {
      res.status(500).json({message:error.message});
    }

}

exports.updateHabit = async(req,res)=>{

    try{
        const updatedHabit = await HabitModel.findOneAndUpdate(
        {
        _id:req.params.id,
        createdBy:req.user.id
        },
        req.body,
        {returnDocument:"after",runValidators:true}
    );
//Update only//if logged user owns habit//User A can update only own habit
//Only _id → findByIdAndUpdate()/ /Multiple conditions → findOneAndUpdate()  
if(!updatedHabit)
    {
        return res.status(404).json({message:"Habit Not Found"})
    }
    
    res.status(200).json({success:true,message:"Habit Updated successfully",data:updatedHabit});

    }
    catch(error){
     res.status(500).json({ message: err.message });
    }
}

exports.deleteHabit = async(req,res)=>{
    try{
        const deletedHabit= await HabitModel.findByIdAndDelete({
        _id:req.params.id,
        createdBy:req.user.id
        })

        if (!deletedHabit) {
          return res.status(404).json({message:"habit not found"});
        }

        res.status(200).json({success:true,message:"Habit deleted successfully",data:deletedHabit})
    }
    catch(error){
        res.status(500).json({ message: err.message });  
    }
}



// Admin → sees own habits only
// User → sees own habits only
// Duplicate allowed across users
// Duplicate blocked inside same user