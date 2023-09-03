const dateParams = () => {
  let date = new Date();
  let month = date.getMonth() + 1;
  let week = Math.ceil(date.getDate() / 7);
  if (week > 4) {
    week = 4;
  }
  let year = date.getFullYear();
  let hash = date.getTime();

  return { month: month, week: week, year: year, hash: hash };
};

const xlString = (number: number) => {
  return `'${number}`;
};

const keyValueMaker = (array: any[][]): Array<keyValue> => {
  let obj: Array<keyValue> = [];

  array.map((v) => {
    obj.push({ id: v[0], desc: v[1] });
  });

  return obj;
};
