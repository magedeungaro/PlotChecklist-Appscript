const ssId = "paste the reference worksheet id here";
const favicon = "img/favicon.ico";
const ss = SpreadsheetApp.openById(ssId);

const doGet = (e) => {
  return html("index", "Checklist de Visitas", "Magê");
};
class Area {
  readonly id: number;
  readonly desc: string;
  readonly idResp: number;
  readonly sig: number;

  constructor(id: number) {
    const queryStr = xlQuery(
      "Areas!A2:E",
      `SELECT B, C,D WHERE A = ${id} AND E = TRUE`
    );

    const area = query(queryStr);

    if (id > 1) area.shift();

    let desc: string, idResp: number, sig: number;
    [sig, desc, idResp] = area.flat();

    this.id = id;
    this.desc = desc;
    this.idResp = idResp;
    this.sig = sig;
  }

  static all(id: number) {
    const queryStr = xlQuery(
      "Areas!A2:E",
      `SELECT A, C WHERE D = ${id} AND E = TRUE`
    );

    let areaQuery = query(queryStr);

    if (id > 1) areaQuery.shift();

    const areas = keyValueMaker(areaQuery);

    return areas;
  }
}
class Category {
  readonly id: number;
  readonly desc: string;
  readonly idResp: number;

  constructor(id: number) {
    const queryStr = xlQuery(
      "Acao!A2:D",
      `SELECT B, C WHERE A = ${id} AND D = TRUE`
    );
    const categoriesQuery = query(queryStr);

    if (categoriesQuery.length > 1) categoriesQuery.shift();

    let desc: string, idResp: number;
    [desc, idResp] = categoriesQuery.flat();

    this.id = id;
    this.desc = desc;
    this.idResp = idResp;
  }

  operationsManager(): Manager {
    return new Manager(this.idResp);
  }

  nonCompliances(): any[][] {
    return NonCompliance.all(this.id);
  }

  status() {
    return "PENDENTE";
  }

  static all(): keyValue[] {
    const queryStr = xlQuery("Acao!A2:D", "SELECT A, B WHERE D = TRUE");
    const categories = keyValueMaker(query(queryStr));

    return categories;
  }

  static nonCompliances(id: number): keyValue[] {
    const category = new Category(id);
    let nonCompliancesQuery = category.nonCompliances();

    if (nonCompliancesQuery.length > 1) nonCompliancesQuery.shift();

    const nonCompliances = keyValueMaker(nonCompliancesQuery);

    return nonCompliances;
  }
}

const allCategories = () => {
  return Category.all();
};

const nonCompliances = ({ id }: { id: number }) => {
  return Category.nonCompliances(id);
};
class Manager {
  readonly id: number;
  readonly username: string;
  readonly name: string;

  constructor(id: ManagerID) {
    let xlColumn: string = "A";

    if (typeof id == "string") {
      id = `'${id}'`;
      xlColumn = "B";
    }

    const queryStr = xlQuery(
      "GP!A2:E",
      `SELECT A, B, C WHERE ${xlColumn} = ${id} AND E = TRUE`
    );
    const res = query(queryStr);

    //problema com a query que está retornando um valor a mais e não achei solução ainda, apenas essa gambiarra
    if (res.length > 1) res.shift();

    const manager = res.flat();

    this.id = manager[0];
    this.username = manager[1];
    this.name = manager[2];
  }
}
class NonCompliance {
  readonly id: number;
  readonly desc: string;

  constructor(id: number) {
    const queryStr = xlQuery(
      "NConformidades!A2:D",
      `SELECT B WHERE A = ${id} AND D = TRUE`
    );
    let nonCompliance = query(queryStr);

    if (nonCompliance.length > 1) nonCompliance.shift();

    const description: string = nonCompliance.flat()[0];

    this.id = id;
    this.desc = description;
  }

  static all(categoryId: number): any[][] {
    const queryStr = xlQuery(
      "NConformidades!A2:D",
      `SELECT A, B WHERE C = ${categoryId} AND D = TRUE`
    );

    return query(queryStr);
  }
}
class ProcessManager extends Manager {
  constructor(username: ManagerID) {
    super(username);
  }

  getAreas() {
    const areas = Area.all(this.id);

    return areas;
  }
}

