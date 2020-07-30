exports.getDate = () => {
  const day = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return day.toLocaleDateString("en-us", options);
};

exports.getDay = () => {
  const day = new Date();
  const options = {
    weekday: "long",
  };

  return day.toLocaleDateString("en-us", options);
};
