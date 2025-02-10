const dataset = require('../Utils/FormCreationAndManagement_td.json');
const { expect } = require('@playwright/test');

class MyApplicationsPage {
    constructor(page) {
        this.page = page;
        this.myApplicationsButton = page.locator("[id*='mainMenuButton-'][id*='-btnInnerEl']");
        this.programTitle = page.locator('h1:has-text("Programm \"kinderstrak 2025\"")');
        this.projectName = page.locator('h2:has-text("Sample Project")');
        this.searchField = page.locator('#searchfield-inputEl');
        this.filterButton = page.getByLabel('Inhalte filtern');
        this.savedStatusText = page.getByText('zwischengespeichert', { exact: true });
        this.useFilterButton = page.locator('#filter_button');
        this.deleteContractButton = page.locator("[aria-label='Antrag löschen']");
        this.deleteContractButtonConfirm = page.locator("[aria-label='Antrag löschen']").nth(1);
    }

        async verifyProjectName() {
        await expect(this.projectName).toContainText(dataset.projectName);
    }

    async extractProjectId() {
        const projectText = await this.projectName.innerText();
        const projectId = projectText.match(/\(ID: (.*?)\)/)[1];
        console.log('Project ID:', projectId);
        return projectId;
    }

    async searchProjectById(projectId) {
        await this.searchField.fill(projectId);
        await this.filterButton.click();
    }

    async verifyAndClickSavedStatus() {
        await expect(this.savedStatusText).toBeVisible();
        await this.savedStatusText.click();
    }

    async deleteProject() {
        await this.deleteContractButton.click();
        await this.deleteContractButtonConfirm.click();
        await expect(this.projectName).not.toBeVisible();
    }

    async navigateToMyApplications() {
        await this.myApplicationsButton.nth(1).click();
    }

    async checkSavedForm() {
        await this.verifyProjectName();
                
    }
    async filterFormAndDeleteConract() {
        const projectId = await this.extractProjectId();
        await this.searchProjectById(projectId);
        await this.verifyAndClickSavedStatus();
        await this.useFilterButton.click();	
        await this.verifyProjectName();
        await this.deleteProject();
    }
}

module.exports = { MyApplicationsPage };