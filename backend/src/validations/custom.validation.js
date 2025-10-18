const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message(' Mật khẩu phải chứa ít nhất 8 ký tự');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(' Mật khẩu phải bao gồm cả chữ cái và số');
  }
  return value;
};
module.exports = {
  password,
};