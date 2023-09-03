const test = () => {
  const categories = allCategories();
  Logger.log(categories.flat());
};

const testQuery = () => {
  const queryStr = xlQuery(
    "GP!A2:E",
    "SELECT A, B, C WHERE B = 'cs225164' AND E = TRUE"
  );
  Logger.log(query(queryStr).flat());
};

const testHash = () => {
  const queryStr = xlQuery("Acao!A2:D", "SELECT A, B WHERE D = TRUE");
  const testArr = query(queryStr);
  Logger.log(keyValueMaker(testArr));
};

const testClasses = () => {
  const gp = new Manager("cs225164");

  Logger.log({ log: "manager class", id: gp.id, username: gp.username, name: gp.name });

  const gp2 = new ProcessManager(1);

  Logger.log({
    log: "processManager class",
    id: gp2.id,
    username: gp2.username,
    name: gp2.name,
    areas: gp2.getAreas(),
  });

  const area = new Area(2);

  Logger.log({
    log: "area class",
    areaId: area.id,
    desc: area.desc,
    idresp: area.idResp,
  });

  const category = new Category(3);

  Logger.log({
    log: "category class",
    id: category.id,
    desc: category.desc,
    idresp: category.idResp,
    nonCompliances: category.nonCompliances(),
  });

  const nonCompliance = new NonCompliance(3);

  Logger.log({
    log: "nonCompliance class",
    id: nonCompliance.id,
    desc: nonCompliance.desc,
  });

  const visit = new Visit({
    areaId: area.id,
    categoryId: category.id,
    nonCompliancesIds: [2, 3, 4],
    plot: "plot",
    obs: "obs",
  });

  Logger.log({
    log: "visit class",
    gp: visit.processManager,
    go: visit.operationManager,
    area: visit.area,
    category: visit.category,
    nonCompliances: visit.nonCompliances(),
    plot: visit.plot,
    obs: visit.obs,
  });

  Logger.log({ log: "visit create", create: visit.create() });
};

const testVisit = () => {
  const params = {
    areaId: 3,
    categoryId: 1,
    nonCompliancesIds: [2, 3],
    plot: "plot",
    obs: "obs",
  };
  Logger.log(saveVisit(params));
  // Logger.log(Visit.save(params));
};
