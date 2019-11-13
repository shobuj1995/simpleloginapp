var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');

var ContactSchema=mongoose.Schema({
	phone: {
		type: String,
		index:true
	},
	
	email: {
		type: String

	},
	address: {
		type: String

	}
});

var Contact = module.exports = mongoose.model('Contact',ContactSchema);

module.exports.createContact=function(newContact,callback){
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newContact.password, salt, function(err, hash) {
        // Store hash in your password DB.
        newContact.password= hash;
        newContact.save(callback);

    });
});
}
// module.exports.getContactByContactname=function(Contactname,callback){
// 	var query = {Contactname: Contactname};
// 	Contact.findOne(query,callback);
// }

// module.exports.getContactById=function(id,callback){
// 	Contact.findById(id,callback);
// }

// module.exports.comparePassword=function(candidatePassword,hash,callback){
// 	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
// 		if(err)throw err;
// 		callback(null,isMatch);
// 	});
// }