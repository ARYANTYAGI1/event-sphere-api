const User = require('../../models/User');
const CommonHelper = require('../../helpers/common');

module.exports = {
    createDefaultAdmin: async function (req, res) {
        const nuser = {
            fullName: process.env.ADMIN_FULLNAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            isEmailVerified: process.env.ADMIN_EMAIL_VERIFIED === 'true',
            userType: parseInt(process.env.ADMIN_USER_TYPE),
            address: {
                fullAddress: process.env.ADMIN_ADDRESS_FULL,
                location: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(process.env.ADMIN_ADDRESS_COORDINATES_LONG),
                        parseFloat(process.env.ADMIN_ADDRESS_COORDINATES_LAT)
                    ]
                }
            }
        };     
        try {
            let usr = await User.findOne({ email: nuser.email });
            if (!usr) {
                let user = new User(nuser);
                user.password = await CommonHelper.bcryptPassword(nuser.password);
                await user.save();
                console.log("Super Admin created successfully");
            } else {
                usr.fullName = nuser.fullName;
                usr.isEmailVerified = nuser.isEmailVerified;
                usr.address = nuser.address;
                await usr.save();
                console.log("Super Admin updated successfully");
            }
        } catch (err) {
            console.error('Error creating or updating Super Admin:', err);
        }
    }
};