const getProcessManagerInfo = ({ username }: { username: string }) => {
  const processManager = new ProcessManager(username);

  return { name: processManager.name, areas: processManager.getAreas() };
};
const html = (fileName: string, title: string, company: string) => {
  let temp = HtmlService.createTemplateFromFile(fileName);
  return temp
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setFaviconUrl(favicon)
    .setTitle(`${title} • ${company}`);
};

const include = (fileName: string) => {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
};

const getData = (
  wsName: string,
  startRow: number,
  startCol: number,
  numCols: number
): any[][] => {
  let ws = ss.getSheetByName(wsName);
  let data = ws
    .getRange(
      startRow,
      startCol,
      ws.getRange(1, 1).getDataRegion().getLastRow() - 1,
      numCols
    )
    .getValues();

  return data;
};

const query = (request: string): any[][] => {
  let sheet = ss.insertSheet();
  let range = sheet.getRange(1, 1);
  range.setFormula(request);

  let value = sheet.getDataRange().getValues();
  ss.deleteSheet(sheet);

  return value;
};

const xlQuery = (rng: string, query: string) => {
  return `=IFERROR(QUERY(${rng}; "${query}";1);"")`;
};

const writeData = (wsName: string, infoArray: Array<any>): void => {
  const ws = ss.getSheetByName(wsName);

  ws.appendRow(infoArray);
};

class err {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
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
type ManagerID = number | string;

interface keyValue {
  id: number;
  desc: string;
}
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
class Visit {
  readonly areaId: number;
  readonly categoryId: number;
  readonly nonCompliancesIds: Array<number>;
  readonly plot: string;
  readonly obs: string;
  readonly date: Date;

  readonly area: Area;
  readonly processManager: ProcessManager;
  readonly category: Category;
  readonly operationManager: Manager;

  constructor({
    areaId,
    categoryId,
    nonCompliancesIds,
    plot,
    obs,
  }: {
    areaId: number;
    categoryId?: number;
    nonCompliancesIds?: Array<number>;
    plot?: string;
    obs?: string;
  }) {
    this.area = new Area(areaId);
    this.processManager = new ProcessManager(this.area.idResp);
    this.category = new Category(categoryId);
    this.operationManager = new Manager(this.category.idResp);
    this.nonCompliancesIds = nonCompliancesIds;
    this.plot = plot;
    this.obs = obs;
    this.date = new Date();
  }

  hasCategory(): boolean {
    return this.category.id > 0;
  }

  nonCompliances(): string {
    const nonCompliances = this.nonCompliancesIds.map((id) => {
      let nonCompliance = new NonCompliance(id);
      return nonCompliance.desc;
    });

    return nonCompliances.join(";");
  }

  hasPlot(): boolean {
    if (!this.hasCategory()) return false;

    return this.plot.length > 0;
  }

  create() {
    if (this.hasCategory() && !this.hasPlot())
      throw new err("Visita com não conformidade precisa ter talhão.");

    let nonComplianceInfo = ["", "", "", "", ""];
    let status = "";

    if (this.hasCategory()) {
      nonComplianceInfo = [
        this.operationManager.username,
        this.operationManager.name,
        this.category.desc,
        this.nonCompliances(),
        this.plot,
      ];

      status = this.category.status();
    }

    const params = dateParams();
    const visit = [
      this.date,
      params.hash,
      this.processManager.username,
      this.processManager.name,
      xlString(this.area.sig),
      this.area.desc,
      nonComplianceInfo,
      this.obs,
      params.month,
      params.week,
      params.year,
      status,
    ].flat();

    return visit;
  }

  static save({
    areaId,
    categoryId,
    nonCompliancesIds,
    plot,
    obs,
  }: {
    areaId: number;
    categoryId?: number;
    nonCompliancesIds?: Array<number>;
    plot?: string;
    obs?: string;
  }) {
    const visit = new Visit({
      areaId,
      categoryId,
      nonCompliancesIds,
      plot,
      obs,
    });

    const wsName = "Database";

    const visitInfo = visit.create();

    writeData(wsName, visitInfo);

    return visitInfo;
  }
}

const saveVisit = (params: any) => {
  const visit = Visit.save(params);

  const visitLog = [
    visit[3],
    visit[5],
    visit[8],
    visit[9],
    visit[10],
    visit[11],
  ];

  return visitLog;
};
