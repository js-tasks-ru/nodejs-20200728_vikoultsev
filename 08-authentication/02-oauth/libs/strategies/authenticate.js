const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) {
      done(null, false, 'Не указан email');
      return;
    }
    const user = await User.findOne({email});

    if (!user) {
      const newUser = await User.create({
        email,
        displayName,
      });
      done(null, newUser);
      return;
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
};
