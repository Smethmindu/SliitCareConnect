const fakeAuth = (role = "STUDENT") => {
  return (req, res, next) => {
    if (role === "STUDENT") req.user = { userId: "STD001", role: "STUDENT" };
    else if (role === "COUNSELOR") req.user = { userId: "CNS001", role: "COUNSELOR" };
    else req.user = { userId: "ADMIN001", role: "ADMIN" };
    next();
  };
};

module.exports = fakeAuth;