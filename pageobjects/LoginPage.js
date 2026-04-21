const { expect } = require("@playwright/test");
const dataset = JSON.parse(JSON.stringify(require("../Utils/FormCreationAndManagement_td.json")));

class LoginPage {
    constructor(page) {
        this.page = page;

        this.emailInput = page.locator('[type="text"]');
        this.passwordInput = page.locator('[type="password"]');
        this.loginButton = page.locator("#button-1106-btnInnerEl");
        this.loginLink = page.locator("div[id='container-1060-innerCt'] a[class='login-panel-hyperlink']");
        this.createContractButton = page.getByRole("button", {name: "Neuen Antrag stellen", state: "visible"});
        this.createSelectedContract = page.locator('#button-5379');
        this.projectText = page.locator('h1:has-text("Mittel für Ihre Projekte")');
        this.heading = page.locator('h1:has-text("Anmeldung")');
        this.CocpitPageText = page.locator("//h1[normalize-space()='Intro']");
        this.UsernameInfoText = page.locator("(//div[contains(@class, 'x-autocontainer-innerCt') and contains(., 'Willkommen')])[1]");
    }

    async navigateURL() {
        await this.page.goto(dataset.baseUrl);
        await expect(this.projectText).toBeVisible();
    }

    async navigateTesterLoginPage() {
        await this.loginLink.click();
        await expect(this.heading).toBeVisible();
    }

    async validTesterLogin(emailInput, passwordInput) {
        await this.emailInput.fill(emailInput);
        await this.passwordInput.fill(passwordInput);
        await this.loginButton.click();

        // Validate successful login
        await expect(this.CocpitPageText).toHaveText(dataset.dashboardTitleText);
        await expect(this.UsernameInfoText).toContainText(dataset.user_name);
    }

   
    async interactWithYearButtons() {
        for (const year of ['2023', '2024']) {
            const button = this.page.getByRole('button', { name: year });
            await button.waitFor({ state: 'visible' });
            await button.click();
        }
    }

    async navigateContract() {
        await this.createContractButton.click();
        await this.interactWithYearButtons();
        debugger;   
        await this.createSelectedContract.first().click();
    }


}
module.exports = { LoginPage };

