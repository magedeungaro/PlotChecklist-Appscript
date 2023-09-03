var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ssId = "paste the reference worksheet id here";
var favicon = "img/favicon.ico";
var ss = SpreadsheetApp.openById(ssId);
var doGet = function (e) {
    return html("index", "Checklist de Visitas", "Magê");
};
var Area = (function () {
    function Area(id) {
        var _a;
        var queryStr = xlQuery("Areas!A2:E", "SELECT B, C,D WHERE A = " + id + " AND E = TRUE");
        var area = query(queryStr);
        if (id > 1)
            area.shift();
        var desc, idResp, sig;
        _a = area.flat(), sig = _a[0], desc = _a[1], idResp = _a[2];
        this.id = id;
        this.desc = desc;
        this.idResp = idResp;
        this.sig = sig;
    }
    Area.all = function (id) {
        var queryStr = xlQuery("Areas!A2:E", "SELECT A, C WHERE D = " + id + " AND E = TRUE");
        var areaQuery = query(queryStr);
        if (id > 1)
            areaQuery.shift();
        var areas = keyValueMaker(areaQuery);
        return areas;
    };
    return Area;
}());
var Category = (function () {
    function Category(id) {
        var _a;
        var queryStr = xlQuery("Acao!A2:D", "SELECT B, C WHERE A = " + id + " AND D = TRUE");
        var categoriesQuery = query(queryStr);
        if (categoriesQuery.length > 1)
            categoriesQuery.shift();
        var desc, idResp;
        _a = categoriesQuery.flat(), desc = _a[0], idResp = _a[1];
        this.id = id;
        this.desc = desc;
        this.idResp = idResp;
    }
    Category.prototype.operationsManager = function () {
        return new Manager(this.idResp);
    };
    Category.prototype.nonCompliances = function () {
        return NonCompliance.all(this.id);
    };
    Category.prototype.status = function () {
        return "PENDENTE";
    };
    Category.all = function () {
        var queryStr = xlQuery("Acao!A2:D", "SELECT A, B WHERE D = TRUE");
        var categories = keyValueMaker(query(queryStr));
        return categories;
    };
    Category.nonCompliances = function (id) {
        var category = new Category(id);
        var nonCompliancesQuery = category.nonCompliances();
        if (nonCompliancesQuery.length > 1)
            nonCompliancesQuery.shift();
        var nonCompliances = keyValueMaker(nonCompliancesQuery);
        return nonCompliances;
    };
    return Category;
}());
var allCategories = function () {
    return Category.all();
};
var nonCompliances = function (_a) {
    var id = _a.id;
    return Category.nonCompliances(id);
};
var Manager = (function () {
    function Manager(id) {
        var xlColumn = "A";
        if (typeof id == "string") {
            id = "'" + id + "'";
            xlColumn = "B";
        }
        var queryStr = xlQuery("GP!A2:E", "SELECT A, B, C WHERE " + xlColumn + " = " + id + " AND E = TRUE");
        var res = query(queryStr);
        if (res.length > 1)
            res.shift();
        var manager = res.flat();
        this.id = manager[0];
        this.username = manager[1];
        this.name = manager[2];
    }
    return Manager;
}());
var NonCompliance = (function () {
    function NonCompliance(id) {
        var queryStr = xlQuery("NConformidades!A2:D", "SELECT B WHERE A = " + id + " AND D = TRUE");
        var nonCompliance = query(queryStr);
        if (nonCompliance.length > 1)
            nonCompliance.shift();
        var description = nonCompliance.flat()[0];
        this.id = id;
        this.desc = description;
    }
    NonCompliance.all = function (categoryId) {
        var queryStr = xlQuery("NConformidades!A2:D", "SELECT A, B WHERE C = " + categoryId + " AND D = TRUE");
        return query(queryStr);
    };
    return NonCompliance;
}());
var ProcessManager = (function (_super) {
    __extends(ProcessManager, _super);
    function ProcessManager(username) {
        return _super.call(this, username) || this;
    }
    ProcessManager.prototype.getAreas = function () {
        var areas = Area.all(this.id);
        return areas;
    };
    return ProcessManager;
}(Manager));
var getProcessManagerInfo = function (_a) {
    var username = _a.username;
    var processManager = new ProcessManager(username);
    return { name: processManager.name, areas: processManager.getAreas() };
};
var html = function (fileName, title, company) {
    var temp = HtmlService.createTemplateFromFile(fileName);
    return temp
        .evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .addMetaTag("viewport", "width=device-width, initial-scale=1")
        .setFaviconUrl(favicon)
        .setTitle(title + " \u2022 " + company);
};
var include = function (fileName) {
    return HtmlService.createHtmlOutputFromFile(fileName).getContent();
};
var getData = function (wsName, startRow, startCol, numCols) {
    var ws = ss.getSheetByName(wsName);
    var data = ws
        .getRange(startRow, startCol, ws.getRange(1, 1).getDataRegion().getLastRow() - 1, numCols)
        .getValues();
    return data;
};
var query = function (request) {
    var sheet = ss.insertSheet();
    var range = sheet.getRange(1, 1);
    range.setFormula(request);
    var value = sheet.getDataRange().getValues();
    ss.deleteSheet(sheet);
    return value;
};
var xlQuery = function (rng, query) {
    return "=IFERROR(QUERY(" + rng + "; \"" + query + "\";1);\"\")";
};
var writeData = function (wsName, infoArray) {
    var ws = ss.getSheetByName(wsName);
    ws.appendRow(infoArray);
};
var err = (function () {
    function err(message) {
        this.message = message;
    }
    return err;
}());
var test = function () {
    var categories = allCategories();
    Logger.log(categories.flat());
};
var testQuery = function () {
    var queryStr = xlQuery("GP!A2:E", "SELECT A, B, C WHERE B = 'cs225164' AND E = TRUE");
    Logger.log(query(queryStr).flat());
};
var testHash = function () {
    var queryStr = xlQuery("Acao!A2:D", "SELECT A, B WHERE D = TRUE");
    var testArr = query(queryStr);
    Logger.log(keyValueMaker(testArr));
};
var testClasses = function () {
    var gp = new Manager("cs225164");
    Logger.log({ log: "manager class", id: gp.id, username: gp.username, name: gp.name });
    var gp2 = new ProcessManager(1);
    Logger.log({
        log: "processManager class",
        id: gp2.id,
        username: gp2.username,
        name: gp2.name,
        areas: gp2.getAreas()
    });
    var area = new Area(2);
    Logger.log({
        log: "area class",
        areaId: area.id,
        desc: area.desc,
        idresp: area.idResp
    });
    var category = new Category(3);
    Logger.log({
        log: "category class",
        id: category.id,
        desc: category.desc,
        idresp: category.idResp,
        nonCompliances: category.nonCompliances()
    });
    var nonCompliance = new NonCompliance(3);
    Logger.log({
        log: "nonCompliance class",
        id: nonCompliance.id,
        desc: nonCompliance.desc
    });
    var visit = new Visit({
        areaId: area.id,
        categoryId: category.id,
        nonCompliancesIds: [2, 3, 4],
        plot: "plot",
        obs: "obs"
    });
    Logger.log({
        log: "visit class",
        gp: visit.processManager,
        go: visit.operationManager,
        area: visit.area,
        category: visit.category,
        nonCompliances: visit.nonCompliances(),
        plot: visit.plot,
        obs: visit.obs
    });
    Logger.log({ log: "visit create", create: visit.create() });
};
var testVisit = function () {
    var params = {
        areaId: 3,
        categoryId: 1,
        nonCompliancesIds: [2, 3],
        plot: "plot",
        obs: "obs"
    };
    Logger.log(saveVisit(params));
};
var dateParams = function () {
    var date = new Date();
    var month = date.getMonth() + 1;
    var week = Math.ceil(date.getDate() / 7);
    if (week > 4) {
        week = 4;
    }
    var year = date.getFullYear();
    var hash = date.getTime();
    return { month: month, week: week, year: year, hash: hash };
};
var xlString = function (number) {
    return "'" + number;
};
var keyValueMaker = function (array) {
    var obj = [];
    array.map(function (v) {
        obj.push({ id: v[0], desc: v[1] });
    });
    return obj;
};
var Visit = (function () {
    function Visit(_a) {
        var areaId = _a.areaId, categoryId = _a.categoryId, nonCompliancesIds = _a.nonCompliancesIds, plot = _a.plot, obs = _a.obs;
        this.area = new Area(areaId);
        this.processManager = new ProcessManager(this.area.idResp);
        this.category = new Category(categoryId);
        this.operationManager = new Manager(this.category.idResp);
        this.nonCompliancesIds = nonCompliancesIds;
        this.plot = plot;
        this.obs = obs;
        this.date = new Date();
    }
    Visit.prototype.hasCategory = function () {
        return this.category.id > 0;
    };
    Visit.prototype.nonCompliances = function () {
        var nonCompliances = this.nonCompliancesIds.map(function (id) {
            var nonCompliance = new NonCompliance(id);
            return nonCompliance.desc;
        });
        return nonCompliances.join(";");
    };
    Visit.prototype.hasPlot = function () {
        if (!this.hasCategory())
            return false;
        return this.plot.length > 0;
    };
    Visit.prototype.create = function () {
        if (this.hasCategory() && !this.hasPlot())
            throw new err("Visita com não conformidade precisa ter talhão.");
        var nonComplianceInfo = ["", "", "", "", ""];
        var status = "";
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
        var params = dateParams();
        var visit = [
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
    };
    Visit.save = function (_a) {
        var areaId = _a.areaId, categoryId = _a.categoryId, nonCompliancesIds = _a.nonCompliancesIds, plot = _a.plot, obs = _a.obs;
        var visit = new Visit({
            areaId: areaId,
            categoryId: categoryId,
            nonCompliancesIds: nonCompliancesIds,
            plot: plot,
            obs: obs
        });
        var wsName = "Database";
        var visitInfo = visit.create();
        writeData(wsName, visitInfo);
        return visitInfo;
    };
    return Visit;
}());
var saveVisit = function (params) {
    var visit = Visit.save(params);
    var visitLog = [
        visit[3],
        visit[5],
        visit[8],
        visit[9],
        visit[10],
        visit[11],
    ];
    return visitLog;
};
