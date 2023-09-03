const obj = {
  options: [
    { id: 1, desc: "a" },
    { id: 2, desc: "b" },
  ],
  msg: "teste",
  firstOptionDisabled: false,
};

const testSelect = ({ options, msg, firstOptionDisabled }) => {
  const firstOption = `<option value="" disabled="${firstOptionDisabled}" selected>${msg}</option>`;

  let htmlOptions = options.map((opt) => {
    return `<option value="${opt.id}">${opt.desc}</option>`;
  });

  htmlOptions.unshift(firstOption);

  console.log(htmlOptions.join(""));
};

testSelect(obj);
