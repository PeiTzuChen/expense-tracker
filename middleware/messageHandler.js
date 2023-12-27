module.exports=(req,res,next)=>{
res.locals.success = req.flash('success')
res.locals.error_msg = req.flash("error");
next()
}

