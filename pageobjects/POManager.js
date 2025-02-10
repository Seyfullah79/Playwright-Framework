const { LoginPage } = require('./LoginPage');
const { FormToFillOut } = require('./FormToFillOut');
const { MyApplicationsPage } = require('./MyApplicationsPage');
const { UserManagementPage } = require('./UserManagementPage');
const { BundIDRegisterPage } = require('./BundIDRegisterPage');

class POManager {

    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.formToFillOut = new FormToFillOut(this.page);
        this.myApplicationsPage = new MyApplicationsPage(this.page);
        this.userManagementPage = new UserManagementPage(this.page);
        this.bundIdRegisterPage = new BundIDRegisterPage(this.page);
    }



    getLoginPage() {
        return this.loginPage;
    }

    getFormToFillOut() {
        return this.formToFillOut;
    }

    getMyApplicationsPage() {
        return this.myApplicationsPage;
    }

    getUserManagementPage() {
        return this.userManagementPage;
    }

    getBundIDRegisterPage() {
        return this.bundIdRegisterPage;
    }

    static async initializeAndNavigate(browser) {
        const context = await browser.newContext();
        const page = await context.newPage();
        const poManager = new POManager(page);

        await poManager.loginPage.navigateURL();
        return poManager;
    }


}

module.exports = { POManager };